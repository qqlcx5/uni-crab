import extraConfig from '@/config'

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


// {value: 1, label: "H5"}
// {value: 0, label: "小程序"}
// {value: 2, label: "APP"}
// {value: 3, label: "PC"}
// {value: 4, label: "微信H5"}
// #ifdef MP
const platformType = 0;
// #endif
// #ifdef H5
const platformType = /micromessenger/.test(navigator.userAgent.toLowerCase()) ? 4 : 1;
// #endif
// #ifndef MP || H5
const platformType = 2;
// #endif

const gzhOpenIdCatchName = 'h5SaasOpenId';

// 当前选中的城市
const localCityCatchName = 'localCity';

const fullPageCatch = 'curFullPage';

// 分享上级缓存
const shareParentName = 'parent_id';

// 分享来源缓存
const shareOriginName = 'shareData';

// 无价格显示（非0，针对undefined）
const priceNullText = '';

// 无库存显示（非0，针对undefined）
const stockNullText = '';

export default {
	env,
	localCityCatchName,
	platformType,
	gzhOpenIdCatchName,
	fullPageCatch,
	shareParentName,
	shareOriginName,
	priceNullText,
	stockNullText,
	...extraConfig
}

