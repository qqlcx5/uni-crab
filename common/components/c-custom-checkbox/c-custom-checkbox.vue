<style scoped lang="scss">
@mixin centenIcon() {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    height: 100%;
}

.c-custom-radio {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    &.is-column {
        display: flex;
    }
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
            box-sizing: border-box;
        }
        .radio-icon__effect {
            @include centenIcon();
        }
    }
    &__style2 {
        .radio-icon {
            height: 28upx;
            width: 28upx;
        }
        .radio-icon__effect {
            @include centenIcon();
        }
    }
    &__style3,
    &__style4 {
        padding: 0 24upx;
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
            .radio-icon__effect {
                // padding: 0 4upx 0 16upx;
                padding-right: 8upx;
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
                    v-if="select_"
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
        return where(is, () => {
            return {
                background: color
            }
        }, () => {
            return {
                border: `${parseToBooltoBorderLine(showBorder)}rpx solid ${defaultColor}`
            }
        })
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
}
export default {
    name: 'CCustomCheckBox',
    props: {
        column: {
            type: Boolean,
            default: false
        },
        showBorder: {
            type: [String, Number],
            default: '2'
        },
        // CheckBox的名称
        name: {
            type: [String, Number],
            default: ''
        },
        // 是否为选中状态
        checked: {
            type: [Boolean, String],
            default: false
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
            value: false
        }
    },
    computed: {
        styleName_() {
            return `c-custom-radio__${this.customStyle} ${this.column ? ' is-column ptb24' : ''}`
        },
        select_() {
            return this.value
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
                this.value = val || false
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
    methods: {
        onClickLabel() {
            if (!this.isLabelDisabled && !this.isDisabled) {
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
            this.$nextTick(() => {
                if (this.parent && this.parent.emitEvent) this.parent.emitEvent(this.name)
            })
        },
        // 设置input的值，这里通过input事件，设置通过v-model绑定的组件的值
        setValue() {
            // 判断是否超过了可选的最大数量
            // let checkedNum = 0
            // if (this.parent && this.parent.children) {
            //     // 只要父组件的某一个子元素的value为true，就加1(已有的选中数量)
            //     this.parent.children.map(val => {
            //         if (val.value) checkedNum++
            //     })
            // }
            this.emitEvent()
            // this.$emit('input', !this.value);
        }
    }
}
</script>

