/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-09-28 16:27:15
 */
// 路由插件
import Router, { RouterMount } from 'uni-simple-router'
import sendHttp, { setRequestList } from './service'
import { setHttpConfig, setApiConfig } from './service/request'

import baseConfig from './config'
import globalMixin from './mixins/globalMixin'
import * as beseUtils from './utils/index'
import baseFilter from './filters'
import baseCommon from './utils/common'
import colorGradient from './utils/colorGradient'
import router from './router/index'
import zzspuiStore from './store/request'

export { RouterMount, router, setRequestList, setHttpConfig }
let zzspVuex = null

export const getVuex = () => {
    return zzspVuex
}

const globalFun = {
    install(Vue, extra) {
        const {
            useRouter = true,
            config = {},
            utils = {},
            common = {},
            filter = {},
            http = {},
            router: routerConfig = {
            },
            mixins = [],
            store = null
        } = extra || {}
        const {
            apiList = []
        } = http

        if (store) {
            zzspVuex = store
            // 注册模块 `zzspui`
            store.registerModule('zzspui', zzspuiStore)
        }
        // 路由插件
        if (useRouter) {
            Vue.use(Router)
            const defaultRouterConfig = {
                beforeEach: (to, from, next) => {
                    console.log('路由默认的beforeEach')
                    next()
                },
                afterEach: (to, from) => {
                    console.log('路由默认的afterEach')
                }
            }
            const newRouterConfig = Object.assign({}, defaultRouterConfig, routerConfig)
            router.beforeEach(newRouterConfig.beforeEach)
            router.afterEach(newRouterConfig.afterEach)
        }

        // 批量挂载在this上
        Vue.prototype.$http = sendHttp
        setHttpConfig(http)
        setRequestList(apiList)

        Vue.prototype.$setApiConfig = setApiConfig

        // 基础配置
        Vue.prototype.$config = Object.assign({}, baseConfig, config)

        // 常用工具
        Vue.prototype.$c = {
            ...beseUtils,
            ...colorGradient,
            ...utils
        }

        // 批量通用方法
        const allConfig = Object.assign({}, baseCommon, common)
        Object.keys(allConfig).forEach(cKey => {
            Vue.prototype[cKey] = allConfig[cKey]
        })

        // 批量注入filter
        const allFilter = Object.assign({}, baseFilter, filter)
        Object.keys(allFilter).forEach(fKey => {
            Vue.filter(fKey, allFilter[fKey])
        })

        mixins.unshift(globalMixin)
        // 混入全局minxins
        mixins.forEach(v => Vue.mixin(v))
    }
}

export default globalFun
