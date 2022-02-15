<template>
    <button
        :open-type="openType"
        :disabled="disabled_"
        class="c-btn"
        :loading="loading_"
        :class="[
            plain_ ? `c-btn--${type}__plain`: '',
            disabled_ ? 'c-btn--disabled': '',
            `c-btn--${type}`,
            `c-btn--${shape}`,
            `c-btn--${size}`
        ]"
        :style="[ style_ ]"
        @click="handleClick"
        @getphonenumber="handleGetphonenumber"
        @getuserinfo="handleGetuserinfo"
        @error="handleError"
        @opensetting="handleOpensetting"
        @launchapp="handleLaunchapp"
    >
        <text
            v-if="plain_"
            class="c-btn__border"
            :style="[ borderStyle_ ]"
        ></text>
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'CButton',
    props: {
        // 按钮的样式类型	
        type: {
            type: String,
            default: 'inherit'
        },
        /**
         * 按钮大小
         * mini 小
         * normal 正常大小
         * large 大按钮
         */
        size: {
            type: String,
            default: 'normal'
        },
        // 是否镂空
        plain: {
            type: [String, Boolean],
            default: false
        },
        // 禁用状态
        disabled: {
            type: [String, Boolean],
            default: false
        },
        // 是否开启加载状态
        loading: {
            type: [String, Boolean],
            default: false
        },
        /**
         * 按钮形状
         * square 圆角矩形
         * circle 两边为半圆形
         */
        shape: {
            type: String,
            default: 'square'
        },
        openType: {
            type: String,
            default: ''
        },
        formType: {
            type: String,
            default: ''
        },
        // 按钮高度
        height: {
            type: [String, Number],
            default: ''
        },
        // 按钮宽度
        width: {
            type: [String, Number],
            default: ''
        },
        // 按钮字体大小
        fontSize: {
            type: [String, Number],
            default: ''
        },
        // 按钮圆角
        radius: {
            type: [String, Number],
            default: ''
        }
    },
    computed: {
        loading_() {
            return String(this.loading) !== 'false'
        },
        plain_() {
            return String(this.plain) !== 'false' || (this.parent && this.type === 'inherit' ? this.parent.type === 'button' : false)
        },
        disabled_() {
            return String(this.disabled) !== 'false'
        },
        radius_() {
            return this.height && this.shape === 'circle' ? this.height / 2 : this.radius
        },
        style_() {
            const bottonStyle = this.parent && this.type === 'inherit' ? { ...this.parent.colorsStyle_ } : {}
            this.width ? (bottonStyle.width = this.$c.formatUnit(this.width)) : ''
            this.height ? (bottonStyle.height = this.$c.formatUnit(this.height)) : ''
            this.fontSize ? (bottonStyle.fontSize = this.$c.formatUnit(this.fontSize)) : ''
            if (this.radius_) {
                bottonStyle.borderRadius = this.$c.formatUnit(this.radius_) + ''
            }
            return bottonStyle
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
            if (this.style_.borderColor) {
                borderStyle.borderColor = this.style_.borderColor
            }
            return borderStyle
        }
    },
    created() {
        this.formEl = this.$c.getParent.call(this, 'CForm')
        // 支付宝小程序不支持provide/inject，所以使用这个方法获取整个父组件，在created定义，避免循环应用
        this.parent = this.$c.getParent.call(this, 'CColors')
    },
    methods: {
        async getUserInfo() { // 获取用户信息 微信
            if (this.btnLoading) return
            this.btnLoading = true
            const data = await this.getwxUserInfo()
            this.btnLoading = false
            this.$emit('getuserinfoencry', {
                type: 'getuserinfo',
                detail: data ? {
                    encryptedData: data.encryptedData,
                    iv: data.iv
                } : {}
            })
        },
        async getwxUserInfo() { // 获取微信授权个人信息
            let res = false
            try {
                res = await wx.getUserProfile({
                    desc: '用于完善会员资料'
                })
            } catch (error) {
                res = false
            }
            return res
        },
        handleGetphonenumber(e) {
            console.log(e)
            this.$emit('getphonenumber', e)
            this.$emit('getphonenumberencry', {
                type: e.type || 'getphonenumber',
                detail: {
                    encryptedData: e.detail.encryptedData,
                    iv: e.detail.iv
                }
            })
        },
        handleGetuserinfo(e) {
            this.$emit('getuserinfo', e)
        },
        handleError(e) {
            this.$emit('error', e)
        },
        handleOpensetting(e) {
            this.$emit('opensetting', e)
        },
        handleLaunchapp(e) {
            this.$emit('launchapp', e)
        },
        handleClick(e) {
            if (this.loading_) return
            if (this.openType === 'getUserInfo') this.getUserInfo()
            if (this.formType && this.formEl) {
                if (this.formType === 'submit' && this.formEl.emitSubmit) {
                    console.log('button submit')
                    this.formEl.emitSubmit(e)
                } else if (this.formType === 'reset' && this.formEl.emitReset) {
                    console.log('button reset')
                    this.formEl.emitReset(e)
                }
                return
            }
            this.$emit('click', e)
        }
    }
}
</script>

<style lang="scss" scoped>
.c-btn {
    height: $button-height;
    @include flex(row);
    align-items: center;
    justify-content: center;
    line-height: 1.4;
    font-size: $font-base;
    text-align: center;
    position: relative;
    font-weight: 400;
    border-radius: $border-radius-base;
    background-color: #fff;
    color: #333;
    padding: 0 $spacing-row-base * 2;
    margin: 0;
    /* #ifndef APP-PLUS-NVUE */
    border: none;
    /* #endif */

    /* #ifndef APP-PLUS-NVUE */
    &::after {
        display: none;
    }
    /* #endif */
    &--inherit {
        color: inherit;
        background-color: inherit;
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

    &--circle {
        border-radius: $button-height / 2;

        .c-btn__border {
            border-radius: $button-height;
        }
    }

    &--mini {
        height: $button-height-sm;
        font-size: $font-sm;
        padding: 0 $spacing-row-base;
        border-radius: $border-radius-sm;

        .c-btn__border {
            border-radius: 2 * $border-radius-sm;
        }

        &.c-btn--circle {
            border-radius: $button-height-sm / 2;

            .c-btn__border {
                border-radius: $button-height-sm;
            }
        }
    }

    &--large {
        height: $button-height-lg;
        font-size: $font-lg;
        padding: 0 $spacing-row-base * 3;
        border-radius: $border-radius-lg;

        .c-btn__border {
            border-radius: 2 * $border-radius-lg;
        }

        &.c-btn--circle {
            border-radius: $button-height-lg / 2;

            .c-btn__border {
                border-radius: $button-height-lg;
            }
        }
    }

    &--primary {
        color: #fff;
        background-color: $color-primary;

        .c-btn__border {
            border-color: $color-primary;
        }
    }

    &--default {
        color: #666666;
        background-color: #fff;

        .c-btn__border {
            border-color: #e0e0e0;
        }
    }

    &--info {
        color: #fff;
        background-color: $color-info;

        .c-btn__border {
            border-color: $color-info;
        }
    }

    &--success {
        color: #fff;
        background-color: $color-success;

        .c-btn__border {
            border-color: $color-success;
        }
    }

    &--warning {
        color: #fff;
        background-color: $color-warning;

        .c-btn__border {
            border-color: $color-warning;
        }
    }

    &--danger {
        color: #fff;
        background-color: $color-danger;

        .c-btn__border {
            border-color: $color-danger;
        }
    }

    &--disabled {
        opacity: 0.5;
        /* #ifndef APP-PLUS-NVUE */
        cursor: not-allowed;
        /* #endif */
    }

    &--primary__plain {
        background-color: transparent;
        color: $color-primary;
    }

    &--info__plain {
        background-color: transparent;
        color: $color-info;
    }

    &--success__plain {
        background-color: transparent;
        color: $color-success;
    }

    &--warning__plain {
        background-color: transparent;
        color: $color-warning;
    }

    &--danger__plain {
        background-color: transparent;
        color: $color-danger;
    }

    &--default__plain {
        color: #666666;
        background-color: transparent;
    }
}
</style>
