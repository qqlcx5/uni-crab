<template>
    <view
        class="c-switch-box"
        @click="switchChange"
    >
        <slot></slot>
        <view
            data-name="switch"
            class="c-switch"
            :style="[style_]"
            :class="{'c-switch__active': switchSel_, 'c-switch__disabled' : disabled}"
        >
            <text
                data-name="text"
                class="c-switch__text c-switch__text_on"
                :style="[textStyle_]"
            >{{ onText }}</text>
            <text
                data-name="text"
                class="c-switch__text c-switch__text_off"
                :style="[textStyle_]"
            >{{ offText }}</text>
            <view
                data-name="slide"
                class="c-switch__slide"
                :style="[slideStyle_]"
            >
                <view class="c-switch__slide-icon">
                    <c-loading
                        v-if="loading_"
                        :color="switchSel_ ? loadingColor : color"
                        :size="38"
                    ></c-loading>
                </view>
            </view>
            <view
                v-if="loading_ && loadingMask_"
                class="c-switch__mask"
                :style="{backgroundColor: maskBg}"
            ></view>
        </view>
        <slot name="right"></slot>
    </view>
</template>

<script>
// 单位rpx转px
const basePix = uni.getSystemInfoSync().windowWidth / 750
const rpx2px = (rpxVal) => {
    rpxVal = String(rpxVal).replace(' ', '')
    rpxVal = rpxVal.replace('calc(', '')
    if (rpxVal.indexOf(')') !== -1) {
        rpxVal = rpxVal.substr(0, rpxVal.length - 1)
    }
    // 所有数值（含单位）
    const borderArr = rpxVal.split('+')
    // （不含单位）
    const borderNumberArr = borderArr.map(o => parseInt(o))
    // 所有的单位
    const borderUnit = borderArr.map((o, i) => o.replace(borderNumberArr[i], '') || 'rpx')
    const result = borderUnit.map((o, i) => (['rpx', 'upx'].includes(o) ? basePix : 1) * borderNumberArr[i])
    const resultNum = result.reduce((a, b) => a + b)
    return resultNum
}
export default {
    props: {
        onVal: {// 选中的值
            type: [String, Number, Boolean],
            default: true
        },
        offVal: {// 未选中的值
            type: [String, Number, Boolean],
            default: false
        },
        value: {// 双向绑定的值
            type: [String, Number, Boolean, Array],
            default: false
        },
        // 选中文案
        onText: {
            type: String,
            default: ''
        },
        // 未选中文案
        offText: {
            type: String,
            default: ''
        },
        textColor: {// 滑动球文案颜色
            type: String,
            default: '#fff'
        },
        textSelColor: {// 滑动球文案选中颜色
            type: String,
            default: '#fff'
        },
        color: {// 开关底座颜色（可以是渐变色）
            type: String,
            default: '#dadada'
        },
        selColor: {// 开关底座选中颜色
            type: String,
            default: ''
        },
        disabled: {// 禁止滑动
            type: [String, Boolean],
            default: false
        },
        disabledText: {// 禁止滑动的提示
            type: String,
            default: ''
        },
        slideColor: {// 滑动球颜色
            type: String,
            default: '#fff'
        },
        slideSelColor: {// 开关开启后滑动球颜色
            type: String,
            default: '#fff'
        },
        scale: {// 缩放
            type: [Number, String],
            default: 1
        },
        asyncSwitch: { // 异步请求限制
            type: [Boolean, String],
            default: false
        },
        loading: {// 网络请求中
            type: [Boolean, String],
            default: false
        },
        loadingColor: {// loading转圈颜色
            type: String,
            default: '#007AFF'
        },
        mask: {// 是否显示蒙层
            type: [String, Boolean],
            default: true
        },
        maskBg: {// 蒙层颜色
            type: String,
            default: 'rgba(255, 255, 255, .35)'
        }
    },
    data() {
        return {
            switchWidth: 0,
            translateX: 0,
            newValue: 0,
            showLoading: false,
            defaultColors: {
                theme: '#eee',
                subColor1: '#eee',
                subColor2: '#eee'
            }
        }
    },
    computed: {
        colors_() {
            return (this.shopConfig_ && this.shopConfig_.color ? this.shopConfig_.color : this.defaultColors).theme;
        },
        asyncSwitch_() {
            return String(this.asyncSwitch) !== 'false'
        },
        scale_() {
            const scale = this.reservedDecimal(this.scale, 2)
            return scale > 1 ? 1 : scale
        },
        disabled_() {
            return String(this.disabled) !== 'false'
        },
        loadingMask_() {
            return String(this.loadingMask) !== 'false'
        },
        switchSel_() {
            const value = this.value
            const valueType = this.$c.VariableType(value)

            if (valueType === 'Number') {
                return value === this.onVal * 1
            } else if (valueType === 'String') {
                return value === String(this.onVal)
            } else if (valueType === 'Null') {
                return false
            } else if (valueType === 'Boolean') {
                return JSON.stringify(value) === JSON.stringify(this.onVal)
            } else {
                return value.findIndex(o => o === this.onVal) !== -1
            }
        },
        textStyle_() {
            const style = {
                color: this.switchSel_ ? this.textSelColor : this.textColor
            }
            return style
        },
        style_() {
            const selColor = this.selColor || this.colors_
            const isGradient = this.color.indexOf('-gradient') !== -1
            const isSelGradient = selColor.indexOf('-gradient') !== -1
            const color = this.switchSel_ ? selColor : this.color
            const bgPro = this.switchSel_ ? (isSelGradient ? 'backgroundImage' : 'backgroundColor') : (isGradient ? 'backgroundImage' : 'backgroundColor')
            const style = {
                [bgPro]: color,
                width: this.switchWidth + uni.upx2px(24) + 'px',
                height: rpx2px(56) + 'px',
                lineHeight: rpx2px(56) + 'px',
                opacity: this.switchWidth ? 1 : 0,
                transform: 'scale(' + this.scale_ + ')'
            }
            return style
        },
        slideStyle_() {
            const isGradient = this.slideColor.indexOf('-gradient') !== -1
            const isSelGradient = this.slideSelColor.indexOf('-gradient') !== -1
            const color = this.switchSel_ ? this.slideSelColor : this.slideColor
            const bgPro = this.switchSel_ ? (isSelGradient ? 'backgroundImage' : 'backgroundColor') : (isGradient ? 'backgroundImage' : 'backgroundColor')
            const style = {
                [bgPro]: color,
                transform: 'translateX(' + (this.switchSel_ ? this.translateX : 0) + ')'
            }
            return style
        },
        loading_() {
            return String(this.loading) !== 'false'
        }
    },
    watch: {
        value: {
            handler() {
                this.calcSwitch()
            }
        },
        immediate: true
    },
    mounted() {
        this.calcSwitch()
    },
    methods: {
        async calcSwitch() {
            const data = await this.$c.getRect.call(this, '.c-switch__text, .c-switch__slide, .c-switch', { dataset: true })
            console.log(data, 33333)
            let switchWidth = 0
            const textData = data.filter(o => o.dataset.name === 'text').map(o => {
                const width = o.width
                switchWidth += width
                return width
            })
            const slideData = data.find(o => o.dataset.name === 'slide') || {}
            const maxWidth = Math.max.apply(null, textData)
            const minWidth = Math.min.apply(null, textData)
            const offsetTop = uni.upx2px(20)
            const textDstEqual = (maxWidth - minWidth) < 1
            const textDst = Math.abs(slideData.width - maxWidth) + (textDstEqual ? 1 : 2) * offsetTop
            this.switchWidth = this.reservedDecimal(switchWidth + textDst + uni.upx2px(4))
            const translateX = this.reservedDecimal(this.switchWidth - slideData.width - uni.upx2px(8))
            this.translateX = translateX + 'px'
        },
        reservedDecimal(num, fixed = 2) {
            if (!num) return Number(0).toFixed(fixed)
            num = String(num)
            const splitNum = num.split('.')
            const firstNum = splitNum[0]
            const lastNum = splitNum[1] ? String(splitNum[1]) : (new Array(fixed + 1)).join('0')
            let toFixedNum = (lastNum && lastNum.length) || 0
            toFixedNum = toFixedNum > fixed ? fixed : toFixedNum
            // toFixed会进行四舍五入 所以我们用裁剪
            // return .toFixed(toFixedNum);
            return firstNum + (toFixedNum > 0 ? '.' : '') + lastNum.substr(0, toFixedNum)
        },
        switchChange() {
            if (this.asyncSwitch_) {
                this.$emit('click')
                return
            }
            if (this.loading_) return
            let res = this.switchSel_ ? this.offVal : this.onVal
            if (typeof this.value === 'object') {
                const value = [...this.value]
                if (this.switchSel_) {
                    value.splice(value.findIndex(o => o === this.onVal), 1)
                } else {
                    value.push(res)
                }
                res = Array.from(new Set(value))
            }
            if (this.disabled_) {
                this.disabledText && uni.showToast({
                    title: this.disabledText,
                    icon: 'none'
                })
                return
            }
            this.$emit('input', res)
            this.$nextTick(() => {
                this.$emit('change', {
                    type: 'change',
                    detail: {
                        value: res
                    }
                })
            })
        }
    }
}
</script>

<style lang="scss">
.c-switch-box {
    display: inline-flexbox;
    vertical-align: middle;
}
.c-switch {
    min-width: 96rpx;
    border-radius: 56rpx;
    display: inline-block;
    vertical-align: middle;
    background-color: #dadada;
    position: relative;
    opacity: 0;
    @include tst;
    .c-switch__mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.35);
    }
    // .c-switch__loading {
    //     width: 6rpx;
    //     height: 6rpx;
    //     position: absolute;
    //     left: 50%;
    //     top: 50%;
    //     transform: translate(-50%, -50%);
    //     color: #444;
    //     border-radius: 100%; /* 圆角 */
    //     box-shadow: 14rpx -10rpx 0 0.5px currentColor,
    //         /* 右 */ 0 16rpx currentColor,
    //         /* 下 */ -14rpx -10rpx 0 0.5px currentColor,
    //         /* 左 */ 0 -16rpx 0 1px currentColor,
    //         /* 右上, 1.5px扩展 */ 14rpx 10rpx currentColor,
    //         /* 右下 */ -14rpx 10rpx currentColor; /* 左下 */
    // }

    // .spin {
    //     animation: spin 1s steps(8) infinite;
    // }

    // @keyframes spin {
    //     from {
    //         transform: rotate(0deg);
    //     }
    //     to {
    //         transform: rotate(360deg);
    //     }
    // }
    .c-switch__slide {
        width: 48rpx;
        height: 48rpx;
        background-color: #fff;
        border-radius: 100%;
        position: absolute;
        top: 50%;
        margin-top: -24rpx;
        left: 4rpx;
        transform: translateX(0);
        transition: transform 0.2s linear;
        &-icon {
            @include siteCenter;
            z-index: 2;
        }
    }
    .c-switch__text {
        position: absolute;
        top: 50%;
        margin-top: -24rpx;
        height: 48rpx;
        line-height: 48rpx;
        display: block;
        font-size: 24rpx;
        color: #ffffff;
        min-width: 30rpx;
        @include tst;
        &.c-switch__text_on {
            left: 16rpx;
            opacity: 0;
        }
        &.c-switch__text_off {
            right: 16rpx;
            opacity: 1;
        }
    }
    &.c-switch__active {
        .c-switch__text_on {
            opacity: 1;
        }
        .c-switch__text_off {
            opacity: 0;
        }
    }
    &.c-switch__disabled {
        cursor: no-drop;
    }
}
</style>
