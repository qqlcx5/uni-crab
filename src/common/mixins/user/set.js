export default {
    data() {
        return {
            info: {
                user_picture: '',
                nick_name: '',
                mobile: ''
            },
            formList: [
                { label: '实名认证', value: '', path: 'realName', color: '', params: {} },
                { label: '专票资质', value: '', path: 'ticket', color: '', params: {} },
                { label: '收货地址', value: '', path: 'address', color: '', params: {}  }
            ]
        }
    },
    onShow() {
        this.dynamic()
    },
    methods: {
        logout() {
            this.$modal({
                title: '温馨提示',
                content: '您确定要退出登录？',
                success: (res) => {
                    if(res.confirm){
                        uni.removeStorageSync('jscode2session')
                        uni.removeStorageSync('userInfo')
                        this.$jump('login')
                    }
                }
            })
        },
        dynamic() {
            this.getUserInfo()
        },
        async getUserInfo(abort = false) { // 获取用户信息
            this.info.user_picture = ''
            this.info.nick_name = ''
            this.info.mobile = ''
            const { data } = await this.$http('userInfo',{},{abort})
            this.info.user_picture = data.user_picture
            this.info.nick_name = data.nick_name
            this.info.mobile = data.mobile
            const is_examine = data.is_examine * 1
            this.formList[0].params.is_examine = is_examine // -1 未提交审核 0 待审核 1 审核通过 2 审核失败
            switch (is_examine) {
                case -1:
                    this.formList[0].path = 'realName'
                    this.formList[0].value = '未认证'
                    break;
                case 0:
                    this.formList[0].path = 'realStatus'
                    this.formList[0].value = '待审核'
                    break;
                case 1:
                    this.formList[0].path = ''
                    this.formList[0].value = '已认证'
                    break;
                case 2:
                    this.formList[0].path = 'realStatus'
                    this.formList[0].value = '审核失败'
                    break;
                default:
                    break;
            }
            this.formList[0].color = is_examine === 1 ? '#666' : '#333'
        }
    }
    
}