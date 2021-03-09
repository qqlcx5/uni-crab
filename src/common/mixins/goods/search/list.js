import listMixins from '@/common/mixins/list'
export default {
    mixins: [listMixins],
    data() {
        return {
            lowPrice: null,
            hightPrice: null,
            listMode: 'column',
            sortStatus: 0,
            brandList: [],
            brandFlag: false, //品牌弹窗标识
            filterFlag: false, //筛选弹窗标识
            filterIndex: 2, //筛选的参数
            serveList: [{
                value: 1,
                label: '仅看有货'
            }, {
                value: 2,
                label: '促销'
            }],
            keyword: '',
            pageList: [],
            autoReq: false,
            reqName: 'goodsSearchGoodsList'
        }
    },
    onLoad() {
        let query = this.$Route.query;
        this.keyword = query.keyword;
        this.defaultParams.goods_name = this.keyword;
        this.defaultParams.goods_category_id = query.cat_id ? query.cat_id * 1 : '';
        this.defaultParams.brand_ids = query.brand_id ? query.brand_id * 1 : '';
        this.initPage();
        this.getGoodsBrand()
    },
    computed: {
        isSelect_() {
            return (min, max) => {
                return this.filterIndex >= min && this.filterIndex <= max;
            }
        }
    },
    methods: {
        async getGoodsBrand() {
            let res = await this.$http('goodsBrand');
            if(this.defaultParams.brand_ids){
                let ids = String(this.defaultParams.brand_ids).split(',');
                this.filterIndex = 3;
                res.data.forEach(o => {
                    o.checked = ids.includes(String(o.id));
                })
            }
            this.brandList = res.data;

        },
        filterClick(min, max, autoInit = true) {
            if (this.filterIndex + 1 > max) {
                this.filterIndex = min;
            } else {
                if (this.filterIndex < min || this.filterIndex > max) {
                    this.filterIndex = min;
                } else {
                    this.filterIndex++;
                }
            }
            autoInit && this.setQuery(this.filterIndex)
        },
        /**
         * 修改模态框显示因此状态
         * flag 模态框显示隐藏状态
         * pro 要修改的对象值
         */
        changeModalFlag(flag = true, pro = 'brandFlag', num = 0) {
            this.filterClick(num, num, false)
            this[pro] = flag;
            // if(flag && pro === 'brandFlag' && !this.brandList.length){
            //     this.getGoodsBrand();
            // }
        },
        setQuery(num) {
            this.brandFlag = false;
            this.filterFlag = false;
            let modeEnum = {
                2: {
                    key: 'whole_sort',
                    value: '1'
                },
                3: {
                    key: 'brand_ids',
                    value: this.brandList.filter(o => o.checked).map(o => o.id).join(',')
                },
                4: {
                    key: 'sales_volume_sort',
                    value: 'desc'
                },
                5: {
                    key: 'price_sort',
                    value: 'desc'
                },
                6: {
                    key: 'price_sort',
                    value: 'asc'
                },
                7: {
                    key: 'price_range',
                    value: this.handleCompareSize()

                }
            }
            this.reqParams = {
                [modeEnum[num].key]: modeEnum[num].value,
                brand_ids: modeEnum[3].value
            }
            this.initPage();
        },
        handleCompareSize() {
            if (this.lowPrice > this.hightPrice) {
                [this.lowPrice, this.hightPrice] = [this.hightPrice, this.lowPrice]
            }
            return [this.lowPrice || 0, this.hightPrice || 0].join(',')
        },
        /**
         * 选中函数
         * index 要修改的下标值
         * pro 要修改的对象值
         * isRadio 是否开启单选但不必选（可以取消的单选）
         */
        changeChecked(index, pro = 'serveList', isRadio = false) {
            if (!this[pro][index].checked && isRadio) {
                let oldIndex = this[pro].findIndex(o => o.checked);
                oldIndex !== -1 && (this[pro][oldIndex].checked = false);
            }
            this.$set(this[pro][index], 'checked', !this[pro][index].checked);
        },
        resetBrandList() {
            this.brandList.forEach((item, index) => {
                this.$set(this.brandList[index], 'checked', false);
            });
            delete this.defaultParams.brand_ids;
        },
        resetFilterPrice() {
            this.lowPrice = null
            this.hightPrice = null
        },
        /**
         * 展示行列切换
         */
        changeMode(e) {
            this.listMode = e.detail.value;
        }
    }
}
