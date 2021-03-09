import orderMixins from '@/common/mixins/goods/order/main'
export default {
    mixins: [orderMixins],
    data() {
        return {}
    },
    methods: {
        copyText(e) {
            this.$c.copyText({
                content: e
            })
        }
    },
    onLoad() {
        this.pageType = 'details'
        this.handleGetOrderInfo()
        // this.getShopInfo() //联系客服
    }
};
