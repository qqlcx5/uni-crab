export default {
    data() {
        return {
            userInfo: {},
            qrcode: '', 
            share: {}
        }
    },
    watch: {
        shopConfig() {
            this.shareParams = {
                title: this.share.shopName,
                path: `${this.shopConfig.menu[0].app_page}?parent_id=${this.userInfo.uid}`
            }
        }
    },
    methods: {
        async saveImg() {
            if (!this.qrcode) return
            const tempFilePath = await this.uniDownloadFile(this.qrcode)
            const savedFilePath = await this.uniSaveFile(tempFilePath)
            this.$toast('保存成功')
        },
        uniDownloadFile(url) {
            return new Promise((resolve, reject) => {
                uni.downloadFile({
                    url: this.$config.proxyImgUrl + url,
                    success: (res) => {
                        if (res.statusCode === 200) {
                            resolve(res.tempFilePath)
                        }
                    }
                })
            })
        },
        uniSaveFile(tempFilePath) {
            return new Promise((resolve, reject) => {
                uni.saveFile({
                    tempFilePath,
                    success: function ({savedFilePath}) {
                        resolve(savedFilePath)
                    },
                    fail: (err) => {
                        reject(err)
                    }
                })
            })
        },
        async getUserInfo(abort = true) { // 获取用户信息
            const { data } = await this.$http('userInfo',{},{abort})
            this.userInfo = data
        },
        async getUserQrcode() { // 获取二维码
            // #ifdef MP-WEIXIN
            const { data: {src} } = await this.$http('getUserQrcode')
            // #endif
            // #ifdef H5
            const { data: {src} } = await this.$http('h5Qrcode')
            // #endif
            this.qrcode = src
        },
        async getShopInfo() {
            const {data} = await this.$http('shopInfo')
            this.share.shopName = data.shop_name
        }
    },
    onLoad() {
        this.getUserInfo()
        this.getUserQrcode()
        this.getShopInfo()
    }
}