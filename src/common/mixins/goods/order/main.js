export default {
  data() {
      return {
          cancelFlag: false, // 取消订单弹窗
          deleteFlag: false, // 删除订单弹窗
          addressFlag: false, // 修改地址弹窗
          tempOrder: {}, // 临时列表订单
          orderInfo: {}, // 订单详情
          order_status_list: [], //订单状态
          sale_status_list: [], //售后状态
          pay_list: [], // 支付类型
          order_tab: [], // 订单tab标签
          cancel_reason_list: [], //取消列表
          pageType: 'details', // 默认详情页details index
          logist: {}, // 单条物流
          loaded: false
      };
  },
  onLoad() {
      this.handleGetOrderStatus()
  },
  computed:{
      completeMoblie_(){
          if(!this.orderInfo.user_name) return ''
          return `${this.orderInfo.user_name} ${this.orderInfo.mobile}`
      },
      completeAddr_() {
          if(!this.orderInfo.province) return ''
          return `${this.orderInfo.province} ${this.orderInfo.city} ${this.orderInfo.district} ${this.orderInfo.address}`
      },
      // 查找订单
      findOrder_(){
          return (arr, value, label) => {
              if(!arr || !arr.length) return ''
              const result = arr.find(val => val.value == value)
              if(label) return result ? result.label : ''
              return result
          }
      },
      orderStatus_(){
          return () => {
              if(!this.orderInfo.order_status) return ''
              return String(this.orderInfo.order_status).charAt(0)
          }
      },
      // 发货单
      order_delivery_(){
          return this.orderInfo.order_delivery && this.orderInfo.order_delivery.length > 1
      },
      // 发票
      invoice_(){
          return this.orderInfo.invoice ? this.orderInfo.invoice.invoice_type || {} : {}
      },
      // 按钮样式
      orderBtnClass_(){
          return((type)=>{
              // if(type === "go_pay" || type === "modify_address" || (type === "part_receipt" && !this.order_delivery_) || type === "again_order"){
              //     return false
              // }
              // return true
              if(type === "modify_address" || (type === "part_receipt" && !this.order_delivery_)){
                  return false
              }
              return true
          })
      },
  },
  methods: {
      // 订单状态
      async handleGetOrderStatus(){
          const res = await this.$http('orderStatus')
          this.cancel_reason_list = res.data.cancel_reason_list
          this.order_status_list = res.data.order_status_list
          this.sale_status_list = res.data.sale_status_list
          this.pay_list = res.data.pay_list
          this.order_tab = res.data.tab
      },
      // 订单详情
      async handleGetOrderInfo(loading = true){
          const res = await this.$http('orderInfo', {order_id: this.$Route.query.detailId}, { loading })
          this.orderInfo = res.data
          this.loaded = true
          // 请求物流
          if((this.orderStatus_() == 2 || this.orderStatus_()== 3) && this.orderInfo.order_delivery.length === 1){
              const params = {
                  is_all: 0,
                  express_number: this.orderInfo.order_delivery[0].fast_mail_sn || '0',
                  source_id: this.orderInfo.order_delivery[0].id || '0',
                  source_type: 1
              }
              let res = await this.$http('getLogistInfo', params);
              // console.log(res.data);
              this.logist = res.data || {}
          }
      },
      // 订单列表
      handleOperate(value, order){
          this.tempOrder = order
          switch (value) {
              case 'go_pay':
                  this.handlePay(order)
                  break;
              case 'modify_address':
                  this.handleEditAddr()
                  break;
              case 'part_receipt':
                  this.handleSureOrder(order)
                  break;
              case 'again_order':
                  this.handleAgainBuy(order)
                  break;
              case 'logistics_order':
                  this.handleViewLogistics(order)
                  break;
              case 'remove_order':
                  this.handleCancel('cancel')
                  break;
              case 'delete_order':
                  this.handleCancel('delete')
                  break;
              default:
                  break;
          }
      },
      // 支付
      handlePay(order){
          this.$jump('orderPayment', { order_id: order.id })
      },
      // 修改地址
      handleEditAddr(){
          this.addressFlag = true
      },
      // 选择地址
      async handleSelectAddres(e){
          let params = { order_id: this.orderInfo.id, address_id: e.detail.id }
          if(this.pageType === 'index'){
              params = { order_id: this.tempOrder.id, address_id: e.detail.id }
          }
          await this.$http('orderEditOrderAddress', params)
          this.addressFlag = false
          if(this.pageType === 'details') this.handleGetOrderInfo(false)
      },

      // 确认收货
      async handleSureOrder(order){
          console.log(order);
          const params = { order_id: order.id }
          if(order.order_delivery.length === 1){
              params.order_delivery_id = order.order_delivery[0].id
              await this.$http('orderConfirmShip', params)
          }else{
            this.$toast('商家未全部发货')
            return
          }
          this.$toast('操作成功')
          if(this.pageType === 'details') this.handleGetOrderInfo()
          if(this.pageType === 'index') this.initPage()

      },
      // 再次购买
      async handleAgainBuy(order){
          let promiseAll = [];
          this.$loading('加入购物车…')
          order.order_goods.forEach(o => {
              promiseAll.push(this.$http('addCart', {
                  num: o.buy_num,
                  goods_id: o.goods_id,
                  goods_sku_id: o.goods_sku_id,
                  is_change: 0
              }, {
                  loading: false
              }))
          })
          let ress = await Promise.all(promiseAll);
          this.$hideLoading();
          this.$jump('shoppingCart');
      },
      // 取消订单

      handleCancel(type){
          if(type === 'cancel') this.cancelFlag = true
          if(type === 'delete') this.deleteFlag = true
      },
      // 确认取消订单
      async handleConfirmCancel(e){
          await this.$http('orderCloseOrder', {order_id: this.orderInfo.id, close_id: e.detail.value })
          this.handleGetOrderInfo()
      },
      // 申请退款
      // handleRefund(){
          // this.$toast('申请退款')
      //     this.$jumpDetail('refuseAfterSale', this.orderInfo.order_goods[0].id)
      // },
      // 申请售后
      // handleAfterSale(order){
      //     this.$jumpDetail('refuseAfterSale', order.id)
      // },
      // 查看物流
      handleViewLogistics(order){
          // this.$toast('查看物流')
          if(order.order_delivery.length === 1){
              this.$jumpDetail('logisticsDetails', order.order_delivery[0].fast_mail_sn, {
                deliveryId: order.order_delivery[0].id
              })
              return
          }
          if(order.order_delivery.length > 1){
              this.$jumpDetail('logistics', order.id)
          }
      },
      // 删除订单
      async handleDelete(){
          await this.$http('orderDeleteOrder', {order_id: this.orderInfo.id })
          this.$jump('orderList')
      },

  }
};
