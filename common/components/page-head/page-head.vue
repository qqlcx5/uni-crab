<template>
    <view>
        <c-colors
            class="c-page-head"
            :class="{ 'c-page-head__fixed': fixed_ }"
            :pro="pro_"
            :theme="theme_"
        >
            <c-status-bar />
            <view
                class="c-page-head__inner"
                :style="[ navbarInnerStyle_ ]"
            >
                <view class="c-page-head-hd">
                    <c-icons
                        v-if="back_"
                        type="zsuicon-tiaozhuan"
                        :size="leftSize_"
                        :color="color"
                        rotate="180"
                        @click="$back"
                    />
                    <slot name="before"></slot>
                </view>
                <view class="c-page-head-bd">
                    <!--这里应该把默认放到slot里去比较好吧？-->
                    <view
                        class="c-page-head__title"
                        :style="[ titleStyle_ ]"
                    >{{ title }}</view>
                    <slot name="title"></slot>
                </view>
                <view
                    class="c-page-head-ft"
                    :style="{ fontSize: rightSize_}"
                >
                    <slot></slot>
                </view>
            </view>
        </c-colors>
        <!-- <view class="c-page-head" :class="{ 'c-page-head__fixed': fixed_ }" :style="[ pageHeadStyle_ ]">
            <c-status-bar />
            <view class="c-page-head__inner" :style="[ navbarInnerStyle_ ]">
                <view class="c-page-head-hd">
                    <c-icons @click="$back" type="zsuicon-tiaozhuan" :size="leftSize_" :color="color" rotate="180" v-if="back_" />
                    <slot name="before"></slot>
                </view>
                <view class="c-page-head-bd">
                    <view class="c-page-head__title" :style="[ titleStyle_ ]">{{ title }}</view>
                    <slot name="title"></slot>
                </view>
                <view class="c-page-head-ft" :style="{ fontSize: rightSize_}">
                    <slot></slot>
                </view>
            </view>
        </view> -->
        <view
            class="c-page-head__clear"
            :style="{height: navbarHeight_ + 'px'}"
        ></view>
    </view>
</template>

<script>
// 获取系统状态栏的高度
const systemInfo = uni.getSystemInfoSync()
let menuButtonInfo = {}
// 如果是小程序，获取右上角胶囊的尺寸信息，避免导航栏右侧内容与胶囊重叠(支付宝小程序非本API，尚未兼容)
// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
menuButtonInfo = uni.getMenuButtonBoundingClientRect()
// #endif
export default {
    props: {
        // 导航栏高度，单位px，非rpx
        height: {
            type: [String, Number],
            default: ''
        },
        /**
         * 默认背景颜色
         * 不滚动的时候显示的颜色，不设置滚动渐变的话 会一直是这个颜色
        */
        bgColor: {
            type: String,
            default: 'transparent'
        },
        /**
         * 下拉滚动的时候是否变色
         * 支持渐变，这是开始颜色
         * 不渐变的话不设置endColor
        */
        startColor: {
            type: String,
            default: ''
        },
        /**
         * 下拉滚动的时候是否变色
         * 支持渐变，这是结束颜色
         * 不渐变的话不设置endColor
        */
        endColor: {
            type: String,
            default: ''
        },
        /**
         * 下拉滚动的时候渐变角度
         * 默认90deg，只有设置了startColor和endColor才会生效
        */
        gradientDeg: {
            type: String,
            default: '90deg'
        },
        /**
         * 是否固定在顶部
         * 默认为true，固定在顶部
         * 会自动占位，页面不需要清楚占位
        */
        fixed: {
            type: [Boolean, String],
            default: true
        },
        /**
         * 是否显示返回箭头
         * 默认显示true
        */
        back: {
            type: [Boolean, String],
            default: true
        },
        // 是否开启渐变显示title
        gradientTiele: {
            type: [Boolean, String],
            default: false
        },
        /**
         * header的字体颜色
         * 默认显示#fff
        */
        color: {
            type: String,
            default: '#fff'
        },
        /**
         * title即页面标题
        */
        title: {
            type: String,
            default: ''
        },
        /**
         * title的字体大小
         * 默认为32
        */
        titleSize: {
            type: [String, Number],
            default: 32
        },
        /**
         * header-ft的字体颜色
        */
        rightSize: {
            type: [String, Number],
            default: 26
        },
        /**
         * header-hd的字体颜色
        */
        leftSize: {
            type: [String, Number],
            default: 52
        }
    },
    data() {
        return {
            scrollHeight: 0,
            curRouteName: ''// 当前路由名称，由于下面pageShow采用全局监听，页面跳转掉后还能监听到，所以要屏蔽
        }
    },
    computed: {
        height_() {
            // #ifdef APP-PLUS || H5
            return (this.height ? this.height : 44)
            // #endif
            // #ifdef MP
            // 小程序特别处理，让导航栏高度 = 胶囊高度 + 两倍胶囊顶部与状态栏底部的距离之差(相当于同时获得了导航栏底部与胶囊底部的距离)
            // 此方法有缺陷，暂不用(会导致少了几个px)，采用直接固定值的方式
            // eslint-disable-next-line no-unreachable
            return menuButtonInfo.height + (menuButtonInfo.top - systemInfo.statusBarHeight) * 2// 导航高度
            // let height = systemInfo.platform === 'ios' ? 44 : 48;
            // return this.height ? this.height : height;
            // #endif
        },
        // 要清空顶部的高度
        navbarHeight_() {
            return this.height_ + systemInfo.statusBarHeight
        },
        gradientTiele_() {
            return String(this.gradientTiele) !== 'false'
        },
        // 导航栏内部盒子的样式
        navbarInnerStyle_() {
            const style = {
                height: this.height_ + 'px',
                color: !this.gradientTiele_ ? this.color : !this.startColor && !this.endColor ? this.color : this.$c.colorToRgba(this.color, this.scrollHeight / 44)
            }
            // 导航栏宽度，如果在小程序下，导航栏宽度为胶囊的左边到屏幕左边的距离
            // 如果是各家小程序，导航栏内部的宽度需要减少右边胶囊的宽度
            // #ifdef MP
            const rightButtonWidth = systemInfo.windowWidth - menuButtonInfo.left
            style.marginRight = rightButtonWidth + 'px'
            // #endif
            return style
        },
        titleStyle_() {
            let titleSize = this.titleSize / 2; let fontWeight = 'bold'
            // #ifdef MP
            let maxSize = this.navHeight_ / 2
            maxSize = maxSize > 28 ? maxSize : 28
            titleSize = titleSize > maxSize ? maxSize : titleSize
            if (systemInfo.platform !== 'devtools' && systemInfo.model.indexOf('iPad') !== -1 && systemInfo.windowWidth >= 768) {
                titleSize = this.menuButtonInfo.height - 14
            }
            fontWeight = systemInfo.platform === 'ios' ? 'bold' : 400
            // #endif
            return {
                fontSize: titleSize + 'px',
                fontWeight
            }
        },
        rightSize_() {
            // #ifdef MP
            let maxSize = this.height_ / 2
            maxSize = maxSize > 26 ? maxSize : 26
            maxSize = this.rightSize > maxSize ? maxSize : this.rightSize
            return maxSize + 'px'
            // #endif
            // #ifndef  MP
            // eslint-disable-next-line no-unreachable
            return this.rightSize / 2 + 'px'
            // #endif
        },
        leftSize_() {
            // #ifdef MP
            let maxSize = this.height_ / 2
            maxSize = maxSize > 26 ? maxSize : 26
            maxSize = this.leftSize > maxSize ? maxSize : this.leftSize
            return maxSize + 'px'
            // #endif
            // #ifndef  MP
            // eslint-disable-next-line no-unreachable
            return this.leftSize / 2 + 'px'
            // #endif
        },
        back_() {
            return String(this.back) !== 'false'
        },
        fixed_() {
            return String(this.fixed) !== 'false'
        },
        pro_() {
            return !this.endColor || !this.startColor ? ['bgc'] : ['bglg']
        },
        theme_() {
            if (!this.startColor && !this.endColor || this.scrollHeight === 0) {
                return [this.bgColor || 't']
            }
            const hex = this.scrollHeight > 44 ? 1 : ((this.scrollHeight < 10 ? '0.0' : '0.') + (this.scrollHeight * 2))
            if (!this.endColor || !this.startColor) {
                const backgroundColor = this.startColor || this.endColor || 't'
                return [`${backgroundColor}|${hex}`]
            } else {
                const startColor = this.startColor.length > 1 ? this.$c.colorToRgba(this.startColor, hex) : this.startColor
                const endColor = this.endColor.length > 1 ? this.$c.colorToRgba(this.endColor, hex) : this.endColor
                return [`${this.gradientDeg}|${startColor}|${endColor}`]
            }
        }
    },
    created() {
        if (this.startColor || this.endColor) {
            const that = this
            that.curRouteName = that.$Route.name
            uni.$on('pageScroll', (e) => {
                that.curRouteName === that.$Route.name && (this.scrollHeight = e.scrollTop / 2)
            })
        }
    }
}
</script>

<style lang="scss">
.c-page-head {
    z-index: 998;
    @include tst();
    &__inner {
        @include flex(row);
        justify-content: space-between;
        color: #fff;
        padding: 7px 3px;
        background-color: transparent;
        transition-property: all;
        overflow: hidden;
    }
    &__fixed {
        @include fixed(0, var(--window-right), null, var(--window-left));
    }

    &__clear {
        display: block;
        width: 100%;
        @include iosSafeArea(height, 44px, top);
    }

    &-bd {
        position: absolute;
        left: 70px;
        right: 70px;
        min-width: 0;
        user-select: auto;
    }

    &-hd,
    &-ft {
        @include flex(row);
        align-items: center;
        font-size: 16px;
        height: 30px;
    }

    &-ft {
        flex-direction: row-reverse;
        font-size: 13px;
    }

    &__title {
        font-weight: bold;
        font-size: 16px;
        line-height: 30px;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}
</style>
