 import listMixin from '@/common/mixins/list'
export default {
    mixins: [ listMixin ],
    data() {
        return {
            fixedTop: '',
            menuIndex: 0,
            menuList: [],
            menuModalFlag: false,
            reqName: 'goodsTeamList',
            autoReq: false,
        }
    },
    computed: {
        isFixed_() {
            return this.scrollTop > this.fixedTop
        }
    },
    onLoad() {
        this.goodsTeamCategory();
    },
    methods: {
        async goodsTeamCategory() {
            let { data } = await this.$http('goodsTeamCategory');
            let obj = { name: '精选' }
            data.list.unshift(obj);
            this.menuList = data.list;
        },
        async handleScroll() {
            let res = await this.$c.getRect.call(this, '.meal-section');
            this.fixedTop = res[1].top - res[0].top;
        },
        handleMenuChange(e) {
            let item = this.menuList[e.detail.value] || {};
            this.reqParams.cat_id = item.id || '';
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
