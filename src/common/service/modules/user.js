export default {
	/**
     * 新增、编辑收货地址
     */
	userShippingAddressSave: {
		url: '/UserShippingAddress/save',
        loading: true
	},
	/**
     * 收货地址列表
     */
	userShippingAddressList: {
		url: '/UserShippingAddress/ajaxList',
        loading: ''
	},
	/**
     * 删除收货地址
     */
	userShippingAddressDel: {
		url: '/UserShippingAddress/del'
	},
	/**
	 * 获取用户信息
	 * */
    userInfo: {
		url: '/users/userinfo',
		catchName: 'userInfo'
	},
	/**
	 * 保存用户信息
	 * */
    editUserInfo: {
		url: '/users/editUserInfo'
	},
	/**
	 * 获取用户实名认证接口
	*/
	getUserAuth: {
		url: '/users/getUserAuth'
	},
	/**
	 * 保存用户实名认证接口
	*/
	saveUserAuth: {
		url: '/users/saveUserAuth'
	},
	/**
	 * 实名认证获取手机验证码
	 * */
	sendSmsCode: {
		url: '/users/sendSmsCode'
	},
	/**
	* 我的团队
     */
	team: {
		url: '/users/team'
	},
	/**
	* 我的团队数量接口
     */
	teamCount: {
		url: '/users/teamCount'
	},
	/**
	* 获取用户所有发票及指定类型发票
     */
	getUserInvoice: {
		url: '/UsersInvoice/getUserInvoice',
        loading: true
	},
	/**
	 * 保存编辑发票
	*/
	saveInvoice: {
		url: '/UsersInvoice/save',
        loading: true
	},
	/**
	 * 会员等级列表
	*/
	getLevelRuleList: {
		url: '/UsersLevel/getLevelRuleList'
	},
	/**
	 * 购买等级
	*/
	levelOrderPay: {
		url: '/UsersLevel/levelOrderPay',
        loading: true
	},
	/**
	 * 我的订单
	*/
	myOrderCount: {
		url: '/Order/myOrderCount'
	},
	/**
	 * 我的余额
	 */
	getUserFund: {
		url: '/UserFund/getUserFund'
	},
	/**
	 * 资金明细类型列表
	 */
	getFundTypeList: {
		url: '/UserFund/getFundTypeList',
		loading: true
	},
	/**
	 * 资金明细渠道列表
	 */
	getFundChannelList: {
		url: '/UserFund/getFundChannelList'
	},
	/**
	 * 资金明细
	 */
	getFunDetailList: {
		url: '/UserFund/getFunDetailList'
	},
	/**
	 * 获取二维码
	*/
	getUserQrcode: {
		url: '/users/getUserQrcode'
	},
	/**
	 * 累计佣金列表
	*/
	allFundList: {
		url: '/UserFund/allFundList'
	},
	/**
	 * 今日收入
	*/
	todayFundList: {
		url: '/UserFund/todayFundList'
	},
	/**
	 * 总销售额
	*/
	orderAmountList: {
		url: '/UserFund/orderAmountList'
	},
	/**
	 * 是否通联认证
	 * */
	isRealVerify: {
		url: '/FinVerify/isRealVerify'
	},
	/**
	 * 是否实名认证
	*/
	isPersonVerify: {
		url: '/FinVerify/isPersonVerify'
	},
	/**
	 * 创建用户 通联
	*/
	createMember: {
		url: '/FinVerify/createMember'
	},
	/**
	 * 个人认证
	*/
	personVerify: {
		url: '/FinVerify/personVerify'
	},
	/**
	 * 身份证类型
	*/
	getIdentityType: {
		url: '/FinVerify/getIdentityType'
	},
	/**
	 * 银行卡猎豹
	*/
	getCardList: {
		url: '/FinVerify/getCardList'

	},
	/**
	 * 银行卡类型
	*/
	getCardCategory: {
		url: '/FinVerify/getCardCategory'
	},
	/**
	 * 查询银行卡
	*/
	searchBindCard: {
		url: '/FinVerify/searchBindCard'
	},
	/**
	 * 请求绑定银行卡
	*/
	requestBindCard: {
		url: '/FinVerify/requestBindCard'
	},
	/**
	 * 确认绑定银行卡
	*/
	confirmBankCard: {
		url: '/FinVerify/confirmBankCard'
	},
	/**
	 * 银行卡详情
	*/
	getCardInfo: {
		url: '/FinVerify/getCardInfo'
	},
	/**
	 * 解绑银行卡
	*/
	unBindCard: {
		url: '/FinVerify/unBindCard'
	},
	/**
	 * 身份证类型
	*/
	getIdentityType: {
		url: '/FinVerify/getIdentityType'
	},
	/**
	 * 发送短信验证【绑定/解绑】
	*/
	sendPhone: {
		url: '/FinVerify/sendPhone'
	},
	/**
	 * H5端用户邀请二维码
	*/
	h5Qrcode: {
		url: '/users/h5Qrcode'
	},
	/**
	 * 手机短信验证【绑定/解绑】
	*/
	doBindPhone: {
		url: '/FinVerify/doBindPhone'
	},
	/**
	 * 获取绑定手机
	*/
	getBindPhone: {
		url: '/FinVerify/getBindPhone'
	},
	/**
	 * 提现列表
	*/
	withdrawDatalist: {
		url: '/Order/withdraw/datalist'
	},
	/**
	 * 提现申请
	*/
	withdrawOrder: {
		url: '/Order/withdraw'
	},
	/**
	 * 余额充值
	*/
	rechargeOrder: {
		url: '/Order/recharge'
	},
	/**
	 * 分享二维码
	*/
    getShareQrcode: {
    	url: '/users/getShareQrcode',
        loading: true
    },
	/**
	 * 分享二维码
	*/
    getH5ShareQrcode: {
    	url: '/users/getH5ShareQrcode',
        loading: true
    },
	/**
	 * 电子签约
	*/
	signContract: {
		url: '/FinVerify/signContract'
	},
	/**
	 * 分佣配置
	*/
	getConfigInfo: {
		url: '/UserFund/getConfigInfo'
	},
    /**
     * 我的资产智能分析
     */
    getAnalytics: {
        url: '/UserFund/getAnalytics'
    },
    /**
     * 我的团队智能分析
    */
    intelligentAnalysis: {
        url: '/users/intelligentAnalysis'
    }
}
