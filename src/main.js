/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-09-29 10:00:57
 */
import Vue from 'vue'
import App from './App'

// 注入公共代码
import saasUI, { RouterMount, router, setHttpConfig, setRequestList } from '../common/index'

Vue.use(saasUI, {
    cconfig: {
        aaa: 1
    },
    common: {
        a: 111
    },
    utils: {
        cloga() {
            console.log('a')
        }
    }
})

router.beforeEach((to, from, next) => {
    console.log('地址拦截', to, from);
    next()
})

router.afterEach((to, from) => {
    console.log(to, from);
})

// 请求列表配置
setRequestList({
    shopInfo: {
        url: '/Shop/info'
    },
    wxuserinfo: {
        url: '/Shop/info'
    }
})
// 请求配置
setHttpConfig({
    // 请求头设置
}, {
    // 备用域名配置
    apiList: [
        // #ifdef H5
        process.env.NODE_ENV === 'production' ? 'http://betaapp-saas.zzsupei.com' : '/ssApi'
        // #endif
        // #ifndef H5
        'http://betaapp-saas.zzsupei.com'
        // #endif
    ]
})

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})

// v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
RouterMount(app, '#app')
// #endif
// #ifndef H5
app.$mount() // 为了兼容小程序及app端必须这样写才有效果
// #endif
