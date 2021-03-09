export default {
	getTopCategory: {
		url: '/GoodsCategory/getTopCategory',
		// catchName: 'allCategory'
	},
	getChildCategory: {
		url: '/GoodsCategory/getChildCategory',
		// catchName: {
		// 	value: 'category',
		// 	position: 'after',
  //           key: 'cat_id'
		// }
	},
	designerList: {
		url: '/JobUser/index'
	},
	designerInfo: {
		url: '/JobUser/info'
	},
	recommendGoods: {  // 推荐商品
		url: '/Goods/recommendGoods'
	},
	hotGoods: {  // 热销爆款
		url: '/Goods/hotGoods'
	},
	specialService: { // 特色服务
		url: '/Shop/specialService'
	},
	JobUser: { // 设计师
		url: '/JobUser/index'
	},
	Package: { // 整装套餐
		url: '/Package/dataList'
	},
	PatternCase: { // 案例列表
		url: 'PatternCase/ajaxList'
	},
	home: {
		url: '/Shop/home',
        loading: '加载中'
	},
	getPageByScene: { // 根据scene获取小程序跳转接口
		url: '/users/getPageByScene'
	},
	jointGoods: { // 拼团
		url: '/Goods/jointGoods'
	},
	spikeGoods: { // 秒杀
		url: '/Goods/spikeGoods'
	},
	getNewUserList: { // 新人专享
		url: '/Shop/getNewUserList'
	},
	/**
     * 获取四宫格
     */
	fourTopics: {
		url: '/Shop/fourTopics'
    },
    /**
     * 推荐专题
     */
	recommendTopics: {
		url: '/Shop/recommendTopics'
    },
}
