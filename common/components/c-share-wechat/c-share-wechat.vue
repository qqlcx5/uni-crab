<template>
    <view>
        <c-popup
            v-model="modalFlag"
            mode="bottom"
            show-close="false"
            height="100%"
            bg-color="transparent"
        >
            <view class="share-wechat">
                <view
                    class="share-wechat-hd"
                    @click="handelClose"
                >
                    <template v-if="!isCreatePost && poster.finalPath">
                        <view
                            id="poster-box"
                            class="share-wechat-hd__box"
                            :style="{
                                transform: `scale(${scale})`
                            }"
                            @click.stop
                        >
                            <c-image
                                v-if="poster.finalPath"
                                radius="16"
                                mode="heightFix"
                                :src="poster.finalPath"
                                show-menu-by-longpress
                                @click="preview(poster.finalPath)"
                            />
                        </view>
                        <view class="share-wechat-hd__text">{{ saveTips }}</view>
                    </template>
                </view>
                <view class="share-wechat-bd">
                    <view class="share-wechat-menu">
                        <view class="share-wechat-menu__left">
                            <c-image
                                src="share/header-left.png"
                                width="240"
                                height="84"
                                mode="heightFix"
                            />
                            <text class="share-wechat-menu__title">分享至</text>
                        </view>
                        <view class="share-wechat-menu__right flex">
                            <slot name="header">
                                <view class="flex-1">{{ title }}</view>
                                <view
                                    v-if="['goods', 'group'].includes(mode)"
                                    class="share-wechat-menu__price"
                                >

                                    <view
                                        class="price-com"
                                        data-price_prefix="￥"
                                    >
                                        {{ goodsInfo.price_show }}
                                        <text class="share-wechat-menu__price--small">{{ goodsInfo.price_show_unit }}</text>
                                    </view>
                                </view>

                                <slot name="headerRight">
                                    <view
                                        v-if="mode !=='article'"
                                        class="flex-1 line-block"
                                    >
                                    </view>
                                </slot>
                            </slot>
                        </view>
                    </view>
                    <view class="share-wechat-bd flex">
                        <!-- #ifdef MP-WEIXIN -->
                        <button
                            class="share-wechat-menu__item flex-ajcenter"
                            open-type="share"
                        >
                            <c-image
                                size="90"
                                src="common/wechat-share.png"
                            ></c-image>
                            <text class="share-wechat-menu__text">分享给好友</text>
                        </button>
                        <!-- #endif -->

                        <!-- #ifdef APP-PLUS -->
                        <view
                            class="share-wechat-menu__item flex-ajcenter"
                            @click="hanlderAppShare('WXSceneSession')"
                        >
                            <c-image
                                size="90"
                                src="common/wechat-share.png"
                            ></c-image>
                            <text class="share-wechat-menu__text">分享给好友</text>
                        </view>
                        <view
                            class="share-wechat-menu__item flex-ajcenter"
                            @click="hanlderAppShare('WXSenceTimeline')"
                        >
                            <c-image
                                size="90"
                                src="common/wechat-timeline.png"
                            ></c-image>
                            <text class="share-wechat-menu__text">分享到朋友圈</text>
                        </view>
                        <!-- #endif -->

                        <!-- #ifdef H5 -->
                        <block v-if="$isWechatBrowser">
                            <view
                                class="share-wechat-menu__item flex-ajcenter"
                                @click="hanlderShowShare('h5')"
                            >
                                <c-image
                                    size="90"
                                    src="common/wechat-share.png"
                                ></c-image>
                                <text class="share-wechat-menu__text">分享给好友</text>
                            </view>
                            <view
                                class="share-wechat-menu__item flex-ajcenter"
                                @click="hanlderShowShare('h5')"
                            >
                                <c-image
                                    size="90"
                                    src="common/wechat-timeline.png"
                                ></c-image>
                                <text class="share-wechat-menu__text">分享到朋友圈</text>
                            </view>
                        </block>
                        <!-- #endif -->

                        <view
                            v-if="showPoster_"
                            class="share-wechat-menu__item flex-ajcenter"
                            @click="hanlderShowShare('posters')"
                        >
                            <c-image
                                size="90"
                                src="common/share-poster.png"
                            ></c-image>
                            <text class="share-wechat-menu__text">生成分享海报</text>
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
            </view>
        </c-popup>
        <canvas
            class="share-wechat__hide"
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
import { getSharePoster } from "../../utils/cavasTool/QS-SharePoster"
const systemInfo = uni.getSystemInfoSync()
export default {
    options: {
        styleIsolation: 'shared'
    },
    props: {
        /**
         * 海报类型：
         * goods 商品相关
         * live 直播相关
         * article 文章咨询相关
         * skill 秒杀
        */
        mode: {
            type: String,
            default: 'goods'
        },
        /**
         * 控制弹窗显示隐藏
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
            default: ''
        },
        /**
         * 分享描述
         */
        summary: {
            type: String,
            default: '长按识别或扫码看详情'
        },
        /**
         * 分享主图
         */
        shareImg: {
            type: String,
            default: 'https://shop.oss.meijiabang.com/w_3840_h_2160_1605087182699.jpg'
        },
        /**
         * 分享的页面url，图片上面的二维码
         */
        shareUrl: {
            type: String,
            default: ''
        },
        /**
         *	商品相关的信息
         */
        goodsInfo: {
            type: Object,
            default: () => {
                return {}
            }
        },
        /**
         * 展示生成海报按钮
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
        },
        /**
         * 显示边框
         */
        showBorder: {
            type: [Boolean, String],
            default: true
        },
        saveTips: {
            type: String,
            default: '长按图片，可快捷转发哦～'
        }
    },
    data() {
        return {
            modalFlag: false,
            isCreatePost: false, // 是否正在生成海报
            poster: {},
            canvasId: 'testShareType',
            userInfo: {},
            qrCode: '', // 小程序码
            defaultColors: {
                theme: '#FF5D0C',
                subColor1: '#FFAE37',
                subColor2: '#FF5D0C'
            },
            showStep: false,
            scale: 1
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
        showBorder_() {
            return String(this.showBorder) !== 'false'
        }
    },
    watch: {
        value: {
            async handler(val) {
                if (val) {
                    this.modalFlag = true
                }
            },
            immediate: true
        },
        modalFlag(val) {
            this.$emit('input', val)
            this.$emit('change', val)
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
            if (val === 'h5') this.shareH5 = true
            else if (val === 'posters') {
                if (this.isCreatePost) return
                this.isCreatePost = true
                await this.shareFc()
                this.isCreatePost = false
                if (this.poster.finalPath) {
                    this.$nextTick(async () => {
                        const data = await this.$c.getRect.call(this, '#poster-box')
                        console.log(data)
                        if (data && data.width > systemInfo.screenWidth) {
                            this.scale = (systemInfo.screenWidth / (data.width + uni.upx2px(48))).toFixed(2)
                        } else {
                            this.scale = 1
                        }
                    })
                }
            } else if (this.mode === 'content') this.$emit('outerFlag', val)
        },
        /**
         * @name 取消按钮触发函数
         */
        handelClose() {
            this.modalFlag = false
            this.shareH5 = false
            this.sharePosters = false
        },
        /**
         * @name 获取太阳码
         */
        async getShareQrcode(httpName) {
            const { data: { src = '' } } = await this.$http(httpName, {
                page: this.shareUrl || `${this.$Route.path}${this.$c.parse(this.$Route.query)}`
            })
            this.qrCode = src
        },
        /**
         * @name 生成海报的方法
         */
        async shareFc() {
            if (this.poster.finalPath) return
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
            // 内容边距
            const ctxPadding = 0
            // 海报默认宽
            const posterWidth = 500
            // 海报默认高
            const posterHeight = 500
            // 二维码大小（H5有白边，所以设置大一点）
            let qrcodeInfo = {
                dWidth: 112,
                dHeight: 112
            }
            // #ifndef H5
            qrcodeInfo = {
                dWidth: 100,
                dHeight: 100
            }
            // #endif
            try {
                const d = await getSharePoster({
                    _this: this, // 若在组件中使用 必传
                    type: 1,
                    background: {
                        // 设置自定义背景画布, 若传该属性则背景图失效
                        width: posterWidth, // 画布宽度
                        height: posterHeight, // 画布高度
                        backgroundColor: '#fff' // 背景颜色
                    },
                    bgScale: 1,
                    posterCanvasId: this.canvasId, // canvasId
                    drawArray: () => {
                        return new Promise((rs, rj) => {
                            const postArr = [
                                // 分享主图
                                {
                                    type: 'image',
                                    url: this.proxyImgUrl_ + this.shareImg,
                                    dx: ctxPadding,
                                    dy: ctxPadding,
                                    dWidth: posterWidth - 2 * ctxPadding,
                                    roundRectSet: {
                                        r: [16, 16, 0, 0]
                                    },
                                    serialNum: 10,
                                    id: 'shareImg',
                                    // 动态设置自身的宽高
                                    infoCallBack: (info) => {
                                        const { width, height } = info
                                        const calcHeight = parseInt(((posterWidth - 2 * ctxPadding) / width) * height)
                                        const params = {
                                            dHeight: calcHeight
                                        }
                                        return params
                                    },
                                    allInfoCallback: ({ drawArray }) => {
                                        return new Promise((resolve) => {
                                            const titleEl = drawArray.find(item => item.id === 'playerTitle')
                                            const shareImgEl = drawArray.find(item => item.id === 'shareImg')
                                            shareImgEl.dy = ctxPadding
                                            // 是否存在主播消息，如果存在，则dy会被改变
                                            if (titleEl) {
                                                shareImgEl.dy = this.getNodeHeight(drawArray, 'playerTitle')
                                            }
                                            resolve(shareImgEl)
                                        })
                                    }
                                },
                                // 昵称
                                {
                                    type: 'text',
                                    text: this.userInfo.nick_name || this.userInfo.mobile,
                                    size: 22,
                                    color: '#333',
                                    textBaseline: 'top',
                                    lineFeed: {
                                        lineHeight: 30,
                                        lineNum: 1,
                                        maxWidth: 110
                                    },
                                    zIndex: 2,
                                    serialNum: 998, // 这个值只要大于类型type非image的个数就行
                                    id: 'userName',
                                    allInfoCallback: ({ drawArray }) => {
                                        return new Promise((resolve) => {
                                            resolve(this.dynamicCalcLocal({
                                                drawArray,
                                                rId: 'avatarImg',
                                                tId: 'userName',
                                                isSameLine: true,
                                                offset: {
                                                    x: 16,
                                                    y: 18
                                                }
                                            }))
                                        })
                                    }
                                },
                                // 昵称下面的矩形
                                {
                                    type: 'roundFillRect',
                                    url: this.proxyImgUrl_ + this.userInfo.user_picture,
                                    circleSet: true,
                                    zIndex: 1,
                                    height: 58,
                                    r: 29,
                                    serialNum: 999, // 这个值只要大于类型type非image的个数就行
                                    id: 'userNameRect',
                                    backgroundColor: '#F7F8F9',
                                    allInfoCallback: ({ drawArray }) => {
                                        return new Promise((resolve) => {
                                            const { textLength, lineFeed } = drawArray.find(o => o.id === 'userName')
                                            const maxWidth = textLength > lineFeed.maxWidth ? lineFeed.maxWidth : textLength
                                            resolve({
                                                ...this.dynamicCalcLocal({
                                                    drawArray,
                                                    rId: 'avatarImg',
                                                    tId: 'userNameRect',
                                                    isSameLine: true,
                                                    offset: {
                                                        x: -29,
                                                        y: 0
                                                    }
                                                }),
                                                width: Math.ceil(maxWidth + 74)
                                            })
                                        })
                                    }
                                }
                            ]
                            switch (this.mode) {
                                case 'goods':
                                    postArr.push(
                                        // 标题
                                        {
                                            type: 'text',
                                            text: this.title,
                                            size: 26,
                                            color: '#333',
                                            textBaseline: 'top',
                                            serialNum: 12,
                                            id: 'posterName', // 自定义标识
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    const shareImgInfo = this.getNodeInfo(drawArray, 'shareImg')
                                                    console.log(shareImgInfo)
                                                    resolve({
                                                        ...this.dynamicCalcLocal({
                                                            drawArray,
                                                            rId: 'shareImg',
                                                            tId: 'posterName',
                                                            offset: {
                                                                x: 24,
                                                                y: 24
                                                            }
                                                        }),
                                                        lineFeed: {
                                                            maxWidth: shareImgInfo.width - 48,
                                                            lineHeight: 38,
                                                            lineNum: 2
                                                        }
                                                    })
                                                })
                                            }
                                        },
                                        // 售价符号
                                        {
                                            type: 'text',
                                            text: this.goodsInfo.price_show ? this.pricePrefix_ : '',
                                            size: 26,
                                            color: this.colors_.theme,
                                            textAlign: 'left',
                                            textBaseline: 'top',
                                            serialNum: 13,
                                            lineFeed: {
                                                lineHeight: 30
                                            },
                                            id: 'priceShowSymbol', // 自定义标识
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'posterName',
                                                        tId: 'priceShowSymbol',
                                                        offset: {
                                                            x: 0,
                                                            y: 16
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        // 售价
                                        {
                                            type: 'text',
                                            text: this.goodsInfo.price_show || '',
                                            size: 40,
                                            color: this.colors_.theme,
                                            textAlign: 'left',
                                            textBaseline: 'top',
                                            fontFamily: 'd-din',
                                            lineFeed: {
                                                lineHeight: 40
                                            },
                                            serialNum: 14,
                                            id: 'priceShow', // 自定义标识
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'priceShowSymbol',
                                                        tId: 'priceShow',
                                                        isSameLine: true,
                                                        offset: {
                                                            x: 0,
                                                            y: -8
                                                        }
                                                    }))
                                                })
                                            }
                                        },

                                        // 售价单位
                                        {
                                            type: 'text',
                                            text: this.goodsInfo.price_show ? this.goodsInfo.price_show_unit : '',
                                            size: 24,
                                            color: this.colors_.theme,
                                            textAlign: 'left',
                                            textBaseline: 'top',
                                            serialNum: 15,
                                            id: 'priceShowUnit', // 自定义标识
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'priceShow',
                                                        tId: 'priceShowUnit',
                                                        isSameLine: true,
                                                        offset: {
                                                            x: 0,
                                                            y: 10
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        // 市场格
                                        {
                                            type: 'text',
                                            text: this.goodsInfo.price_market ? `${this.pricePrefix_}${this.goodsInfo.price_market}${this.goodsInfo.price_show_unit}` : '',
                                            size: 24,
                                            color: '#999',
                                            textAlign: 'left',
                                            textBaseline: 'top',
                                            serialNum: 16,
                                            fontFamily: this.goodsInfo.price_show_unit ? 'sans-serif' : 'd-din',
                                            lineFeed: {
                                                lineHeight: 24
                                            },
                                            lineThrough: {
                                                width: 1,
                                                color: '#999'
                                            },
                                            id: 'priceMarket', // 自定义标识
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'priceShowUnit',
                                                        tId: 'priceMarket',
                                                        isSameLine: true,
                                                        offset: {
                                                            x: 8,
                                                            y: 0
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        // 二维码
                                        {
                                            type: 'image',
                                            url: this.proxyImgUrl_ + this.qrCode,
                                            ...qrcodeInfo,
                                            serialNum: 100,
                                            id: 'imgBarcode',
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    let offsetY = 50
                                                    let offsetX = 352
                                                    // #ifndef H5
                                                    offsetX = 364
                                                    offsetY = 62
                                                    // #endif
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'posterName',
                                                        tId: 'imgBarcode',
                                                        offset: {
                                                            x: offsetX,
                                                            y: offsetY
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        // 长按识别
                                        {
                                            type: 'text',
                                            text: this.summary,
                                            size: 22,
                                            color: '#999',
                                            textAlign: 'center',
                                            textBaseline: 'top',
                                            serialNum: 101,
                                            lineFeed: {
                                                lineHeight: 22
                                            },
                                            id: 'longTips', // 自定义标识
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'imgBarcode',
                                                        tId: 'longTips',
                                                        offset: {
                                                            x: 60,
                                                            y: 10
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        // 头像
                                        {
                                            type: 'image',
                                            url: this.proxyImgUrl_ + this.userInfo.user_picture,
                                            dWidth: 58,
                                            dHeight: 58,
                                            circleSet: true,
                                            zIndex: 2,
                                            serialNum: 101, // 这个值只要大于类型type非image的个数就行
                                            id: 'avatarImg',
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'posterName',
                                                        tId: 'avatarImg',
                                                        offset: {
                                                            x: 0,
                                                            y: 100
                                                        }
                                                    }))
                                                })
                                            }
                                        })
                                    break
                                case 'live':
                                    console.log(this.playerInfo)
                                    postArr.push(
                                        // 主播头像
                                        {
                                            type: 'image',
                                            url: this.proxyImgUrl_ + this.playerInfo.headingimg,
                                            dx: ctxPadding,
                                            dy: ctxPadding,
                                            dWidth: 72,
                                            dHeight: 72,
                                            circleSet: true,
                                            id: 'playerImg'
                                        },
                                        // 主播名称
                                        {
                                            type: 'text',
                                            text: `主播: ${this.playerInfo.wechat_nickname || '张伟'}`,
                                            size: 28,
                                            color: '#333',
                                            textBaseline: 'top',
                                            fontWeight: 'bold',
                                            lineFeed: {
                                                maxWidth: posterWidth - 2 * ctxPadding - 16 - 72,
                                                lineNum: 1
                                            },
                                            id: 'playerName',
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'playerImg',
                                                        tId: 'playerName',
                                                        isSameLine: true,
                                                        offset: {
                                                            x: 16,
                                                            y: 22
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        // 直播间标题
                                        {
                                            type: 'text',
                                            text: this.title,
                                            size: 30,
                                            color: '#333',
                                            lineFeed: {
                                                maxWidth: posterWidth - 2 * ctxPadding,
                                                lineNum: 2,
                                                lineHeight: 42
                                            },
                                            textBaseline: 'top',
                                            id: 'playerTitle',
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'playerImg',
                                                        tId: 'playerTitle',
                                                        offset: {
                                                            x: 0,
                                                            y: 8
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        // 二维码
                                        {
                                            type: 'image',
                                            url: this.proxyImgUrl_ + this.qrCode,
                                            ...qrcodeInfo,
                                            serialNum: 100,
                                            id: 'imgBarcode',
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    const posterNameInfo = this.getNodeInfo(drawArray, 'posterName')
                                                    let offsetX = 10
                                                    let offsetY = 22
                                                    // #ifndef H5
                                                    offsetY = 40
                                                    offsetX = 4
                                                    // #endif
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'posterName',
                                                        tId: 'imgBarcode',
                                                        offset: {
                                                            x: posterNameInfo.width - qrcodeInfo.dWidth + offsetX,
                                                            y: offsetY
                                                        }
                                                    }))
                                                })
                                                // return new Promise((resolve) => {
                                                //     let offsetY = 50
                                                //     let offsetX = 352
                                                //     // #ifndef H5
                                                //     offsetX = 364
                                                //     offsetY = 62
                                                //     // #endif
                                                //     resolve(this.dynamicCalcLocal({
                                                //         drawArray,
                                                //         rId: 'posterName',
                                                //         tId: 'imgBarcode',
                                                //         offset: {
                                                //             x: offsetX,
                                                //             y: offsetY
                                                //         }
                                                //     }))
                                                // })
                                            }
                                        },
                                        // 长按识别
                                        {
                                            type: 'text',
                                            text: this.summary,
                                            size: 20,
                                            color: '#999',
                                            textAlign: 'left',
                                            serialNum: 101,
                                            lineFeed: {
                                                lineHeight: 28,
                                                lineNum: 2,
                                                maxWidth: 100
                                            },
                                            id: 'longTips', // 自定义标识
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    let offsetY = 60
                                                    // #ifndef H5
                                                    offsetY = 74
                                                    // #endif
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'shareImg',
                                                        tId: 'longTips',
                                                        offset: {
                                                            x: 268,
                                                            y: offsetY
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        // 头像
                                        {
                                            type: 'image',
                                            url: this.proxyImgUrl_ + this.userInfo.user_picture,
                                            dWidth: 58,
                                            dHeight: 58,
                                            circleSet: true,
                                            zIndex: 2,
                                            serialNum: 101, // 这个值只要大于类型type非image的个数就行
                                            id: 'avatarImg',
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'shareImg',
                                                        tId: 'avatarImg',
                                                        offset: {
                                                            x: 24,
                                                            y: 24
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        // 分隔线
                                        {
                                            type: 'fillRect',
                                            backgroundColor: '#DFDFDF',
                                            width: 1,
                                            height: 76,
                                            serialNum: 102,
                                            id: 'line',
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'shareImg',
                                                        tId: 'line',
                                                        offset: {
                                                            x: 250,
                                                            y: 36
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        // 邀请语
                                        {
                                            type: 'text',
                                            text: this.summary || '长按识别或扫码看直播',
                                            size: 22,
                                            color: '#999',
                                            textBaseline: 'top',
                                            lineFeed: {
                                                maxWidth: 202,
                                                lineNum: 1
                                            },
                                            serialNum: 103,
                                            id: 'summary',
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'avatarImg',
                                                        tId: 'summary',
                                                        offset: {
                                                            x: 0,
                                                            y: 12
                                                        }
                                                    }))
                                                })
                                            }
                                        })
                                    break
                                case 'article':
                                    postArr.push(
                                        // 文章标题
                                        {
                                            type: 'text',
                                            text: this.title,
                                            size: 26,
                                            color: '#333',
                                            lineFeed: {
                                                maxWidth: posterWidth - 48,
                                                lineNum: 2,
                                                lineHeight: 38
                                            },
                                            serialNum: 99,
                                            textBaseline: 'top',
                                            id: 'posterName',
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'shareImg',
                                                        tId: 'posterName',
                                                        offset: {
                                                            x: 24,
                                                            y: 24
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        // 二维码
                                        {
                                            type: 'image',
                                            url: this.proxyImgUrl_ + this.qrCode,
                                            ...qrcodeInfo,
                                            serialNum: 100,
                                            id: 'imgBarcode',
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    const posterNameInfo = this.getNodeInfo(drawArray, 'posterName')
                                                    let offsetX = 10
                                                    let offsetY = 22
                                                    // #ifndef H5
                                                    offsetY = 40
                                                    offsetX = 4
                                                    // #endif
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'posterName',
                                                        tId: 'imgBarcode',
                                                        offset: {
                                                            x: posterNameInfo.width - qrcodeInfo.dWidth + offsetX,
                                                            y: offsetY
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        // 长按识别
                                        {
                                            type: 'text',
                                            text: this.summary,
                                            size: 20,
                                            color: '#999',
                                            textAlign: 'right',
                                            textBaseline: 'top',
                                            serialNum: 101,
                                            lineFeed: {
                                                lineHeight: 28,
                                                lineNum: 2,
                                                maxWidth: 100
                                            },
                                            id: 'longTips', // 自定义标识
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    let offsetX = 0
                                                    // #ifndef H5
                                                    offsetX = 8
                                                    // #endif
                                                    const longTips = this.getNodeInfo(drawArray, 'longTips')
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'imgBarcode',
                                                        tId: 'longTips',
                                                        isSameLine: true,
                                                        offset: {
                                                            x: -(qrcodeInfo.dWidth + offsetX),
                                                            y: (qrcodeInfo.dHeight - longTips.height) / 2 + (longTips.height - longTips.size * longTips.lineNum) / 2
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        // 分隔线
                                        {
                                            type: 'fillRect',
                                            backgroundColor: '#DFDFDF',
                                            width: 1,
                                            height: 76,
                                            serialNum: 102,
                                            id: 'line',
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    let offsetX = 16
                                                    // #ifndef H5
                                                    offsetX = 24
                                                    // #endif
                                                    const longTips = this.getNodeInfo(drawArray, 'longTips')
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'imgBarcode',
                                                        tId: 'line',
                                                        isSameLine: true,
                                                        offset: {
                                                            x: -(qrcodeInfo.dWidth + longTips.width + offsetX),
                                                            y: (qrcodeInfo.dHeight - 76) / 2
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        // 头像
                                        {
                                            type: 'image',
                                            url: this.proxyImgUrl_ + this.userInfo.user_picture,
                                            dWidth: 58,
                                            dHeight: 58,
                                            circleSet: true,
                                            zIndex: 2,
                                            serialNum: 101, // 这个值只要大于类型type非image的个数就行
                                            id: 'avatarImg',
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'posterName',
                                                        tId: 'avatarImg',
                                                        offset: {
                                                            x: 0,
                                                            y: 48
                                                        }
                                                    }))
                                                })
                                            }
                                        })
                                    break
                                case 'group':
                                case 'skill':
                                    // 拼团、秒杀
                                    postArr.push( // 标题
                                        {
                                            type: 'text',
                                            text: this.title,
                                            size: 26,
                                            color: '#333',
                                            serialNum: 11,
                                            textBaseline: 'top',
                                            zIndex: 2,
                                            id: 'posterName', // 自定义标识
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    const shareImgInfo = this.getNodeInfo(drawArray, 'shareImg')
                                                    resolve({
                                                        ...this.dynamicCalcLocal({
                                                            drawArray,
                                                            rId: 'shareImg',
                                                            tId: 'posterName',
                                                            offset: {
                                                                x: 24,
                                                                y: 24
                                                            }
                                                        }),
                                                        lineFeed: {
                                                            maxWidth: shareImgInfo.width - 48,
                                                            lineHeight: 38,
                                                            lineNum: 2
                                                        }
                                                    })
                                                })
                                            }
                                        },
                                        // 售价符号
                                        {
                                            type: 'text',
                                            text: this.goodsInfo.price_show ? this.pricePrefix_ : '',
                                            size: 26,
                                            color: this.colors_.theme,
                                            textAlign: 'left',
                                            textBaseline: 'top',
                                            serialNum: 16,
                                            lineFeed: {
                                                lineHeight: 30
                                            },
                                            id: 'priceShowSymbol', // 自定义标识
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'posterName',
                                                        tId: 'priceShowSymbol',
                                                        offset: {
                                                            x: 0,
                                                            y: 14
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        // 售价
                                        {
                                            type: 'text',
                                            text: this.goodsInfo.price_show,
                                            size: 40,
                                            color: this.colors_.theme,
                                            textAlign: 'left',
                                            textBaseline: 'top',
                                            fontFamily: 'd-din',
                                            lineFeed: {
                                                lineHeight: 40
                                            },
                                            serialNum: 17,
                                            id: 'priceShow', // 自定义标识
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'priceShowSymbol',
                                                        tId: 'priceShow',
                                                        isSameLine: true,
                                                        offset: {
                                                            x: 0,
                                                            y: -12
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        // 售价单位
                                        {
                                            type: 'text',
                                            text: this.goodsInfo.price_show ? this.goodsInfo.price_show_unit : '',
                                            size: 24,
                                            color: this.colors_.theme,
                                            textAlign: 'left',
                                            textBaseline: 'top',
                                            serialNum: 18,
                                            id: 'priceShowUnit', // 自定义标识
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'priceShow',
                                                        tId: 'priceShowUnit',
                                                        isSameLine: true,
                                                        offset: {
                                                            x: 0,
                                                            y: 10
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        // 市场格
                                        {
                                            type: 'text',
                                            text: this.goodsInfo.price_market ? `${this.pricePrefix_}${this.goodsInfo.price_market}${this.goodsInfo.price_show_unit}` : '',
                                            size: 24,
                                            color: '#999',
                                            textAlign: 'left',
                                            textBaseline: 'top',
                                            serialNum: 19,
                                            fontFamily: this.goodsInfo.price_show_unit ? 'sans-serif' : 'd-din',
                                            lineFeed: {
                                                lineHeight: 24
                                            },
                                            lineThrough: {
                                                width: 1,
                                                color: '#999'
                                            },
                                            id: 'priceMarket', // 自定义标识
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'priceShowUnit',
                                                        tId: 'priceMarket',
                                                        isSameLine: true,
                                                        offset: {
                                                            x: 8,
                                                            y: 2
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        // 拼团件数
                                        {
                                            type: 'text',
                                            text: this.goodsInfo.group_sales,
                                            size: 24,
                                            color: '#333',
                                            textAlign: 'right',
                                            textBaseline: 'top',
                                            serialNum: 19,
                                            lineFeed: {
                                                lineHeight: 24
                                            },
                                            id: 'groupSales', // 自定义标识
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    const posterNameInfo = this.getNodeInfo(drawArray, 'posterName')
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'posterName',
                                                        tId: 'groupSales',
                                                        offset: {
                                                            x: posterNameInfo.width,
                                                            y: 16
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        // 角标
                                        {
                                            type: 'image',
                                            url: this.proxyImgUrl_ + this.$config.ossImgUrl + 'share/angle-mark.png',
                                            dWidth: 85,
                                            dHeight: 90,
                                            serialNum: 11,
                                            zIndex: 2,
                                            id: 'angleMark',
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    const shareImgInfo = this.getNodeInfo(drawArray, 'shareImg')
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'shareImg',
                                                        tId: 'angleMark',
                                                        isSameLine: true,
                                                        offset: {
                                                            x: -shareImgInfo.width + 34,
                                                            y: 0
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        {
                                            type: 'text',
                                            text: this.mode === 'skill' ? '限时秒杀' : '拼团',
                                            size: 26,
                                            color: '#FFE3B2',
                                            textAlign: 'right',
                                            textBaseline: 'top',
                                            serialNum: 12,
                                            lineFeed: {
                                                lineHeight: 28,
                                                lineNum: 2,
                                                maxWidth: 52
                                            },
                                            zIndex: 3,
                                            id: 'angleMarkText', // 自定义标识
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'angleMark',
                                                        tId: 'angleMarkText',
                                                        isSameLine: true,
                                                        offset: {
                                                            x: -16,
                                                            y: 10
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        {
                                            type: 'text',
                                            text: this.goodsInfo.joint_quantity,
                                            size: 20,
                                            color: '#FFE3B2',
                                            textAlign: 'center',
                                            textBaseline: 'top',
                                            serialNum: 12,
                                            zIndex: 3,
                                            id: 'jointQuantity', // 自定义标识
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve, reject) => {
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'angleMark',
                                                        tId: 'jointQuantity',
                                                        isSameLine: true,
                                                        offset: {
                                                            x: this.mode === 'skill' ? 999999 : -43,
                                                            y: 40
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        // 二维码
                                        {
                                            type: 'image',
                                            url: this.proxyImgUrl_ + this.qrCode,
                                            ...qrcodeInfo,
                                            serialNum: 100,
                                            id: 'imgBarcode',
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    const posterNameInfo = this.getNodeInfo(drawArray, 'posterName')
                                                    let offsetY = 50
                                                    let offsetX = 12
                                                    // #ifndef H5
                                                    offsetY = 62
                                                    offsetX = 0
                                                    // #endif
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'posterName',
                                                        tId: 'imgBarcode',
                                                        offset: {
                                                            x: posterNameInfo.width - qrcodeInfo.dWidth + offsetX,
                                                            y: offsetY
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        // 长按识别
                                        {
                                            type: 'text',
                                            text: this.summary,
                                            size: 20,
                                            color: '#999',
                                            textAlign: 'right',
                                            serialNum: 101,
                                            lineFeed: {
                                                lineHeight: 28,
                                                lineNum: 2,
                                                maxWidth: 100
                                            },
                                            id: 'longTips', // 自定义标识
                                            allInfoCallback: ({ drawArray }) => {
                                                const posterNameInfo = this.getNodeInfo(drawArray, 'posterName')
                                                return new Promise((resolve) => {
                                                    let offsetY = 92
                                                    let offsetX = -12
                                                    // #ifndef H5
                                                    offsetY = 84
                                                    offsetX = 0
                                                    // #endif
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'posterName',
                                                        tId: 'longTips',
                                                        offset: {
                                                            x: posterNameInfo.width - (qrcodeInfo.dWidth + offsetX),
                                                            y: offsetY
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        // 分隔线
                                        {
                                            type: 'fillRect',
                                            backgroundColor: '#DFDFDF',
                                            width: 1,
                                            height: 76,
                                            serialNum: 102,
                                            id: 'line',
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'longTips',
                                                        tId: 'line',
                                                        isSameLine: true,
                                                        offset: {
                                                            x: -214,
                                                            y: -28
                                                        }
                                                    }))
                                                })
                                            }
                                        },
                                        // 头像
                                        {
                                            type: 'image',
                                            url: this.proxyImgUrl_ + this.userInfo.user_picture,
                                            dWidth: 58,
                                            dHeight: 58,
                                            circleSet: true,
                                            zIndex: 2,
                                            serialNum: 101, // 这个值只要大于类型type非image的个数就行
                                            id: 'avatarImg',
                                            allInfoCallback: ({ drawArray }) => {
                                                return new Promise((resolve) => {
                                                    resolve(this.dynamicCalcLocal({
                                                        drawArray,
                                                        rId: 'posterName',
                                                        tId: 'avatarImg',
                                                        offset: {
                                                            x: 0,
                                                            y: 84
                                                        }
                                                    }))
                                                })
                                            }
                                        })
                                    break
                                default:
                                    break
                            }
                            // 底部引导图
                            if (this.showStep) {
                                postArr.push({
                                    type: 'image',
                                    url: this.proxyImgUrl_ + this.$config.ossImgUrl + 'share/boot-step.png',
                                    dx: ctxPadding,
                                    dWidth: posterWidth - 2 * ctxPadding,
                                    dHeight: 82,
                                    roundRectSet: {
                                        r: [0, 0, 16, 16]
                                    },
                                    serialNum: 999,
                                    id: 'showStep',
                                    allInfoCallback: ({ drawArray }) => {
                                        const height = Math.max.apply(null, drawArray.map(o => {
                                            return this.getNodeHeight(drawArray, o.id, 'showStep')
                                        }))
                                        let disHeight = 10
                                        // #ifndef H5
                                        disHeight = 24
                                        // #endif
                                        return {
                                            dy: height + disHeight
                                        }
                                    }
                                })
                            }
                            if (this.showBorder_) {
                                // 边框
                                postArr.push({
                                    color: '#EDEDED',
                                    type: 'roundStrokeRect',
                                    lineWidth: 1,
                                    dx: ctxPadding,
                                    dy: ctxPadding,
                                    r: 16,
                                    width: posterWidth - 2 * ctxPadding,
                                    height: 0,
                                    serialNum: 9999,
                                    allInfoCallback: ({ drawArray }) => {
                                        return {
                                            height: Math.max.apply(null, drawArray.map(o => {
                                                return this.getNodeHeight(drawArray, o.id)
                                            })) + (this.showStep ? 0 : 12)
                                        }
                                    }
                                })
                            }
                            rs(postArr)
                        })
                    },
                    drawBefore: ({ drawArray }) => {
                        const height = Math.max.apply(null, drawArray.map(o => {
                            return this.getNodeHeight(drawArray, o.id)
                        }))
                        return {
                            posterWidth,
                            height: height + ctxPadding + (this.showStep ? 0 : 12)
                        }
                    },
                    setCanvasWH: async ({ bgObj }) => {
                        // 为动态设置画布宽高的方法，
                        this.poster = bgObj
                    },
                    setCanvasToTempFilePath(bgObj) { // 这里是为了解决CanvasToTempFilePath生成的图片模糊的情况
                        return {
                            quality: 1,
                            destWidth: bgObj.width * systemInfo.pixelRatio,
                            destHeight: bgObj.height * systemInfo.pixelRatio
                        }
                    }
                })
                this.poster.finalPath = d.poster.tempFilePath
            } catch (e) {
                this.$toast(JSON.stringify(e))
            }
        },
        getNodeInfo(drawArray, nodeId) {
            const nodeInfo = drawArray.find(o => o.id === nodeId)
            if (!nodeInfo) return {}
            // 组件高度
            const { lineFeed = {}, textLength, dHeight, height: rHeight, dWidth, width: rWidth, size } = nodeInfo
            let width = textLength || dWidth || rWidth || 1
            width = lineFeed.maxWidth || width
            const lineHeight = lineFeed.lineHeight || size
            const lineNum = Math.ceil(textLength / width)
            const height = rHeight || dHeight || lineNum * lineHeight
            return {
                ...nodeInfo,
                lineNum,
                width,
                height
            }
        },
        getNodeHeight(drawArray, nodeId, filterId) {
            const nodeInfo = drawArray.find(o => o.id === nodeId)
            if (!nodeInfo || nodeId === filterId) return 0
            // 组件高度
            const { lineFeed = {}, size, textLength, dHeight, height: rHeight, dWidth, width: rWidth, dy } = nodeInfo
            let height = rHeight
            if (nodeInfo.type === 'text') {
                const textLineHeight = lineFeed.lineHeight || size
                // 参照物最大宽度
                // 参照物宽
                const width = textLength || dWidth || rWidth || 1
                const maxWidth = lineFeed.maxWidth || width || 0
                let lineNum = maxWidth ? Math.ceil(width / maxWidth) : 0
                lineNum = lineNum > lineFeed.lineNum && lineFeed.lineNum !== -1 ? lineFeed.lineNum : lineNum
                height = Math.ceil(lineNum * textLineHeight)
            } else if (nodeInfo.type === 'image') {
                height = dHeight
            }
            return height + dy
        },
        /**
        * 动态计算元素位置
        * drawArray {Array}全部的绘画数组
        * tId {String}目标id
        * rId {String}参照物id
        * isSameLine 是否处于同一行
        * offset {Object}距离参照物的dy偏移量
        *        x  左右偏移量
        *        y  上下偏移量
        */
        dynamicCalcLocal({
            drawArray,
            tId,
            rId,
            isSameLine = false,
            offset = {
                x: 0,
                y: 0
            }
        }) {
            rId = rId || tId
            // 目标对象
            const tEl = drawArray.find(item => item.id === tId)
            !tEl && console.error(`目标元素${tId}不存在`)
            // 参照对象，参照物可能为空
            const rEl = drawArray.find(item => item.id === rId)
            !rEl && console.error(`参照元素${rId}不存在(${tId})`)
            // 如果参展物为空，这边默认有边距
            const { lineFeed = {} } = rEl || {
                dx: 24,
                dy: 24
            }
            // 参照物宽
            const rWidth = rEl.textLength || rEl.dWidth || 1
            // 参照物最大宽度
            const rMaxWidth = lineFeed.maxWidth || rWidth || 0
            // 参照物长度
            const rLineHeight = lineFeed.lineHeight || rEl.size || 0
            // 参照物行数
            let rLineNum = rMaxWidth ? Math.ceil(rWidth / rMaxWidth) : 0
            rLineNum = rLineNum > lineFeed.lineNum && lineFeed.lineNum !== -1 ? lineFeed.lineNum : rLineNum
            // 参照物高度
            const rHeight = rEl.type === 'image' ? rEl.dHeight : rLineNum * rLineHeight
            // 偏移量
            const offsetX = offset.x || 0
            const offsetY = offset.y || 0
            tEl.dy = rEl.dy + offsetY + (isSameLine ? 0 : rHeight)
            tEl.dx = rEl.dx + offsetX + (isSameLine ? rMaxWidth : 0)
            if (rEl.fontFamily === 'd-din') {
                tEl.dx *= 0.85
            }
            return tEl
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
.share-wechat {
    @include flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    &-hd {
        width: 100%;
        flex: 1;
        height: 50%;
        /* #ifdef H5 */
        padding-top: 24rpx;
        /* #endif */
        /* #ifndef H5 */
        padding-top: calc(24rpx + var(--window-top));
        /* #endif */
        @include flex;
        align-items: center;
        &__box {
            padding: 24rpx;
            border-radius: 16rpx;
            background-color: #fff;
            height: calc(100% - 50rpx);
            @include tst;
        }
        &__text {
            font-size: 26rpx;
            font-weight: 400;
            color: #ffffff;
            line-height: 50rpx;
            letter-spacing: 1px;
            text-align: center;
        }
    }
    &__hide {
        position: fixed;
        top: -99999rpx;
        left: -99999rpx;
        z-index: -99999;
    }
    &-bd {
        background: transparent;
        width: 100%;
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
            width: 100%;
            @include flex(row);
            justify-content: center;
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
    }

    &-menu {
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
            &--small {
                font-size: 24rpx;
            }
        }
        .line-block {
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
        &__item {
            flex: 1;
            @include flex(row);
            align-items: center;
            flex-direction: column;
            background: #ffffff;
            padding: 50rpx 0 46rpx;
            border-radius: 0;
            font-size: 28rpx;

            &::after {
                display: none;
            }
        }
        &__text {
            font-size: 28rpx;
            margin-top: 12rpx;
            color: #333333;
        }
    }
    &-ft {
        padding: 0 24rpx;
        background-color: #fff;
    }
}
</style>
