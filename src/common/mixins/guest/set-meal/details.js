export default {
    data() {
        return {
            packageInfo: {},
            package_img: [],
            tempDom: null,
            fixedTop: null,
            scrollHeight: null,
            test: [{id: 134},{id: 124},{id: 114},{id: 4},{id: 54},{id: 13},{id: 14}]
        };
    },
    computed: {
        isFixedTop_(){
            return this.scrollHeight > this.fixedTop
        },
    },
    methods: {
        async handleDealDom(){
            // 获取tab相对高度，刷新高度误差问题
            let data = await this.$utilFn.getRect.call(this, '.mark');
            this.fixedTop = data[1].top - data[0].top;
        },
        async handleTab(val) {
            let data = await this.$utilFn.getRect.call(this, '.mark');
            console.log(data);
            let nodeInfo = []
            let height = data[1].height;
            let top = data[0].top;
            val = val.detail.value
            data.forEach(o => {
                nodeInfo.push(o.top - top - height);
            });
            let scrollTop = nodeInfo[val + 2] > 0 ? nodeInfo[val + 2] : 0;
            uni.pageScrollTo({
                scrollTop: scrollTop,
                duration: 300
            });
        },
        async getPackageInfo(params) {
            let res = await this.$http('packageInfo',params);
            this.packageInfo = res.data
            this.package_img = this.packageInfo.package_img
            this.handleDealDom()
        },
    },
    onLoad(){
        this.getPackageInfo({id: this.$Route.query.detailId})
        uni.$on('pageScroll', (e) => {
            this.scrollHeight = e.scrollTop
        })
    },
};