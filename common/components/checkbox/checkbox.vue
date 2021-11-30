<template>
    <view
        class="c-checkbox"
        :style="[checkboxStyle]"
        @tap="onClickLabel"
    >
        <view
            class="c-checkbox__zsuicon-wrap"
            @tap.stop="toggle"
        >
            <c-icons
                class="c-radio__zsuicon-wrap__icon"
                :type="iconType"
                :size="checkboxIconSize"
                :color="iconColor"
            />
        </view>
        <view
            v-if="$slots.default"
            class="c-checkbox__label"
            :style="{ fontSize: labelSize_,flex: parent.wrap ? 1 : 'auto' }"
        >
            <slot />
        </view>
    </view>
</template>

<script>
/**
 * checkbox 复选框
 * @description 该组件需要搭配checkboxGroup组件使用，以便用户进行操作时，获得当前复选框组的选中情况。
 * @tutorial https://www.uviewui.com/components/checkbox.html
 * @property {String Number} zsuicon-size 图标大小，单位rpx（默认20）
 * @property {String Number} label-size label字体大小，单位rpx（默认28）
 * @property {String Number} name checkbox组件的标示符
 * @property {String} shape 形状，见官网说明（默认circle）
 * @property {Boolean} disabled 是否禁用
 * @property {Boolean} label-disabled 是否禁止点击文本操作checkbox
 * @property {String} active-color 选中时的颜色，如设置CheckboxGroup的active-color将失效
 * @event {Function} change 某个checkbox状态发生变化时触发，回调为一个对象
 * @example <c-checkbox v-model="checked" :disabled="false">天涯</c-checkbox>
 */
import { mapState } from 'vuex'
export default {
    name: 'CCheckbox',
    props: {
        // checkbox的名称
        name: {
            type: [String, Number],
            default: ''
        },
        // 形状，square为方形，circle为原型
        shape: {
            type: String,
            default: ''
        },
        // 是否为选中状态
        checked: {
            type: [Boolean, String],
            default: false
        },
        // 是否禁用
        disabled: {
            type: [String, Boolean],
            default: ''
        },
        // 是否禁止点击提示语选中复选框
        labelDisabled: {
            type: [String, Boolean],
            default: ''
        },
        customStyle: {
            type: Object,
            default: () => { }
        },
        // 选中状态下的颜色，如设置此值，将会覆盖checkboxGroup的activeColor值
        activeColor: {
            type: String,
            default: ''
        },
        // 图标的大小，单位rpx
        iconSize: {
            type: [String, Number],
            default: ''
        },
        // label的字体大小，rpx单位
        labelSize: {
            type: [String, Number],
            default: ''
        },
        // 组件的整体大小
        size: {
            type: [String, Number],
            default: ''
        }
    },
    data() {
        return {
            parentDisabled: false,
            newParams: {},
            value: false,
            defaultColors: {
                theme: '#FF5D0C',
                subColor1: '#FFAE37',
                subColor2: '#FF5D0C'
            }
        }
    },
    watch: {
        checked: {
            handler(val) {
                this.value = val
            },
            immediate: true
        }
    },
    created() {
        // 支付宝小程序不支持provide/inject，所以使用这个方法获取整个父组件，在created定义，避免循环应用
        this.parent = this.$c.getParent.call(this, 'CCheckboxGroup')
        // 如果存在c-checkbox-group，将本组件的this塞进父组件的children中
        this.parent && this.parent.children.push(this)
    },
    computed: {
        ...mapState({
            shopConfig_: state => state.config ? state.config.shopConfig : null
        }),
        colors_() {
            return this.shopConfig_ ? this.shopConfig_.color : this.defaultColors
        },
        // 是否禁用，如果父组件c-checkbox-group禁用的话，将会忽略子组件的配置
        isDisabled() {
            return this.disabled !== '' ? this.disabled : this.parent ? this.parent.disabled : false
        },
        // 是否禁用label点击
        isLabelDisabled() {
            return this.labelDisabled !== '' ? this.labelDisabled : this.parent ? this.parent.labelDisabled : false
        },
        // 组件尺寸，对应size的值，默认值为34rpx
        checkboxSize() {
            return this.size ? this.size : (this.parent ? this.parent.size : 34)
        },
        // 组件的勾选图标的尺寸，默认20
        checkboxIconSize() {
            return this.iconSize ? this.iconSize : (this.parent ? this.parent.iconSize : 36)
        },
        // 组件选中激活时的颜色
        elActiveColor() {
            return this.activeColor ? this.activeColor : (this.parent && this.parent.activeColor ? this.parent.activeColor : this.colors_.theme)
        },
        // 组件的形状
        elShape() {
            return this.shape ? this.shape : (this.parent ? this.parent.shape : 'square')
        },
        labelSize_() {
            return this.$c.formatUnit(this.labelSize, 'rpx', '28')
        },
        iconStyle() {
            const style = {}
            // 既要判断是否手动禁用，还要判断用户v-model绑定的值，如果绑定为false，那么也无法选中
            if (this.elActiveColor && this.value && !this.isDisabled) {
                style.borderColor = this.elActiveColor
                style.backgroundColor = this.elActiveColor
            }
            style.width = this.$c.formatUnit(this.checkboxSize)
            style.height = this.$c.formatUnit(this.checkboxSize)
            return style
        },
        // checkbox内部的勾选图标，如果选中状态，为白色，否则为透明色即可
        iconColor() {
            return this.value == true ? this.elActiveColor : '#E0E0E0'
        },
        iconType() {
            const types = {
                square: {
                    icon: 'zsuicon-checkbox',
                    selIcon: 'zsuicon-checkbox-checked'
                },
                circle: {
                    icon: 'zsuicon-weixuan',
                    selIcon: 'zsuicon-xuanzhong'
                }
            }
            return this.value ? types[this.elShape].selIcon : types[this.elShape].icon
        },
        checkboxStyle() {
            const style = {}
            if (this.parent && this.parent.width) {
                style.width = this.parent.width
                // #ifdef MP
                // 各家小程序因为它们特殊的编译结构，使用float布局
                style.float = 'left'
                // #endif
                // #ifndef MP
                // H5和APP使用flex布局
                style.flex = `0 0 ${this.parent.width}`
                // #endif
            }
            if (this.parent && this.parent.wrap) {
                style.width = '100%'
                // #ifndef MP
                // H5和APP使用flex布局，将宽度设置100%，即可自动换行
                style.flex = '0 0 100%'
                // #endif
            }
            return { ...style, ...this.customStyle }
        }
    },
    methods: {
        onClickLabel() {
            if (!this.isLabelDisabled && !this.isDisabled) {
                this.setValue()
            }
        },
        toggle() {
            if (!this.isDisabled) {
                this.setValue()
            }
        },
        emitEvent() {
            this.value = !this.value
            this.$emit('change', {
                value: this.value,
                name: this.name
            })
            // 执行父组件c-checkbox-group的事件方法
            // 等待下一个周期再执行，因为this.$emit('input')作用于父组件，再反馈到子组件内部，需要时间
            setTimeout(() => {
                if (this.parent && this.parent.emitEvent) this.parent.emitEvent(this.name)
            }, 80)
        },
        // 设置input的值，这里通过input事件，设置通过v-model绑定的组件的值
        setValue() {
            // 判断是否超过了可选的最大数量
            let checkedNum = 0
            if (this.parent && this.parent.children) {
                // 只要父组件的某一个子元素的value为true，就加1(已有的选中数量)
                this.parent.children.map(val => {
                    if (val.value) checkedNum++
                })
            }
            if (!this.value) {
                // 如果超出最多可选项，提示
                if (this.parent && checkedNum >= this.parent.max) {
                    return this.toast(`最多可选${this.parent.max}项`)
                }
            }
            this.emitEvent()
            // this.$emit('input', !this.value);
        }
    }
}
</script>

<style lang="scss" scoped>
.c-checkbox {
    /* #ifndef APP-NVUE */
    display: inline-flex;
    /* #endif */
    align-items: center;
    overflow: hidden;
    user-select: none;
    line-height: 1.8;

    &__zsuicon-wrap {
        color: $color-sub-text;
        flex: none;
        display: -webkit-flex;
        @include flex(row);
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        // width: 42rpx;
        // height: 42rpx;
        color: transparent;
        justify-content: center;
        align-items: center;
        transition-property: color, border-color, background-color;
        font-size: 20rpx;
        // border: 1px solid #c8c9cc;
        transition-duration: 0.2s;
        position: relative;

        /* #ifdef MP-TOUTIAO */
        // 头条小程序兼容性问题，需要设置行高为0，否则图标偏下
        &__icon {
            line-height: 0;
        }

        /* #endif */

        &--circle {
            border-radius: 100%;
        }

        &--square {
            border-radius: 6rpx;
        }

        &--checked {
            color: $color-primary;
            // background-color: $color-primary;
            // border-color: $color-primary;
        }

        &--disabled {
            background-color: #ebedf0;
            border-color: #c8c9cc;
        }

        &--disabled--checked {
            color: #c8c9cc !important;
        }
    }

    &__label {
        word-wrap: break-word;
        margin-left: 10rpx;
        margin-right: 24rpx;
        color: $color-sub-text;
        font-size: 30rpx;

        &--disabled {
            color: #c8c9cc;
        }
    }
}
</style>
