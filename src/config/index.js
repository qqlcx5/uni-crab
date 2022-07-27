/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-06-28 15:10:24
 */
/** *
 * shop_uid 商家id
 * h5，web目前是服务端根据host自己判断
 * 微信小程序中 shop_uid 从微信公众平台的ext.json的文件中获取
*/
// 访问的完整路径
const fullPageCatch = 'curFullPage'

let shopUid = 1
let templateId = ''
let appId = ''
let userVersion = ''
let ossImgUrl = ''
let domainList = ''

const ossFileName = 'saas'
// #ifdef H5
// 请求路径 ，H5只支持一个
domainList = [
    window.appDomain ? window.appDomain : 'https://betaapp-saas.zzsupei.com'
]
ossImgUrl = (window.ossDomain ? window.ossDomain : 'https://betastatic-saas.zzsupei.com')
// #endif

// #ifdef MP-WEIXIN
const extConfig = wx.getExtConfigSync()
shopUid = extConfig.shop_uid !== undefined ? extConfig.shop_uid : 1
domainList = [
    extConfig.api_host,
    extConfig.api_back_host
]
templateId = extConfig.template_id
appId = extConfig.applet_appid
userVersion = extConfig.user_version
ossImgUrl = process.env.NODE_ENV === 'production' ? extConfig.img_host : 'https://betastatic-saas.zzsupei.com'
// #endif

// #ifndef H5 || MP
domainList = [
    'https://betaapp-saas.zzsupei.com'
]
ossImgUrl = 'https://betastatic-saas.zzsupei.com'
// #endif

let homePath = ''
// #ifdef MP
homePath = (ROUTES.find(o => o.name === 'home') || ROUTES[0] || {}).path
// #endif
// #ifdef H5
const homeObj = (ROUTES.find(o => o.name === 'home') || ROUTES[0] || {})
homePath = homeObj.aliasPath ? homeObj.aliasPath : homeObj.path
// #endif
// #ifdef APP-PLUS
homePath = ''
// #endif
// 微信审核版本号，审核时需与后端api config接口的 *_wxapp_version 字段统一，审核完成后由后端修改
// 当前版本号 1
const version = 1

const shareDefault = {
    allowShare: true, // 是否允许，默认允许，不允许分享会分享为首页
    title: '', // 分享标题
    summary: '我发现一家严选好店，品质保证，快来挑选，低价抢购......', // 分享文案
    imageUrl: ossImgUrl + 'common/shop-map-error.png', // 分享图片
    path: homePath, // 点击链接进入的页面
    webUrl: 'https://aaa.test.zzsupei.com', // 兼容低版本的网页链接
    jsApiList: ['updateTimelineShareData', 'updateAppMessageShareData'] // 分享的JSSDK列表
}

// 无价格显示（非0，针对undefined）
const priceNullText = ''
// 无库存显示（非0，针对undefined）
const stockNullText = ''

// 个人中心自定义来源
const projectSource = false

// {value: 1, label: "H5"}
// {value: 0, label: "小程序"}
// {value: 2, label: "APP"}
// {value: 3, label: "PC"}
// {value: 4, label: "微信H5"}
let platformType
// #ifdef MP
platformType = 0
// #endif
// #ifdef H5
platformType = /micromessenger/.test(navigator.userAgent.toLowerCase()) ? 4 : 1
// #endif
// #ifndef MP || H5
platformType = 2
// #endif
// 审核模式下的屏蔽名单
const shieldWhite = ['bindbank', 'balanceRealName', 'uploadId', 'user']

export default { platformType, fullPageCatch, domainList, shieldWhite, ossImgUrl, version, ossFileName, shopUid, userVersion, shareDefault, priceNullText, stockNullText, templateId, appId, projectSource }
