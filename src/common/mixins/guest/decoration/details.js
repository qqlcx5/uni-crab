export default {
    data() {
        return {
            articleData: {},
            modalFlag: false
        };
    },
    onLoad() {
        this.getArticleDetail()
    },
    onShow() {},
    methods: {
        handleShare() {
            this.modalFlag = true;
        },
        async getArticleDetail() {
            let res = await this.$http('articleDetail', {
                id: this.$Route.query.detailId
            });
            this.articleData = res.data;
            let { title, poster_image } = res.data;
            this.goodsInfo = res.data;
            this.shareParams = {
                imageUrl: poster_image,
                title,
                summary: '好物分享'
            }
            this.h5Share();
        }
    }
};