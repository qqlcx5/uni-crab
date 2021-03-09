import router from './index'
import { Route } from 'uni-simple-router'
import Vue from 'vue'
const that_ = Vue.prototype;

//全局路由前置守卫
router.beforeEach((to, from, next) => {
    //之后可能加其他的，可以用来做登录返回上一页
    if(to.query.action === "referrer"){
        delete to.query.action;
        next({
            NAVTYPE: 'push',
            name: to.name,
            query: {
                lastName: from.name,
                lastQuery: JSON.stringify({...from.query}),
                prevPath: from.path,
                ...to.query
            }
        })
        return ;
    }
    next()
})

// 全局路由后置守卫
router.afterEach(async (to, from) => {
    /**
	 * 调用埋点
	*/
	let userInfoRes = await that_.$http('userInfo', {}, {
		source: 'catch'
	});
	let userInfo = userInfoRes.data;
	Object.keys(userInfo).length && guestRecord(to, from);

	/**
	 * 打烊之后页面不显示，就要请求店铺基本信息
	*/
	let { meta = {} } = to;
	if(meta.storeClose !== 'show'){
		let { data } = await that_.$http('shopInfo');
		if(data.status === 0 && to.name !== 'storeClose'){
			return router.push({
				name: 'storeClose',
				params: {
					lastName: from.name,
					lastQuery: JSON.stringify({...from.query}),
					prevPath: from.path,
					...to.query
				}
			})
		}
	}
	uni.setStorageSync(that_.$config.fullPageCatch, `${to.path}${that_.$c.parse(to.query)}`)
})

/** *
 * 埋点
 */
async function guestRecord(to, from) {
	let { data: { token } } = await that_.$http('wxuserinfo', null, {
		source: 'catch'
	});
	if (!token) return false
    let shareUserId = uni.getStorageSync(that_.$config.shareParentName);
	that_.$http('setGuestRecord', {
		relate_id: to.query.detailId,
		relate_type: to.meta ? to.meta.type_id : '',
		share_user_id: shareUserId ? shareUserId : '',
		platform_type: that_.$config.platformType
	})
}