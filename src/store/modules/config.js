import Vue from 'vue'
/** 基本用户信息 */
export default {
	namespaced: true,
	state: {
		pagePath: {},
		pagePathFrom: {},
		shopConfig: {},
		shopInfo: {}
	},
	mutations: {
		SET_PAGE_PATH(state, o) {
			state.pagePath = o.to
			state.pagePathFrom = o.from
		},
		SET_SHOP_CONFIG(state, data) {
			state.shopConfig = data
		}
	},
	actions: {
		setPagePath({ commit }, o) {
			commit('SET_PAGE_PATH', o)
		},
		async setShopConfig({ commit }, o) {
			let res = await Vue.prototype.$http('shopConfig');
			if(res.code === 0){
				commit('SET_SHOP_CONFIG', res.data)
			}
		}
	},
	getters: {
		getPagePath: (state) => {
			return state.pagePath
		},
		getPagePathFrom: (state) => {
			return state.pagePathFrom
		},
		getShopInfo: (state) => {
			return state.shopInfo
		}
	}
}
