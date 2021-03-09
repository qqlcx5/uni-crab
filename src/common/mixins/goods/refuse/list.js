import refundMixins from '@/common/mixins/goods/refund/main'
import listMixins from '@/common/mixins/list'
export default {
    mixins: [refundMixins, listMixins],
    data() {
        return {
            reqName: 'orderReturnList'
        }
    },
    onLoad() {},
    computed: {},
    methods: {
        handleToDetail(id){
            this.$jumpDetail('refuseDetails', id)
        },
    }
}