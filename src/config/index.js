// 请求服务器接口配置地址
const hostUrl = process.env.NODE_ENV == 'production' ? "https://betaapp-saas.zzsupei.com" :
	"https://betaapp-saas.zzsupei.com"

// oss图片配置地址
const ossImgUrl = 'https://betastatic-saas.zzsupei.com/saas-xmmall/'

// 微信审核版本号，审核时需与后端api config接口的 *_wxapp_version 字段统一，审核完成后由后端修改
// 当前版本号 1
const version = 1

/** *
 * shop_uid 商家id
 * h5，web目前是服务端根据host自己判断
 * app目前需每次打包写死
 * 微信小程序中 shop_uid 从微信公众平台的ext.json的文件中获取
 */
let shopUid = 0;
// #ifdef MP-WEIXIN
let extConfig = wx.getExtConfigSync();
shopUid = extConfig.shop_uid !== undefined ? extConfig.shop_uid : 1;
//#endif

const shareDefault = {
	allowShare: true, //是否允许，默认允许，不允许分享会分享为首页
	title: '中装建材SaaS', //分享标题
	summary: '我是很长很长很长很长很长很长很长很长的描述文案', //分享文案
	shareImg: 'https://dxqwhg.up72.cn/u/cms/dxwhg/202010/191137066jv8.png', //分享图片
	path: '/home/index/index', //点击链接进入的页面
	webUrl: 'https://uniapp.dcloud.io/api/plugins/share?id=share', //兼容低版本的网页链接
	jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] //分享的JSSDK列表
}

const errorImg = ossImgUrl + 'common/pic-error.png';


export default {
	shopUid,
	version,
	ossImgUrl,
	hostUrl,
	errorImg,
	shareDefault
}
