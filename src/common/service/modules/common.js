export default {
    /**
     * 获取商家信息
     */
	shopInfo: {
		url: '/Shop/info'
	},
    /**
     * 获取配置信息
     */
	shopConfig: {
		url: '/Shop/theme'
		// catchName: 'configData'
	},
    /**
     * 获取配置信息
     */
	wechatShare: {
		url: '/users/wechatShare'
	},
    /**
     * 分享/埋点
     */
	setGuestRecord: {
		url: '/GuestRecord/save',
		showErr: false
	},
    /**
     * 获取定位
     */
	getRegion: {
		url: '/Region/ajaxGetRegion',
        loading: true
	},
	upload: { // 上传文件
		url: '/Tools/upload'
	},
    /**
     * 保存收藏
     */
	favoritesSave: {
		url: '/Favorites/save',
        toast: '收藏成功',
        modalBack: false
	},
    /**
     * 取消收藏
     */
	favoritesCancel: {
		url: '/Favorites/cancel',
        modalBack: false
	},
    /**
     * 我的收藏列表
     */
    favoritesDataList: {
    	url: '/Favorites/dataList',
	},
    /**
     * 是否收藏
     */
    hasFavorite: {
    	url: '/Favorites/hasFavorite',
	},
    /**
     * 上传图片
     */
    uploadImg: {
    	url: '/Tools/upload',
        type: 'upload'
    },
    /**
     *  微信支付
     */
    payInfo: {
    	url: '/Order/weChatPayTest',
	},
    /**
     *  微信支付
     */
    getWeChatSubscription: {
    	url: '/shop/getWeChatSubscription'
	},
    /**
     * 立即预约
     */
    applySignUp: {
        url: '/UsersAppointApply/signUp'
    }
}
