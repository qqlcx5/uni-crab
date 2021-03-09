 // #ifdef APP-PLUS
import shareFn from '@/mixins/share'
// #endif
// import _app from '@/common/utils/cavasTool/app';
import { getSharePoster } from '@/common/utils/cavasTool/QS-SharePoster';
let _this = this;
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''

        },
        summary: {
            type: String,
            default: ''
        },
        shareImg: {
            type: String,
            default: ''
        },
        // content 不展示弹窗
        mode: {
          type: String,
          default: 'normal'
        },

    },
    data() {
        return {
            modalFlag: false,
            shareH5: false,
            sharePosters: false,
            poster: {},
            qrShow: false,
            canvasId: 'testShareType',
            userInfo: {},
            qrCode: ''//小程序码
        };
    },
    watch: {
        value: {
            handler(val) {
                this.modalFlag = val;
            },
            immediate: true
        },
        modalFlag(val) {
            this.$emit("input", val);
            this.$emit("change", val);
        }
    },
    methods: {
        clear() {
            this.poster.finalPath = '';
        },
        hanlderAppShare(val) {
            // #ifdef APP-PLUS
            shareFn.call(this, val);
            // #endif
        },
        async getUserInfo() {
            const { data } = await this.$http('userInfo')
            this.userInfo = data
        },
        hanlderShowShare(val) {
            this.modalFlag = false;
            if (val === 'h5') this.shareH5 = true;
            if (val === 'posters') {
                this.qrShow = false;
                this.shareFc()
            }
            if(this.mode === 'content') this.$emit('outerFlag', val)
        },
        handelClose() {
            this.modalFlag = false;
            this.shareH5 = false;
            this.sharePosters = false;
        },
        async getShareQrcode(httpName) {
            let {
                data: { src = ''}
            } = await this.$http(httpName, {
                page: `${this.$Route.path}${this.$c.parse(this.$Route.query)}`
            });
            this.qrCode = src;
        },
        async shareFc() {
            if(this.poster.finalPath){
                this.sharePosters = true;
                return ;
            }
            // #ifdef MP-WEIXIN
            await this.getShareQrcode('getShareQrcode');
            // #endif
            // #ifndef MP-WEIXIN
            await this.getShareQrcode('getH5ShareQrcode');
            // #endif
            if(!this.qrCode) return this.$toast('获取小程序二维码失败')
            // #ifdef H5
            let baseUrl = window.location.origin + this.$router.options.base;
            let frontUrl = baseUrl + this.$route.fullPath.substr(1);
            // #endif
            await this.getUserInfo();
            let width = 600,
                imgHeight = width, height = imgHeight + 300;
            try {
                // _app.log('准备生成:' + new Date())
                const d = await getSharePoster({
                    _this: this, //若在组件中使用 必传
                    type: 1,
                    background: { //设置自定义背景画布, 若传该属性则背景图失效
                        height, //画布高度
                        width, //画布宽度
                        backgroundColor: '#fff' //背景颜色
                    },
                    posterCanvasId: this.canvasId, //canvasId
                    delayTimeScale: 20, //延时系数
                    drawArray: ({
                        bgObj,
                        type,
                        bgScale
                    }) => {
                        const fontSize = 28;
                        const userImgSize = 80;
                        const lineHeight = 1.5 * fontSize;
                        let u24 = 24;
                        //可直接return数组，也可以return一个promise对象, 但最终resolve一个数组, 这样就可以方便实现后台可控绘制海报
                        return new Promise((rs, rj) => {
                            rs([{
                                    type: 'image',
                                    url: this.$config.proxyImgUrl + this.shareImg,
                                    // alpha: .3,
                                    dx: 0,
                                    dy: 0,
                                    dWidth: bgObj.width,
                                    dHeight: imgHeight
                                },
                                {
                                    type: 'text',
                                    text: this.title,
                                    size: fontSize,
                                    color: '#333',
                                    lineFeed: {
                                        maxWidth: bgObj.width - u24,
                                        lineHeight: 1.5 * u24
                                    },
                                    dx: u24,
                                    dy: imgHeight + 1.5 * u24,
                                    textAlign: 'left',
                                    textBaseline: 'middle',
                                    serialNum: 0,
                                    id: 'title' //自定义标识
                                },
                                // 用户头像
                                {
                                    type: 'image',
                                    url: this.$config.proxyImgUrl + this.userInfo.user_picture,
                                    // alpha: .3,
                                    dx: u24,
                                    dy: bgObj.height - 74 - userImgSize,
                                    dWidth: userImgSize,
                                    dHeight: userImgSize,
                                    circleSet: true
                                },
                                // 用户名
                                {
                                    type: 'text',
                                    text: this.userInfo.nick_name,
                                    size: fontSize,
                                    color: '#333333',
                                    textAlign: 'left',
                                    textBaseline: 'middle',
                                    serialNum: 1,
                                    dx: userImgSize + 1.6 * u24,
                                    dy: bgObj.height - 132
                                },
                                // 简介
                                {
                                    type: 'text',
                                    text: this.summary ? this.summary : '向您分享一篇精选好文',
                                    size: 0.7 * fontSize,
                                    color: '#999999',
                                    textAlign: 'left',
                                    textBaseline: 'middle',
                                    serialNum: 1,
                                    dx: userImgSize + 1.6 * u24,
                                    dy: bgObj.height - 90
                                },
                                // 二维码
                                {
                                    type: 'image',
                                    url: this.$config.proxyImgUrl + this.qrCode,
                                    dx: 440,
                                    dy: bgObj.height - 175,
                                    dWidth: 1.5 * userImgSize,
                                    dHeight: 1.5 * userImgSize
                                },

                            ]);
                        })
                    },
                    setCanvasWH: ({
                        bgObj,
                        type,
                        bgScale
                    }) => { // 为动态设置画布宽高的方法，
                        this.poster = bgObj;
                    }
                });
                this.poster.finalPath = d.poster.tempFilePath;
                this.sharePosters = true;
            } catch (e) {
                // _app.hideLoading();
                // _app.showToast(JSON.stringify(e));
                this.$toast(JSON.stringify(e));
            }
        },
        downloadPosters() {
            uni.saveImageToPhotosAlbum({
                filePath: this.poster.finalPath,
                success: () => {
                    this.$toast('图片保存成功')
                }
            });
        },

    }
}
