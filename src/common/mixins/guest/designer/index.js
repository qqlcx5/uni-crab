import listMixins from '@/common/mixins/list'
export default {
    mixins: [listMixins],
    data() {
        return {
            reqName: 'designerList',
        }
    },
    onReachBottom() {
        console.log('触底了')
    },
    methods: {
        jump(name, id) {
            this.$jump(name, { detailId: id })
        },
    },
}