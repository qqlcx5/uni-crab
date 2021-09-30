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

let apiDefaultList = []
let apiCatchTime = 3660 * 24 * 1000
let tokenUrl = ''


/**
 * 修改全局配置示例
 **/
const http = new Request({
    header: {
        'Content-Type': 'application/json; charset=utf-8',
        'app-version': commonConfig.version, // 版本号
        'app-type': commonConfig.platformType, // 平台类型
        'shop-uid': commonConfig.shopUid, // 商家id
        // #ifdef MP-WEIXIN
        'applet-appid': commonConfig.appId, // 商家id
        'template-id': commonConfig.templateId, // 小程序模板id
        'user-version': commonConfig.userVersion || '' // 小程序模板id
        // #endif
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
    const otherHeader = {
        'app-from': encodeURIComponent(uni.getStorageSync(commonConfig.fullPageCatch) || '')
    }
    // 无法避免多次请求
    if (tokenUrl && config.url !== tokenUrl && config.method !== 'UPLOAD') {
        let { data: { token } } = await requestBefore(tokenUrl, null, {
            source: 'catch'
        })
        token || commonConfig.platformType !== 5 ? '' : commonConfig.shopUserTokenCatchName && (token = (uni.getStorageSync(commonConfig.shopUserTokenCatchName) || {}).token)
        token && (otherHeader['Authorization'] = `bearer ${token}`)
    }
    config.header = {
        ...config.header,
        ...otherHeader
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
    if (((refreshToken.isRefresh && response.data.code !== 0) || response.data.code === 20202) && response.config.url !== 'WxApp/shuaxin') {
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
    console.log('接口报错了', response);
    // 接口请求不通是不存在statusCode状态码，所以只要根据statusCode判断切域名
    const { statusCode = 0 } = response
    if (!statusCode) {
        if (apiDefaultList.length > 1) {
            console.log('域名不存在或已宕机，正在切换域名')
            // if(response.config.url !== 'WxApp/shuaxin')
            // 正在切换域名
            if (!refreshToken.isChangeDomain) {
                saveAPIConfig(true)
                refreshToken.setDomainType(true)
                // 刷新token
                return resendChangeDomainRequest().then(() => {
                    console.log('域名切换成功，正在重发请求')
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


export function setHttpConfig(config, apiConfig) {
    /**
     * apiList {Array} 备用域名列表
     * catchTime {Number}备用域名存在时间
     * tokenApi {String}请求头带的token请求的地址
    */
    const { apiList = [], catchTime = 0, tokenApi = '' } = apiConfig || {}
    if (!apiList.length) {
        console.warn('-----------至少设置一个baseURL地址---------')
        return
    }
    tokenUrl = tokenApi
    apiCatchTime = catchTime || apiCatchTime
    apiDefaultList = apiList
    uni.removeStorageSync(commonConfig.curApiCatch)
    saveAPIConfig()
}

/**
 * 切换域名
 * force {boolean} 暴力切换
*/
function saveAPIConfig(force = false) {
    const newTime = +new Date()
    let apiCatch = uni.getStorageSync(commonConfig.curApiCatch)
    // #ifdef MP-WEIXIN
    // 切换的域名有效
    if (apiCatch) {
        // 时间超过缓存时间 要切回来
        if (apiCatch.saveTime < newTime - apiCatchTime || force) {
            console.log('-----------请求域名缓存超时或被清行切换---------')
            apiCatch = {
                saveTime: newTime,
                url: apiDefaultList.find(o => o !== apiCatch.url)
            }
            uni.setStorageSync(commonConfig.curApiCatch, apiCatch)
        }
    } else {
        apiCatch = {
            saveTime: newTime,
            url: apiDefaultList[0] || ''
        }
        uni.setStorageSync(commonConfig.curApiCatch, apiCatch)
    }
    // #endif
    // #ifndef MP-WEIXIN
    apiCatch = {
        saveTime: newTime,
        url: apiDefaultList[0] || ''
    }
    // #endif
    http && http.setConfig(_config => {
        return { ..._config, baseURL: apiCatch.url }
    })
    return apiCatch
}

export default http
