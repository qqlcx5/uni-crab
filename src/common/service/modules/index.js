/**
 * 接口缓存列表
 * @param {String,Object} name接口name值
 * @param {String,Object} catchName缓存名称, 存在该值表示要缓存
 * @param {String} catchName.position	值后缀拼接位置position after或者before，目前只支持从接口参数中取值
 * @param {String} catchName.storage	不存在则去取请求参数
 * @param {String} catchName.key		获取的键值
 * @param {String} catchName.value 	即将被拼接的catchName缓存名称, 存在该值表示要缓存
 * @param {String} removeName 删除的键值,多个逗号隔开（键值是RequestListConfig下的属性）
 * @param {Boolern} persistence是否是持久化缓存 true => localStrong  false => sessionStrong  默认为true
 * @param {String} type 请求类型		get 、post、upload 之类  默认值是post
 * @param {Boolern} abort 是否中断请求（如果有缓存是不会去请求的）默认值是true
 * @param {String} source 可选值是any和catch，默认是any，建议写在特殊场合调用的地方，如头部加上token
 * @param {Object, String} timeKey 缓存时间字段
 * @param {Function} catchBefore 缓存之前做的操作，比如一些计算
 * @param {String} update强制更新数据接口=>目前只做删除，后续可以考虑加上自动请求更新掉旧数据,只会更新白名单里面的缓存,强制更新他人的  必须请求
 * @param {String} showErr提示错误信息，默认为true
 * @param {String} showModal提示弹窗错误信息，默认为false
 * @param {String} modalBack 未登录返回按钮是否是上一页，默认为true
 *
 */
let modules  = {}
// #ifndef APP-PLUS-NVUE
let files = require.context('.', false, /\.js$/)
let files1 = require.context('../../../service', false, /\.js$/)
files.keys().forEach(key => {
	if (key === './index.js') return false
	Object.assign(modules, files(key).default);
})
files1.keys().forEach(key => {
	if (key === './index.js') return false
	Object.assign(modules, files1(key).default);
})
// #endif
// #ifdef APP-PLUS-NVUE
import common from './common.js';
import goods from './goods.js';
import guset from './guset.js';
import home from './home.js';
import login from './login.js';
import user from './user.js';
import order from './order.js';
import topic from './topic.js';
import goodsTeam from './goodsTeam.js';
import goodsSpike from './goodsSpike.js';
modules = {
    ...common, ...goods, ...guset, ...home, ...login, ...user, ...order, ...goodsSpike, ...goodsTeam, ...topic
}
// #endif


/**
 * @description 判断对象是否存在键值
 * @param {Object} obj 要查找的对象
 * @param {String} key 对象键值
 * @return {Boolean} 返回一个布尔值
 */
function isExitValue(obj, key) {
	if (obj.hasOwnProperty(key) === false || obj[key] === undefined || obj[key] === null || obj[key] === '') return false;
	return true;
}


// 需要缓存的列表计算
const needCatchList = (() => { //只执行一次，减少开销
	let list = {};
	for (var key in modules) {
		var item = modules[key];
		item.persistence = isExitValue(item, 'persistence') ? item.persistence : true;
		item.catchBefore = isExitValue(item, 'catchBefore') ? item.catchBefore : false;
		item.showErr = isExitValue(item, 'showErr') ? item.showErr : true;
		item.showModal = isExitValue(item, 'showModal') ? item.showModal : false;
		item.modalBack = isExitValue(item, 'modalBack') ? item.modalBack : true;
		item.source = isExitValue(item, 'source') ? item.source : 'any';
		item.abort = isExitValue(item, 'abort') ? item.abort : true;
		item.type = isExitValue(item, 'type') ? item.type : 'post';
		list[key] = item;
	}
	return list
})();

export default needCatchList;
