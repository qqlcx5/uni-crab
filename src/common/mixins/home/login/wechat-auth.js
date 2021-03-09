export default {
    data() {
        return {
            shop: {
                src: '',
                name: ''
            }
        }
    },
    methods: {
        async getUserInfo( data ) { // 绑定微信操作
            if ( !data.encryptedData || !data.iv ) {
                return
            }
            const { code } = await getCode('weixin')
            const postData = { ...data, code }
            const res = await this.$http('usersbindwechat', postData)
            switch (res.bizCode) { 
                case 1011: // 绑定成功
                    this.$back()
                    break;
                case 1012: // 微信绑定失败 
                    this.$back()
                    break;
                case 1013: // 微信已被绑
                    this.$back()
                    break;
                default:
                    this.$toast(res.msg)
                    break;
            }
            this.$back()
        }
    }
}