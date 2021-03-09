export default {
    data() {
        return {
            wechat_auth: 0, // 商家是否公众号授权
            shop: {
                src: '',
                name: ''
            },
            wechatType: 'tel' // 授权登录按钮类型 tel 授权手机 info 授权微信信息(一键登录)
        }
    },
    methods: {
        // #ifdef MP-WEIXIN
        getCode( provider ) { // 获取登录code
            return new Promise((resolve,reject) => {
                uni.login({
                    provider,
                    success: (loginRes) => { 
                        resolve(loginRes)
                    },
                    fail: (res) => {
                        reject(res)
                    }
                })
            })
        },
        async verifyCode() { // 验证code 是否授权 微信小程序专用
            this.$loading()
            const { code } = await this.getCode('weixin')
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
                case 40029:
                    this.$toast('AppId跟商户Id不匹配');
                    break;
                default:
                    console.log(await this.getCode('weixin'), 'code')
                    console.log('bizCode', bizCode)
                    break;
            }
            this.$hideLoading();
            // console.log(data)
        },
        // #endif
        jump(url){
            uni.redirectTo({
                url
            })
        },
        async getShopInfo() {
            const {data} = await this.$http('shopInfo')
            this.shop.src = data.shop_logo
            this.wechat_auth = data.wechat_auth
            this.shop.name = data.shop_name
        },
        // #ifdef H5
        async getWxUrl() { // 获取微信
            let baseUrl = window.location.origin + this.$Router.$route.options.base;
            const {relate_type = 99} = this.pagePathFrom.meta || {}
            const parent_id = uni.getStorageSync(this.$config.shareParentName)
            location.href = `${hostUrl}/WxApp/getWxUrl?h5_redirect=${baseUrl}home/login/bind-mobile&&relate_type=${relate_type}&&parent_id=${parent_id}`
        }
        // #endif
    },
    onLoad() {
        // #ifdef MP-WEIXIN
        this.verifyCode()
        // #endif
        this.getShopInfo()
    }
}