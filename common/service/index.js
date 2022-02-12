import http, { zzspApiConfig } from './request.js'
import {
    backPage,
    showLoading,
    hideLoading,
    showToast,
    sessionCatch,
    showModal
    // #ifndef APP-PLUS-NVUE
    , jumpPage
    // #endif
} from '../utils/common'

import { deepClone, getVariableType } from '../utils/tools'

let curPage = {}
const needCatchList = {}
let infoFirstRequest = true
const currentPath = ''

/**
 * @description 判断对象是否存在键值
 * @param {Object} obj 要查找的对象
 * @param {String} key 对象键值
 * @return {Boolean} 返回一个布尔值
 */
function isExitValue(obj, key) {
    if (obj.hasOwnProperty(key) === false || obj[key] === undefined || obj[key] === null || obj[key] === '') return false
    return true
}

// 设置请求列表
export function setRequestList(reqList) {
    for (var key in reqList) {
        var item = reqList[key]
        item.persistence = isExitValue(item, 'persistence') ? item.persistence : true
        item.catchBefore = isExitValue(item, 'catchBefore') ? item.catchBefore : false
        item.showErr = isExitValue(item, 'showErr') ? item.showErr : true
        item.showModal = isExitValue(item, 'showModal') ? item.showModal : false
        item.modalBack = isExitValue(item, 'modalBack') ? item.modalBack : true
        item.source = isExitValue(item, 'source') ? item.source : 'any'
        item.abort = isExitValue(item, 'abort') ? item.abort : true
        item.type = isExitValue(item, 'type') ? item.type : 'post'
        needCatchList[key] = item
    }
    console.log(needCatchList)
}
/**
 * @description 请求前统一拦截
 * @param {String} name 请求地址值key，具体看配置文件@/api/config.js
 * @param {Object} query 请求参数列表
 * @param {String} modifyObj 修改请求配置
 * @param {String} type 请求类型：get | post | upload,默认post
 * @param {Boolean} reLoad 是否是重发请求类型：get | post,默认post
 * @return {Promise} 返回是一个promise
 */
export default function requestBefore(name, query = {}, modifyObj = {}, type) {
    const pages = getCurrentPages()
    const tempCurPage = pages.length ? pages[pages.length - 1] : {}
    if (currentPath !== tempCurPage.route) {
        if (tempCurPage.route) {
            // #ifdef H5
            curPage = tempCurPage
            // #endif
            // #ifndef H5
            curPage = tempCurPage.$vm
            // #endif
        }
    }
    return new Promise((resolve, reject) => {
        const catchObj = getRequestconfig(name)
        if (modifyObj) {
            for (var i in modifyObj) {
                if (typeof modifyObj[i] === 'object' && typeof catchObj[i] === 'object') {
                    Object.assign(catchObj[i], modifyObj[i])
                } else {
                    catchObj[i] = modifyObj[i]
                }
            }
        }
        if (!catchObj.url) { // 请求地址不能为空
            // showToast('请求地址错误');
            // #ifdef H5
            console.error('[fatal error] 请求地址错误，『' + name + '』不存在请求配置文件中')
            // #endif
            // #ifndef H5
            console.log('[fatal error] 请求地址错误，『' + name + '』不存在请求配置文件中')
            // #endif
            return reject({
                code: 20000,
                msg: '请求地址不能为空'
            })
        }

        if (catchObj.catchName && !catchObj.update && catchObj.abort) { // 说明需要存缓存，先去去缓存，强制更新他人的  必须请求
            var storage = catchObj.persistence ? uni.getStorageSync : sessionCatch.get
            var catchName = getCatchName(catchObj.catchName, query)
            var catchStorage = storage(catchName)
            if (catchStorage) {
                return resolve({
                    code: 0,
                    msg: '读取缓存成功',
                    data: catchStorage
                })
            }
            if (catchObj.source === 'catch') { // 如果缓存没有则返回空，一般是object类型
                return resolve({
                    code: 0,
                    msg: '缓存中没有相应数据',
                    data: {}
                })
            }
        }
        type = (type || catchObj.type || 'POST').toLocaleLowerCase()
        catchObj.url += (getVariableType(query) === 'String' ? ('/' + query) : '')
        let taskFn = null
        if (getVariableType(query) === 'Object') {
            taskFn = query.getTask
            delete query.getTask
        }

        catchObj.loading && showLoading(String(catchObj.loading) === 'true' ? '' : catchObj.loading)
        http[type](
            catchObj.url,
            type !== 'get' && type !== 'download' ? {
                ...query,
                getTask: (task, options) => {
                    task.onProgressUpdate((res) => {
                        taskFn ? taskFn(res) : ''
                    })
                }
            } : {
                params: query
            }
        ).then(async res => {
            catchObj.loading && hideLoading()
            // 如果是刷新token过程中有偷溜的要禁止返回
            await responseSuccess(res, catchObj, query)
            if (res.code === 0) {
                resolve(res)
                // 如果商户开启了强制登录,这边要做拦截
                forceLogin(catchObj, name, res)
            } else {
                reject(res)
            }
        }).catch(err => {
            catchObj.loading && hideLoading()
            responseFail(err, catchObj)
            reject(err)
        })
    })
}

async function forceLogin(catchObj, name, res) {
    if (name === 'shopInfo' && res.data && res.data.force_login === 1 && infoFirstRequest) {
        // 第一次进来,一般是在中转页
        // if(!curPage) return showLoginModal({ catchObj, content: res.msg, showCancel: false });
        if (curPage && curPage.$config && !curPage.$config.forceLoginWhite.includes(curPage.$Route.name)) {
            infoFirstRequest = false
            const { data: { token = false } } = await requestBefore('wxuserinfo', {}, {
                source: 'catch'
            })
            if (!token) {
                showLoginModal({ catchObj, content: res.msg, showCancel: false })
            }
        }
    }
}

// 判断请求地址是否在配置好的地址表中,如果没有直接转换成跟地址表一样的格式
function getRequestconfig(name) {
    const hasFullAddress = String(name).indexOf('/') !== -1
    const requestName = Object.keys(needCatchList).find(o => needCatchList[o].url === name)
    return deepClone((hasFullAddress ? requestName ? needCatchList[requestName] : false : needCatchList[name]) || (hasFullAddress ? { url: name } : {}))
}

export function resendRefreshRequest() {
    return requestBefore('shuaxinWxApp', null, {
        abort: false
    })
}

export function resendChangeDomainRequest() {
    return requestBefore('shopInfo', null, {
        abort: false
    })
}

function responseFail(res, catchObj = {}) {
    if (catchObj.toast && res.code) {
        uni.getNetworkType({
            success: (res) => {
                if (res.networkType === 'none' || res.networkType === 'unknown') {
                    showToast(res.msg || '您的网络不佳')
                } else {
                    showToast(res.msg || '系统繁忙')
                }
            }
        })
    }
}

async function responseSuccess(res, catchObj, query) {
    if (res.code === 0) {
        res.data = catchObj.catchBefore ? await catchObj.catchBefore(res.data) : res.data
        if (catchObj.catchName || catchObj.update) { // 表示要进行缓存或者强制更新
            catchHandle(catchObj, res, query)
        }
        if (catchObj.removeName) {
            var removeObj = needCatchList[catchObj.removeName]
            var removeName = getCatchName(removeObj.name)
            if (removeObj.persistence) {
                uni.removeStorageSync(removeName)
            } else {
                sessionCatch.remove(removeName)
            }
        }
        catchObj.toast && showToast(getVariableType(catchObj.toast) === 'Boolean' ? res.msg : catchObj.toast, 1)
    } else {
        if (res.code === 20200 || (res.code === 20202 && catchObj.url === zzspApiConfig.tokenApi)) { // token错误，需要登录，可能未登录
            showLoginModal({ catchObj, content: res.data ? res.data.msg : res.msg })
        } else if (res.code !== 20202) {
            catchObj.showErr && showToast(res.msg)
            catchObj.showModal ? showLoginModal({ catchObj, content: res.msg, showCancel: false, title: '错误提示', confirmTex: '我知道了', clearLogin: false }) : ''
        }
    }
}

export function showLoginModal({ catchObj = {}, content = '您还未登录或登录已过期，请登录后操作', showCancel = true, title = '温馨提示', confirmText = '确定', clearLogin = true } = {}) {
    // 第一次进来,一般是在中转页
    if (!curPage) return
    if (curPage.$config && curPage.$config.forceLoginWhite.includes(curPage.$Route.name)) return
    clearLogin && removeUserInfo()
    if (!getApp().globalData.errModalFlag) {
        getApp().globalData.errModalFlag = true
        showModal({
            title,
            // content: `${content}(${catchObj.url})`,
            content: `${content}`,
            cancelText: catchObj.modalBack ? '返回' : '取消',
            showCancel,
            confirmText,
            success: res => {
                getApp().globalData.errModalFlag = false
                if (!clearLogin) return
                if (res.confirm) {
                    // #ifdef APP-PLUS-NVUE
                    uni.redirectTo({
                        url: '/home/login/index'
                    })
                    // #endif
                    // #ifndef APP-PLUS-NVUE
                    jumpPage('login', {
                        action: 'referrer',
                        replace: true
                    })
                    // #endif
                } else {
                    catchObj.modalBack && backPage()
                }
            }
        })
    }
}

export function removeUserInfo() {
    needCatchList['userInfo'] && removeStorageSync([needCatchList['userInfo']])
    needCatchList['shuaxinWxApp'] && removeStorageSync([needCatchList['shuaxinWxApp']])
    uni.removeStorageSync('prveTokenSession')
}

/**
 * @description 缓存统一设置或删除管理
 * @param {Object} catchObj 缓存对象
 * @param {type} queryObj 请求参数
 */

function catchHandle(catchObj = {}, resObj = {}, queryObj = {}) {
    const catchName = getCatchName(catchObj.catchName, queryObj)
    if (catchName === 'jscode2session' && resObj.result) {
        const prevToken = uni.getStorageSync(catchName)
        if (prevToken.token) {
            setStorageSync('prveToken', {}, prevToken.token)
        }
    }
    catchObj.catchName && setStorageSync(catchName, catchObj, resObj.data)
}

/**
 * @description 获取缓存名称
 * @param {Object} catchObj 缓存项
 * @return {String}
 */
const getCatchName = (nameObj, queryObj = {}) => {
    let catchName = ''
    if (getVariableType(nameObj) === 'Object') {
        catchName = nameObj.value
        if (nameObj.position) {
            let extraName = ''
            if (getVariableType(nameObj.storage) === 'Function') {
                (async () => {
                    nameObj.storage = await nameObj.storage()
                })()
            }
            const nameStorage = nameObj.storage ? nameObj.storage : false
            if (nameStorage) {
                extraName = nameStorage[extraName] || ''
            } else if (getVariableType(queryObj) === 'Object') {
                const _key = nameObj.key || ''
                extraName = _key && queryObj.hasOwnProperty(_key) ? queryObj[_key] : _key
            } else {
                extraName = queryObj
            }
            catchName = nameObj.position === 'after' ? (catchName + extraName) : (extraName + catchName)
        }
    } else {
        catchName = nameObj
    }
    return catchName
}
// 设置缓存
function setStorageSync(name, catchObj, data) {
    if (getVariableType(data) === 'Object' && JSON.stringify(data) === '{}') return
    if (getVariableType(data) === 'Array' && data.length === 0) return
    const {
        persistence
    } = catchObj
    if (persistence) {
        uni.setStorageSync(name, data)
    } else {
        sessionCatch.set(name, data)
    }
}
/**
 * @param {Array} list 需要清空缓存的数组
 * @param {String} list 键值
 * @return {Void} 无返回值
 */
function removeStorageSync(list) {
    list.forEach(o => {
        if (o) {
            var catchName
            var storage = o.persistence ? {
                get: uni.getStorageSync,
                remove: uni.removeStorageSync
            } : {
                get: sessionCatch.get,
                remove: sessionCatch.remove
            }
            const catchNameType = getVariableType(o.catchName) === 'Object'
            if (catchNameType) {
                catchName = o.catchName.value
            } else {
                catchName = o.catchName
            }
            var _position = catchNameType ? o.catchName.position : false
            if (_position) { // 这种情况都是做持久化的，获取名字匹配的直接删除
                var allCatch = uni.getStorageInfoSync().keys || []
                allCatch.forEach(o1 => {
                    if (_position === 'before') { // 加载前缀
                        var item = o1.split('').reverse().join('')
                        if (item.indexOf(catchName.split('').reverse().join('')) === 0) {
                            console.warn('模糊删除前缀为：' + catchName + '的缓存')
                            storage.remove(o1)
                        }
                    } else {
                        if (o1.indexOf(catchName) === 0) {
                            console.warn('模糊删除后缀为：' + catchName + '的缓存')
                            storage.remove(o1)
                        }
                    }
                })
            } else {
                console.warn('删除缓存：' + catchName)
                catchName && storage.remove(catchName)
            }
        }
    })
}
