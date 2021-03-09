export default {
    data() {
        return {
            orderInfoId: '',
            order_delivery: [],
        }
    },
    onLoad() {
        this.handleGetOrder()
        
    },
    methods: {
        async handleGetOrder(){
            const res = await this.$http('orderInfo', {order_id: this.$Route.query.detailId})
            this.orderInfoId = res.data.id
            console.log(res.data.order_delivery);
            this.order_delivery = res.data.order_delivery
        },
        async handleSureOrder(order){
            const params = { 
                order_id: this.orderInfoId,
                order_delivery_id: order.id
            }
            await this.$http('orderConfirmShip', params)
            this.handleGetOrder()
        },
        handleCourier(val){
            this.$jumpDetail('logisticsDetails', val)
        }
    },
}