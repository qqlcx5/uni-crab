import TimeUtil from '@/common/utils/countDown'
import goodsDetails from '@/common/mixins/goods/details/index'
export default {
    mixins: [ goodsDetails ],
    data() {
        return {
            timer: null,
            timeUtil: null,
            server_time: 0, // 服务端时间
            group_info: {},
            groupList: [],
            groupListFormat: [],
            groupStyle: {
                marginTop: '24rpx',
                background: '#fff'
            },
            groupValueStyle: {
                fontSize: '28rpx',
                flex: '8',
                color: '#fff'
            },
        };
    },
    computed: {
        priceJointOrigin_() {
            return this.$c.numFormat(this.goodsInfo.price_joint_origin)
        }
    },
    onShow() {
        this.timeUtil = new TimeUtil();
        this.goodsTeamOrderTop();
        this.timer = setInterval(() => {
            this.goodsTeamOrderTop();
        }, 30000);
    },
    destroyed() {
        this.clearAllTime();
    },
    onHide() {
        this.clearAllTime();
    },
    methods: {
        clearAllTime() {
            clearInterval(this.timer);
            this.timer = null
            this.timeUtil.end()
            this.timeUtil = null;
        },
        // 获取拼团列表
        async goodsTeamOrderTop() {
            let {
                data
            } = await this.$http('goodsTeamOrderTop', {
              activity_id: this.activity_id
            })
            this.server_time = data.server_time;
            this.handleTask(data.list)
        },
        handleTask(arr) {
            arr.forEach(o => {
                this.timeUtil.addTask(o.end_time - this.server_time)
            });
            this.timeUtil.start((res) => {
                res.forEach((o, i) => {
                    res[i].time && arr[i] && (arr[i].time = res[i].time);
                })
                this.groupListFormat = this.setArrData(arr, 2)
            })
        },
        // 格式化拼团列表
        setArrData(arr, num) {
            let len = Math.ceil(arr.length / num); // 2
            let temp = new Array(len);
            for (let i = 0; i < len; i++) {
                temp[i] = arr.slice(i * num, (i + 1) * num);
            }
            return temp;
        },
    }
};
