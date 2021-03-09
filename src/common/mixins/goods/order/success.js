export default {
    data() {
        return {
            orderId: ''
        }
    },
    onLoad() {
        this.orderId = this.$Route.query.order_id || false;
        console.log(this.orderId);
    }
}
