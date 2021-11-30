<!--
 * @Descripttion: 
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-11-17 14:59:07
-->
# SaaS公共包改用引入npm引入方式的具体操作说明

## 安装UI库
```js
    // 执行npm进行安装
    yarn add zzsp-saas-ui 或 npm install zzsp-saas-ui
```

## App.vue 改为样式引入
```scss
    /* 引入框架的样式 star */
    @import '~zzsp-saas-ui/common/index.scss';
    /* 引入框架的样式 end */

    /* 自身项目样式 star */
    // @import '~@/common/styles/common.scss';
    /**
    * icon问题很重要，请认真看完
    * 自己的iconfoot文件引入 默认icon   .iconfont:{font-family: 'iconfont';}  底部菜单栏 .tabbar:{font-family: 'tabbar';}（建议使用）或.tarbar{font-family: 'tarbar';}（不建议使用，旧版错误导致只能写这个兼容）
    * 如果是项目需要引入多风格icon，则需要全局变量配合,可以在use这个框架的时候 传入mixin  变量为 zzspIconStyle  确保这个变量在任意地方都能通过 this.zzspIconStyle 拿到值
    * 例如 zzspIconStyle值为'style1'  则css那边的样式名应该为.iconstyle1{font-family: 'iconstyle1';}  
    * 这边可以在iconfont里面的项目配置 => 修改项目设置，修改里面的     FontClass/Symbol前缀 为 zsuicon-style1-     Font Family 为 iconstyle1 
    * 使用实例：
    * <c-icon type="zsuicon-dianzan" /> 会自动加上class => iconstyle1 zsuicon-style1-dianzan
    * <c-icon type="tabbar-wode" /> 会自动加上class => tabbar tabbar-wode
    */
    // 通用图标
    // @import '~@/common/styles/iconfont.css';
    // 底部菜单栏图标
    // @import '~@/common/styles/tabbar.css';
    /* 自身项目样式 end */
```

## uni.scss 导入共用变量
```scss
    @import "~zzsp-saas-ui/common/theme.scss";
```

## vue.config.js
```js
    const TransformPages = require('uni-read-pages')
    const { webpack } = new TransformPages()
    module.exports = {
        transpileDependencies: ['uni-simple-router', 'luch-request', 'zzsp-saas-ui'],
        configureWebpack: {
            plugins: [
                new webpack.DefinePlugin({
                    ROUTES: webpack.DefinePlugin.runtimeValue(() => {
                        const tfPages = new TransformPages({
                            includes: ['path', 'name', 'meta', 'aliasPath']
                        })
                        return JSON.stringify(tfPages.routes)
                    }, true)
                })
            ]
        }
    }
```

## common文件
```
    删除src/common下面的 compoents、config、uilts 文件
    删除src/common/style中的 common/reset/d-din-font 样式文件
    src/common/router 文件留下 router-ctrl
    src/common/service 文件留下 modules 文件夹
```

## 修改pages.json 的easycom  
```js
    "^c-(.*)$": "zzsp-saas-ui/common/components/$1/$1.vue" // 基础组件
```

## router-ctrl.js 的守卫函数改成函数导出
```js
    // 例如: 
    export function beforeEach(to, from, next) {}
```

## main.js
```js
    // 导入各种配置，这边是最完整的配置
    import apiList from '@/common/service/modules/index'
    import globalMixins from '@/common/mixins/globalMixins'
    import config from '@/config'
    import saasUi, {
        RouterMount
    } from 'zzsp-saas-ui'
    import {
        beforeEach,
        afterEach
    } from '@/common/router/router-ctrl'
    Vue.use(saasUi, {
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
        // 全局混入的mixins
        mixins: [globalMixins],
        // 路由相关的配置的拦截函数
        router: {
            beforeEach,
            afterEach
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
                // #ifdef MP-WEIXIN
                'applet-appid': config.appId, // 商家id
                'template-id': config.templateId, // 小程序模板id
                'user-version': config.userVersion || '', // 小程序模板id
                // #endif
                'app-from': encodeURIComponent(uni.getStorageSync(config.fullPageCatch) || '')
            },
            apiConfig: {
                // 代理名称
                proxyName: '/ssApi',
                // 获取token的接口，跟缓存配置有关系，这边不会请求，只会取缓存
                tokenApi: '/WxApp/wxuserinfo',
                // 刷新token接口
                refreshApi: 'WxApp/shuaxin',
                // 域名切换的缓存时间
                apiCatchTime: 3660 * 24 * 1000,
                // 备用域名配置,至少配置一个,这边会自动设置baseUrl，至少传入一个域名，H5本地调试会自己代理到proxyName
                domainList: config.apiList
            },
            // 所有的api列表
            apiList
        }
    })
```

## 下载babel-plugin-import-replaces 
```js
    // 之前项目有很多vscode自动导入的文件，最好可以不用这个插件
    //babel.config.js 中plugins改为（主要为了减少心智和人力,来进行项目中的路径手动转换，之后如果路径改完了这个插件可以从这里删除）郑然通知开发，此处应该有掌声
    const plugins = [[
        'import-replaces',
        {
            exclude: 'node_modules',
            ignore: [
                '@/common/service/modules/index'
            ],
            importReplace: [{
                key: '@/common/utils',
                value: 'zzsp-saas-ui/common/utils'
            }, {
                key: '@/common/service',
                value: 'zzsp-saas-ui/common/service'
            }
        ]
        }
    ]]
```

## 组件以前的c-xxx降级处理
```js
    // 如果你项目中用到这些插件，请升级处理
    c-address-item => gc-address-item
    c-comment => gc-comment
    c-comment-item => gc-comment-item
    c-count-down => gc-count-down
    c-coupon-popup => gc-coupon-popup
    c-coupons => gc-coupons
    c-digital-input => gc-digital-input
    c-digital-keyboard => gc-digital-keyboard
    c-edit-address => gc-edit-address
    c-fa-sms-modal => gc-fa-sms-modal
    c-integral-browse => gc-integral-browse
    c-pay => gc-pay
    c-payment-password => gc-payment-password
    c-select-address => gc-select-address
    c-share-wechat => gc-share-wechat
    c-slide-menu => gc-slide-menu
    c-tag => sub-activity-tag
    c-coupon-detail => sub-home-coupon-detail

    // 公共组件有哪些？
    c-button => 按鈕
    c-cell-group => 单元格
    c-cell => 单元格item
    c-checkbox-group => 复选框组
    c-checkbox => 复选框
    c-radio-group => 单选框组
    c-radio => 单选框
    c-colors => 主题组件
    c-fixed-menu => 沉浸在底部或顶部
    c-form => 表单组件
    c-icons => icon
    c-image => image，oss至少要上传一张图片'${this.$config.ossImgUrl}err-img/200_200.png'可以按照xxx_xxx.png他会自动匹配错误图片，或者你直接传入errSrc指定哪一张错误图片
    c-input => 输入框
    c-jyf-parser => 富文本
    c-loading  => loading
    c-mask => mask蒙层，如果要放到非弹层上使用，必须传入 stopPrevent=false 不然会导致该区域无法滑动
    c-modal => modal弹窗
    c-no-data => 暂无数据组件
    c-page-head => 自定义头部组件
    c-popup => popup弹窗
    c-popup-video => 弹出全屏播放视频
    c-select-city => 选择省市区
    c-send-sms-code => 发送短信验证码，支持3中状态响应
    c-share-menu => 分享底部菜单
    c-status-bar => 状态栏（电池栏）占位
    c-swipe-action => 侧滑删除容器
    c-swipe-action-item => 侧滑删除item
    c-switch => switch开关切换 
    c-tabbar => 底部菜单栏，用vuex做数据共享 => this.shopConfig_.menu会自动取这个值，并且底部菜单栏跟页面以及参数完全匹配才能展示出来
    c-toast => 吐司提示，自定义图标的时候用到
    c-top-search => 顶部搜索
    c-uploader => 图片组上传
    c-waterfall => 瀑布流

```