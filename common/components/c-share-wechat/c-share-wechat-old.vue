<template>
    <view>
        <!-- 第一步弹窗分享至 -->
        <c-popup
            v-model="modalFlag"
            mode="bottom"
            radius="24rpx 24rpx 0 0"
        >
            <view class="share-wechat">
                <view class="share-wechat__title">分享至</view>
                <slot></slot>
                <view class="share-wechat__content flex">
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
            </view>
        </c-popup>
        <view
            v-if="false"
            class="canvas-box"
        >
            <view
                id="canvas"
                class="canvas"
            >
                <view>
                    <c-image
                        width="600"
                        height="450"
                        :src="shareImg"
                        mode="widthFix"
                    />
                    <view class="canvas-title p24">
                        {{ title }}
                    </view>
                    <view class="multi-cell flex-ajcenter p24">
                        <view class="multi-cell__before">
                            <c-image
                                size="80"
                                radius="40"
                                :src="userInfo.user_picture"
                                mode="widthFix"
                            />
                        </view>
                        <view class="multi-cell__content plr24">
                            <view class="color-333 c-ellipsis-2">{{ userInfo.nick_name }}</view>
                            <view class="color-999 pt12 fs-24">{{ summary || '向您分享一篇精选好文' }}</view>
                        </view>
                        <view class="multi-cell__after pl24">
                            <c-image
                                size="120"
                                :src="qrCode"
                                mode="widthFix"
                            />
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 第二步微信浏览器展示图片 -->
        <c-popup
            v-model="shareH5"
            mode="cover"
            show-close="false"
            bg-color="transparent"
        >
            <view>
                <c-image
                    class="share-h5-image"
                    width="435"
                    src="common/share-tips.png"
                    mode="widthFix"
                />
                <view class="share-h5-btn">
                    <c-colors
                        :theme="['#fff', '#fff']"
                        :pro="['bdc', 'c']"
                        radius="38"
                        type="button"
                    >
                        <c-button
                            plain
                            @click="handelClose"
                        >我知道了</c-button>
                    </c-colors>
                </view>
            </view>
        </c-popup>
        <!-- 第二步分享到朋友圈 -->
        <c-popup
            v-model="sharePosters"
            mode="bottom"
            radius="24rpx 24rpx 0 0"
        >
            <view class="share-wechat">
                <view class="share-wechat__title">保存到相册</view>
                <view class="share-posterst__content">
                    <view class="share-posterst__box">
                        <c-image
                            v-if="sharePosters"
                            width="600"
                            :height="posterHeight_"
                            radius="16"
                            :src="poster.finalPath"
                        ></c-image>
                    </view>
                    <view class="mt24">
                        <!-- #ifndef H5 -->
                        <c-colors
                            :theme="['t', '#fff']"
                            :pro="['bgc', 'c']"
                            radius="8"
                        >
                            <c-button
                                type="inherit"
                                @click="downloadPosters"
                            >
                                <c-icons
                                    size="36"
                                    type="icon-xiazai"
                                />
                                <text class="save">保存图片</text>
                            </c-button>
                        </c-colors>
                        <!-- #endif -->
                        <!-- #ifdef H5 -->
                        <c-colors
                            :theme="['#f5f5f5']"
                            :pro="['bgc']"
                            radius="8"
                        >
                            <c-button
                                type="inherit"
                                @click="downloadPosters"
                            >
                                <text class="save">请长按图片保存</text>
                            </c-button>
                        </c-colors>
                        <!-- #endif -->
                    </view>
                </view>
            </view>
        </c-popup>
        <canvas
            class="hideCanvas"
            canvas-id="testShareType"
            :style="{ width: (poster.width || 600) + 'px', height: (poster.height || 900) + 'px' }"
        ></canvas>
    </view>
</template>
<script>
// #ifdef APP-PLUS
import shareFn from '@/common/mixins/share'
// #endif
import { getSharePoster } from '../../utils/cavasTool/QS-SharePoster'
// #ifdef H5
// import html2canvas from 'html2canvas';
// #endif
import { mapState } from 'vuex'
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
        // 额外的标签
        extraTag: {
            type: [String, Number],
            default: ''
        },
        // content 不展示弹窗
        mode: {
            type: String,
            default: 'normal'
        },
        // 分享的页面url
        shareUrl: {
            type: String,
            default: ''
        },
        imgHeight: {
            type: [String, Number],
            default: 600
        },
        showPoster: {
            type: [Boolean, String],
            default: true
        },
        /**
         *	海报需要展示的价格都在里面
         */
        curSkuInfo: {
            type: Object,
            default: () => {
                return {}
            }
        },
        /**
         * 海报需要展示的价格单位
         */
        priceShowUnit: {
            type: String,
            default: ''
        }
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
        posterHeight_() {
            return Number(this.imgHeight) + 300
        }
    },
    watch: {
        value: {
            handler(val) {
                this.modalFlag = val
            },
            immediate: true
        },
        modalFlag(val) {
            this.$emit('input', val)
            this.$emit('change', val)
        }
    },
    methods: {
        clear() {
            this.poster.finalPath = ''
        },
        hanlderAppShare(val) {
            console.log(this.shopInfo_)
            // #ifdef APP-PLUS
            shareFn.call(this, val)
            // #endif
        },
        async getUserInfo() {
            const { data } = await this.$http('userInfo')
            this.userInfo = data
        },
        hanlderShowShare(val) {
            this.modalFlag = false
            if (val === 'h5') this.shareH5 = true
            if (val === 'posters') {
                this.qrShow = false
                this.shareFc()
            }
            if (this.mode === 'content') this.$emit('outerFlag', val)
        },
        handelClose() {
            this.modalFlag = false
            this.shareH5 = false
            this.sharePosters = false
        },
        async getShareQrcode(httpName) {
            let page = `${this.$Route.path}${this.$c.parse(this.$Route.query)}`
            if (this.shareUrl) {
                page = this.shareUrl
            }
            const {
                data: { src = '' }
            } = await this.$http(httpName, {
                page
            })
            this.qrCode = src
        },
        async shareFc() {
            if (this.poster.finalPath) {
                this.sharePosters = true
                return
            }
            // #ifdef MP-WEIXIN
            await this.getShareQrcode('getShareQrcode')
            // #endif
            // #ifndef MP-WEIXIN
            await this.getShareQrcode('getH5ShareQrcode')
            // #endif
            if (!this.qrCode) return this.$toast('获取小程序二维码失败')
            // #ifdef H5
            // let baseUrl = window.location.origin + this.$router.options.base;
            // let frontUrl = baseUrl + this.$route.fullPath.substr(1);
            // #endif
            await this.getUserInfo()
            const width = 600
            const imgHeight = this.imgHeight ? this.imgHeight : width
            const height = Number(imgHeight) + 300
            try {
                // _app.log('准备生成:' + new Date())
                const d = await getSharePoster({
                    _this: this, // 若在组件中使用 必传
                    type: 1,
                    background: {
                        // 设置自定义背景画布, 若传该属性则背景图失效
                        height, // 画布高度
                        width, // 画布宽度
                        backgroundColor: '#fff' // 背景颜色
                    },
                    posterCanvasId: this.canvasId, // canvasId
                    delayTimeScale: 20, // 延时系数
                    drawArray: ({ bgObj, type, bgScale }) => {
                        const fontSize = 28
                        const tagSize = 24
                        const userImgSize = 80
                        // const lineHeight = 1.5 * fontSize
                        const u24 = 24
                        let price_show_width = 0
                        let price_market_width = 0
                        const priceTagSize = 20
                        const priceTagWidth = 14
                        // 可直接return数组，也可以return一个promise对象, 但最终resolve一个数组, 这样就可以方便实现后台可控绘制海报
                        return new Promise((rs, rj) => {
                            let postArr = [
                                {
                                    type: 'image',
                                    url: this.proxyImgUrl_ + this.shareImg,
                                    // alpha: .3,
                                    dx: 0,
                                    dy: 0,
                                    mode: 'aspectFit',
                                    dWidth: bgObj.width,
                                    dHeight: imgHeight
                                },
                                // 标题
                                {
                                    type: 'text',
                                    text: this.title,
                                    size: fontSize,
                                    color: '#333',
                                    lineFeed: {
                                        maxWidth: bgObj.width - u24 * 2,
                                        lineHeight: 1.5 * u24,
                                        lineNum: 2
                                    },
                                    dx: u24,
                                    dy: imgHeight + 1.5 * u24,
                                    textAlign: 'left',
                                    textBaseline: 'middle',
                                    serialNum: 0,
                                    id: 'title' // 自定义标识
                                },
                                // 大的价格符号
                                {
                                    type: 'text',
                                    text: this.curSkuInfo.price_show ? this.pricePrefix_ : '',
                                    size: priceTagSize,
                                    color: this.colors_.theme,
                                    dx: u24,
                                    dy: imgHeight + 1.5 * u24 * 3,
                                    textAlign: 'left',
                                    textBaseline: 'middle',
                                    serialNum: 0,
                                    id: 'big_tip' // 自定义标识
                                },
                                // 大的价格
                                {
                                    type: 'text',
                                    text: this.curSkuInfo.price_show ? `${this.curSkuInfo.price_show}${this.priceShowUnit}` : '',
                                    size: fontSize,
                                    color: this.colors_.theme,
                                    dx: u24 + priceTagWidth,
                                    dy: imgHeight + 1.5 * u24 * 3,
                                    textAlign: 'left',
                                    textBaseline: 'middle',
                                    serialNum: 0,
                                    infoCallBack(width) {
                                        price_show_width = width
                                    },
                                    id: 'price_show' // 自定义标识
                                },
                                // 小的价格
                                {
                                    type: 'text',
                                    text: this.curSkuInfo.price_market ? `${this.pricePrefix_}${this.curSkuInfo.price_market}${this.priceShowUnit}` : '',
                                    size: priceTagSize,
                                    color: '#999',
                                    dy: imgHeight + 1.5 * u24 * 3,
                                    textAlign: 'left',
                                    textBaseline: 'middle',
                                    serialNum: 10,
                                    lineThrough: {
                                        width: 1,
                                        color: '#999'
                                    },
                                    infoCallBack(width) {
                                        price_market_width = width
                                        return {
                                            dx: u24 + price_show_width + priceTagWidth + 8
                                        }
                                    },
                                    id: 'price_market' // 自定义标识
                                },
                                // 用户头像
                                {
                                    type: 'image',
                                    url: this.proxyImgUrl_ + this.userInfo.user_picture,
                                    // alpha: .3,
                                    dx: u24,
                                    dy: bgObj.height - 72 - userImgSize,
                                    dWidth: userImgSize,
                                    dHeight: userImgSize,
                                    circleSet: true
                                },
                                // 用户名
                                {
                                    type: 'text',
                                    text: this.userInfo.nick_name ? this.userInfo.nick_name : this.userInfo.mobile,
                                    size: fontSize,
                                    color: '#333333',
                                    textAlign: 'left',
                                    textBaseline: 'middle',
                                    serialNum: 1,
                                    dx: userImgSize + 1.6 * u24,
                                    dy: bgObj.height - 132,
                                    lineFeed: {
                                        maxWidth: bgObj.width - 3.5 * userImgSize - userImgSize,
                                        lineNum: 1
                                    }
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
                                    url: this.proxyImgUrl_ + this.qrCode,
                                    dx: 390,
                                    dy: bgObj.height - 210,
                                    dWidth: 2.5 * userImgSize,
                                    dHeight: 2.5 * userImgSize
                                }
                            ]
                            if (this.extraTag) {
                                const tagRadius = (tagSize + 10) / 2
                                const tagHeight = bgObj.height - 190
                                const extraArr = [
                                    {
                                        type: 'roundFillRect',
                                        backgroundColor: this.colors_.theme,
                                        r: tagRadius,
                                        dx: u24,
                                        dy: tagHeight,
                                        width: this.extraTag.length * tagSize + 20,
                                        height: tagSize + 10,
                                        id: 'roundFillRect',
                                        allInfoCallback({ drawArray }) {
                                            return new Promise((resolve, reject) => {
                                                if ((price_show_width || price_show_width === 0) && (price_market_width || price_market_width === 0)) {
                                                    const roundFillRect = drawArray.find(item => item.id === 'roundFillRect')
                                                    roundFillRect.dx = u24 + parseInt(price_show_width) + (price_show_width ? priceTagWidth : 0) * 2 + 8 + parseInt(price_market_width)
                                                    resolve(roundFillRect)
                                                }
                                            })
                                        }
                                    },
                                    {
                                        type: 'text',
                                        text: this.extraTag,
                                        size: tagSize,
                                        color: '#fff',
                                        textBaseline: 'middle',
                                        dx: u24 + 15,
                                        dy: tagHeight + tagRadius + 2,
                                        id: 'extraTag',
                                        infoCallBack() {
                                            if ((price_show_width || price_show_width === 0) && (price_market_width || price_market_width === 0)) {
                                                return {
                                                    dx: u24 + parseInt(price_show_width) + (price_show_width ? priceTagWidth : 0) * 2 + 8 + parseInt(price_market_width) + 15
                                                }
                                            }
                                        }
                                    }
                                ]
                                postArr[2].dy += 20
                                postArr[3].dy += 20
                                postArr[4].dy += 20
                                postArr = postArr.concat(extraArr)
                            }
                            rs(postArr)
                        })
                    },
                    setCanvasWH: ({ bgObj, type, bgScale }) => {
                        // 为动态设置画布宽高的方法，
                        this.poster = bgObj
                    }
                })
                this.poster.finalPath = d.poster.tempFilePath
                this.sharePosters = true
            } catch (e) {
                this.$toast(JSON.stringify(e))
            }
        },
        // getPicH5() {
        //     console.time('time1')
        //     var copyDom = document.querySelector('#canvas')
        //     console.log('getPicH5getPicH5getPicH5')
        //     const width = copyDom.offsetWidth // 可见屏幕的宽
        //     const height = copyDom.offsetHeight // 可见屏幕的高
        //     html2canvas(copyDom, {
        //         width: width,
        //         heigth: height,
        //         scrollX: 0,
        //         scrollY: 0,
        //         y: 0,
        //         scale: 1,
        //         useCORS: true,
        //         taintTest: true
        //     }).then((canvas) => {
        //         const url = canvas.toDataURL() // 图片地址
        //         this.poster.finalPath = url
        //         this.sharePosters = true
        //     })
        // },
        downloadPosters() {
            uni.saveImageToPhotosAlbum({
                filePath: this.poster.finalPath,
                success: () => {
                    this.$toast('图片保存成功')
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.share-h5-image {
    @include fixed(30rpx, 30rpx);
}

.share-h5-btn {
    @include fixed(null, 50%, 156rpx);
    transform: translateX(50%);
    width: 186rpx;
}

.canvas-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 600rpx;
    z-index: -9999;
    opacity: 0;
    background-color: #fff;

    .canvas {
        overflow: hidden;
        border-radius: 16rpx;
    }
}

.hideCanvas {
    position: fixed !important;
    top: -99999upx;
    left: -99999upx;
    z-index: -99999;
}

.btn-primary-ghost {
    background: #f5f5f5;

    &::after {
        border: 1rpx solid #ededed;
    }

    .save {
        font-size: 28rpx;
        color: #333333;
        margin-left: 12rpx;
    }
}

.share-wechat {
    background: #ffffff;
    border-radius: 24rpx 24rpx 0px 0px;

    &__title {
        height: 96rpx;
        line-height: 96rpx;
        text-align: center;
        font-size: 32rpx;
        color: #333333;
        position: relative;
        border-bottom: 1rpx solid #ededed;

        .close {
            position: absolute;
            right: 25rpx;
            top: 50%;
            transform: translateY(-50%);
        }
    }

    .share-wechat {
        &__content {
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
                font-size: 28rpx;

                &::after {
                    display: none;
                }

                .desc {
                    margin-top: 16rpx;
                    color: #333333;
                }
            }
        }
    }

    .share-posterst {
        &__content {
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
}
</style>
