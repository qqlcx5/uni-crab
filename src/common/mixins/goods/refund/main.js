export default {
    data() {
        return {
            cancelFlag: false, // 撤销订单
            deleteFlag:false, //删除弹窗
            goods: [], //商品
            return_price: '', // 退款金额
            return_pattern: [], // 退货选项
            goods_status: [], // 货物状态
            return_reason: [], // 退款原因
            stateFlag: false, // 货物状态弹窗
            refundFlag: false, // 退款状态弹窗
            stateValue: '请选择', // 货物状态
            refundValue: '请选择', // 退款原因
            orderInfo: {},
            logist: {}, // 物流信息
            loaded: false,
            returnFinish: false
        };
    },
    computed:{
        findStatus_(){
            return (obj, label) => {
                if(!obj || !obj.status_list) return ''
                const result = obj.status_list.find(val => val.value === obj.status)
                if(label) return result ? result[label] : ''
                return result
            }
        },
        timeAxis_(){
            let status = this.findStatus_(this.orderInfo, 'value')
            if( status === 20 || status === 70) return false
            return true
        },
        step_(){
            if(!this.orderInfo.progress_list) return 0
            const result = this.orderInfo.progress_list.findIndex(val => val.value === this.orderInfo.status)
            return result !== -1 ? result : 0
        },
    },
    methods: {
        // 申请退款列表
        async handleOrderReturnIndex(){
            let params = {order_goods_id: this.$Route.query.detailId }
            params.id = this.$Route.query.id
            const { data: { return_pattern = {}, goods_status = {}, return_reason = {}, goods = {}, return_price = {} } } = await this.$http('orderReturnIndex', params)
            this.return_pattern = return_pattern;
            this.goods_status = goods_status;
            this.return_reason = return_reason;
            this.goods = goods;
            this.return_price = return_price;
            this.returnFinish = true;
        },
        // 售后选择弹窗
        handleSelect(val){
            this.pro = val
            if(val === "goods_status") this.stateFlag = true
            if(val === "return_reason") this.refundFlag = true
        },
        // 售后详情
        async handleOrderReturnDetails(){
            const res = await this.$http('OrderReturnDetails', {id: this.$Route.query.detailId })
            this.orderInfo = res.data
            this.loaded = true
            let back_invoice_no = res.data.back_invoice_no
            // 请求快递信息
            if(back_invoice_no){
              const params = {
                  is_all: 0,
                  express_number: back_invoice_no,
                  source_type: 2
              }
              let res = await this.$http('getLogistInfo', params);
              this.logist = res.data || {}
            }
        },
        // 填写退货快递信息
        handleToCourier(){
            this.$jumpDetail('logisticsCourier', this.$Route.query.detailId)
        },
        // 订单列表
        handleOperate(type){
            switch (type) {
                case 'cancel':
                    this.cancelFlag = true
                    // this.handleCancel()
                    break;
                case 'reapply':
                    this.handleReapply()
                    break;
                case 'delete':
                    this.handleDelete()
                    break;
                default:
                    return ''
            }
        },
        // 撤销申请
        async handleCancel(){
            const res = await this.$http('OrderRevertApply', {id: this.$Route.query.detailId })
            this.$jumpDetail('orderDetails', res.data.order_id, {}, 'replace')
        },
        // 重新申请
        handleReapply(){
            this.$jumpDetail('refuseAfterSale', this.orderInfo.goods[0].order_goods_id, { id: this.$Route.query.detailId})
        },
        // 删除售后单
        async handleDelete(){
            const res = await this.$http('OrderDel', {id: this.orderInfo.id })
            console.log(res);
        },
        copyText(e){
          this.$c.copyText({content: e})
        }

    }
};
