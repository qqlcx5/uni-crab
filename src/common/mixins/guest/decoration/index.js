import listMixins from '@/common/mixins/list'
export default {
    mixins: [ listMixins ],
    data() {
        return {
            keyword: '',
            typeIndex: 0,
            typeList: [],
            reqName: 'articleList',
            autoReq: false
        }
    },
    onLoad() {
        this.getArticleArticleCategory();
    },
    methods: {
        handleTypeChange(e) {
            let item  = this.typeList[e.detail.value] || {};
            this.reqParams.title = this.keyword;
            this.reqParams.cat_id = item.id ? item.id : '';
            this.initPage();
        },
        confirmInput(e) {
            this.reqParams.title = e.detail.value;
            this.initPage();
        },
        async getArticleArticleCategory() {
            let res = await this.$http('articleArticleCategory');
            res.data.list.unshift({
                id: '',
                cat_name: '全部'
            })
            this.typeList = res.data.list;
        }
    }
}