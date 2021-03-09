export default {
    data() {
        return {
            // 我的订单
            order: {
                notPayCount: 0,
                notReceiptCount: 0,
                notShipCount: 0,
                returnCount: 0
            },
            orderStatus: [{
                label: '待付款',
                icon: 'tmp1-daifukuan',
                name: 'orderList',
                params: {
                    menu_index: 1
                },
                prop: 'notPayCount'
            },
            {
                label: '待发货',
                icon: 'tmp1-daifahuo',
                name: 'orderList',
                params: {
                    menu_index: 2
                },
                prop: 'notShipCount'
            },
            {
                label: '待收货',
                icon: 'tmp1-daishouhuo',
                name: 'orderList',
                params: {
                    menu_index: 3
                },
                prop: 'notReceiptCount'
            },
            {
                label: '退换货',
                icon: 'tmp1-tuihuanhuo', 
                name: 'refuseList',
                prop: 'returnCount'
            }
            ],
            // 我的资产
            assetsList: [{
                label: '累计佣金',
                prop: 'totalSplit',
                path: 'income',
                params: { type: 'totalSplit' },
            },
            {
                label: '今日收入',
                prop: 'todaySplit',
                params: { type: 'todaySplit' },
                path: 'income'
            },
            {
                label: '总销售额',
                prop: 'totalSale',
                params: { type: 'totalSale' },
                path: 'income'
            }
            ],
            equity: [
                '严选好物 专属福利',
                '限时折扣 分享抽佣',
            ],
            teamCount: {},
            userInfo: {},
            shopInfo: {}
        };
    },
    onLoad() {
        this.getUserInfo(true, 'catch')
        this.getShopInfo()
    },
    onShow() {
        this.getUserInfo()
        this.getTeamCount()
        this.myOrder()
    },
    async onPullDownRefresh() {
        await this.getUserInfo(false)
        uni.stopPullDownRefresh()
    },
    methods: {
        // #ifdef MP-WEIXIN
        async wechatUserInfo(data) { // 获取微信用户信息回调
            if (!data.encryptedData) return
            this.$loading()
            await this.bindwechat(data)
            this.$hideLoading();
        },
        async bindwechat(data) { // 绑定微信
            let newCode = await getCode('weixin')
            const postData = { ...data, code: newCode.code }
            const res = await this.$http('usersbindwechat', postData)
            switch (res.bizCode) {
                case 1011: // 绑定成功
                    this.getUserInfo(false)
                    this.$toast('绑定成功')
                    break;
                case 1012: // 微信绑定失败
                    this.$toast('微信绑定失败')
                    break;
                case -41003: // 授权超时
                    this.$toast('授权超时，请重新操作')
                    break;
                case 1013: // 微信已被绑
                    this.$toast('微信已被绑')
                    break;
                default:
                    this.$toast(res.msg)
                    break;
            }
        },
        // #endif
        async getTeamCount() {
            let res = await this.$http('teamCount');
            this.teamCount = res.data;
        },
        async getUserInfo(abort = true, source = 'any') { // 获取用户信息
            this.userInfo = {}
            const { data } = await this.$http('userInfo', {}, { abort, source })
            this.userInfo = data
        },
        async getShopInfo() {
            let { data } = await this.$http('shopInfo');
            this.shopInfo = data;
        },
        inviteToFriend() { // 邀请好友
            // #ifdef MP-WEIXIN
            if (this.userInfo.unionid) {
                // #endif
                this.$jump('inviteToFriend')
                // #ifdef MP-WEIXIN
            }
            // #endif
        },
        userInfoJump(path) {
            const { token } = uni.getStorageSync('jscode2session')
            if (token) {
                this.$jump('informationUser')
            } else {
                this.$jump('login')
            }
        },
        async myOrder() { // 我的订单
            const { data: { notPayCount, notReceiptCount, notShipCount, returnCount } } = await this.$http('myOrderCount')
            this.order = {
                notPayCount: notPayCount < 100 ? notPayCount : '99+', // 待支付
                notReceiptCount: notReceiptCount < 100 ? notReceiptCount : '99+', // 待收货
                notShipCount: notShipCount < 100 ? notShipCount : '99+', // 待发货
                returnCount: returnCount < 100 ? returnCount : '99+' // 退换货
            }
        }
    }
};