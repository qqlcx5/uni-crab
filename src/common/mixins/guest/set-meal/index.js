import listMixins from '@/common/mixins/list'
export default {
    mixins: [ listMixins ],
    data() {
        return {
            menuList: [{
                name: '全部套餐',
                id: ''
            }],
            menuIndex: 0,
            menuModalFlag: false,
            scrollTop: -1,
            fixedTop: 0,
            autoReq: false,
            reqName: 'packageDataList'
        }
    },
    computed: {
        isFixed_() {
            return this.scrollTop > this.fixedTop
        }
    },
    onLoad() {
        this.handleScroll();
        this.getPackageStyle();
        uni.$on('pageScroll', (e) => {
            this.scrollTop = e.scrollTop;
        })
    },
    methods: {
        async getPackageStyle() {
            let res = await this.$http('packageStyle');
            this.menuList.push.apply(this.menuList, res.data);
        },
        async handleScroll() {
            let res = await this.$c.getRect.call(this, '.meal-section');
            this.fixedTop = res[1].top - res[0].top;
        },
        handleMenuChange(e) {
            this.reqParams = {
                job_style_id: this.menuList[e.detail.value].id
            }
            this.initPage();
        },
        changeMenuIndex(index) {
            this.menuIndex = index;
            this.menuIconClick();
        },
        menuIconClick() {
            this.menuModalFlag = !this.menuModalFlag;
        }
    }
}