<style scoped lang="scss">
.c-custom-radio {
    display: inline-flex;
    align-items: center;
    .radio-icon {
        margin-right: 8upx;
    }
    .radio-text {
        font-size: 28upx;
        color: #333333;
        line-height: 40upx;
    }
    &__style1 {
        .radio-icon {
            border-radius: 50%;
            width: 32upx;
            height: 32upx;
            background: #ffffff;
            border: 2upx solid #dcdee0;
            box-sizing: border-box;
        }
        &.is-active {
            .radio-icon {
                // border: 2upx solid #1b7aff;
                display: flex;
                align-items: center;
                justify-content: center;
                .radio-icon__effect {
                    width: 16upx;
                    height: 16upx;
                    // background: #1b7aff;
                    border-radius: inherit;
                }
            }
        }
    }
    &__style2 {
        .radio-icon {
            height: 28upx;
            width: 28upx;
        }
        .radio-icon__effect {
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
        }
    }
    &__style3,
    &__style4 {
        min-width: 116upx;
        height: 56upx;
        text-align: center;
        .radio-text {
            width: 100%;
        }
        .radio-icon {
            margin-right: 0;
        }
        &.is-active {
            .radio-text {
                color: inherit;
            }
        }
    }
}
</style>
<template>
    <view
        class="c-custom-radio"
        :class="[styleName_,{
            'is-active':select_
        }]"
        :style="[contentEffect_]"
        @tap="onClickLabel"
    >
        <view
            class="radio-icon iconstyle1"
            :style="[warpEffect_]"
        >
            <view
                class="radio-icon__effect"
                :style="[insetEffect_]"
            >
                <c-icons
                    v-if="customStyle === 'style2'"
                    class="icon-text"
                    :type="select_ ? 'icon-dui' : ''"
                    size="16"
                />
            </view>
        </view>
        <view class="radio-text">
            <slot></slot>
        </view>
    </view>
</template>

<script>
const where = (is, condition1, condition2 = () => { return {} }) => {
    return is ? condition1() : condition2()
}

const parseToBooltoBorderLine = (str) => {
    // return parseInt(str) ? 2 : 0
    return 2
}

const contentEffect = {
    default(css) {
        return {
            'margin': '20rpx 32rpx 0rpx 0',
            ...css
        }
    },
    style3({ color, is, showBorder }) {
        const style = where(is, () => {
            const rgb = color.replace(/(?:\(|\)|rgba|RGBA)*/g, '').split(',')
            rgb.pop()
            return {
                color,
                background: `rgba(${rgb.join(',')},${0.1})`,
                border: `${parseToBooltoBorderLine(showBorder)}rpx solid ${color}`
            }
        }, () => {
            return {
                background: '#F6F5F8',
                border: `${parseToBooltoBorderLine(showBorder)}rpx solid transparent`
            }
        })
        return {
            ...style,
            borderRadius: '28rpx'
        }
    },
    style4({ color, is, showBorder }) {
        return {
            ...contentEffect.style3({ color, is, showBorder }),
            borderRadius: '0rpx'
        }
    }
}
const warpEffect = {
    style1({ color, defaultColor, is, showBorder }) {
        return {
            border: `${parseToBooltoBorderLine(showBorder)}rpx solid ${is ? color : defaultColor}`
        }
    },
    style2({ color, defaultColor, is, showBorder }) {
        return where(is, () => {
            return {
                background: color
            }
        }, () => {
            return {
                border: `${parseToBooltoBorderLine(showBorder)}rpx solid ${defaultColor}`
            }
        })
    }
}
const insetEffect = {
    style1({ color }) {
        return {
            background: color
        }
    }
}
export default {
    name: 'CCustomRadio',
    props: {
        // 是否为选中状态
        checked: {
            type: [Boolean, String],
            default: false
        },
        showBorder: {
            type: [String, Number],
            default: '2'
        },
        // radio的名称
        name: {
            type: [String, Number],
            default: ''
        },
        // 是否禁止点击提示语选中复选框
        labelDisabled: {
            type: [String, Boolean],
            default: ''
        },
        customCss: {
            type: Object,
            default: () => {
                return {}
            }
        },
        // 选中状态下的颜色，如设置此值，将会覆盖parent的activeColor值
        activeColor: {
            type: String,
            default: 'rgba(27, 122, 255, 1)'
        },
        defaultColor: {
            type: String,
            default: '#DCDEE0'
        },
        customStyle: {
            type: String,
            default: 'style1'
        }
    },
    data() {
        return {
            parentData: {
                value: null
            }
        }
    },
    computed: {
        styleName_() {
            return `c-custom-radio__${this.customStyle}`
        },
        select_() {
            console.log(this.name, this.parentData.value, '----')
            return this.name === this.parentData.value
        },
        nomiliziStyle_() {
            return {
                defaultColor: this.defaultColor,
                showBorder: this.showBorder,
                color: this.activeColor,
                is: this.select_
            }
        },
        contentEffect_() {
            const style = contentEffect[this.customStyle]
            const defaultCss = contentEffect.default(this.customCss)
            return {
                ...where(style, () => {
                    return {
                        ...style(this.nomiliziStyle_)
                    }
                }),
                ...defaultCss
            }
        },
        warpEffect_() {
            const style = warpEffect[this.customStyle]
            return where(style, () => {
                return style(this.nomiliziStyle_)
            })
        },
        insetEffect_() {
            const style = insetEffect[this.customStyle]
            return where(style, () => {
                return style(this.nomiliziStyle_)
            })
        }
    },
    watch: {
        checked: {
            handler(val) {
                if (val) {
                    this.parentData.value = this.name || false
                }
            },
            immediate: true
        }
    },
    created() {
        // 支付宝小程序不支持provide/inject，所以使用这个方法获取整个父组件，在created定义，避免循环引用
        this.parent = this.$c.getParent.call(this, 'CRadioGroup')
        if (!this.parent) return this.$toast('请嵌套c-radio-group使用')
        this.parent.children.push(this)
        // this.parentData.value = this.parent.value
    },
    methods: {
        onClickLabel() {
            this.setRadioCheckedStatus()
        },
        emitEvent() {
            if (this.parentData.value !== this.name) this.$emit('change', this.name)
        },
        // 改变组件选中状态
        // 这里的改变的依据是，更改本组件的parent.value值为本组件的name值，同时通过父组件遍历所有c-radio实例
        // 将本组件外的其他c-radio的parent.value都设置为空(由computed计算后，都被取消选中状态)，因而只剩下一个为选中状态
        setRadioCheckedStatus() {
            const name = this.cancelEnble_ && this.parentData.value === this.name ? '' : this.name
            this.emitEvent()
            if (this.parent) {
                this.parent.setValue(name)
                this.parentData.value = name
            }
        }
    }
}
</script>

