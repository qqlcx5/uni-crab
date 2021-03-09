import refundMixins from '@/common/mixins/goods/refund/main'
export default {
    mixins: [refundMixins],
    data() {
        return { };
    },
    computed: {
		showAbleButton_() {
			return this.orderInfo.able_button ? this.orderInfo.able_button.length > 0 : false;
		}
	},
    onLoad() {
        this.handleOrderReturnDetails()
    },
};