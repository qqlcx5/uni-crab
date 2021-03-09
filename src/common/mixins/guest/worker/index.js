import listMixins from '@/common/mixins/list'
export default {
    mixins: [ listMixins ],
    data() {
        return {
            keywords: '',
            currentAreaName: '',
            reqParams: {
                city_id: '',
                keywords: '',
            },
            pageList: [],
			reqName: 'shopForeman',
			autoReq: false,
        }
	},
	watch: {
		currentAreaName: {
			handler(val) {
				this.initPage();
			}
		},
	},
    onShow() {
        let getLocation = uni.getStorageSync(this.$config.localCityCatchName);
        if (getLocation) {
            let selectCity = getLocation.find(o => o.checked) || getLocation.find(o => o.curCity);
            this.currentAreaName = selectCity.name;
			this.reqParams.city_id = selectCity.id;
        } else {
            this.getLocation();
        }
		// 2秒获取不到位置信息, 请求接口
		// ifdef H5
		setTimeout(() => {
			if (!this.reqParams.city_id) {
				this.initPage(); 
				uni.hideLoading();
			}
		}, 1500) 
		// endif
	},
	onLoad() {
	},
    methods: {
        confirmInput(e) {
			this.reqParams.keywords = this.keywords;
			this.initPage();
        },
        selectCurrentLocation() {
            this.$jump('chooseCity', { action: 'referrer' })
        },
        // 获取当前定位信息
        getLocation() {
			uni.showLoading({
				title: '加载中'
			})
            uni.getLocation({
                type: 'gcj02',
                geocode: true,
                success: (res) => {
					console.log('位置信息: ', res.latitude, res.longitude);
					uni.hideLoading();
                    this.$http('getLocalInfo', {
                        lat: res.latitude,
                        lng: res.longitude
                    }).then(result => {
                        // 将位置存储到缓存
                        let cityName = result.data.city;
                        let city_id = result.data.city_id;
                        let currentAreaName = {
                            name: cityName,
                            id: city_id,
                            curCity: 1
                        }
                        let regionList = [];
                        regionList.push(currentAreaName);
                        uni.setStorageSync(this.$config.localCityCatchName, regionList);
                        this.currentAreaName = cityName;
                        this.reqParams.city_id = city_id;
                    });

                }
            })
        }
    }
}