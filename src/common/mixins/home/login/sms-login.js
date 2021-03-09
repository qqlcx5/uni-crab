export default {
    data() {
        return {
            formData: {
                mobile: '',
                sms_code: ''
            },
            formList: [
                { prop: 'mobile', placeholder: '请输入手机号', type: 'number', maxlength: 11 },
                { prop: 'sms_code', placeholder: '验证码', child: 'settime',disabled: false, type: 'number' }
            ],
            isInfo: false,
            cacheMobile: '',
            wechatType: 'tel' // 授权登录按钮类型 tel 授权手机 info 授权微信信息(一键登录)
        }
    },
    methods: {
        async submit(){ // 登录
            const parent_id = uni.getStorageSync(this.$config.shareParentName)
            let type = 1 // 1微信小程序端验证码2公众号端验证码3H5端纯手机验证码
            // #ifdef H5 
            type = this.$isWechatBrowser ? 2 : 3
            // #endif
            // #ifdef APP-PLUS 
            type = 4
            // #endif
            const {relate_type = 99} = this.pagePathFrom.meta || {}
            const { bizCode, msg } = await this.$http('smsLogin',{...this.formData, parent_id, type, relate_type },{abort: false})
            if ( bizCode != 0 ) {
                return this.$toast(msg)
            }
            await this.$http('userInfo', {}, {abort: false})
            this.$back()
        },
        countdown(next){
            next()
        },
        // #ifdef MP-WEIXIN 
        async verifyCode() { // 验证code 是否授权 微信小程序专用
            const { code } = await getCode('weixin')
            /**
             * @bizCode 1006 用户未注册 1014 用户已注册
            */
            const { bizCode } = await this.$http('mobileByCode', { code }) // bizCode
            switch ( bizCode ) {
                case 1006:
                    this.wechatType = 'tel'
                    break;
                case 1014:
                    this.wechatType = 'info'
                    break;
                default:
                    break;
            }
        },
        // #endif
        async mobileisauth(mobile) {
            // #ifdef MP-WEIXIN 
                if ( !this.cacheMobile ) {
                    this.cacheMobile = mobile
                } else if ( this.cacheMobile === mobile ) {
                    return
                }
                const { bizCode } = await this.$http('mobileisauth', {mobile})
                switch (bizCode) {
                    case 1001: // 用户已授权
                        this.isInfo = false
                        break;
                    case 1000: // 用户未授权
                        this.isInfo = true
                        break;
                    default:
                        break;
                }
            // #endif
        }
    },
    onLoad(){
        // #ifdef MP-WEIXIN 
        this.verifyCode()
        // #endif
    }
} 