export default {
    data() {
        return {
            selectSpecFlag: false,
            tempAddr: {},
            selectAddressFlag: false,
            joint_id: '',   // 拼团的id
            order_id: '',   // 订单id
            order: {},
            orderList: [],
            pageData: {},
            inviteFlag: false,
            shareFlag: false,
            titleStyle: {
                width: '110rpx',
                fontSize: '26rpx',
                color: '#333',
                flex: 'inherit',
            },
            valueStyle: {
                fontSize: '26rpx',
                justifyContent: 'flex-end',
                color: '#333',
                flex: 1,
            },
            stepList: [{
                    label: '支付开团或者组团',
                    src: 'https://mjb-zzyx-static.oss-cn-zhangjiakou.aliyuncs.com/sass/goods/pin1.png',
                    iconColor: '#FFC19C',
                    iconSize: '60'
                },
                {
                    label: '等待好友组团支付',
                    src: 'https://mjb-zzyx-static.oss-cn-zhangjiakou.aliyuncs.com/sass/goods/pin2.png',
                    iconColor: '#FFC19C',
                    iconSize: '60'
                },
                {
                    label: '达到人数组团成功',
                    src: 'https://mjb-zzyx-static.oss-cn-zhangjiakou.aliyuncs.com/sass/goods/pin3.png',
                    iconColor: '#FFC19C',
                    iconSize: '60'
                }
            ],
            groupIndex: '',
                    group: [
                { iconType: '', iconTitle: '', iconMsg: '', title: '', btnTxt: '立即参团' , btnType: 1},
                { iconType: '', iconTitle: '', iconMsg: '', title: '人数已满，拼团成功 ', btnTxt: '首页逛逛 ' , btnType: 2},
                { iconType: '', iconTitle: '', iconMsg: '', title: '时间已到，拼团结束', btnTxt: '首页逛逛 ' , btnType: 3},
                { iconType: 'icon-jiaoyichenggong', iconTitle: '拼团中', iconMsg: '快邀请好友参团吧', title: '', btnTxt: '邀请人参团 ' , btnType: 4},
                { iconType: 'icon-jiaoyichenggong', iconTitle: '拼团成功', iconMsg: '恭喜拼团成功，等待商家发货！', title: '拼团成功', btnTxt: '查看订单 ' , btnType: 5},
                { iconType: 'icon-jiaoyishibai', iconTitle: '拼团失败', iconMsg: '未按时达到拼团人数，系统将款项原来返回', title: '本次拼团失败', btnTxt: '重新开团 ' , btnType: 6}
            ],
            lodingText: '',
            noData: false,
            finish: false
        }
    },
    computed: {
        group_() {
            return this.pageData.status_txt || {};
        },
        shareImg_() {
          return this.order.goods_img || '';
        },
        completeAddr_() {
            if (this.tempAddr && !this.tempAddr.province) return '请选择送至地址'
            if (this.tempAddr.province && this.tempAddr.province.label) return `${this.tempAddr.province.label} ${this.tempAddr.city.label} ${this.tempAddr.district.label}`
            return `${this.tempAddr.province} ${this.tempAddr.city} ${this.tempAddr.district}`
        },
        teamList_() {
            let otherUser = [];
            if(this.pageData.details){
                otherUser.length = this.order.left;
                otherUser.fill({empty: true});
            }
            return this.pageData.details ? [...this.pageData.details, ...otherUser] : []
        }
    },
    onShow() {
        this.order_id = this.$Route.query.order_id;
        if (this.$Route.query.type == 'invite') this.inviteFlag = true;
        this.goodsTeamOrderDetail();
    },
    methods: {
        handleSelectAddress() {
            this.selectAddressFlag = true
        },
        changeSpec(e){
            console.log(e);
        },
        hanlderShowShare(){
            this.shareFlag = true
        },
        // 选择地址
        handleAddress(e) {
            if(e.detail) this.tempAddr = e.detail
            this.selectAddressFlag = false
        },
        timestamp(start_time,end_time){
          if(!start_time || !end_time) return 0
          let timestamp = Number(end_time) - Number(start_time)
          return timestamp
        },
        async goodsTeamOrderDetail() {
            this.lodingText = '数据加载中';
            this.finish = false;
            let { data } = await this.$http('goodsTeamOrderDetail', {
                id: this.order_id
            })
            this.finish = true;
            this.pageData = data;
            if(!data.order){
                this.lodingText = '拼团商品不存在';
                return this.noData = true;
            }else{
                this.lodingText = '';
            }
            this.order = data.order;
            this.joint_id = data.order.joint_id;
            this.orderList = [ { ...data.order, ...data.order.goods_joint} ];
            switch(this.order.status) {
                case 10:
                    this.groupIndex = 0;
                    break;
                case 20:
                    this.groupIndex = 1;
                    break;
                case 30:
                    this.groupIndex = 2;
                    break;
            }
        },
        groupBooking(btnType) {
            // 立即参团, 邀请人参团, 查看订单, 重新开团, 更多拼团
            switch(btnType) {
                case 1:
                    this.selectSpecFlag = true;
                    break;
                case 2:
                case 3:
                    this.$jump('group');
                    break;
                case 4:
                    this.inviteFlag = true;
                    break;
                case 5:
                     this.$jumpDetail('orderDetails', this.order.activity_order_id);
                    break;
                case 6:
                    this.$jumpDetail('groupDetails', this.order.goods_id, { activity_id: this.order.activity_id });
                    break;

            }
            // this.selectSpecFlag = true;
            // return ;
            // this.$jumpDetail('groupDetails', this.order.goods_id, {
            //     activity_order_id: this.order_id,
            // });
            // return
            // if (this.order.status == 10) {
            //     this.inviteFlag = true;
            // } else if (this.order.status == 20)  {
            //     this.$jumpDetail('groupList');
            // } else if (this.order.status == 30)  {
            //     let params = {};
            //     params.joint_id = this.joint_id;
            //     this.$jumpDetail('groupDetails', this.order.goods_id, params);
            // }
        }
    }
}