import refundMixins from "@/common/mixins/goods/refund/main";
export default {
    mixins: [refundMixins],
    data() {
        return {
            pro: '',
            params: {
                return_pattern: '',
                goods_status: '',
                return_reason_id: '',
                return_brief: '', //补充描述
                return_proof: '',
                order_goods_id: '',
            },
			refuseType: 0
        };
    },
    onLoad(){
		this.refuseType = this.$Route.query.value ? this.$Route.query.value * 1 : 0;
        this.handleOrderReturnIndex()
    },
    computed: {},
    methods: {
        handleChecked(e) {
            if(!e) return
            let itemObj = this[this.pro].find(o=> o.value === e.detail.value)
            console.log(itemObj);
            if(this.pro === 'goods_status'){
                this.stateValue = itemObj.label
                this.params.goods_status = itemObj.value
            }else if(this.pro === 'return_reason'){
                this.refundValue = itemObj.label
                this.params.return_reason_id = itemObj.value
            }
        },
        handleChange(e) {
            this.params.return_proof = e.detail.map(o => o.src);
        },
        async handleSubmit(){
            if(!this.params.goods_status && this.$Route.query.value !== '1'){
                this.$toast('请选择货物状态')
                return
            }
            if(!this.params.return_reason_id){
                this.$toast('请选择退款原因')
                return
            }
            this.params.return_pattern = this.$Route.query.value
            this.params.order_goods_id = this.$Route.query.detailId
            this.params.id = this.$Route.query.id
            const res = await this.$http('orderReturnApply', this.params)
            this.$jumpDetail('refuseDetails', res.data.id)
        }

    },
};
