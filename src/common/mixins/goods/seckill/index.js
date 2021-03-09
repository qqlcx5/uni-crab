import listMixins from '@/common/mixins/list'
export default {
    mixins: [ listMixins ],
    data() {
        return {
            menuIndex: 0,
            server_time: '',
            autoReq: false,
            reqName: 'goodsSpikePage',
            orderList: [],
            page: 2
        }
    },
    computed: {
        curList_() {
            return this.orderList[this.menuIndex] || {};
        },
        timestamp_ () {
            let time = this.orderList[0]
            if (!time) return 0
            let timestamp = Number(time.end_time_stamp) - Number(this.server_time)
            return timestamp
        }
    },
    onLoad() {
        this.handleGetList()
    },
    methods: {
        async handleGetList() {
            this.lodingText = '数据加载中';
            const {
                data: {
                    list = [],
                    server_time = ''
                }
            } = await this.$http('goodsSpikeList')
            this.server_time = server_time;
            this.orderList = list;
            this.pageList = list[0] ? list[0].goods : [];
            this.defaultParams.time_id = list[0] ? list[0].id : '';
            let len = this.pageList.length;
            if (!len) {
                this.noData = true;
                this.lodingText = this.noDataText;
            }else if(len < this.limit){
                this.lodingText = this.lastText;
            }
        },
        handleClick(val, index) {
            this.reqParams.time_id = val.id;
            this.page = 2;
            this.menuIndex = index;
            this.pageList = this.orderList[index].goods
            if(this.pageList.length >= this.limit){
                this.busy = false;
                this.finish = false;
                this.noData = false;
            }
        },
    }
}
