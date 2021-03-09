export default {
    data() {
        return {
            formData: {
                mobile: '',
                login_type: '',
                key: '',
                sms_code: ''
            },
            formList: [
                { prop: 'mobile', placeholder: '请输入手机号', type: 'number', maxlength: 11 },
                { prop: 'sms_code', placeholder: '验证码', child: 'settime',disabled: false, type: 'number' }
            ],
            options: {},
            time: 0
        }
    },
    onLoad(options){
        this.options = options
        this.formData.key = options.key 
        this.formData.login_type = options.login_type
        if (options.login_type === 'success') {
            this.submit(true)
        }
    },
    methods: {
        async submit(success = false) { // 绑定
            const postData = { ...this.formData }
            if (!postData.key) return this.$toast('没有授权信息请重新授权')
            if (!postData.mobile && !success) return this.$toast('请填写手机号')
            if (!postData.sms_code && !success) return this.$toast('请填写短信验证码')
            await this.$http('h5LoginSuccess', postData, {abort: false})
            await this.$http('userInfo', {}, {abort: false})
            this.$back()
        },
        async sendSms(){ // 发送短信接口
            if (this.time !== 0) return
            const mobile = this.formData.mobile
            const key = this.options.key
            if (!key) return this.$toast('没有授权信息请重新授权')
            if (!mobile) return this.$toast('请填写手机号')
            if ( !/^1[3456789]\d{9}$/.test(mobile) ) return this.$modal({
                title: '提示',
                content: '请输入正确的手机号',
                showCancel: false
            })
            const {bizCode} = await this.$http('h5RegisterSendSmsCode',{ mobile, key })
            if ( bizCode === 1002 || bizCode === 1016 ) {
                this.$toast('发送成功！')
                this.time = 60
                this.init()
            }
        },
        init() {
            clearTimeout(this.settime)
            this.settime = setInterval(() => {
                if (this.time > 0) {
                    this.time -= 1
                } else {
                    clearTimeout(this.settime)
                }
            }, 1000);
        }
    }
}