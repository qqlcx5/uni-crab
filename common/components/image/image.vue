<template>
    <view
        class="c-image"
        :style="[parentStyle_]"
        @click="onClick"
    >
        <image
            v-if="imgUrl_"
            :style="[style_]"
            :src="imgUrl_"
            lazy-load
            class="c-image__image"
            :mode="mode_"
            :show-menu-by-longpress="showMenuByLongpress_"
            @load="imgLoaded"
            @error="imgError"
        ></image>
        <text
            v-if="border_"
            class="c-image__border"
            :style="[borderStyle_]"
        ></text>
        <view
            v-if="!loadStatus && showLoading"
            class="c-image__icon"
        >
            <c-loading color="#999"></c-loading>
        </view>
    </view>
</template>

<script>
/**
 * props下面的宽高圆角都只支持rpx  不要传单位进来
 */
export default {
    name: 'CImage',
    props: {
        /**
         * 同image的modem,如果设置宽高为百分比  mode设置会失效变成widthFix
         */
        mode: {
            type: String,
            default: 'scaleToFill'
        },
        // 是否显示加载中
        showLoading: {
            type: [String, Boolean],
            default: false
        },
        // 加载中字号大小
        loadingSize: {
            type: [String, Number],
            default: 50
        },
        // 错误图片地址
        errSrc: {
            type: String,
            default: ''
        },
        // 不建议设置百分比,没有设置width或height就会取size的值
        size: {
            type: [String, Number],
            default: '100%'
        },
        // 图片的宽
        width: {
            type: [String, Number],
            default: 0
        },
        // 图片形状 值circle 和 square
        shape: {
            type: String,
            default: 'square'
        },
        // 图片的高
        height: {
            type: [String, Number],
            default: 0
        },
        // 高度是否自动
        heightAuto: {
            type: Boolean,
            default: true
        },
        // 图片的最大高
        maxHeight: {
            type: [String, Number],
            default: 0
        },
        // 图片地址,支持静态地址,网络地址
        src: {
            type: String,
            default: ''
        },
        // 图片圆角,解决app端问题，如果设置了shape为circle，该属性就失效了
        radius: {
            type: [String, Number],
            default: 0
        },
        // 是否是本地静态图片
        static: {
            type: [String, Boolean],
            default: false
        },
        // 背景颜色	
        bgColor: {
            type: String,
            default: 'transparent'
        },
        // 是否使用过渡效果
        effect: {
            type: Boolean,
            default: false
        },
        // 是否有边框
        border: {
            type: [Boolean, String],
            default: false
        },
        // 边框颜色
        borderColor: {
            type: String,
            default: '#fff'
        },
        // 淡入淡出动画的过渡时间
        duration: {
            type: [Number, String],
            default: 300
        },
        // 是否开启图片长按识别小程序码菜单
        showMenuByLongpress: {
            type: [String, Boolean],
            default: false
        },
        // 可选值有normal/update
        type: {
            type: String,
            default: 'normal'
        }
    },
    data() {
        return {
            errorFlag: false,
            opacity: 0,
            loadStatus: false,
            time: 0,
            oWidth: 0
        }
    },
    computed: {

        isEffect_() {
            return String(this.effect) !== 'false'
        },
        maxHeight_() {
            return this.maxHeight ? this.$c.formatUnit(this.maxHeight) : null
        },
        size_() {
            return this.$c.formatUnit(this.size, 'rpx')
        },
        width_() {
            return this.mode_ === 'heightFix' ? 'auto' : this.$c.formatUnit(this.width, 'rpx', this.size_)
        },
        height_() {
            return this.mode_ === 'widthFix' ? 'auto' : this.$c.formatUnit(this.height, 'rpx', this.size_)
        },
        style_() {
            const radius = this.shape === 'circle' ? '50%' : this.$c.formatUnit(this.radius)
            const style = {
                width: this.width_,
                borderRadius: radius
            }
            // #ifndef APP-PLUS-NVUE
            style.height = this.mode_ === 'widthFix' && this.heightAuto ? 'auto' : this.height_;

            // #endif
            // #ifdef APP-PLUS-NVUE
            (this.mode !== 'widthFix' || this.height) && (style.height = this.height_)
            // #endif
            return style
        },
        parentStyle_() {
            const parentStyle = {
                maxHeight: this.maxHeight_,
                backgroundColor: this.bgColor,
                ...this.style_
            }
            if (this.isEffect_) {
                parentStyle.opacity = this.opacity
                parentStyle.transition = `opacity ${this.time / 1000}s ease-in-out`
            } else {
                parentStyle.opacity = 1
            }
            if (this.errorFlag) {
                parentStyle.height = this.$c.formatUnit(this.height, 'rpx', this.size_)
                parentStyle.backgroundColor = '#f5f5f5'
            }
            // 当关闭自动高度的时候 改变垂直居中方式
            !this.heightAuto && (parentStyle.alignItems = 'flex-start')
            return parentStyle
        },
        static_() {
            return String(this.static) !== 'false'
        },
        showMenuByLongpress_() {
            return String(this.showMenuByLongpress) !== 'false'
        },
        errSrc_() {
            if (this.errSrc) return this.getFullOssImg(this.errSrc, 'normal')
            const oWidth = parseInt(this.oWidth)
            const imgList = ['err-img/200_200.png', 'err-img/256_192.png', 'err-img/339_339.png', 'err-img/500_500.png', 'err-img/506_380.png', 'err-img/702_180.png', 'err-img/750_563.png', 'err-img/750_750.png']
            if (!oWidth) return this.getFullOssImg(imgList[0], 'normal')
            const oHeight = parseInt(this.$c.formatUnit(this.height, 'rpx', this.size_))
            const imgInfoList = imgList.map((o, i) => {
                const info = o.split('/').pop().split('.').shift().split('_')
                const width = Number(info[0])
                const height = Number(info[1])
                return {
                    id: i,
                    src: o.src,
                    width,
                    height,
                    ratio: parseInt(width * 1000 / height)
                }
            })
            let compareNum = 0
            let curErrSrc = ''
            // 只知道宽或者高
            if (oWidth === 'auto' || oHeight === 'auto') {
                const heightArr = imgInfoList.map(o => o.height).sort((a, b) => a - b)
                const widthArr = imgInfoList.map(o => o.height).sort((a, b) => a - b)
                compareNum = oWidth === 'auto' ? oHeight : oWidth
                const compareArr = oWidth === 'auto' ? heightArr : widthArr
                const curIndex = compareArr.findIndex(o => {
                    if (compareNum > o * 0.95 || compareNum < o * 1.05) {
                        return true
                    }
                    return false
                })
                curErrSrc = imgList[curIndex === -1 ? 0 : curIndex]
            } else {
                // 宽高都已经知道
                const ratio = parseInt(oWidth * 1000 / oHeight)
                // 找到相近的图片
                curErrSrc = imgInfoList.filter(o => o.ratio > ratio * 0.9 && o.ratio < ratio * 1.1).map(o => {
                    return {
                        ...o,
                        disWidth: Math.abs(o.width - oWidth)
                    }
                }).sort((a, b) => a.disWidth - b.disWidth)[0]?.src || imgList[0]
            }
            return this.getFullOssImg(curErrSrc, 'normal')
        },
        imgUrl_() {
            const url = (this.src ? this.src : this.errSrc_)
            return this.errorFlag ? this.errSrc_ : (this.static_ ? url : this.getFullOssImg(url))
        },
        mode_() {
            return this.mode
        },
        border_() {
            return String(this.border) !== 'false'
        },
        borderStyle_() {
            const borderStyle = {}
            if (this.style_.borderRadius) {
                // 所有边框（含单位）
                const borderArr = String(this.style_.borderRadius).split(' ')
                // 所有边框转数字（不含单位）
                const borderNumberArr = borderArr.map(o => parseInt(o))
                // 所有边框的单位
                const borderUnit = borderArr.map((o, i) => o.replace(borderNumberArr[i], ''))
                borderStyle.borderRadius = borderArr.map((o, i) => parseInt(o) * 2 + borderUnit[i]).join(' ')
            }
            borderStyle.borderColor = this.borderColor
            return borderStyle
        }
    },
    watch: {
        loadStatus() {
            // 如果是不开启过渡效果，直接返回
            if (!this.isEffect_) return
            this.time = 0
            // 原来opacity为1(不透明，是为了显示占位图)，改成0(透明，意味着该元素显示的是背景颜色，默认的白色)，再改成1，是为了获得过渡效果
            this.opacity = 0
            // 延时30ms，否则在浏览器H5，过渡效果无效
            setTimeout(() => {
                this.time = this.duration
                this.opacity = 1
            }, 30)
        },
        // 图片路径发生变化时，需要重新标记一些变量，否则会一直卡在某一个状态
        src: {
            handler(val) {
                if (val && this.errSrc_ !== val) {
                    this.errorFlag = false
                    this.loadStatus = false
                    this.getImgRect()
                }
            },
            immediate: true
        }
    },
    methods: {
        async getImgRect() {
            const data = await this.$c.getRect.call(this, '.c-image')
            if (!data) return
            this.oWidth = data.width
        },
        getFullOssImg(url, type = false) {
            if (url.indexOf('data:image') !== -1 || url.indexOf('wxfile:') !== -1 || url.indexOf('file:') !== -1 || url.indexOf('_doc') !== -1) {
                return url
            } else if (/(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g.test(url)) {
                return url
            } else {
                const ossFileName = (type || this.type) === 'normal' ? `/${this.$config?.ossFileName || ''}/` : ''
                return `${this.$config?.ossImgUrl || ''}${ossFileName}${url}`
            }
        },
        imgLoaded() {
            if (!this.loadStatus) {
                this.loadStatus = true
                this.$emit('imgLoaded', this.loadStatus)
            }
        },
        // 图片错误一律按404处理，之后可能分清空
        imgError(e) {
            this.errorFlag = true
            this.loadStatus = false
            setTimeout(() => {
                this.loadStatus = true
            }, 50)
        },
        onClick(e) {
            this.$emit('click', e)
        }
    }
}
</script>

<style lang="scss" scoped>
.c-image {
    @include flex(row);
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    opacity: 0;
    /* #ifdef H5 */
    overflow: hidden;
    /* #endif */
    position: relative;
    &__image {
        width: 100%;
        height: 100%;
    }

    &__icon {
        @include siteCenter;
        z-index: 2;
    }

    &__border {
        content: '';
        width: 198.8%;
        height: 198.8%;
        border: 1px solid rgba(0, 0, 0, 0.2);
        transform: scale(0.5, 0.5);
        position: absolute;
        top: 0;
        left: 0;
        transform-origin: 0 0;
        border-radius: 2 * $border-radius-base;
        z-index: 1;
    }
}
</style>
