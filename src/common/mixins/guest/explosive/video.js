import { debounce, throttle } from '@/common/utils'

let sysInfo = uni.getSystemInfoSync(),
    videoContext;
let defaultSlider = {
    unActive: {
        blockSize: 16,
        lineSize: 4,
        color: 'rgba(255, 255, 255, 0.05)',
        activeColor: 'rgba(255, 255, 255, 0.35)',
        blockColor: 'rgba(255, 255, 255, 0.5)',
        blockOuterColor: 'rgba(255, 255, 255, 0.5)'
    },
    active: {
        blockSize: 24,
        lineSize: 6,
        color: 'rgba(255, 255, 255, 0.25)',
        activeColor: 'rgba(255, 255, 255, 0.5)',
        blockColor: 'rgba(255, 255, 255, 1)',
        blockOuterColor: 'rgba(255, 255, 255, 0.5)'
    }
}
import { mapState } from 'vuex'
export default {
    data() {
        return {
            shopWindowFlag: false,
            shopWindowActive: false,
            current: 0,
            videoValue: 0,
            modalFlag: false,//分享标识
            sysInfo: sysInfo,
            currentVideo: {
                showPoster: true, //解决刚进去没视频 图片显示黑屏问题
                play: true,
                duration: 0,
                currentTime: 0
            }, //播放元数据信息：当前位置，总时长，是否在播放，是否显示封面图
            // #ifdef APP-PLUS
            // objectFit: sysInfo.platform === 'ios' ? 'fill' : 'cover',
            // #endif
            // #ifndef APP-PLUS
            // objectFit: 'cover',
            // #endif
            objectFit: 'contain',
            showGoods: true,
            clickActive: false,
            // #ifdef H5
            isFirstClick: false,
            // #endif
            // #ifndef H5
            isFirstClick: true,
            // #endif
            duration: 0,
            page: 1,
            limit: 10,
            circular: false, //是否循环滚动
            busy: false, //请求拦截，防止多次加载
            finish: false, //是否请求完成，用于页面展示效果
            pageList: [], //视频列表
            videoGoodsList: [],
            videoGoodsFinish: false,
            options: {},
            nvueHttp: null,
            detailId: ''
        }
    },
    computed: {
        ...mapState({
            videoOptions: store => store.page.videoOptions
        }),
        posterUrl_() {
            return (item) => {
                return item.video_url_url + '?x-oss-process=video/snapshot,t_0,f_jpg';
            }
        },
        curGoods_() {
            return this.videoGoodsList[0] || {}
        },
        marqueeDuration_() {
            return (marqueeText) => {
                return (marqueeText.length / 0.002).toFixed(0);
            }
        },
        slider_() {
            return this.clickActive ? defaultSlider.active : defaultSlider.unActive
        },
        fullStyle_() {
            return {
                width: sysInfo.screenWidth,
                height: sysInfo.screenHeight
            }
        }
    },
    watch: {
        'currentVideo.showPoster'(val) {
            let that = this;
            if(!val){
                let item = this.pageList[this.current] || {};
                this.shareParams = {
                   imageUrl: item.cover_url,
                   title: item.title,
                   summary: '爆品视频分享'
                }
                this.$refs.shareWechat.clear()
            }
            debounce(function videoRead() {
                that.videoRead();
            }, 1000)
        }
    },
    onLoad(options) {
        this.options = this.videoOptions || options;
        this.nvueHttp = this.$http || getApp().globalData.$http;
        this.getVideoList(options.curPage);
    },
    onShow() {
        this.handleClick(false);
    },
    onHide() {
        this.handleClick(true);
    },
    methods: {
        handleShare() {
            // #ifdef APP-PLUS-NVUE
            this.appShare();
            // #endif
            // #ifndef APP-PLUS-NVUE
            this.modalFlag = true;
            // #endif
        },
        // 商品加载完成回调
        handleShowWindowChange(arr) {
            this.videoGoodsFinish = true;
            this.videoGoodsList = arr;
        },
        //增加阅读量
        videoRead() {
            if(this.current === -1) return ;
            let curItem = this.pageList[this.current];
            if(!curItem) return ;
            let id = this.pageList[this.current].id;
            let videoRead = uni.getStorageSync('videoRead') || [];
            if(videoRead.findIndex(o => o === id) === -1){
                videoRead.push(id);
                uni.setStorageSync('videoRead', videoRead);
                this.nvueHttp('videoRead', {
                    id: this.pageList[this.current].id
                });
            }
        },
        backPage() {
            // #ifdef APP-PLUS-NVUE
            uni.navigateBack({
                delta: 1
            });
            // #endif
            // #ifndef APP-PLUS-NVUE
            this.$back();
            // #endif
        },
        async videoPraise(index) {
            let curItem = this.pageList[index], praise = curItem.is_praise === 0 ? 1 : 0;
            let res = await this.nvueHttp('videoPraise', {
                id: curItem.id,
                type: praise
            });
            this.$set(this.pageList[index], 'is_praise', praise);
            if(Number.isInteger(this.pageList[index].virtual_praise_num_text * 1)){
                let virtualPraiseNum = this.$utilFn.calcFn.add(this.pageList[index].virtual_praise_num_text, (praise ? 1 : -1));
                this.$set(this.pageList[index], 'virtual_praise_num_text', virtualPraiseNum > 0 ? virtualPraiseNum : 0);
            }
        },
        //获取视频列表
        async getVideoList(curPage = 1) {
            if (this.busy) return;
            this.busy = true;
            this.finish = false;
            this.circular = false;
            let res = await this.nvueHttp('videoList', {
                ...this.reqParams,
                page: this.page,
                limit: curPage * this.limit
            });
            if (this.page === 1) this.pageList = [];
            let listLen = this.pageList.push.apply(this.pageList, res.data.list);
            if (this.page === 1) {
                let detailId = this.options.detailId ? this.options.detailId : this.pageList[0].id;
                this.current === 0 && (this.current = this.pageList.findIndex(o => o.id == detailId));
                if(this.current === -1){//视频被下架
                    uni.showToast({
                        title: '视频已被删除',
                        icon: 'none'
                    })
                    setTimeout(() => {
                        uni.navigateBack();
                    }, 500)
                }
                this.$nextTick(() => {//解决第一次无法暂停问题
                    setTimeout(() => {
                        videoContext = uni.createVideoContext(`video_${this.current}`, this);
                    }, 10)
                })
                this.detailId = detailId;
            }
            if (listLen < res.data.count) { //说明还有数据
                this.busy = false;
                this.page = Math.ceil(listLen / this.limit) + 1;
            } else {
                this.circular = true;
                console.log('到底了，开启循环', this.circular);
            }
            this.finish = true;
        },
        // 关闭推荐商品
        closeCmdGoods(e) {
            e.stopPropagation();
            this.showGoods = false;
        },
        //视频切换
        handleChange(e) {
            this.showGoods = true;
            this.current = e && e.detail.current || 0;
            this.videoGoodsFinish = false;
            this.videoGoodsList = [];
            this.duration = 0;
            this.$set(this.currentVideo, 'showPoster', true);
            this.$nextTick(() => {
                setTimeout(() => {
                    videoContext = uni.createVideoContext(`video_${this.current}`, this);
                }, 10)
            })
            let that = this;
            if(this.current >= this.pageList.length - this.limit / 2){
                this.getVideoList();
            }
            debounce(function getVideoGoods() {
                that.detailId = that.pageList[that.current].id;
            }, 1000)
        },
        showShopWindow() {
            this.shopWindowFlag = true;
            setTimeout(() => { //模拟请求返回
                this.shopWindowActive = true;
            }, 300)
        },
        hideShopWindow() {
            this.shopWindowActive = false;
            this.shopWindowFlag = false;
        },
        toggleLike(index) {
            let that = this;
            debounce(function getVideoGoods() {
                that.videoPraise(index);
            }, 500)
            this.$refs.likeAmi && this.$refs.likeAmi.likeClick()
        },
        handleLoadedmetadata(e) {
            // #ifndef APP-PLUS-NVUE
            this.$set(this.currentVideo, 'showPoster', false);
            // #endif
        },
        handleWaiting(e) {
            // console.log('handleWaiting', e);
        },
        marqueeCom() {
            this.$refs.marqueeRef[0].start();
        },
        handleClick(isPlay = true, e) {
            console.log('handleClick');
            if (!videoContext) return;
            // #ifdef H5
            if (e && !this.isFirstClick) { //H5静音播放解决方案
                this.isFirstClick = true;
                return
            }
            // #endif
            if (isPlay && this.currentVideo.play) {
                console.log('video pause');
                this.$set(this.currentVideo, 'play', false);
                videoContext.pause();
            } else {
                console.log('video play');
                // #ifndef H5
                this.isFirstClick = true;
                // #endif
                this.isFirstClick && this.$set(this.currentVideo, 'play', true);
                videoContext.play();
                this.clickActive = false;
            }
            this.sliderChanging();
        },
        sliderChanging() {
            this.clickActive = true;
            debounce(() => {
                this.clickActive = false;
            }, 2000)
        },
        sliderChange(e) {
            this.sliderChanging();
            if (e.type !== 'changed') return;
            let seek = Math.floor(e.detail.progress * this.currentVideo.duration / 100);
            videoContext && videoContext.seek(seek);
            this.handleClick(false);
        },
        handleTimeupdate(e) {
            if (!this.duration) {
                this.currentVideo.currentTime = e.detail.currentTime;
                this.currentVideo.duration = e.detail.duration;
                this.duration = e.detail.duration;
            }
            this.$set(this.currentVideo, 'showPoster', false);
            this.videoValue = Math.ceil(e.detail.currentTime * 100 / e.detail.duration)
            this.hasChange = false;
        }
    }
}