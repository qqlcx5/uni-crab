/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-06-21 15:52:38
 */
import Request from 'luch-request' // 下载的插件

import commonConfig from '../config/index'

import requestBefore, { resendRefreshRequest, resendChangeDomainRequest } from './index'

import Refresh from './refreshToken'

import { getVuex } from '../index'

// 传入的api配置
export let zzspApiConfig = {
    apiCatchTime: 3660 * 24 * 1000, // 域名缓存时间
    tokenApi: '', // 获取token的api
    refreshApi: '', // 刷新的api
    domainList: [], // 备用域名列表
    header: {} // 请求头
}

/**
 * 修改全局配置示例
 **/
const http = new Request({
    header: {
        'Content-Type': 'application/json; charset=utf-8'
    },
    validateStatus: (statusCode) => { // statusCode 必存在。此处示例为全局默认配置
        return statusCode >= 200 && statusCode < 300
    }
})
const refreshToken = Refresh.initRefreshToken()
/* 请求之前拦截器。可以使用async await 做异步操作 */
http.interceptors.request.use(async (config) => {
    config.data = {
        ...config.data
    }
    // 无法避免多次请求
    if (zzspApiConfig.tokenApi && config.url !== zzspApiConfig.tokenApi && config.method !== 'UPLOAD') {
        let { data: { token } } = await requestBefore(zzspApiConfig.tokenApi, null, {
            source: 'catch'
        })
        token || commonConfig.platformType !== 5 ? '' : commonConfig.shopUserTokenCatchName && (token = (uni.getStorageSync(commonConfig.shopUserTokenCatchName) || {}).token)
        token && (config.header['Authorization'] = `bearer ${token}`)
    }
    const zzspApiConfigHeader = {}
    Object.keys(zzspApiConfig.header).forEach(key => {
        const item = zzspApiConfig.header[key]
        const itemType = typeof item
        zzspApiConfigHeader[key] = itemType === 'function' ? item() : item
    })
    config.header = {
        ...config.header,
        ...zzspApiConfigHeader
    }
    return config
}, (err) => {
    return err
})

/**
 * 1.正在刷新跳过
 * 20200 token无效
 */
http.interceptors.response.use((response) => {
    // 下载文件
    if (!response.data) {
        response.data = {}
        response.data.code = 0
    }
    // token过期
    if (((refreshToken.isRefresh && response.data.code !== 0) || response.data.code === 20202) && response.config.url !== zzspApiConfig.refreshApi) {
        // 刷新token状态中
        if (!refreshToken.isRefresh) {
            refreshToken.setRefreshType(true)
            // 刷新token
            return resendRefreshRequest().then(() => {
                refreshToken.notifyTaskReload()
                refreshToken.setRefreshType(false)
                return http.request(response.config)
            }).catch((v) => {
                refreshToken.clearTask()
                refreshToken.setRefreshType(false)
                return response.data
            })
        }
        return new Promise((r, s) => {
            // 将需要重新请求的接口添加到队列中
            refreshToken.addTask((isError) => {
                if (isError) {
                    return r(response)
                }
                http.request(response.config).then(r).catch(s)
            })
        })
    } else {
        if (response.data.code === 20200 && uni.getStorageSync('jscode2session')) {
            /**
            * 判断溜走的请求携带的token是否是等于老token并且不等于新token
            * 如果是则重新在发起请求
            */
            const requestToken = response.config.header.Authorization
            const prevToken = uni.getStorageSync('prveTokenSession')
            const newToken = uni.getStorageSync('jscode2session')
            const prevCondition = prevToken && newToken
            if (prevCondition && requestToken === `bearer ${prevToken}` && requestToken !== `bearer ${newToken.token}`) {
                return http.request(response.config)
            }
        }
        const {
            data = {},
            statusCode,
            tempFilePath
        } = response
        let message = data.msg
        if (statusCode !== 200) { // 服务端返回的状态码不等于200，则reject()
            data.code = 99
            if (statusCode === 404) {
                message = '资源不存在'
            }
        } else {
            data.code = data.result && data.code === 0 ? 0 : data.code
        }
        data.msg = message
        if (tempFilePath) {
            data.tempFilePath = tempFilePath
            data.code = 0
            data.msg = '下载文件成功'
        }
        return data
    }
}, response => {
    // 接口请求不通是不存在statusCode状态码，所以只要根据statusCode判断切域名
    const { statusCode = 0 } = response
    if (!statusCode) {
        if (zzspApiConfig.domainList.length > 1) {
            console.log('域名不存在或已宕机，正在切换域名')
            // 正在切换域名
            if (!refreshToken.isChangeDomain) {
                setApiConfig(true)
                refreshToken.setDomainType(true)
                // 刷新token
                return resendChangeDomainRequest().then((res) => {
                    console.log('域名切换成功，正在重发请求', res)
                    refreshToken.notifyTaskReload()
                    refreshToken.setDomainType(false)
                    return http.request(response.config)
                }).catch((e) => {
                    console.log('切换之后还是失败了', e)
                    refreshToken.clearTask()
                    refreshToken.setDomainType(false)
                    return response
                })
            }
            return new Promise((r, s) => {
                // 将需要重新请求的接口添加到队列中
                refreshToken.addTask((isError) => {
                    if (isError) {
                        return r(response)
                    }
                    http.request(response.config).then(r).catch(s)
                })
            })
        }
        return response
    } else {
        return response
    }
})

export function setHttpConfig({ apiConfig, header = {} }) {
    const newConfig = {
        ...apiConfig,
        header
    }
    zzspApiConfig = Object.assign({}, zzspApiConfig, newConfig)
    if (!apiConfig.domainList || !apiConfig.domainList.length) {
        console.error('-----------至少设置一个baseURL地址(domainList)---------')
        return
    }
    const apiCatch = uni.getStorageSync(commonConfig.curApiCatch)
    setApiConfig(false, apiCatch && apiCatch.url)
}

/**
 * 切换域名
 * force {boolean} 暴力切换
 * url {string} 指定域名
*/
export function setApiConfig(force = false, url = '') {
    const newTime = +new Date()
    let apiCatch = uni.getStorageSync(commonConfig.curApiCatch)
    // #ifdef MP-WEIXIN
    // 切换的域名有效
    if (apiCatch) {
        // 时间超过缓存时间 要切回来,特殊域名不过期
        if ((!apiCatch.isSpecial && apiCatch.saveTime < newTime - zzspApiConfig.apiCatchTime) || force || url) {
            console.log('-----------请求域名缓存超时或被强行切换---------')
            apiCatch = {
                saveTime: newTime,
                url: url || zzspApiConfig.domainList[0],
                isSpecial: !!url
            }
            uni.setStorageSync(commonConfig.curApiCatch, apiCatch)
        }
    } else {
        console.log('-----------重新设置域名请求---------')
        apiCatch = {
            saveTime: newTime,
            url: url || zzspApiConfig.domainList[0] || '',
            isSpecial: !!url
        }
        uni.setStorageSync(commonConfig.curApiCatch, apiCatch)
    }
    // #endif
    if (!apiCatch) {
        apiCatch = {}
    }
    // #ifdef H5
    // H5本地走代理
    if (process.env.NODE_ENV !== 'production') {
        apiCatch.url = zzspApiConfig.proxyName
    }
    // #endif
    http && http.setConfig(_config => {
        return { ..._config, baseURL: apiCatch.url }
    })
    // 这边要对代理的地址做下处理
    const saveAPI = {
        ...apiCatch,
        // #ifdef H5
        url: zzspApiConfig.domainList[0]
        // #endif
    }
    try {
        getVuex().commit('zzspui/SET_CUR_DOMAIN', saveAPI)
    } catch (error) {
        console.log('这边没有注入保存当前请求域名的store')
    }
    return apiCatch
}

export default http
