export default {
    data() {
        return {
            jump_url: '/user/balance/index/',
            isVerifyStatus: {} // 通联验证状态
        }
    },
    onShow(){
        this.isRealVerify()
    },
	methods: {
		/**
		 * @param {Object} member_type 会员类型
		 * @param {Object} jump_page_type 签约页面类型 1.H5页面 2.小程序页面
		 * @param {Object} jump_url 签约完成后转地址
		 */
		async signContract(jump_page_type = 1, member_type = 3) {
            // #ifdef MP-WEIXIN
            jump_page_type = 2
            // #endif
            const jump_url = `${this.jump_url}`
            const {data:{data:{url}}} = await this.$http('signContract', { jump_page_type, jump_url, member_type })
            // #ifdef MP-WEIXIN
            this.navigateToMiniProgram(url)
            // #endif
            // #ifdef H5
            url && (window.location.href = url)
            // #endif
            // #ifdef APP-PLUS
            url && this.$jump('realWebView',{url})
            // #endif
            
        },
        // #ifdef MP-WEIXIN
        navigateToMiniProgram(targetUrl) {
            return new Promise((resolve, reject) => {
                uni.navigateToMiniProgram({
                    appId: 'wxc46c6d2eed27ca0a',//通商云平台账户小程序appId
                    path: 'pages/merchantAddress/merchantAddress',
                    extraData: {
                        targetUrl//商户拼接的请求报文
                    },
                    envVersion: 'release',//develop 开发版  trial 体验版  release 正式版
                    success(res) {
                        resolve(res)
                    },
                    fail(err) {
                        // this.$jump()
                        reject(err)
                    }
                })
            })
            
        },
        // #endif
        async isRealVerify() { // 是否通联认证
            const { data: isVerifyStatus } = await this.$http('isRealVerify',{ member_type: 3 }) // 2: 企业 3： 个人
            this.isVerifyStatus = isVerifyStatus
            if ( !isVerifyStatus.is_auth.status && !isVerifyStatus.is_bank.status && !isVerifyStatus.is_mobile.status && !isVerifyStatus.is_sign.status ) this.$http('createMember')
        },
        async submitSuccess() {
            const { data: isVerifyStatus } = await this.$http('isRealVerify',{ member_type: 3 }) // 2: 企业 3： 个人
            const verify = this.$Route.query.type
            console.log(verify,'verify')
            if (!verify) {
                return this.$back()
            }
            if ( !isVerifyStatus.is_auth.status ) return this.$jump('balanceRealName',{}, 'replace')
            if ( !isVerifyStatus.is_mobile.status ) return this.$jump('bindPhone',{}, 'replace')
            if ( !isVerifyStatus.is_sign.status ) return this.signContract()
            if ( !isVerifyStatus.is_bank.status ) return this.$jump('bindbank',{}, 'replace')
            this.$back()
        },
	}
}
