import { localCityCatchName } from '@/config'
export default {
	articleArticleCategory: {
		url: '/Article/articleCategory'
	},
	articleList: {
		url: '/Article/article'
	},
	articleDetail: {
		url: '/Article/detail'
	},
	videoList: {
		url: '/Video/index',
        loading: '加载中'
	},
	videoPraise: {
		url: '/Video/praise'
	},
	getVideoGoods: {
		url: '/Video/getVideoGoods'
	},
	videoRead: {
		url: '/Video/read'
	},
	patternCaseList: {
		url: '/PatternCase/ajaxList',
		loading: '加载中'
	},
	caseSearchTab: {
		url: '/PatternCase/ajaxSearchTab'
	},
	caseDetail: {
		url: '/PatternCase/read'
	},
	localCity: {
		catchName: localCityCatchName
	},
	cityList: {
		url: '/Region/ajaxGetCity'
	},
	packageStyle: {
		url: '/Package/packageStyle'
	},
	// 套餐包
	packageDataList: {
		url: '/Package/dataList'
	},
	/**
	 * 获取当前城市的信息
	*/
	getLocalInfo: {
		url: 'Region/getLocalInfo'
	},
	packageInfo: {
		url: '/Package/info'
	},
	/**
	 * 查看更多工长
	*/
	shopForeman: {
		url: '/ShopForeman/ajaxMoreList'
	},
	/**
	 * 工長展示
	*/
	shopForemanInfo: {
		url: '/ShopForeman/ajaxInfo'
	},
}
