/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-09-28 16:27:15
 */
// 路由插件
import Router, { RouterMount } from 'uni-simple-router'
import sendHttp, { setRequestList } from './service'
import { setHttpConfig } from './service/request'

import baseConfig from './config'
import * as beseUtils from './utils/index'
import baseFilter from './filters'
import baseCommon from './utils/common'
import colorGradient from './utils/colorGradient'
import router from './router/index'

export { RouterMount, router, setRequestList, setHttpConfig }

const globalFun = {
    install(Vue, extra) {
        const {
            useRouter = true,
            config = {},
            utils = {},
            common = {},
            filter = {}
        } = extra || {}

        // 路由插件
        useRouter && Vue.use(Router)

        // 批量挂载在this上
        Vue.prototype.$http = sendHttp;

        // 基础配置
        Vue.prototype.$config = Object.assign({}, baseConfig, config);

        // 常用工具
        Vue.prototype.$c = {
            ...beseUtils,
            ...colorGradient,
            ...utils
        }

        // 批量通用方法
        const allConfig = Object.assign({}, baseCommon, common)
        Object.keys(allConfig).forEach(cKey => {
            Vue.prototype[cKey] = allConfig[cKey];
        })

        // 批量注入filter
        const allFilter = Object.assign({}, baseFilter, filter)
        Object.keys(allFilter).forEach(fKey => {
            Vue.filter(fKey, allFilter[fKey]);
        })
    }
}

export default globalFun
