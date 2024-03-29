/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-09-29 10:00:57
 */
import Vue from 'vue'
import App from './App'
import store from './store'
import config from '@/config'

Vue.config.productionTip = false

App.mpType = 'app'

// 注入公共代码并载入配置
import saasUI, { RouterMount } from '@common/index'
Vue.use(saasUI, {
    // 如果需要多域名切换请把store实例传入
    store,
    // 共用配置 this.$config
    config: {
        libName: 'zzspSaaSUI'
    },
    // 共用方法或变量 this.sayHello
    common: {
        sayHello() {
            console.log('Hello! 我是this上面的方法')
        }
    },
    // 工具方法this.$c.logHello
    utils: {
        logHello() {
            console.log('Hello!我是this.$c上面的工具方法')
        }
    },
    // 路由相关的配置
    router: {
        beforeEach: (to, from, next) => {
            console.log('自定义beforeEach')
            next()
        },
        afterEach: (to, from) => {
            console.log('自定义afterEach')
        }
    },
    // 请求相关的配置
    http: {
        // 请求头字段配置（baseURL无效），设置请求地址请在下面的apiConfig里面进行配置
        header: {
            // 对应的值支持传入方法，动态拿值
            // 'uuid': () => uni.getStorageSync('xxxx'),
            'app-version': config.version, // 版本号
            'app-type': config.platformType, // 平台类型
            'shop-uid': config.shopUid, // 商家id
            // #ifdef MP
            'applet-appid': config.appId, // 商家id
            'template-id': config.templateId, // 小程序模板id
            'user-version': config.userVersion || '', // 小程序模板id
            // #endif
            'app-from': () => encodeURIComponent(uni.getStorageSync(config.fullPageCatch) || '')
        },
        apiConfig: {
            tokenApi: '/WxApp/wxuserinfo',
            // 备用域名配置,至少配置一个
            domainList: ['http://11111111dfsdsfsd.com', 'http://2222dfsdsfsd.com', 'http://betaapp-saas4.zzsupei.com']
        },
        apiList: {
            shopInfo: {
                url: '/Shop/info'
            },
            wxuserinfo: { // 向后台传送微信用户信息 或 授权后一键登录
                url: '/WxApp/wxuserinfo',
                catchName: 'jscode2session',
                toast: true
            },
            home: {
                url: '/Shop/home'
            },
            getGoodsModuleList: {
                url: '/Goods/getGoodsModuleList'
            },
            getGoodsModuleList1111: {
                url: '/Goods1111/getGoodsModuleList1111'
            }
        }
    }
})
const app = new Vue({
    ...App,
    store
})
// v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
RouterMount(app, '#app')
// #endif
// #ifndef H5
app.$mount() // 为了兼容小程序及app端必须这样写才有效果
// #endif
