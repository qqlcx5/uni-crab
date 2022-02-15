<template>
    <view v-if="popupFlag">
        <!-- 清楚浮动 -->
        <view
            class="c-fixed-menu"
            :class="[`c-fixed-menu--${position}`]"
            :style="[parentStyle_]"
        >
        </view>
        <!-- 主要内容体 -->
        <view
            :class="[
                `c-${position}-menu__fixed`,
                innerPopupFlag ? 'c-fixed-menu--active' : '',
                hasBorder_
                    ? position === 'top'
                        ? ' c-underline'
                        : ' c-underline__top'
                    : '',
            ]"
            :style="[childrenStyle_]"
        >
            <c-colors
                :pro="['bgc']"
                :theme="[bgColor]"
            >
                <view :style="[colorStyle_]">
                    <slot></slot>
                </view>
            </c-colors>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        destroyEle: {
            type: [String, Boolean],
            default: false
        },
        // 浮动方向,值为top或者bottom
        position: {
            type: String,
            default: 'top'
        },
        // 清楚浮动的高度,支持rpx px,不写单位默认为rpx
        height: {
            type: [String, Number],
            default: 88
        },
        // 固定底部高度	
        fixedHeight: {
            type: [String, Number],
            default: 'inherit'
        },
        // 是否浮动显示	
        value: {
            type: Boolean,
            default: true
        },
        // 背景颜色	
        bgColor: {
            type: String,
            default: '#fff'
        },
        // 是否显示描边	
        border: {
            type: [Boolean, String],
            default: false
        },
        // 距离顶部的距离 次参数会覆盖hasNav_
        top: {
            type: [String, Number],
            default: 0
        },
        // 是否留出底部tabbar位置
        hasTab: {
            type: [Boolean, String],
            default: false
        },
        // 动画时长 单位ms  300ms = 0.3s
        duration: {
            type: [String, Number],
            default: 300
        },
        // 是否留出顶部标题位置
        hasNav: {
            type: [Boolean, String],
            default: true
        }
    },
    data() {
        return {
            paddingTop: '0px',
            paddingRight: 0,
            popupFlag: false,
            innerPopupFlag: false,
            isFirst: true
        }
    },
    computed: {
        hasNav_() {
            return String(this.hasNav) !== 'false'
        },
        hasBorder_() {
            return String(this.border) !== 'false'
        },
        hasTab_() {
            return String(this.hasTab) !== 'false'
        },
        destroyEle_() {
            return String(this.destroyEle) !== 'false'
        },
        fixedHeight_() {
            return this.$c.formatUnit(
                this.fixedHeight === 'auto'
                    ? 'auto'
                    : this.fixedHeight === 'inherit'
                        ? this.height
                        : this.fixedHeight
            )
        },
        height_() {
            if (!this.value) return '0px'
            return this.$c.formatUnit(this.height)
        },
        paddingTop_() {
            return this.hasNav_ ? '0px' : this.paddingTop
        },
        parentStyle_() {
            // 浮动在顶部,并且清除没有高度
            const zeroFixedHeight = !!['0rpx', '0', '0px'].includes(
                String(this.fixedHeight)
            )
            const parentStyle = {
                height: zeroFixedHeight
                    ? 0
                    : `calc(${this.fixedHeight !== 'inherit'
                        ? this.fixedHeight_
                        : this.height_
                    } + ${this.paddingTop_})`
            }
            if (this.height_ === '0px') {
                parentStyle[
                    this.position === 'bottom' ? 'paddingBottom' : 'paddingTop'
                ] = '0px'
            }
            return parentStyle
        },
        childrenStyle_() {
            const childrenStyle = {
                transitionDuration: `${this.duration}ms`,
                ...this.parentStyle_,
                height: `calc(${this.height_} + ${this.paddingTop_})`,
                backgroundColor: this.bgColor
            }
            this.hasNav_ ? '' : (childrenStyle.top = 0)
            this.top ? (childrenStyle.top = this.top + 'rpx') : ''
            this.value &&
                this.hasTab_ &&
                (childrenStyle.transform = `translateY(${this.hasTab_ ? '-50px' : 0
                    })`)
            return childrenStyle
        },
        colorStyle_() {
            return {
                paddingTop: this.paddingTop_,
                height: this.childrenStyle_.height
            }
        }
    },
    watch: {
        value: {
            handler(val) {
                val ? this.open() : this.close()
                this.isFirst = false
            },
            immediate: true
        }
    },
    created() {
        // console.log('呵呵呵呵呵');
        const systemInfo = uni.getSystemInfoSync()
        // #ifdef MP
        console.log('获取胶囊')
        const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
        console.log(menuButtonInfo)
        this.paddingTop = menuButtonInfo.top + 'px'
        this.paddingRight =
            menuButtonInfo.width +
            (systemInfo.screenWidth - menuButtonInfo.right) +
            'px'
        // #endif
        // #ifdef APP-PLUS
        this.paddingTop = systemInfo.statusBarHeight + 'px'
        // #endif
    },
    methods: {
        open() {
            this.change('popupFlag', 'innerPopupFlag', true)
            return true
        },
        close() {
            this.change('innerPopupFlag', 'popupFlag', false)
            return false
        },
        change(pro1, pro2, status) {
            this[pro1] = status
            if (this.isFirst) {
                // eslint-disable-next-line no-return-assign
                return (this[pro2] = status)
            }
            // 先清空延时函数
            clearTimeout(this.timer)
            this.timer = null
            if (status) {
                // #ifdef H5 || MP
                this.timer = setTimeout(() => {
                    this[pro2] = status
                }, 50)
                // #endif
                // #ifndef H5 || MP
                this.$nextTick(() => {
                    this[pro2] = status
                })
                // #endif
            } else {
                this.timer = setTimeout(() => {
                    this.destroyEle_ ? (this[pro2] = status) : ''
                }, 50)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.c-top-menu__fixed,
.c-bottom-menu__fixed {
    transform: translateY(-120%);
    margin: 0 auto;
    z-index: 20;
    opacity: 0;
    @include tst((opacity, transform));
    // /deep/ button{
    //     width: 160rpx;
    //     height: 72rpx;
    //     border-radius: 8rpx;
    //     font-size: 28rpx;
    //     &::after{
    //         border-radius: 16rpx;
    //     }
    //     &.full-width{
    //         border-radius: 16rpx;
    //         font-size: 32rpx;
    //         height: 88rpx;
    //         &::after{
    //             border-radius: 32rpx;
    //         }
    //     }
    // }
}

.c-top-menu__fixed {
    @include fixed(0, var(--window-right), null, var(--window-left));
    /* #ifdef H5 */
    @include iosSafeArea(top, 44px, top);
    /* #endif */
    /* #ifndef H5 */
    @include iosSafeArea(top, 0px, top);
    /* #endif */
}

.c-bottom-menu__fixed {
    box-sizing: content-box;
    transform: translateY(120%);
    @include fixed(null, var(--window-right), 0, var(--window-left));
    @include iosSafeArea(padding, 0px, bottom, bottom);
}

.c-fixed-menu {
    box-sizing: content-box;

    &--bottom {
        @include iosSafeArea(padding, 0px, bottom, bottom);
    }

    &--active {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
