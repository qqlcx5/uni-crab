import needCatchList from './modules'
import http from './request.js'
import {
	backPage,
	showLoading,
	hideLoading,
	showToast,
	sessionCatch,
	getVariableType,
	deepClone,
	showModal
} from '@/common/utils/common'

let errModalFlag = false, //错误弹窗，防止弹出多个
	requsetData = { //预设最大重发请求数，一定要先定义，不然监听会出错
		refreshToken: false,
		ajax0: false,
		ajax1: false,
		ajax2: false,
		ajax3: false,
		ajax4: false,
		ajax5: false,
		ajax6: false,
		ajax7: false,
		ajax8: false,
		ajax9: false,
		ajax10: false
	},
	changeRequsetData = {
		refreshToken: false,
		ajax0: false,
		ajax1: false,
		ajax2: false,
		ajax3: false,
		ajax4: false,
		ajax5: false,
		ajax6: false,
		ajax7: false,
		ajax8: false,
		ajax9: false,
		ajax10: false
	},
	requsetNumber = 0;
/**
 * @description 请求前统一拦截
 * @param {String} name 请求地址值key，具体看配置文件@/api/config.js
 * @param {Object} query 请求参数列表
 * @param {String} modifyObj 修改请求配置
 * @param {String} type 请求类型：get | post | upload,默认post
 * @param {Boolean} reLoad 是否是重发请求类型：get | post,默认post
 * @return {Promise} 返回是一个promise
 */
export default function requestBefore(name, query = {}, modifyObj = {}, type, reLoad = false) {
	return new Promise(async (resolve, reject) => {
		let catchObj = deepClone(needCatchList[name] || {});
		if (modifyObj) {
			for (var i in modifyObj) {
				if (typeof modifyObj[i] == 'object' && typeof catchObj[i] == 'object') {
					Object.assign(catchObj[i], modifyObj[i])
				} else {
					catchObj[i] = modifyObj[i];
				}
			}
		}
		if (!catchObj.url) { //请求地址不能为空
			showToast('请求地址错误');
			// #ifdef H5
			console.error('[fatal error] 请求地址错误，『' + name + '』不存在请求配置文件中');
			// #endif
			return reject({
				code: 20000,
				msg: '请求地址不能为空'
			});
		}
		if (catchObj.catchName && !catchObj.update && catchObj.abort) { //说明需要存缓存，先去去缓存，强制更新他人的  必须请求
			var storage = catchObj.persistence ? uni.getStorageSync : sessionCatch.get;
			var catchName = getCatchName(catchObj.catchName, query)
			var catchStorage = storage(catchName);
			if (catchStorage) {
				return resolve({
					code: 0,
					msg: '读取缓存成功',
					data: catchStorage
				});
			}
			if (catchObj.source === 'catch') { //如果缓存没有则返回空，一般是object类型
				return resolve({
					code: 0,
					msg: '缓存中没有相应数据',
					data: {}
				});
			}
		}
		type = (type || catchObj.type || 'POST').toLocaleLowerCase();
		catchObj.loading && showLoading(String(catchObj.loading) === 'true' ? '' : catchObj.loading);
		catchObj.url += (getVariableType(query) === 'String' ? ('/' + query) : '');
		let taskFn = null;
		if (getVariableType(query) === 'Object') {
			taskFn = query.getTask;
			delete query.getTask;
		}
        if(requsetData.refreshToken && name !== 'shuaxinWxApp'){
            let lRes = await resendRequest(name, query, modifyObj, type);
            resolve(lRes);
        }
		http[type](
			catchObj.url,
			type !== 'get' ? {
				...query,
				getTask: (task, options) => {
					task.onProgressUpdate((res) => {
						taskFn(res);
					})
				}
			} : {
				params: query
			}
		).then(async res => {
            //如果是刷新token过程中有偷溜的要禁止返回
			name === 'shuaxinWxApp' || !requsetData.refreshToken ? responseSuccess(res, catchObj, query) : '';
			if (res.code === 0) {
				resolve(res);
			} else {
                //这是一条偷溜出去的数据
                if(res.code === 20200 && requsetData.refreshToken && name !== 'shuaxinWxApp'){
                    let lRes = await resendRequest(name, query, modifyObj, type);
                    resolve(lRes);
                } else if (res.code === 20202) { //token过期，需要刷新
					if (name === 'shuaxinWxApp') return reject(res);
					if (name !== 'shuaxinWxApp' && requsetData.refreshToken) {
                        let nRes = await resendRequest(name, query, modifyObj, type);
                        resolve(nRes);
					} else {
						console.log('刷新Token开始');
						requsetData.refreshToken = true;
						let rsd = await resendRefreshRequest();
						console.log('刷新Token结束');
						requsetData.refreshToken = false;
						for (; requsetNumber > 0; requsetNumber--) {
							requsetData['ajax' + requsetNumber] = !requsetData['ajax' + requsetNumber];
						}
						let rep = await requestBefore(name, query, modifyObj, type);
						if (rep.code === 0) {
							resolve(rep);
						} else {
							reject(rep);
						}
					}
				} else {
					reject(res);
				}
			}
		}).catch(err => {
			responseFail(err, catchObj);
			reject(err);
		})
	})
}

function resendRequest(name, query, modifyObj, type) {
	return new Promise((resolve, reject) => {
		requsetNumber++;
		console.log('等待Token刷新完成');
		let curKey = 'ajax' + requsetNumber;
		Object.defineProperty(requsetData, curKey, {
			get: function() {
				return changeRequsetData[curKey];
			},
			set: async function(newValue) {
				changeRequsetData[curKey] = newValue;
				if (!requsetData.refreshToken) {
					console.log('重发Token过期请求');
					let reqRes = await requestBefore(name, query, modifyObj, type);
					if (reqRes.code === 0) {
						resolve(reqRes);
					} else {
						reject(reqRes);
					}
				}
			}
		})
	})
}



function resendRefreshRequest() {
	return new Promise(async (resolve, reject) => {
		let abortRes = {
			code: 20000,
			msg: '系统繁忙请稍后再试'
		}
		let res = await requestBefore('shuaxinWxApp', null, {
			abort: false
		})
		resolve(res);
	})
}

function responseFail(res, catchObj = {}) {
	catchObj.loading && hideLoading();
	if (catchObj.toast && res.code) {
		uni.getNetworkType({
			success: (res) => {
				if (res.networkType === 'none' || res.networkType === 'unknown') {
					showToast(res.msg || '您的网络不佳');
				} else {
					showToast(res.msg || '系统繁忙');
				}
			}
		})
	}
}

async function responseSuccess(res, catchObj, query) {
	catchObj.loading && hideLoading();
	if (res.code === 0) {
		res.data = catchObj.catchBefore ? await catchObj.catchBefore(res.data) : res.data;
		res.msg = res.msg;
		if (catchObj.catchName || catchObj.update) { //表示要进行缓存或者强制更新
			catchHandle(catchObj, res, query);
		}
		if (catchObj.removeName) {
			var removeObj = needCatchList[catchObj.removeName];
			var removeName = getCatchName(removeObj.name);
			if (removeObj.persistence) {
				uni.removeStorageSync(removeName)
			} else {
				sessionCatch.remove(removeName)
			}
		}
		catchObj.toast && showToast(getVariableType(catchObj.toast) === 'Boolean' ? res.msg : catchObj.toast, 1);
	} else {
		if (res.code === 20200) { //token错误，需要登录，可能未登录
			removeStorageSync([needCatchList['userInfo']]);
			removeStorageSync([needCatchList['shuaxinWxApp']]);
			if (!errModalFlag) {
			    errModalFlag = true;
			    showModal({
			        title: '温馨提示',
			        content: '您还未登录或登录已过期，请登录后操作',
			        // content: '您还未登录或登录已过期，请登录后操作' +  JSON.stringify(catchObj),
			        cancelText: catchObj.modalBack ? '返回' : '取消',
			        success: (res => {
			            if (res.confirm) {
			                uni.redirectTo({
			                    url: '/home/login/index'
			                })
			                // jumpPage('login', {
			                //     action: 'referrer'
			                // })
			            } else {
			                catchObj.modalBack && backPage();
			            }
						errModalFlag = false;
			        })
			    })
			}
		} else if (res.code !== 20202) {
			catchObj.showErr && showToast(res.msg);
			if (catchObj.showModal && !errModalFlag) {
				errModalFlag = true;
				errModalFlag && showModal({
					title: '错误提示',
					content: res.msg,
					showCancel: false,
					confirmText: '我知道了',
					success: () => {
						errModalFlag = false;
					}
				});
			}
		}
	}
}

/**
 * @description 缓存统一设置或删除管理
 * @param {Object} catchObj 缓存对象
 * @param {type} queryObj 请求参数
 */

function catchHandle(catchObj = {}, resObj = {}, queryObj = {}) {
	let catchName = getCatchName(catchObj.catchName, queryObj);
	catchObj.catchName && setStorageSync(catchName, catchObj, resObj.data);
}

/**
 * @description 获取缓存名称
 * @param {Object} catchObj 缓存项
 * @return {String}
 */
const getCatchName = (nameObj, queryObj = {}) => {
	let catchName = '';
	if (getVariableType(nameObj) === 'Object') {
		catchName = nameObj.value;
		if (nameObj.position) {
			let nameStorage, extraName = '';
			if (getVariableType(nameObj.storage) === 'Function') {
				(async () => {
					nameObj.storage = await nameObj.storage();
				})();
			}
			nameStorage = nameObj.storage ? nameObj.storage : false;
			if (nameStorage) {
				extraName = nameStorage[extraName] || '';
			} else if (getVariableType(queryObj) === 'Object') {
				let _key = nameObj.key || '';
				extraName = _key && queryObj.hasOwnProperty(_key) ? queryObj[_key] : _key;
			} else {
				extraName = queryObj;
			}
			catchName = nameObj.position === 'after' ? (catchName + extraName) : (extraName + catchName);
		}
	} else {
		catchName = nameObj;
	}
	return catchName;
}
// 设置缓存
function setStorageSync(name, catchObj, data) {
	if (getVariableType(data) === 'Object' && JSON.stringify(data) === '{}') return;
	if (getVariableType(data) === 'Array' && data.length === 0) return;
	let {
		persistence
	} = catchObj;
	if (persistence) {
		uni.setStorageSync(name, data);
	} else {
		sessionCatch.set(name, data);
	}
}
/**
 * @param {Array} list 需要清空缓存的数组
 * @param {String} list 键值
 * @return {Void} 无返回值
 */
function removeStorageSync(list) {
	list.forEach(o => {
		var catchName;
		var storage = o.persistence ? {
			get: uni.getStorageSync,
			remove: uni.removeStorageSync
		} : {
			get: sessionCatch.get,
			remove: sessionCatch.remove
		};
		let catchNameType = getVariableType(o.catchName) === 'Object';
		if (catchNameType) {
			catchName = o.catchName.value;
		} else {
			catchName = o.catchName;
		}
		var _position = catchNameType ? o.catchName.position : false;
		if (_position) { //这种情况都是做持久化的，获取名字匹配的直接删除
			var allCatch = uni.getStorageInfoSync().keys || [];
			allCatch.forEach(o1 => {

				if (_position === 'before') { //加载前缀
					var item = o1.split('').reverse().join('');
					if (item.indexOf(catchName.split('').reverse().join('')) === 0) {
						console.warn('模糊删除前缀为：' + catchName + '的缓存');
						storage.remove(o1);
					}
				} else {
					if (o1.indexOf(catchName) === 0) {
						console.warn('模糊删除后缀为：' + catchName + '的缓存');
						storage.remove(o1);
					}
				}
			})
		} else {
			console.warn('删除缓存：' + catchName)
			storage.remove(catchName);
		}
	})
}
