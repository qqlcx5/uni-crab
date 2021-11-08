<template>
    <view class="share">
        <view
            v-if="modalFlag && sharePosters"
            class="share__poster"
        >
            <scroll-view
                scroll-y
                :style="{
                    width: '650rpx',
                    height: posterHeight_
                }"
            >
                <c-image
                    v-if="sharePosters"
                    radius="16"
                    mode="heightFix"
                    :src="poster.finalPath"
                    show-menu-by-longpress
                    @click="preview(poster.finalPath)"
                />
            </scroll-view>
            <view class="fs28 ptb12">长按图片，可快捷转发哦～</view>
        </view>
        <!-- 第一步弹窗分享至 -->
        <c-popup
            v-model="modalFlag"
            mode="bottom"
            show-close="false"
            radius="0 16rpx 0 0"
        >
            <view class="share-wechat">
                <view class="share-wechat-hd">
                    <view class="share-wechat-hd__left">
                        <c-image
                            src="share/header-left.png"
                            width="240"
                            height="84"
                            mode="heightFix"
                        />
                        <text class="share-wechat-hd__title">分享至</text>
                    </view>
                    <view class="share-wechat-hd__right flex">
                        <div class="flex-1">美的(Midea】智能变频空调</div>
                        <div :class="[mode === 'goods' ? 'share-wechat-hd__price' : 'flex-1']">
                            <view
                                class="price-com"
                                data-price_prefix="￥"
                            >
                                1199.00
                            </view>
                        </div>
                    </view>
                </view>
                <view class="share-wechat-bd flex">
                    <!-- #ifdef MP-WEIXIN -->
                    <button
                        class="share-wechat__item flex-ajcenter"
                        open-type="share"
                    >
                        <c-image
                            size="90"
                            src="common/wechat-share.png"
                        ></c-image>
                        <text class="desc">分享给好友</text>
                    </button>
                    <!-- #endif -->

                    <!-- #ifdef APP-PLUS -->
                    <view
                        class="share-wechat__item flex-ajcenter"
                        @click="hanlderAppShare('WXSceneSession')"
                    >
                        <c-image
                            size="90"
                            src="common/wechat-share.png"
                        ></c-image>
                        <text class="desc">分享给好友</text>
                    </view>
                    <view
                        class="share-wechat__item flex-ajcenter"
                        @click="hanlderAppShare('WXSenceTimeline')"
                    >
                        <c-image
                            size="90"
                            src="common/wechat-timeline.png"
                        ></c-image>
                        <text class="desc">分享到朋友圈</text>
                    </view>
                    <!-- #endif -->

                    <!-- #ifdef H5 -->
                    <block v-if="$isWechatBrowser">
                        <view
                            class="share-wechat__item flex-ajcenter"
                            @click="hanlderShowShare('h5')"
                        >
                            <c-image
                                size="90"
                                src="common/wechat-share.png"
                            ></c-image>
                            <text class="desc">分享给好友</text>
                        </view>
                        <view
                            class="share-wechat__item flex-ajcenter"
                            @click="hanlderShowShare('h5')"
                        >
                            <c-image
                                size="90"
                                src="common/wechat-timeline.png"
                            ></c-image>
                            <text class="desc">分享到朋友圈</text>
                        </view>
                    </block>
                    <!-- #endif -->

                    <view
                        v-if="showPoster_"
                        class="share-wechat__item flex-ajcenter"
                        @click="hanlderShowShare('posters')"
                    >
                        <c-image
                            size="90"
                            src="common/share-poster.png"
                        ></c-image>
                        <text class="desc">生成分享海报</text>
                    </view>
                </view>
                <view class="share-wechat-ft">
                    <view class="c-underline__top">
                        <c-button
                            size="large"
                            @click="handelClose"
                        >
                            <text class="c-999">取消</text>
                        </c-button>
                    </view>
                </view>
            </view>
        </c-popup>
        <canvas
            class="share__hideCanvas"
            canvas-id="testShareType"
            :style="{
                width: (poster.width || 640) + 'px',
                height: (poster.height || 940) + 'px'
            }"
        />
    </view>
</template>
<script>
import { mapState } from 'vuex'
import { getSharePoster } from '../../utils/cavasTool/QS-SharePoster'
const systeminfo = uni.getSystemInfoSync()
export default {
    options: {
        styleIsolation: 'shared'
    },
    props: {
        mode: {
            type: String,
            default: 'goods'
        },
        /**
         * 双向绑定控制
         */
        value: {
            type: Boolean,
            default: false
        },
        /**
         * 分享海报标题
         */
        title: {
            type: String,
            default: '看见家 I 厦门万科金域缇香楼盘今日概况'
        },
        /**
         * 用户名称下的副标题
         */
        summary: {
            type: String,
            default: '邀请你观看直播'
        },
        /**
         * 分享主图
         */
        shareImg: {
            type: String,
            default: 'https://shop.oss.meijiabang.com/w_3840_h_2160_1605087182699.jpg'
        },
        /**
         * 分享主图左上角标识
         */
        // shareImgTip: {
        //     type: String,
        //     default: 'live/live-poster-1.png'
        // },
        /**
         * 分享的页面url
         */
        shareUrl: {
            type: String,
            default: ''
        },
        /**
         * 展示海报
         */
        showPoster: {
            type: [Boolean, String],
            default: true
        },
        /**
         * 主播信息
         */
        playerInfo: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            modalFlag: false,
            sharePosters: false,
            poster: {},
            canvasId: 'testShareType',
            userInfo: {},
            qrCode: '', // 小程序码
            defaultColors: {
                theme: '#FF5D0C',
                subColor1: '#FFAE37',
                subColor2: '#FF5D0C'
            }
        }
    },
    computed: {
        ...mapState({
            shopConfig_: (state) => (state.config.shopConfig ? state.config.shopConfig : null),
            shopInfo_: (state) => (state.config.shopInfo ? state.config.shopInfo : {})
        }),
        colors_() {
            return this.shopConfig_ ? this.shopConfig_.color : this.defaultColors
        },
        showPoster_() {
            return String(this.showPoster) !== 'false'
        },
        /**
         * 海报图展示高度计算,适配不同高度的手机
         */
        posterHeight_() {
            return `calc(100vh - 478rpx - env(safe-area-inset-bottom))`
        }
    },
    watch: {
        value: {
            async handler(val) {
                if (val) {
                    // if (this.showPoster_) {
                    //     // 分享弹框展示时,默认调用海报生成的, 海报生成之后再显示出弹出层
                    //     const result = await this.hanlderShowShare('posters')
                    //     if (result) {
                    //         this.modalFlag = val
                    //     } else {
                    //         // 没有打开弹出层时要把外层v-model以及置为true的值改为false
                    //         this.$emit('input', false)
                    //     }
                    // } else {
                    this.modalFlag = true
                    // }
                }
            },
            immediate: true
        },
        modalFlag(val) {
            this.$emit('input', val)
            this.$emit('change', val)
            if (!val) {
                this.sharePosters = false
            }
        },
        /**
         * 分享主图改变时重置绘画
         */
        shareImg(val) {
            this.poster = {}
        }
        /**
         * 分享主图提示改变时重置绘画
         */
        // shareImgTip(val) {
        //     this.poster = {}
        // }
    },
    methods: {
        /**
         * @name 清除已经生成的海报
         */
        clear() {
            this.poster.finalPath = ''
        },
        /**
         * @name 获取用户信息
         */
        async getUserInfo() {
            const { data } = await this.$http('userInfo')
            this.userInfo = data
        },
        /**
         * @name 海报生成
         */
        async hanlderShowShare(val) {
            if (val === 'posters') {
                return await this.shareFc()
            }
        },
        /**
         * @name 取消按钮触发函数
         */
        handelClose() {
            this.modalFlag = false
            this.sharePosters = false
        },
        /**
         * @name 获取太阳码
         */
        async getShareQrcode(httpName) {
            let page = `${this.$Route.path}${this.$c.parse(this.$Route.query)}`
            if (this.shareUrl) {
                page = this.shareUrl
            }
            const { data: { src = '' } } = await this.$http(httpName, { page })
            this.qrCode = src
        },
        /**
         * @name 生成海报的方法
         */
        async shareFc() {
            if (this.poster.finalPath) {
                this.sharePosters = true
                return this.poster.finalPath
            }
            // #ifdef MP-WEIXIN
            await this.getShareQrcode('getShareQrcode')
            // #endif
            // #ifndef MP-WEIXIN
            await this.getShareQrcode('getH5ShareQrcode')
            // #endif
            if (!this.qrCode) {
                this.$toast('获取小程序二维码失败')
                return
            }
            await this.getUserInfo()
            const width = 640
            const height = 736
            let mainImgHeight = 0
            const liveInfoHeight = this.mode === 'live' ? 232 : 48
            try {
                const d = await getSharePoster({
                    _this: this, // 若在组件中使用 必传
                    type: 1,
                    background: {
                        // 设置自定义背景画布, 若传该属性则背景图失效
                        height, // 画布高度
                        width, // 画布宽度
                        backgroundColor: '#fff' // 背景颜色
                    },
                    bgScale: 1,
                    posterCanvasId: this.canvasId, // canvasId
                    drawArray: ({ getBgObj, setBgObj }) => {
                        return new Promise((rs, rj) => {
                            const postArr = [
                                // 主播头像
                                // {
                                //     type: 'image',
                                //     url: this.proxyImgUrl_ + this.playerInfo.headingimg,
                                //     dx: 36,
                                //     dy: 30,
                                //     dWidth: 100,
                                //     dHeight: 100,
                                //     circleSet: true
                                // },
                                // 主播名称
                                // {
                                //     type: 'text',
                                //     text: `主播: ${this.playerInfo.wechat_nickname}`,
                                //     size: 28,
                                //     color: '#333',
                                //     textBaseline: 'top',
                                //     dx: 186,
                                //     dy: 68,
                                //     fontWeight: 'bold',
                                //     lineFeed: {
                                //         lineNum: 1
                                //     }
                                // },
                                // 分享海报标题
                                {
                                    type: 'text',
                                    text: this.title,
                                    size: 32,
                                    color: '#000',
                                    lineFeed: {
                                        maxWidth: getBgObj().width - 36,
                                        lineNum: 1
                                    },
                                    dx: 36,
                                    dy: 154,
                                    fontWeight: 'bold',
                                    textBaseline: 'top',
                                    serialNum: 0,
                                    id: 'title'
                                },
                                // 分享主图
                                {
                                    type: 'image',
                                    url: this.proxyImgUrl_ + this.shareImg,
                                    dx: 24,
                                    dy: 24,
                                    dWidth: getBgObj().width - 48,
                                    dHeight: 448,
                                    roundRectSet: {
                                        r: 16
                                    },
                                    serialNum: -1,
                                    infoCallBack: (info) => {
                                        const { width, height } = info
                                        const calcHeight = parseInt(((getBgObj().width - 72) / width) * height)
                                        mainImgHeight = calcHeight
                                        const params = {
                                            dHeight: calcHeight
                                        }
                                        setBgObj({
                                            height: getBgObj().height - 448 + calcHeight
                                        })
                                        return params
                                    }
                                },
                                // 分享主图左上角标识
                                // {
                                //     type: 'image',
                                //     url: this.proxyImgUrl_ + this.$config.ossImgUrl + this.shareImgTip,
                                //     dx: 36,
                                //     dy: 210,
                                //     dWidth: 153,
                                //     dHeight: 43
                                // },
                                // 用户头像
                                {
                                    type: 'image',
                                    url: this.proxyImgUrl_ + this.userInfo.user_picture,
                                    dx: 36,
                                    dy: 680,
                                    dWidth: 90,
                                    dHeight: 90,
                                    circleSet: true,
                                    serialNum: 2,
                                    infoCallBack: (info) => {
                                        return {
                                            dy: liveInfoHeight + mainImgHeight
                                        }
                                    }
                                },
                                // 用户名称
                                {
                                    type: 'text',
                                    text: this.userInfo.nick_name,
                                    size: 28,
                                    color: '#333',
                                    textBaseline: 'top',
                                    dx: 142,
                                    dy: 690,
                                    fontWeight: 'bold',
                                    lineFeed: {
                                        maxWidth: 168,
                                        lineNum: 1
                                    },
                                    serialNum: 2,
                                    infoCallBack: (info) => {
                                        return {
                                            dy: liveInfoHeight + 16 + mainImgHeight
                                        }
                                    }
                                },
                                // 介绍语
                                {
                                    type: 'text',
                                    text: this.summary,
                                    size: 24,
                                    color: '#999',
                                    textBaseline: 'top',
                                    dx: 142,
                                    dy: 736,
                                    lineFeed: {
                                        maxWidth: 168,
                                        lineNum: 1
                                    },
                                    serialNum: 2,
                                    infoCallBack: (info) => {
                                        return {
                                            dy: 48 + liveInfoHeight + mainImgHeight
                                        }
                                    }
                                },
                                // 分隔线
                                {
                                    type: 'fillRect',
                                    backgroundColor: '#333',
                                    alpha: 0.1,
                                    dx: 343,
                                    dy: 680,
                                    width: 2,
                                    height: 91,
                                    serialNum: 2,
                                    allInfoCallback: (info) => {
                                        return {
                                            dy: liveInfoHeight + mainImgHeight
                                        }
                                    }
                                },
                                // 二维码
                                {
                                    type: 'image',
                                    url: this.proxyImgUrl_ + this.qrCode,
                                    dx: getBgObj().width - 261,
                                    dy: 680,
                                    dWidth: 90,
                                    dHeight: 90,
                                    zIndex: 99,
                                    id: 'image_barcode',
                                    serialNum: 2,
                                    infoCallBack: (info) => {
                                        return {
                                            dy: liveInfoHeight + mainImgHeight
                                        }
                                    }
                                },
                                // 简介
                                {
                                    type: 'text',
                                    text: '长按识别或扫码看直播',
                                    size: 24,
                                    color: '#999',
                                    textBaseline: 'top',
                                    dx: getBgObj().width - 155,
                                    dy: 696,
                                    lineFeed: {
                                        maxWidth: 120,
                                        lineHeight: 33,
                                        lineNum: 2
                                    },
                                    serialNum: 2,
                                    infoCallBack: (info) => {
                                        return {
                                            dy: liveInfoHeight + 16 + mainImgHeight
                                        }
                                    }
                                },
                                // 底部引导图
                                {
                                    type: 'image',
                                    url: this.proxyImgUrl_ + this.$config.ossImgUrl + 'share/boot-step.png',
                                    dx: 24,
                                    dWidth: getBgObj().width - 48,
                                    dHeight: 98,
                                    serialNum: 2,
                                    infoCallBack: () => {
                                        return {
                                            dy: getBgObj().height - 98 - 24
                                        }
                                    }
                                }
                            ]
                            rs(postArr)
                        })
                    },
                    setCanvasWH: ({ bgObj }) => {
                        // 为动态设置画布宽高的方法，
                        this.poster = bgObj
                    },
                    setCanvasToTempFilePath(bgObj) { // 这里是为了解决CanvasToTempFilePath生成的图片模糊的情况
                        return {
                            quality: 1,
                            destWidth: bgObj.width * systeminfo.pixelRatio,
                            destHeight: bgObj.height * systeminfo.pixelRatio
                        }
                    }
                })
                this.poster.finalPath = d.poster.tempFilePath
                this.sharePosters = true
                return this.poster.finalPath
            } catch (e) {
                this.$toast(JSON.stringify(e))
                return
            }
        },
        /**
         * @name 下载海报
         */
        downloadPosters() {
            // if (!this.qrCode) return false
            // if (!Object.keys(this.playerInfo).length) {
            //     return false
            // }
            // if (!this.sharePosters) {
            //     this.$toast('海报生成中')
            //     return false
            // }
            uni.saveImageToPhotosAlbum({
                filePath: this.poster.finalPath,
                success: () => {
                    this.$toast('图片保存成功')
                },
                fail: (err) => {
                    if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
                        this.$toast('请开启保存图片相册')
                    }
                }
            })
        },
        /**
         * @name 生成的海报预览
         */
        preview(url) {
            uni.previewImage({
                current: 0,
                urls: [url]
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.share {
    &__poster {
        @include flex;
        justify-content: center;
        position: fixed;
        left: 0;
        right: 0;
        bottom: calc(400rpx + env(safe-area-inset-bottom));
        width: fit-content;
        border-radius: 16rpx;
        margin: 0 auto;
        color: #fff;
        z-index: 1000;
        .fs28.ptb12 {
            text-align: center;
        }
    }
    &__hideCanvas {
        position: fixed;
        top: -99999rpx;
        left: -99999rpx;
        z-index: -99999;
    }
    &-wechat {
        background: transparent;
        margin-top: -12rpx;
        // border-radius: 24rpx 24rpx 0px 0px;

        &__title {
            font-size: 32px;
            font-weight: 500;
            color: #333333;
            padding-left: 48rpx;
            height: 86rpx;
            @include flex(row);
            align-items: center;

            .close {
                position: absolute;
                right: 25rpx;
                top: 50%;
                transform: translateY(-50%);
            }
        }

        &-bd {
            height: 230rpx;
            @include flex(row);
            justify-content: center;
            .share-wechat__item {
                flex: 1;
                @include flex(row);
                align-items: center;
                flex-direction: column;
                background: #ffffff;
                padding: 0;
                border-radius: 0;
                font-size: 28rpx;

                &::after {
                    display: none;
                }

                .desc {
                    font-size: 28rpx;
                    margin-top: 16rpx;
                    color: #333333;
                }
            }
        }

        .share-posterst {
            &-bd {
                min-height: 600rpx;
                padding: 24rpx 75rpx;
                display: flex;
                flex-direction: column;
            }

            &__box {
                background: #ffffff;
                border-radius: 16rpx;
                box-shadow: 0px 4rpx 10rpx 2rpx rgba(0, 0, 0, 0.06);
            }
        }
        &-hd {
            position: relative;
            height: 84rpx;
            padding-top: 10rpx;
            &__left {
                position: absolute;
                left: 0;
                bottom: 0;
                height: 84rpx;
                top: 0;
                z-index: 2;
            }
            &__title {
                @include abs(50%, null, null, 48rpx);
                transform: translateY(-50%);
                font-size: $font-lg;
                color: $color-text;
                font-weight: bold;
            }
            &__right {
                color: #fff;
                @include flex(row);
                align-items: center;
                padding-left: 206rpx;
                height: 100%;
                background: linear-gradient(90deg, #ff6663 0%, #fa5452 100%);
                border-top-right-radius: 16rpx;
                .flex-1 {
                    padding: 0 24rpx;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
            &__price,
            &__anchor {
                padding: 0 24rpx;
                position: relative;
                &::before {
                    content: '';
                    width: 2px;
                    height: 32rpx;
                    @include abs(50%, null, null, 0);
                    transform: scaleX(0.5) translateY(-50%);
                    background-color: #fff;
                }
            }
        }
        &-ft {
            padding: 0 24rpx;
            background-color: #fff;
        }
    }

    /deep/ .c-modal-hd {
        overflow: initial !important;
    }
}
</style>
