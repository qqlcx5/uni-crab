import Vue from 'vue'
import Router from '../router/index'
import { getVariableType, isEmpty, deepClone } from './tools'
import { getUrlQuery } from './index'
import sendHttp from '../service'

/*
    消息提示框
    title String 是 提示的内容，长度与 icon 取值有关。
    icon String 否 图标，有效值 "success", "loading", "none"
    duration Number 否 提示的延迟时间，单位毫秒，默认：1500
    image String 否 自定义图标的本地路径
    mask Boolean 否 是否显示透明蒙层，防止触摸穿透，默认：false
*/
export function showToast(msg, icon = 0, duration = 1500, mask = true, image = false) {
    if (!msg) return
    const icons = ['none', 'success', 'loading']
    const _icon = icons[icon]
    const params = {
        icon: _icon,
        title: msg,
        duration: duration,
        // #ifndef MP-TOUTIAO
        mask: mask
        // #endif
    }
    image && (params.image = image)
    uni.showToast(params)
}

// loading框
export function showLoading(msg = '加载中', mask = true) {
    const params = {
        // #ifndef MP-TOUTIAO
        mask: mask,
        // #endif
        title: msg
    }
    uni.showLoading(params)
}

// 隐藏loading框
export function hideLoading() {
    uni.hideLoading()
}

/*
    显示对话框
    title	String	是	提示的标题
    content	String	是	提示的内容
    showCancel	Boolean	否	是否显示取消按钮，默认为 true
    cancelText	String	否	取消按钮的文字，默认为"取消"，最多 4 个字符
    cancelColor	HexColor	否	取消按钮的文字颜色，默认为"#000000"	H5、微信小程序、百度小程序
    confirmText	String	否	确定按钮的文字，默认为"确定"，最多 4 个字符
    confirmColor	HexColor	否	确定按钮的文字颜色，H5平台默认为"#007aff"，微信小程序平台默认为"#3CC51F"，百度小程序平台默认为"#3c76ff"	H5、微信小程序、百度小程序
    success	Function	否	接口调用成功的回调函数
    fail	Function	否	接口调用失败的回调函数
    complete	Function	否	接口调用结束的回调函数（调用成功、失败都会执行）
*/
export function showModal({
    title = '',
    content = '这是一个模态框',
    showCancel = true,
    cancelText = '取消',
    cancelColor = '#666',
    confirmText = '确定',
    confirmColor = '#0260fe',
    success,
    fail,
    complete
}) {
    uni.showModal({
        title: title,
        content: content,
        showCancel: showCancel,
        cancelText: cancelText,
        cancelColor: cancelColor,
        confirmText: confirmText,
        confirmColor: confirmColor,
        success: (res) => {
            success && success(res)
        },
        fail: (err) => {
            fail && fail(err)
        },
        complete: (res) => {
            complete && complete(res)
        }
    })
}

/**
 *@description 判断微信浏览器还是h5
 * @param {*} Boolean 任意数据类型 Boolean
 * @return {string} 返回数据类型有 Boolean
 */
export const isWechatBrowser = (() => {
    // #ifdef H5
    const ua = navigator.userAgent.toLowerCase()
    return !!(/micromessenger/.test(ua))
    // #endif
    return false
})()

export const sessionCatch = {
    // #ifdef H5
    set(key, val) {
        const sessionKey = key + 'Session'
        const type = typeof val
        sessionStorage.setItem(sessionKey, JSON.stringify({
            type: type,
            data: val
        }))
    },
    get(key) {
        const sessionKey = key + 'Session'
        const data = JSON.parse(sessionStorage.getItem(sessionKey) || '{}')
        return data.data
    },
    remove(key) {
        const sessionKey = key + 'Session'
        sessionStorage.removeItem(sessionKey)
    },
    clear() {
        sessionStorage.clear()
    },
    // #endif
    // #ifndef H5
    set(key, val) {
        const sessionKey = key + 'Session'
        uni.setStorageSync(sessionKey, val)
    },
    get(key) {
        const sessionKey = key + 'Session'
        return uni.getStorageSync(sessionKey)
    },
    remove(key) {
        const sessionKey = key + 'Session'
        uni.removeStorageSync(sessionKey)
    },
    clear() {
        const allSession = uni.getStorageInfoSync('uni-storage-keys').keys
        allSession.forEach(key => {
            if (key.indexOf('Session') !== -1) {
                uni.removeStorageSync(key)
            }
        })
    }
    // #endif
}
/**
 * @description 跳转函数
 * @param {string} name 路由名称或者页面路径 用/开头
 * @param {object,null} params跳转参数
 * @param {string} method跳转方法
 * @param {function,null} 跳转地址错误回调
 */

export const jumpPage = (name, params = {}, method = 'push', errFn) => {
    if (!name) return
    params = params || {}
    if (name.indexOf('?')) {
        const routeObj = getUrlQuery(name)
        name = routeObj.path
        params = Object.assign({}, params, routeObj.query)
    }
    const jumpRouteObj = ROUTES.find(o => o.name === name || o.path === name || o.aliasPath === name)
    if (!jumpRouteObj) {
        errFn && errFn()
        return console.error('[fatal error] 路由地址错误，『' + name + '』不存在路由表中')
    }
    params = formatParams(params) || {}
    Router[method]({
        name: jumpRouteObj.name,
        params: params
    })
}

export const jumpPageDetail = (name, id, params = {}, method = 'push', errFn) => {
    if (!id) return
    params = params || {}
    params.detailId = id
    params = formatParams(params) || {}
    if (!name) return
    return jumpPage(name, params, method, errFn)
}

/**
 * @description 跳转函数
 * @param {Object, null} params 要修改或者向上一页传递的值
 * @param {Object, null} extraQuery 上一页的值，不参数参数传递
 * @param {replace} 是否强制替掉所有页面（主要用于解决强登录带来的bug）
 */
export const backRef = (params = {}, extraQuery = {}, replace = false, errFn) => {
    params = params || {}
    extraQuery = extraQuery || {}
    const that_ = Vue.prototype
    // 小程序端有问题，所以需要加$nextTick
    that_.$nextTick(() => {
        const query = Object.assign({}, that_.$Route.query, extraQuery)
        console.log(query)
        if (!query.lastName) { // 没有上一页指定则正常返回
            return backPage()
        }
        const pages = getCurrentPages() // 全部页面
        const prevPage = pages[pages.length - 2] // 上一个页面
        const lastQuery = query.lastQuery ? JSON.parse(decodeURIComponent(query.lastQuery) || '{}') : {}
        // let isExitQuery = Object.keys(params).every(o => {//多次切换会导致返回同一个页面
        //     return Object.keys(lastQuery).findIndex(o1 => o1 === o) !== -1;
        // })
        const isExitQuery = false
        if (replace || isExitQuery || pages.length === 1 || ('/' + prevPage.route) !== decodeURIComponent(query.prevPath)) {
            jumpPage(query.lastName, Object.assign({}, lastQuery, params), replace ? 'replaceAll' : 'replace', errFn)
        } else {
            Object.keys(params).forEach(key => {
                prevPage.$vm[key] = params[key]
            })
            backPage()
        }
    })
}

/**
 *@description 返回上一页
 */
export const backPage = () => {
    if (getCurrentPages().length === 1) {
        jumpPage('home', {}, 'replace')
    } else {
        Router.back()
    }
}
/**
 *@description 专题页跳转以及后端配置地址跳转
 */
export const serverJump = ({
    app_page,
    id,
    keyword,
    cat_id,
    store_id,
    hideTitle,
    is_example
}, params = {}, method = 'push', errFn) => {
    params = Object.assign({}, formatParams(params || {}), { store_id })
    // 实例数据
    if (is_example === 1) return
    if (!app_page) return
    if (app_page === 'jumpMp') {
        setTimeout(async () => {
            const { data } = await sendHttp('/ModuleSet/getMpJumpInfo', {
                id
            }, {
                loading: true
            })
            const { app_id: appId, path, param, h5_url: url } = data
            // #ifdef MP
            if (appId) {
                uni.navigateToMiniProgram({
                    appId,
                    path,
                    extraData: param || {}
                })
            }
            // #endif
            if (url) {
                // #ifdef MP
                if (!appId) {
                    jumpPage('webView', {
                        url,
                        hideTitle: true
                    })
                }
                // #endif
                // #ifdef H5
                jumpPage('webView', {
                    url,
                    hideTitle: true
                })
                // #endif
            }
        })
    } else if (/(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g.test(app_page)) { // 远端地址
        jumpPage('webView', {
            url: app_page,
            hideTitle,
            ...params
        }, method, errFn)
    } else if (cat_id || keyword) {
        jumpPage(app_page, {
            cat_id,
            keyword,
            ...params
        }, method, errFn)
    } else if (id) {
        jumpPageDetail(app_page, id, params, method, errFn)
    } else {
        jumpPage(app_page, params, method, errFn)
    }
}

function formatParams(params = {}) {
    const newParams = {}
    Object.keys(params).forEach(o => {
        const item = String(params[o])
        !['undefined', 'null'].includes(item) && (newParams[o] = params[o])
    })
    return newParams
}

/**
 * @name: 获取时间字符串
 * @param {Number} day; 和今天相差几天 
 * @return {String} 2021-03-30
 */
export const getData = (day) => {
    var today = new Date()
    var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
    today.setTime(targetday_milliseconds) // 注意，这行是关键代码
    var tYear = today.getFullYear()
    var tMonth = today.getMonth()
    var tDate = today.getDate()
    tMonth = doHandleMonth(tMonth + 1)
    tDate = doHandleMonth(tDate)
    return tYear + '-' + tMonth + '-' + tDate
}
function doHandleMonth(month) {
    var m = month
    if (month.toString().length === 1) {
        m = '0' + month
    }
    return m
}

export default {
    $back: backPage,
    $backRef: backRef,
    $jump: jumpPage,
    $deepClone: deepClone,
    $typeOf: getVariableType,
    $hideLoading: hideLoading,
    $isWechatBrowser: isWechatBrowser,
    $session: sessionCatch,
    $loading: showLoading,
    $modal: showModal,
    $getData: getData,
    $toast: showToast,
    $serverJump: serverJump,
    $jumpDetail: jumpPageDetail,
    $isEmpty: isEmpty
}
