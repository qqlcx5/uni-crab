/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-09-28 16:25:21
 */
/** *
 * 常量配置
 * @env '运行环境'
 * @hostUrl '请求地址'
 * @ossImgUrl 'oss图片地址'
 * @version· '微信审核版本号'
 * @shop_uid 'app-plus上面每个打包的id为对应不同商户的shop_uid'
 */

// node环境变量
const env = process.env.NODE_ENV

const gzhOpenIdCatchName = 'h5SaasOpenId'

// 当前选中的城市
const localCityCatchName = 'localCity'

// 当前选中的城市
const homeCityCatchName = 'homeLocalCity'

// 分享上级缓存
const shareParentName = 'parent_id'

const shareBusinessCardName = 'business_card_id'

// 分享来源缓存
const shareOriginName = 'shareData'

// 用户开启应用的唯一标识
const uuidCatchName = 'uuid'

// 登录参数缓存
const loginQueryCatchName = 'loginQuery'

// 第一次进入页面缓存
const firstIntPageCatchName = 'firstPage'

// 邀请码缓存
const invitationCodeCatchName = 'invitationCode'

const curApiCatch = 'currentDomain'

// 无价格显示（非0，针对undefined）
const priceNullText = ''

// 无库存显示（非0，针对undefined）
const stockNullText = ''

// 强制登录白名单[路由名称， 路由名称]
const forceLoginWhite = ['login', 'sms-login', 'wechatAuth', 'storeClose', 'bindMobile', 'redirect', 'agreement']

// 埋点白名单
const trajectoryWhite = ['home', 'redirect', 'businessCard']

export default {
    env,
    invitationCodeCatchName,
    localCityCatchName,
    homeCityCatchName,
    gzhOpenIdCatchName,
    shareParentName,
    shareOriginName,
    priceNullText,
    stockNullText,
    uuidCatchName,
    forceLoginWhite,
    trajectoryWhite,
    loginQueryCatchName,
    shareBusinessCardName,
    firstIntPageCatchName,
    curApiCatch
}

