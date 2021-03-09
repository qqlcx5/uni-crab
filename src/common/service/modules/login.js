export default {
    shuaxinWxApp: {
		url: 'WxApp/shuaxin',
		catchName: 'jscode2session'
	},
	getwxmobile: {  // 小程序一键登录或者注册
		url: '/WxApp/getwxmobile',
		catchName: 'jscode2session'
	},
	mobileisauth: { // 判断手机号是否授权绑定微信
		url: '/WxApp/mobileisauth'
	},
	wxuserinfo: { // 向后台传送微信用户信息 或 授权后一键登录
		url: '/WxApp/wxuserinfo',
		catchName: 'jscode2session'
	},
	smsLogin: { // 短信验证登录
		url: '/WxApp/smsLogin',
		catchName: 'jscode2session'
	},
	codeisauth: { // 根据微信code判断小程序是否授权
		url: '/WxApp/codeisauth'
	},
	mobileByCode: { // 微信端  根据code判断是否注册
		url: '/WxApp/mobileByCode'
	},
	usersbindwechat: { // 用户绑定微信
		url: '/users/usersbindwechat'
	},
	getWxUrl: { // H5微信登录
		url: '/WxApp/getWxUrl'
	},
	h5RegisterSendSmsCode: { // 公众号绑定手机
		url: '/WxApp/h5RegisterSendSmsCode'
	},
	h5LoginSuccess: {// 微信H5登录获取token
		url: '/WxApp/h5LoginSuccess',
		catchName: 'jscode2session'
	},
	h5mobileRegisterSendSmsCode: { // h5手机号注册发送短信验证码
		url: '/WxApp/h5mobileRegisterSendSmsCode'
	}
}
