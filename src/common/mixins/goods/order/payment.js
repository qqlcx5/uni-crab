import paymentMixin from '@/common/mixins/pay';
    export default {
        mixins: [ paymentMixin ],
        data() {
            return {
                timeText: '',
                sortTime: '',
                orderOpen: true,
                finish: false,
                orderInfo: {},
                showPopup: false,
                setDefaultPay: true,
                timestamp: 0
            };
        },
        onBackPress(options) {
            if (options.from === 'navigateBack') {
                return false;
            }
            return this.showPopupFn();
        },
        onLoad() {
            this.getOrderInfo();
        },
        onShow() {
            // this.getUserInfo();
        },
        methods: {
            handleCancel() {
                this.$back();
            },
            showPopupFn() {
                this.orderOpen && (this.showPopup = true);
                return this.orderOpen;
            },
            async getUserInfo() {
                const { data } = await this.$http('userInfo',{}, {abort: false})
            },
            handleSubmit() {
                this.submitPay({
                    order_id: this.orderId,
                });
            },
            async getOrderInfo() {
                let {
                    data
                } = await this.$http('orderConfirmPay', {
                    order_id: this.orderId
                })
                this.finish = true;
                this.orderInfo = data.info;
                if(this.orderInfo.activity_type === 2){
                    this.returnUrl = '/goods/group/success'
                }
                this.timestamp = data.expire_time
            },
            handleClose(){
               this.orderOpen = false;
                this.$modal({
                    title: '温馨提示',
                    content: '超时未支付，订单已取消',
                    confirmText: '我知道了',
                    cancelText: '返回',
                    success: (res) => {
                        if (res.cancel) {
                            this.$back();
                        }
                    }
                })
            },
        },
        destroyed() {}
    };