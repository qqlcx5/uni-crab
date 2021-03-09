import Vue from 'vue'
import Router from '@/common/router'

/*
	消息提示框
	title String 是 提示的内容，长度与 icon 取值有关。
	icon String 否 图标，有效值 "success", "loading", "none"
	duration Number 否 提示的延迟时间，单位毫秒，默认：1500
	image String 否 自定义图标的本地路径
	mask Boolean 否 是否显示透明蒙层，防止触摸穿透，默认：false
*/
export function showToast(msg, icon = 0, duration = 1500, mask = true, image = false) {
    const icons = ['none', 'success', 'loading']
    const _icon = icons[icon];
    let params = {
        icon: _icon,
        title: msg || '系统繁忙',
        duration: duration,
        mask: mask
    }
    image && (params.image = image);
    uni.showToast(params);
}


// loading框
export function showLoading(msg = '加载中', mask = true) {
    let params = {
        mask: mask,
        title: msg
    }
    uni.showLoading(params);
}

// 隐藏loading框
export function hideLoading() {
    uni.hideLoading();
}

/*
	显示对话框
	title	String	是	提示的标题
	content	String	是	提示的内容
	showCancel	Boolean	否	是否显示取消按钮，默认为 true
	cancelText	String	否	取消按钮的文字，默认为"取消"，最多 4 个字符
	cancelColor	HexColor	否	取消按钮的文字颜色，默认为"#000000"	H5、微信小程序、百度小程序
	confirmText	String	否	确定按钮的文字，默认为"确定"，最多 4 个字符
	confirmColor	HexColor	否	确定按钮的文字颜色，H5平台默认为"#007aff"，微信小程序平台默认为"#3CC51F"，百度小程序平台默认为"#3c76ff"	H5、微信小程序、百度小程序
	success	Function	否	接口调用成功的回调函数
	fail	Function	否	接口调用失败的回调函数
	complete	Function	否	接口调用结束的回调函数（调用成功、失败都会执行）
*/
export function showModal({
    title = '',
    content = '这是一个模态框',
    showCancel = true,
    cancelText = '取消',
    cancelColor = '#666',
    confirmText = '确定',
    confirmColor = '#0260fe',
    success,
    fail,
    complete
}) {
    uni.showModal({
        title: title,
        content: content,
        showCancel: showCancel,
        cancelText: cancelText,
        cancelColor: cancelColor,
        confirmText: confirmText,
        confirmColor: confirmColor,
        success: (res) => {
            success && success(res);
        },
        fail: (err) => {
            fail && fail(err);
        },
        complete: (res) => {
            complete && complete(res);
        }
    });
}


// 深拷贝
export const deepClone = (obj) => {
    // 申明一个容器 用于存放科隆的数据
    let warp;
    // 读取类型
    let objType = getVariableType(obj);
    // 判断读到的类型 并且以符合的存放格式存放数据
    if (objType === 'Object') {
        warp = {};
    } else if (objType === 'Array') {
        warp = [];
    } else {
        return obj;
    }
    //  循环数据内容
    for(var x in obj) {
        //  得到的数据内容
        let value = obj[x];
        // 判断 已经得到的内容里是否还有Object，Array
        //  因为 数据中可能出现 [1,2,[4,5,4,],47,97] 这种情况
        let valueType = getVariableType(value)
        if (valueType === 'Object' || valueType === 'Array') {
            // 当出现上述情况是 使用递归函数进行再次运行
            warp[x] = deepClone(value)
        } else {
            //如果没有出现上诉情况 直接克隆
            warp[x] = obj[x];
        }
    }
    return warp;
}


/**
 *@description 判断数据类型
 * @param {*} anything 任意数据类型 any
 * @return {string} 返回数据类型有Array,Number,Object,Boolean,String,Undefined,Function,Null
 */
export function getVariableType(anything) {
    return Object.prototype.toString.call(anything).slice(8, -1)
}

/**
 *@description 判断微信浏览器还是h5
 * @param {*} Boolean 任意数据类型 Boolean
 * @return {string} 返回数据类型有 Boolean
 */
export const isWechatBrowser = (() => {
    // #ifdef H5
    let ua = navigator.userAgent.toLowerCase();
    return (/micromessenger/.test(ua)) ? true : false;
    // #endif
    return false
})();

export const sessionCatch = {
    // #ifdef H5
    set(key, val) {
        let sessionKey = key + 'Session';
        let type = typeof val;
        sessionStorage.setItem(sessionKey, JSON.stringify({
            type: type,
            data: val
        }));
    },
    get(key) {
        let sessionKey = key + 'Session';
        let data = JSON.parse(sessionStorage.getItem(sessionKey) || '{}');
        return data.data;
    },
    remove(key) {
        let sessionKey = key + 'Session';
        sessionStorage.removeItem(sessionKey)
    },
    clear() {
        sessionStorage.clear();
    },
    // #endif
    // #ifndef H5
    set(key, val) {
        let sessionKey = key + 'Session';
        uni.setStorageSync(sessionKey, val);
    },
    get(key) {
        let sessionKey = key + 'Session';
        return uni.getStorageSync(sessionKey);
    },
    remove(key) {
        let sessionKey = key + 'Session';
        uni.removeStorageSync(sessionKey);
    },
    clear() {
        let allSession = uni.getStorageInfoSync('uni-storage-keys').keys;
        allSession.forEach(key => {
            if (key.indexOf('Session') !== -1) {
                uni.removeStorageSync(key);
            }
        });
    }
    // #endif
}

export const jumpPage = (name, params = {}, method = 'push') => {
    params = formatParams(params) || {};
    if(!name) return ;
    Router[method](getVariableType(name) === 'String' ? {
        name: name,
        params: params
    }: name)
}

export const jumpPageDetail = (name, id, params = {}, method = 'push') => {
    params = formatParams(params) || {};
    if(!name) return ;
    if(!id){
        return jumpPage(name, params, method);
    }
    Router[method]({
        name: name,
        params: {
            detailId: id,
            ...params
        }
    })
}

function formatParams(params) {
    let newParams = {};
    Object.keys(params).forEach(o => {
      let item = String(params[o]);
      !['undefined', 'null'].includes(item) && (newParams[o] = params[o]);
    })
    return newParams;
}


export const backRef = (params = {}) => {
    let that_ = Vue.prototype;
    //小程序端有问题，所以需要加$nextTick
    that_.$nextTick(() => {
        let query = that_.$Route.query;
        if (!query.lastName) { //没有上一页指定则正常返回
            return backPage();
        }
        let pages = getCurrentPages(); //全部页面
        let prevPage = pages[pages.length - 2]; //当前页面
        let lastQuery = JSON.parse(query.lastQuery || '{}');
        // let isExitQuery = Object.keys(params).every(o => {//多次切换会导致返回同一个页面
        //     return Object.keys(lastQuery).findIndex(o1 => o1 === o) !== -1;
        // })
        let isExitQuery = false;
        if (isExitQuery || pages.length === 1 || ('/' + prevPage.route) !== decodeURIComponent(query.prevPath)) {
            Router.replace({
                name: query.lastName,
                params: Object.assign({}, lastQuery, params)
            })
        } else {
            Object.keys(params).forEach(key => {
                prevPage.$vm[key] = params[key];
            })
            backPage();
        }
    })
}

/**
 *@description 返回上一页
 */
export const backPage = () => {
    if (getCurrentPages().length === 1) {
        Router.replace({
            name: 'home'
        })
    } else {
        Router.back();
    }
}
/**
 *@description 专题页跳转以及后端配置地址跳转
 */
export const serverJump = ({
		app_page,
		id,
		keyword,
		cat_id
	}) => {
	if (id) {
		jumpPageDetail(app_page, id);
	} else if(/(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g.test(app_page)){//远端地址
		jumpPage('webView', {
			url: encodeURIComponent(app_page)
		});
	} else {
		jumpPage(app_page, {
			cat_id,
			keyword
		});
	}
}


/**
 * 数据 按照 拼音首字母 排序 并分组
 *
 * @param {Json} data ; 需要 排序的 数据
 * @param {String} field ；必须；排序所依据的 字段 名
 *
 * @return {Json} ; 例如：{A:[{},{}],B:[{},{}],C:[{}],#:[]}
 */
const data_letter_sort = (data, field) => {
	let letter_reg = /^[A-Z]$/;
	let list = new Array();
	let letter = '';
	for (let i = 0; i < data.length; i++) {
		// 添加 # 分组，用来 存放 首字母不能 转为 大写英文的 数据
		list['#'] = new Array();
		// 首字母 转 大写英文
		letter = (data[i][field]).substr(0, 1).toUpperCase();
		// 是否 大写 英文 字母
		if (!letter_reg.test(letter)) {
			letter = '#';
		}
		// 创建 字母 分组
		if (!(letter in list)) {
			list[letter] = new Array();
		}
		// 字母 分组 添加 数据
		list[letter].push(data[i]);
	}
	// 转换 格式 进行 排序；
	var resault = new Array();
	for (var key in list) {
		resault.push({
			letter: key,
			list: list[key]
		});
	}
	resault.sort(function (x, y) {
		return x.letter.charCodeAt(0) - y.letter.charCodeAt(0);
	});
	// # 号分组 放最后
	var last_arr = resault[0];
	resault.splice(0, 1);
	resault.push(last_arr);

	// 转换 数据 格式
	var json_sort = {}
	for (var i = 0; i < resault.length; i++) {
		json_sort[resault[i].letter] = resault[i].list;
	}

	return json_sort;
}

/** *
 * 是否为空
 * @parmas any - val 传进来的值
 */
const isEmpty = (val) => {
	if (val instanceof Array) {
		if (val.length === 0) return true
	} else if (val instanceof Object) {
		if (!Object.keys(val).length) return true
	} else {
		if (val === 'null' || val === null || val === 'undefined' || val === undefined || val === '') return true
		return false
	}
	return false
}

export default {
    $back: backPage,
    $backRef: backRef,
    $jump: jumpPage,
    $deepClone: deepClone,
    $typeOf: getVariableType,
    $hideLoading: hideLoading,
    $isWechatBrowser: isWechatBrowser,
    $session: sessionCatch,
    $loading: showLoading,
    $modal: showModal,
    $toast: showToast,
	$serverJump: serverJump,
	$jumpDetail: jumpPageDetail,
    $data_letter_sort: data_letter_sort,
    $isEmpty: isEmpty
}
