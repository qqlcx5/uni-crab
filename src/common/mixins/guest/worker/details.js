export default {
    data() {
        return {
            showAppointment: false,
            userInfo: {},
            stepList: [
                { src: 'guest/worker/appointment.png', t: '免费预约', next: true },
                { src: 'guest/worker/quotation.png', t: '报价', next: true },
                { src: 'guest/worker/roadwork.png', t: '施工', next: true },
                { src: 'guest/worker/pass-check.png', t: '验收', next: false },
            ]
        }
    },
    onLoad() {
        let details = this.$Route.query.detailId;
        this.getShopForemanInfo(details);
    },
    methods: {
        async getShopForemanInfo(id) {
            let res = await this.$http('shopForemanInfo', { id });
            this.userInfo = res.data;
        },
        previewImage(urls, isArr = false) {
            let arr = [];
            !isArr && (arr.push(urls), urls = arr)
            uni.previewImage({
                current: 1,
                urls,
                loop: true,
            })
        }
    }
}