import listMixins from '@/common/mixins/list'
export default {
    mixins: [ listMixins ],
    data() {
        return {
            info: {},
            reqName: 'patternCaseList',
            autoReq: false,
            reqParams: {
                job_user_id: ''
            }
        }
    },
    onLoad() {
        this.reqParams.job_user_id = this.$Route.query.detailId;
        this.getDesignerInfo(this.$Route.query.detailId);
        this.initPage()
    },
    methods: {
         async getDesignerInfo(id) {
            let res = await this.$http('designerInfo', { id });
            this.info = res.data;
        },
        reachBottomFn() {
            this.getCommonList();
        },
        jump(name, id) {
            this.$jump(name, { detailId: id })
        }
    }
}