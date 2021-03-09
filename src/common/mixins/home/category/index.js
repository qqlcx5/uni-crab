export default {
  data() {
    return {
        keyword: '',
        menuList: [],
        menuIndex: -1,
        categoryData: [],
        scrollHeight: '0px',
        noData: false,
        lodingText: ''
    }
  },
  onLoad() {
    this.calcELHeight();
    this.getTopCategory();
  },
  methods: {
    async calcELHeight() {
      let res = await this.$c.getRect.call(this, '#searchRef,#tabBarRef');
      this.scrollHeight = uni.getSystemInfoSync().windowHeight - res[0].height - res[1].height + 'px';
    },
    async getTopCategory() {
      let res = await this.$http('getTopCategory');
      this.menuList = res.data;
              this.menuIndex = 0;
    },
    async handleChange(e) {
        let cat_id = this.menuList[e.detail.value].cat_id;
        this.lodingText = '加载中';
        this.noData = false;
        let { data } = await this.$http('getChildCategory', { cat_id });
        this.noData = [...data.goods_branch.data, ...data.child_category].length === 0;
        if(this.noData){
              this.lodingText = '暂无相关分类';
        }else{
              this.lodingText = '';
        }
        this.categoryData = data;
    },
    handleClick(e) {
        this.$Router.push({name: 'search'})
    },
  }
}