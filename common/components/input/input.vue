<template>
    <view
        class="c-input-view"
        :style="[ style_ ]"
        :class="['c-input-view--' + type]"
        @click="onClick"
    >
        <view
            v-if="$slots.before"
            class="c-input-hd"
            :style="[ beforeStyle_ ]"
        >
            <slot name="before"></slot>
        </view>
        <view
            class="c-input-bd"
            :style="[textAreaStyle_]"
        >
            <input
                v-if="type !== 'textarea'"
                ref="input"
                class="c-input"
                :disabled="disabled_"
                :confirm-type="confirmType"
                :maxlength="maxlength_"
                :focus="focus_"
                :type="inputType"
                :value="inputValue_"
                :placeholder="placeholder"
                :password="type === 'password' && !showPassword"
                placeholder-class="c-input-placeholder"
                :placeholder-style="placeholderStyle_"
                @input="onInput"
                @focus="onFocus"
                @blur="onBlur"
                @confirm="onConfirm"
                @keyboardheightchange="onKeyboardheightchange"
            />
            <textarea
                v-else
                class="c-textarea"
                :style="{'min-height':minHeight+'rpx'}"
                :auto-height="autoHeight_"
                :disabled="disabled_"
                :confirm-type="confirmType"
                :maxlength="maxlength_"
                :focus="focus_"
                :type="inputType"
                :value="inputValue_"
                :placeholder="placeholder"
                :password="type === 'password' && !showPassword"
                placeholder-class="c-input-placeholder"
                disable-default-padding
                :placeholder-style="placeholderStyle_"
                :cursor-spacing="cursorSpacing_"
                @input="onInput"
                @focus="onFocus"
                @blur="onBlur"
                @confirm="onConfirm"
            ></textarea>
            <view
                v-if="numVerification"
                class="c-numVerification"
            >{{ value.length || 0 }} /{{ maxlength_ }} </view>
        </view>
        <!-- 操作事件 -->
        <view
            v-if="displayable_"
            class="c-input-icon"
            @click="display"
        >
            <c-icons
                color="#999"
                :type="showPassword ? 'zsuicon-zhengyan' : 'zsuicon-biyan'"
                size="40"
            ></c-icons>
        </view>
        <view
            v-if="clearable_"
            class="c-input-icon c-input-icon__clear"
            @click.stop="clear"
        >
            <c-icons
                color="#d4d4d4"
                type="zsuicon-guanbi"
                size="32"
            ></c-icons>
        </view>
        <view
            v-if="type === 'select'"
            class="c-input-icon c-input-icon__arrows"
            @click="handleSelect"
        >
            <c-icons
                v-if="arrows_"
                color="#d4d4d4"
                type="zsuicon-tiaozhuan"
                size="32"
            ></c-icons>
        </view>
        <view
            v-if="$slots.default"
            class="c-input-ft"
            :style="[ afterStyle_ ]"
        >
            <slot></slot>
        </view>
    </view>
</template>

<script>
export default {
    name: 'CInput',
    model: {
        prop: 'value',
        event: 'input'
    },
    props: {
        /**
         * 输入类型
         */
        type: {
            type: String,
            default: 'text'
        },
        /**
         * 值
         */
        value: {
            type: [String, Number],
            default: ''
        },
        /**
         * 占位符
         */
        confirmType: {
            type: String,
            default: 'done'
        },
        /**
         * placeholder显示值
         */
        placeholder: {
            type: String,
            default: ''
        },
        /**
         * 是否显示清除按钮
         */
        clearable: {
            type: [Boolean, String],
            default: false
        },
        /**
         * 是否自动增高，设置auto-height时，style.height不生效  type为textarea时才生效
         */
        autoHeight: {
            type: [Boolean, String],
            default: false
        },
        /**
         * 是否显示密码可见按钮，仅在type为password下有效
         */
        displayable: {
            type: [Boolean, String],
            default: false
        },
        /**
         * 是否显示字数验证
         */
        numVerification: {
            type: Boolean,
            default: false
        },
        /**
         * 最小高度
         */
        minHeight: {
            type: [Number, String],
            default: 0
        },
        /**
         * 是否显示箭头
         */
        arrows: {
            type: [Boolean, String],
            default: false
        },
        /**
         * 是否禁用输入框	
         */
        disabled: {
            type: [Boolean, String],
            default: false
        },
        /**
         * 输入框的最大可输入长度	
         */
        maxlength: {
            type: [Number, String],
            default: 140
        },
        /**
         * 自动获取焦点
         */
        focus: {
            type: [Boolean, String],
            default: false
        },
        /**
         * 精度
         */
        decimal: {
            type: [Number, String],
            default: 2
        },
        /**
         * 最大值
         */
        max: {
            type: [Number, String],
            default: 0 // 0表示不限制
        },
        /**
         * 最小值
         */
        min: {
            type: [Number, String],
            default: 0
        },
        // 输入框圆角
        radius: {
            type: [String, Number],
            default: 0
        },
        // before之前的宽度，默认auto
        beforeWidth: {
            type: [String, Number],
            default: 'auto'
        },
        // after之前的宽度，默认auto
        afterWidth: {
            type: [String, Number],
            default: 'auto'
        },
        // 正则校验	
        pattern: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        // 消息提示语
        msgName: {
            type: String,
            default: ''
        },
        // 之前样式
        beforeStyle: {
            type: Object,
            default() {
                return {}
            }
        },
        // 之后样式
        afterStyle: {
            type: Object,
            default() {
                return {}
            }
        },
        // placeholder样式
        placeholderStyle: {
            type: [String, Object],
            default: ''
        },
        // textArea样式
        textAreaStyle: {
            type: Object,
            default: () => { }
        },
        /**
         * H5无效
         */
        cursorSpacing: {
            type: Number,
            default: 0
        },
        // 是否必须校验
        required: Boolean
    },
    data() {
        return {
            /**
             * 显示密码明文
             */
            showPassword: false,
            inputName: '',
            inputValue: ''// 这个值用于表单提交
        }
    },
    computed: {
        // 这个值用户数据双向绑定，如果没有v-model  这边初始值会有问题，所以表单提交的时候 要用inputValue作为值返回
        inputValue_: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        },
        beforeStyle_() {
            return {
                width: this.$c.formatUnit(this.beforeWidth),
                ...this.beforeStyle
            }
        },
        afterStyle_() {
            return {
                width: this.$c.formatUnit(this.afterWidth),
                ...this.afterStyle
            }
        },
        maxlength_() {
            const maxlength = parseInt(this.maxlength)
            return isNaN(maxlength) ? 140 : maxlength
        },
        decimal_() {
            return parseInt(this.decimal)
        },
        max_() {
            return this.reservedDecimal(this.max, this.decimal_) * 1
        },
        min_() {
            return this.reservedDecimal(this.min, this.decimal_) * 1
        },
        inputType() {
            const inputType = (this.type === 'password' ? 'text' : (this.type === 'price' ? 'digit' : this.type)).toLocaleLowerCase()
            return ['text', 'number', 'idcard', 'digit'].includes(inputType) ? inputType : 'text'
        },
        clearable_() {
            return String(this.clearable) !== 'false' && String(this.value).length
        },
        autoHeight_() {
            return String(this.autoHeight) !== 'false'
        },
        displayable_() {
            return String(this.displayable) !== 'false' && String(this.value).length
        },
        arrows_() {
            return String(this.arrows) !== 'false'
        },
        disabled_() {
            return String(this.disabled) !== 'false' || this.type === 'select'
        },
        focus_() {
            return String(this.focus) !== 'false'
        },
        style_() {
            return {
                borderRadius: this.$c.formatUnit(this.radius)
            }
        },
        cursorSpacing_() {
            const number = Number(this.cursorSpacing)
            return isNaN(number) ? 0 : number
        },
        textAreaStyle_() {
            if (this.type === 'textarea') {
                return this.textAreaStyle
            }
            return {}
        },
        placeholderStyle_() {
            if (this.$typeOf(this.placeholderStyle) === 'String') {
                return this.placeholderStyle
            } else {
                return Object.keys(this.placeholderStyle).reduce((a, b) => a + `${b}:${this.placeholderStyle[b]};`, '')
            }
        }
    },
    watch: {
        value: {
            handler(val) {
                this.inputValue = val
            },
            immediate: true
        }
    },
    created() {
        this.inputName = this.name ? this.name : ('crabInput' + Math.random().toString(32).substr(2))
        this.parent = this.$c.getParent.call(this, 'CForm')
        this.parent && this.parent.children.push(this)
    },
    mounted() {
        // #ifdef H5
        if (uni.getSystemInfoSync().platform === 'ios' && this.decimal_ === 0) { // 修改金额类型为tel（整数数字--->针对ios）
            this.type === 'price' && (this.$refs.input.$el.getElementsByTagName('input')[0].type = 'tel')
        }
        // #endif
    },
    beforeDestroy() {
        if (this.parent && this.inputName) {
            const index = this.parent.children.findIndex(o => o === this)
            this.parent.children.splice(index, 1)
        }
    },
    methods: {
        onKeyboardheightchange(e) {
            this.$emit('keyboardheightchange', e)
        },
        onClick(e) {
            this.$emit('click', e)
        },
        handleSelect(e) {
            this.$emit('select', e)
        },
        clear() {
            this.$emit('input', '')
            this.$emit('clear')
        },
        display() {
            this.showPassword = !this.showPassword
        },
        onFocus() {
            this.$emit('focus')
        },
        onBlur(e) {
            this.onInput(e, true)
            this.$emit('blur', e)
            this.parent && this.parent.validate && this.parent.validate()
        },
        validate(hasMsg = true) {
            if (!this.pattern) return true
            if (!this.required && !this.inputValue) return true
            const validateObj = this.$c.validate(this.pattern, this.inputValue, hasMsg)
            if (hasMsg) {
                if (!validateObj.validate) {
                    this.$toast(this.msgName + validateObj.message)
                }
            } else {
                if (!validateObj) {
                    this.$toast('格式错误')
                }
            }
            return validateObj
        },
        onConfirm(e) {
            this.$emit('confirm', e)
        },
        onInput(e, isBlur) {
            let val = e.detail.value
            this.$emit('input', val)
            this.inputValue = val
            if (this.type === 'price') {
                var valIndexOf = val.indexOf('.') + 1
                // 用户输入小数点(针对ios，安卓不会出现该问题)
                if (valIndexOf === val.length && val.length) {
                    if (this.decimal_ === 0) {
                        val = parseInt(val)
                    }
                    if (isBlur) {
                        val = Number(val)
                    }
                } else {
                    val = /\d+(?:\.)?(?:\d*)?/.exec(val)
                    val = val ? val[0] : ''
                    // 说明有小数点
                    if (valIndexOf > 0) {
                        val !== '' && (val = this.reservedDecimal(val, this.decimal_))
                    }
                    if (isBlur) {
                        if (Number(val) === 0) {
                            val = ''
                        } else {
                            val = Number(val)
                        }
                    }
                }

                if (val && this.max_) {
                    val = val > this.max_ ? this.max_ : val
                }
                if (isBlur && val) {
                    val = val < this.min_ ? this.min_ : val
                }
                this.$nextTick(() => {
                    this.$emit('input', val)
                })
                this.inputValue = val
            }
        },
        reservedDecimal(num, fixed = 1) {
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
        }
    }
}
</script>

<style lang="scss" scoped>
.c-input {
    &-hd {
        @include flex(row);
        align-items: flex-start;
    }

    &-bd {
        height: $input-height;
        padding: 0 $spacing-row-base;
        flex: 1;
    }

    &-ft {
        @include flex(row);
        align-items: center;
    }

    &-icon {
        height: $input-height;
        line-height: 1;
        @include flex(row);
        align-items: center;
        padding-right: $spacing-row-base;
        &__clear {
            position: relative;
            z-index: 3;
            cursor: pointer;
        }
    }

    &-view {
        position: relative;
        /* #ifdef MP-WEIXIN */
        background-color: inherit;
        /* #endif */
        @include flex(row);
        justify-content: center;
        align-items: center;
        flex: 1;

        .c-input,
        .c-textarea {
            flex: 1;
            width: 100%;
            line-height: inherit;
            height: inherit;
            font-size: $font-base;
            color: #333;
            padding: 0;
            min-height: 0;
            background-color: transparent;
        }
        .c-numVerification {
            text-align: right;
        }
        &--select {
            .c-input-icon__arrows {
                @include abs(0, 0, 0, 0);
                z-index: 2;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                width: 100%;
                height: auto;
            }
        }

        &--textarea {
            align-items: flex-start;

            .c-input-hd {
                min-height: $input-height;
            }

            .c-input-bd {
                height: auto;
            }

            .c-textarea {
                height: 120rpx;
            }
        }

        .c-input-placeholder {
            color: #b3b3b3;
        }
    }
}
</style>
