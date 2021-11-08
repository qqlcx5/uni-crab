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
        <view
            v-if="!loadStatus && showLoading"
            class="c-image__icon"
        >
            <c-loading color="#999"></c-loading>
        </view>
    </view>
</template>

<script>
// #ifdef APP-PLUS-NVUE
import config from '../../config'
import { formatUnit } from '../../utils'
// #endif
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
            type: Object,
            default: () => {
                return {}
            }
        },
        // 淡入淡出动画的过渡时间
        duration: {
            type: [Number, String],
            default: 300
        },
        showMenuByLongpress: {
            type: [String, Boolean],
            default: false
        }
    },
    data() {
        return {
            errorFlag: false,
            opacity: 0,
            loadStatus: false,
            time: 0
        }
    },
    computed: {
        isEffect_() {
            return String(this.effect) !== 'false'
        },
        maxHeight_() {
            return this.maxHeight ? this.$c.formatUnit(this.maxHeight) : null
        },
        style_() {
            const size = this.$c.formatUnit(this.size)
            const width = this.mode_ === 'heightFix' ? 'auto' : this.$c.formatUnit(this.width, 'rpx', size)
            const height = this.$c.formatUnit(this.height, 'rpx', size)
            // 如果含有空格 说明已经计算过了
            const radius = this.shape === 'circle' ? '50%' : this.$c.formatUnit(this.radius)
            let style = {
                width: width,
                borderRadius: radius
            }
            if (Object.keys(this.border).length) {
                style = Object.assign({}, style, this.border)
            }
            // #ifndef APP-PLUS-NVUE
            style.height = this.mode_ === 'widthFix' ? 'auto' : height;
            // #endif
            // #ifdef APP-PLUS-NVUE
            (this.mode !== 'widthFix' || this.height) && (style.height = height)
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
            return parentStyle
        },
        static_() {
            return String(this.static) !== 'false'
        },
        showMenuByLongpress_() {
            return String(this.showMenuByLongpress) !== 'false'
        },
        errSrc_() {
            let errSrc
            // #ifdef APP-PLUS-NVUE
            errSrc = this.errSrc ? this.errSrc : config ? config.errorImg : ''
            // #endif
            // #ifndef APP-PLUS-NVUE
            errSrc = this.errSrc ? this.errSrc : this.$config ? this.$config.errorImg : ''
            // #endif
            return this.getFullOssImg(errSrc)
        },
        imgUrl_() {
            const url = (this.src ? this.src : this.errSrc_)
            return this.errorFlag ? this.errSrc_ : this.static_ ? url : this.getFullOssImg(url)
        },
        mode_() {
            return this.mode
            // const size = this.$c.formatUnit(this.size)
            // const width = this.$c.formatUnit(this.width, 'rpx', size)
            // const height = this.$c.formatUnit(this.height, 'rpx', size)
            // return width.indexOf('%') !== -1 && height.indexOf('%') !== -1 ? 'widthFix' : this.mode
        }
    },
    watch: {
        loadStatus(val) {
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
                }
            },
            immediate: true
        }
    },
    created() {
        // #ifdef APP-PLUS-NVUE
        !this.$config ? (this.$config = {}) : ''
        this.$config = config
        !this.$c ? (this.$c = {}) : ''
        this.$c.formatUnit = formatUnit
        // #endif
    },
    methods: {
        getFullOssImg(url) {
            if (url.indexOf('data:image') !== -1 || url.indexOf('wxfile:') !== -1 || url.indexOf('file:') !== -1 || url.indexOf('_doc') !== -1) {
                return url
            } else if (/(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g.test(url)) {
                return url
            } else {
                // #ifdef APP-PLUS-NVUE
                return (config ? config.ossImgUrl : '') + url
                // #endif
                // #ifndef APP-PLUS-NVUE
                return (this.$config ? this.$config.ossImgUrl : '') + url
                // #endif
            }
        },
        imgLoaded(e) {
            if (!this.loadStatus) {
                this.loadStatus = true
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
    overflow: hidden;
    position: relative;

    &__image {
        width: 100%;
        height: 100%;
    }

    &__icon {
        @include siteCenter;
        z-index: 2;
    }
}
</style>
