export default {
    data() {
        return {
            keyword: '',
            goods_hot_tags: [], //热门搜索
            style_word: [], //搜索记录
            historyList: uni.getStorageSync("_searchHistoryList") || []
        }
    },
    onLoad(){
        this.handlegoodsSearchKeyWord()
    },
    methods: {
        handleSetsetStorage(keyword){
            if(!keyword || !keyword.trim()) return
            let list = [...this.historyList]
            list.unshift(keyword)
            list = Array.from(new Set(list))
            this.historyList = list
            uni.setStorageSync('_searchHistoryList', list)
        },
        confirmInput(){
            this.handleSetsetStorage(this.keyword)
            this.$jump('searchList', { key: this.keyword })
        },
        handleClear(){
            let that = this
            this.$modal({
                title: '提示',
                content: '确认删除全部历史记录',
                success: function (res) {
                    if (res.confirm) {
                        that.historyList = [],
                        uni.setStorageSync('_searchHistoryList', [])
                    }
                }
            })
        },
        async handlegoodsSearchKeyWord(e) {
            let res = await this.$http('goodsSearchKeyWord');
            let {goods_hot_tags, style_word } = res.data
            this.goods_hot_tags = goods_hot_tags
            this.style_word = style_word
        },
        handleSearchKey(val){
            this.keyword = val
            this.handleSetsetStorage(val)
            this.$jump('searchList', {key: this.keyword})
        },
    },
}
