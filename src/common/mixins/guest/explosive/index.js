import { mapActions } from 'vuex'
import listMixins from '@/common/mixins/list'
export default {
    mixins: [ listMixins ],
    data() {
        return {
            keyword: '',
            reqName: 'videoList',
            autoReq: false
        };
    },
    onLoad() {
        this.defaultParams.sort_order = 'sort_order';
        this.initPage();
    },
    methods: {
        ...mapActions('page', ['setVideoOptions']),
        confirmInput(e) {
            this.reqParams.keyword = e.detail.value;
            this.initPage();
        },
        handleClick(id) {
            let index = this.pageList.findIndex(o => o.id === id) + 1;
            if(index === 0) return this.$toast('未找到详情id');
            let curPage = Math.ceil(index / this.limit);
            this.setVideoOptions({
                detailId: id,
                curPage: curPage
            })
            // uni.navigateTo({
            //     url: `./video?detailId=${id}&curPage=${curPage}`
            // })
            this.$jumpDetail('explosiveVideo', id, {
                curPage: Math.ceil(index / this.limit)
            })
        }
    }
};