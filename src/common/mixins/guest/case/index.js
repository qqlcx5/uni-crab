import listMixins from '@/common/mixins/list'
let operationFlag = false, //用户操作标识
    filterNums = 2; //默认显示几行筛选
export default {
    mixins: [ listMixins ],
    data() {
        return {
            brandList: [],
            filterFlag: false, //顶部下拉的过滤是否显示
            showAll: false, //是否显示全部
            keyword: '',
            cateIndex: 0,
            showFilter: false, //是否显示
            selectArr: [],
            currentAreaName: '',
            reqParams: {
                currentArea: '',
                selectArr: '[]',
                keyword: ''
            },
            reqName: 'patternCaseList',
            autoReq: false,
            guestCategory: [{
                value: '1',
                label: '全部分类'
            }, {
                value: '2',
                label: '装修宝典'
            }, {
                value: '3',
                label: '装修流程'
            }, {
                value: '4',
                label: '工艺展示'
            }, {
                value: '5',
                label: '选购指南'
            }],
            shopOptions: [],
            filterData: {}
        }
    },
    watch: {
        selText_(){
            let that = this;
            this.$c.throttle(initPageFn, 300);
            function initPageFn() {
                that.reqParams.selectArr = JSON.stringify(that.selectArr)
                that.initPage();
            }
        },
        currentAreaName: {
            handler(val) {
                this.initPage();
            }
        },
    },
    computed: {
        shopOptions_() {
            return this.showAll ? this.shopOptions : this.shopOptions.slice(0, filterNums);
        },
        selText_() {
            let selTextArr = [];
            this.selectArr.forEach((o, i) => {
                o!==-1 && selTextArr.push(this.shopOptions[i].content.find(o1 => o1.id === o).name);
            })
            return selTextArr.join(' | ')
        }
    },
    onLoad() {

        this.getSearcgTab();
    },
    onShow() { 
        //用户到选中地址后刷新才会走这边的赋值
        // let query = this.$Route.query;
        // query.currentArea && (this.currentAreaName = query.currentArea);
        let getStorage = uni.getStorageSync(this.$config.localCityCatchName)
        if (getStorage) {
            let curCity = getStorage.find(o => o.checked) || getStorage.find(o => o.curCity)
            this.currentAreaName = curCity.name
            this.reqParams.currentArea = curCity.id;
        } else {
            this.getLocation();
            setTimeout(() => {
                uni.hideLoading();
                console.log('2s后执行');
                if (!this.reqParams.currentArea) {
                    this.initPage();
                }
            }, 1500)
        }
    },
    methods: {
        async onPageScrollFn() {
            this.filterData = await this.$c.getRect.call(this, '.filter-content__static');
            uni.$on('pageScroll', (e) => {
                this.showFilter = e.scrollTop > this.filterData.height;
                if (e.direction === 'down' || !operationFlag) {
                    this.filterFlag = false;
                }
            })
        },
        async getSearcgTab() {
            let res = await this.$http('caseSearchTab');
            this.shopOptions = res.data;
            let selectArr = [];
            selectArr.length = res.data.length;
            selectArr.fill(-1);
            this.selectArr = selectArr;
            this.$nextTick(() => {
                this.onPageScrollFn();
            })
        },
        async getLocation() {
            uni.showLoading();
            uni.getLocation({
                type: 'gcj02',
                geocode: true,
                success: (res) => {
                    console.log(res);
                    console.log('当前位置的经度：' + res.longitude);
                    console.log('当前位置的纬度：' + res.latitude);
                    console.log(this);

                    this.$http('getLocalInfo', {
                        lat: res.latitude,
                        lng: res.longitude
                    }).then(result => {
                        console.log(result);
                        let currentAreaName = {
                            name: result.data.city,
                            id: result.data.city_id,
                            curCity: 1
                        }
                        let regionList = [];
                        regionList.push(currentAreaName)
                        uni.setStorageSync(this.$config.localCityCatchName, regionList)
                        this.currentAreaName = result.data.city
                        this.reqParams.currentArea = result.data.city_id;
                    });

                },
                complete: (res) => {
                    console.log(res);
                }
            });
        },
        finishInit() {
            uni.hideLoading();
        },
        /**
         * 这边会触发页面滚动，会有一个展开问题
         * 添加operationFlag 来解决这个问题
         */
        toggleAll() {
            if(operationFlag) return ;
            this.showAll = !this.showAll;
            operationFlag = true;
            this.$c.debounce(() => {
                operationFlag = false;
            }, 100)
        },
        openFilter() {
            // 如果没展开,就展开
            if (!this.filterFlag) {
                this.filterFlag = true;
            } else if(this.showAll){//如果已经展开并且全部就关闭
                this.filterFlag = false;
            } else {//如果已经展开就打开全部
                this.toggleAll();
            }
        },
        selectItem(pIndex, index) {
            this.$set(this.selectArr, pIndex, index);
        },
        confirmInput(e) {
            this.reqParams.keyword = e.detail.value;
            this.initPage();
        },
        selectCurrentLocation() {
            this.$jump('chooseCity', {
                action: 'referrer'
            })
            // this.$jump('chooseCity')
        }
    }
}