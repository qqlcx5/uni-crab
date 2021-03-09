import goodsDetails from '@/common/mixins/goods/details/index'
export default {
    mixins: [ goodsDetails ],
    computed: {
        timestamp_() {
            if (!this.activityInfo_.end_time) return 0;
            let timestamp = Number(this.activityInfo_.end_time) - Number(this.activityInfo_.start_time)
            return timestamp > 0 ? timestamp : 0;
        }
    },
    methods: {
        handleSelectSpec(val) {
            if (val === 2 && !this.activityInfo_.status) return;
            this.action = val;
            this.selectSpecFlag = true;
        }
    }
};
