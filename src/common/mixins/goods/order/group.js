import listMixins from '@/common/mixins/list.js'
export default {
    mixins: [listMixins],
    data() {
        return {
            reqName: 'goodsTeamOrderList',
            autoReq: false,
            reqParams: {
                status: ''
            },
            noDataText: '暂无拼团信息，去拼团板块开团吧！',
            menuIndex: -1,
            timer: null,
            tab: [
                {"value":"","label":"全部"},
                {"value":10,"label":"拼团中"},
                {"value":20,"label":"拼团成功"},
                {"value":30,"label":"拼团失败"},
            ],
            server_time: '',
            inviteFlag: false,
            order: {},
        }
    },

    onLoad() {
      this.menuIndex = (this.$Route.query.menu_index || 0) * 1
    },
    methods: {
        handleBtn(type, order){
          console.log(type, order);
          let id="", params = {};
          switch(type) {
              case 'detail':    // 拼团详情
                this.$jump('groupSuccess', {order_id: order.goods[0].order_id})
                break;
              case 'invitation':    // 邀请好友
                // this.order = order;
                this.$jump('groupSuccess', {order_id: order.goods[0].order_id, type: 'invite'})
                // this.inviteFlag = true;
                break;
              case 'orderDetails':  // 订单详情
                this.$jumpDetail('orderDetails', order.goods[0].order_id);
                break;
              case 'againJoint':    // 重新开团
                params.activity_type = order.goods[0].activity_type;
                params.activity_id = order.goods[0].activity_id;
                this.$jumpDetail('groupDetails', order.goods[0].goods_id, params);
                break;
          }
        },
        changeType(e) {
            this.reqParams.status = this.tab[e.detail.value].value
            this.initPage()
        },
        timestamp(end_time){
          let timestamp = Number(end_time) - Number(this.server_time)
          return timestamp
        },
        finishInit(data) {
          this.server_time = data.server_time
        },
    },
    beforeDestroy() {
        clearTimeout(this.timer)
    }
}
