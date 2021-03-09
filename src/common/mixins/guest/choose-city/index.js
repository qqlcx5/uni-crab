let u40 = uni.upx2px(40);
export default {
    data() {
        return {
            isIPX: null,
            regionId: null, //区域ID
            inputValue: "",
            searchData: [], //搜索的数据
            isClearBtn: false,

            regionList: [], //区域列表,模拟数据请自行修改
            cityId: null, //城市ID
            cityName: null, //城市名
            areaName: '', //区域名,模拟数据请自行修改

            hotcites: [], //热门城市，模拟数据请自行修改
            cities: [], //城市列表,拟数据请自行修改

            alphabet: ["area","hot","A","B","C","D","E","F","G","H","J","K","L","M","N","P","Q","R","S","T","W","X","Y","Z"], //字母列表
            toIndex: "", //跳转的索引的字母
            tipsLetter: "", //滑动显示字母
            timer: null,
            hasNoData: false,
            searchFocus: false,
            letterDetails: [],
            currentLetter: "area" //默认选择hot
        };
    },
    onLoad() {
        let storageCity =  uni.getStorageSync(this.$config.localCityCatchName) || [];
        this.regionList = storageCity.slice(0, 3)
        this.getCityList();
    },
    methods: {
        //列表滚动，和右边字母表对应
        scrollHandle(e) {
            this.$c.debounce(async() => {//防抖
                let d= await this.$c.getRect.call(this, '.hash-itme')
                    let top = d[0].top;
                    this.letterDetails = [];
                    d.forEach(item => {
                        this.letterDetails.push({
                            id: item.id,
                            top: item.top - top,
                            bottom: item.bottom - top
                        });
                    });
                    const scrollTop = e.detail.scrollTop;
                    this.markLabel(scrollTop);
            }, 50)
        },
        async getCityList() {
            let res = await this.$http('cityList');
            this.hotcites = res.data.hot_list;
            this.cities = res.data.city_list;
        },
        markLabel(scrollTop) {
            this.letterDetails.some(item => {
                if (scrollTop >= item.top && scrollTop <= item.bottom - 20) {
                    this.currentLetter = item.id;
                    //当前固定用的是粘性定位，如果不用粘性定位，在这里设置
                    return true;
                }
            });
        },

        selectCity(item) {
            console.log('选择的城市：', item)
            //当前项目是需要选择到区域，所以选择城市后回到区县的地方
            // this.toIndex = "area";
            // setTimeout(() => {
            //     this.toIndex = "";
            // }, 1000)
            let regionList = [].concat(this.regionList);
            let index = regionList.findIndex(o => o.id === item.id);
            let deleteItem = {};
            regionList.forEach(o => o.checked = false);
            item.checked = true;;
            index !== -1 && (deleteItem = regionList.splice(index, 1)[0]);
            regionList.splice(regionList.length && !deleteItem.curCity ? 1 : 0, 0,  deleteItem.curCity ? deleteItem : item);
            this.regionList = regionList;

            uni.setStorageSync(this.$config.localCityCatchName, this.regionList);
            this.$backRef();
            // let pages = getCurrentPages();//全部页面
            // let prevPage = pages[pages.length - 2];//当前页面
            // let query = this.$Route.query;
            // let lastQuery = JSON.parse(query.lastQuery) || {};
            // if(pages.length > 1 && prevPage.$Route.name === query.lastName){
            //     prevPage.currentArea = item.city;
            //     this.$Router.back();
            // }else{//刷新
            //     this.$Router.replace({
            //         name: query.lastName,
            //         params: Object.assign({}, lastQuery, {
            //             currentArea: item.city
            //         })
            //     })
            // }
        },

        //区域选择
        selectRegion(item) {
            console.log('选择的区域是：', item)
        },

        //触发开始
        touchStart(e) {
            // console.log(e);
        },
        //移动时
        touchMove(e) {
            let y = e.touches[0].clientY;
            let offsettop = e.currentTarget.offsetTop;

            //判断选择区域,只在选择区才会生效
            if (y > offsettop) {
                let num = parseInt((y - offsettop) / u40); //右边每个字母元素的高度
                let letter = this.alphabet[num];
                this.tipsLetter = letter;

                let curentLetter = this.letterTransform(letter);
                uni.showToast({
                    title: curentLetter,
                    icon: "none",
                    duration: 1000
                });
            }
            return false
        },
        //触发结束
        touchEnd() {
            this.toIndex = this.tipsLetter;
            console.log(this.toIndex);
        },
        //移动开始获取字母，并放大提示
        getLetter(e) {
            uni.vibrateShort();
            let {
                id
            } = e.currentTarget;
            this.tipsLetter = id;

            let curentLetter = this.letterTransform(id);
            uni.showToast({
                title: curentLetter,
                icon: "none",
                duration: 1000
            });
        },
        //移动结束设置字母，赋值到toIndex
        setLetter() {
            this.toIndex = this.tipsLetter;
        },

        //提示字母转换
        letterTransform(letter) {
            let str = "";
            if (letter == "area") {
                str = "区县";
            } else if (letter == "hot") {
                str = "热门";
            } else {
                str = letter;
            }
            return str;
        }
    }
};