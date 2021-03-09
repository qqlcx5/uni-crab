export default {
    data() {
        return {
            head: {
                user_picture: '',
                nick_name: '',
                sex: '',
                mobile: '',
                birthday: ''
            },
            formList: [
                { label: '昵称', prop: 'nick_name' },
                { label: '手机号', prop: 'mobile' },
                { label: '性别', prop: 'sex', type: 'normal', options: [
                    { label: '先生', value: '1' },
                    { label: '女士', value: '2' }
                ] },
                { label: '生日', prop: 'birthday', type: 'date' }
            ]
        }
    },
    onShow() {
        this.dynamic()
    },
    onLoad() {
        this.basics()
    },
    methods: {
        dynamic() { // 动态数据
            this.getStorageUserInput() // 昵称修改回调
        },
        basics() { // 基础数据
            this.getUserInfo() // 获取用户信息
        },
        async getUserInfo() { // 获取用户信息
            const {data} = await this.$http('userInfo')
            this.head.user_picture = data.user_picture
            this.head.nick_name = data.nick_name
            this.head.sex = data.sex
            this.head.mobile = data.mobile
            this.head.birthday = data.birthday
            this.head.qr_code_url = data.qr_code_url
        },
        async saveUserInfo(data_) { // 保存用户信息
            const data = data_ || {...this.head}
            await this.$http('editUserInfo',data)
            await this.$http('userInfo', {}, {abort: false})
            // this.$toast('保存成功', 1) // 保存提示
        },
        jump(path) {
            this.$jump(path)
        },
        editName(value){ // 修改姓名
            this.$jump('publicInput',{value,maxlength: 15})
        },
        getStorageUserInput(){ // 昵称修改回调 放入onshow
            /**
             * @value 昵称修改数据获取
             * @user_input 公共输入页面保存后存入storage里 有则赋值并清空
            */
            const value = uni.getStorageSync('user_input')
            if (value) {
                uni.removeStorageSync('user_input') // 用完一定要删 防止数据污染
                if (value !== this.head.nick_name) {
                    this.head.nick_name = value
                    this.saveUserInfo({nick_name: value})
                }
            }
        },
        radioChange({ detail: { value }}) { // 单选框 性别
           this.head.sex = value
           this.saveUserInfo({sex: value})
        },
        async changeHeadPic(){ // 更换头像
            let dataUplod = await this.chooseImage()
            const file = dataUplod[0]
            const { data } = await this.$http('uploadImg',{
                filePath: file,
                name: 'file'
            })
            this.head.user_picture = data.src
            this.saveUserInfo({user_picture: data.src})
        },
        chooseImage(){  // 选择头像
            return new Promise((resolve, reject) => {
                uni.chooseImage({
                    success: (chooseImageRes) => {
                        const { tempFilePaths } = chooseImageRes
                        resolve(tempFilePaths)
                    },
                    fail: (err) => {
                        reject(err.errMsg)
                    }
                })
            })
        } 
    }
}