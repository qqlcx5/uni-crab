export default {
    data() {
        return {
            caseDetail: {},
            housingImage: [],
            modalFlag: false,
            showAppointment: false,
            // 设计师
            reqName: 'patternCaseList',
            autoReq: false,
            reqParams: {},
            shopInfoData: {}
        }
    },
    onLoad() {
        this.reqParams.job_user_id = this.$Route.query.id;
        this.getCaseDetail(this.$Route.query.detailId);
    },
    onShow() {},
    methods: {
        async getCaseDetail(id) {
            let res = await this.$http('caseDetail', { id });
            this.caseDetail = res.data;
            this.housingImage = this.caseDetail.effect_img || [];
            if (this.caseDetail.job_user_id) {
                // 设计师
                let shopInfoData = await this.$http('designerInfo', { id: this.caseDetail.job_user_id });
                this.shopInfoData = shopInfoData.data;
                let { title, housingImage } = res.data;
                this.shareParams = {
                    imageUrl: this.shopInfoData.case_default_img,
                    title: this.caseDetail.name,
                    summary: '精选案例推荐'
                }
                this.h5Share();
            }
        },
        handleShare() {
            this.modalFlag = true;
        },
        appointment() {
            this.showAppointment = true;
        },
        toWebView(url) {
            console.log(url);
            if (!url) {
                uni.showToast({
                    icon: 'none',
                    title: '暂无3D全景'
                })
                return
            }
            uni.navigateTo({
                url: `/home/webview/web-view?url=${encodeURIComponent(url)}`
            })
        },
    }
};