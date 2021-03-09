import Vue from 'vue'
import commonConfig from '@/common/config'

import { getFullUrl } from '@/common/utils'

import Request from 'luch-request' // 下载的插件

/**
 * 修改全局配置示例
 **/
const http = new Request({
    // #ifdef H5
    baseURL: process.env.NODE_ENV == 'production' ? commonConfig.hostUrl : '/ssApi',
    // #endif
    // #ifndef H5
    baseURL: commonConfig.hostUrl,
    // #endif
    header: {
        'Content-Type': 'application/json; charset=utf-8',
        'app-version': commonConfig.version,//版本号
        'app-type': commonConfig.platformType,//平台类型
        'shop-uid': commonConfig.shopUid,//商家id
		// #ifdef MP-WEIXIN
		'template-id': commonConfig.templateId,//小程序模板id
		// #endif
    },
    validateStatus: (statusCode) => { // statusCode 必存在。此处示例为全局默认配置
        return statusCode >= 200 && statusCode < 300
    }
})

/* 请求之前拦截器。可以使用async await 做异步操作 */
http.interceptors.request.use(async (config) => {
    config.data = {
        ...config.data
    }
    let otherHeader = {
         'app-from': encodeURIComponent(uni.getStorageSync(commonConfig.fullPageCatch) || '')
    }
    //无法避免多次请求
    if(config.url !== '/WxApp/wxuserinfo'){
        let { data: { token } } = await Vue.prototype.$http('wxuserinfo', null, {
            source: 'catch'
        });
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

/* 请求之后拦截器。可以使用async await 做异步操作  */
http.interceptors.response.use((response) => {
    let {
        data,
        statusCode
    } = response;
    let message = data.msg;
    if (response.statusCode !== 200) { // 服务端返回的状态码不等于200，则reject()
        data.code = 99;
        if (response.statusCode === 404) {
            message = "资源不存在";
        }
    } else {
        data.code = data.result && data.code === 0 ? 0 : data.code;
    }
    data.msg = message;
    return data;
}, (response) => {
    return response
})

export default http
