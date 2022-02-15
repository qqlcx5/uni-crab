<template>
    <c-popup
        v-model="modalFlag"
        :custom-class="customClass"
        radius="34"
        :close-pos="closePos"
        :show-close="showClose_"
        :maskabled="maskabled"
        :hd-style="hdStyle"
    >
        <view class="c-modal">
            <view
                v-if="showTitle_"
                class="c-modal__title"
                :style="[ titleStyle ]"
            >{{ title }}</view>
            <view class="c-modal__content">
                <template v-if="$slots.default || content">
                    <view
                        class="c-modal-bd"
                        :style="[ contentStyle ]"
                    >
                        <view v-if="content">{{ content }}</view>
                        <slot></slot>
                    </view>
                </template>
            </view>
            <view class="c-modal-ft">
                <c-colors
                    v-if="showCancel_"
                    class="c-modal__btn"
                    radius="16"
                    plain
                    :pro="['bgc', 'c']"
                    :theme="['#EDEDED', '#333']"
                    type="button"
                >
                    <c-button
                        :size="buttonSize"
                        :style="{ color: cancelColor }"
                        @click="handleCancel"
                    >{{ cancelText }}</c-button>
                </c-colors>
                <c-colors
                    v-if="showConfirm_"
                    class="c-modal__btn"
                    radius="16"
                    :pro="['bgc', 'c']"
                    :theme="['t', '#fff']"
                    type="button"
                >
                    <c-button
                        :size="buttonSize"
                        :style="{ color: confirmColor }"
                        :open-type="openType"
                        @click="handleConfirm"
                    >
                        <c-loading
                            v-if="loading"
                            color="confirmColor"
                        ></c-loading>
                        {{ loading ? '' : confirmText }}
                    </c-button>
                </c-colors>
            </view>
        </view>
        <view
            v-if="$slots.other"
            slot="other"
        >
            <slot name="other"></slot>
        </view>
    </c-popup>
</template>

<script>
export default {
    props: {
        // 是否显示modal框	
        value: {
            type: Boolean,
            default: false
        },
        // popup组件自定义class
        customClass: {
            type: String,
            default: ''
        },
        /**
         * 提示的标题
         */
        title: {
            type: [String, Boolean],
            default: '提示'
        },
        // 标题样式
        titleStyle: {
            type: Object,
            default: () => {
                return {}
            }
        },
        // 关闭按钮
        showClose: {
            type: [String, Boolean],
            default: false
        },
        /**
         * popup组件点击蒙板是否关闭,默认true关闭
         */
        maskabled: {
            type: [String, Boolean],
            default: false
        },
        /**
         * 关闭按钮位置  可选值 top-right | top-left | bottom-right | bottom-left
         */
        closePos: {
            type: String,
            default: 'top-left'
        },
        /**
         * 提示的内容
         */
        content: {
            type: String,
            default: ''
        },
        // 内容样式
        contentStyle: {
            type: Object,
            default: () => {
                return {}
            }
        },
        /**
         * 是否显示取消按钮，默认为 true
         */
        showCancel: {
            type: [String, Boolean],
            default: true
        },
        /**
         * 取消按钮的文字，默认为"取消"，最多 4 个字符
         */
        cancelText: {
            type: String,
            default: '取消'
        },
        /**
         * 取消按钮的文字颜色，默认为"#666666"
         */
        cancelColor: {
            type: String,
            default: '#333'
        },
        /**
         * 是否显示确定按钮，默认为 true
         */
        showConfirm: {
            type: [String, Boolean],
            default: true
        },
        /**
         * 确定按钮的文字，默认为"确定"，最多 4 个字符
         */
        confirmText: {
            type: String,
            default: '确定'
        },
        /**
         * 确定按钮的文字颜色，默认为"#0260fe"
         */
        confirmColor: {
            type: String,
            default: '#fff'
        },
        /**
         * 是否开启异步关闭，H5平台默认为"#007aff"
         */
        asyncClose: {
            type: [String, Boolean],
            default: false
        },
        // 内容体额外样式
        hdStyle: {
            type: Object,
            default: () => {
                return {}
            }
        },
        // 按钮提交类型
        openType: {
            type: String,
            default: ''
        },
        // 按钮大小
        buttonSize: {
            type: String,
            default: 'large'
        }
    },
    data() {
        return {
            loading: false // 确认按钮loading状态
        }
    },
    computed: {
        modalFlag: {
            get(val) {
                return val.value
            },
            set(val) {
                this.$emit('input', val)
            }
        },
        showClose_() {
            return String(this.showClose) !== 'false'
        },
        showCancel_() {
            return String(this.showCancel) !== 'false'
        },
        showConfirm_() {
            return String(this.showConfirm) !== 'false'
        },
        showTitle_() {
            return String(this.title) !== 'false'
        },
        asyncClose_() {
            return String(this.asyncClose) !== 'false'
        }
    },
    watch: {
        // 如果是异步关闭时，外部修改v-model的值为false时，重置内部的loading状态
        // 避免下次打开的时候，状态混乱
        value(n) {
            if (n === true) this.loading = false
        }
    },
    methods: {
        clearLoading() {
            this.loading = false
        },
        handleCancel() {
            this.$emit('input', false)
            const res = {
                type: 'confirm',
                detail: {
                    value: false
                }
            }
            this.$emit('cancel', res)
            this.$emit('change', res)
        },
        handleConfirm() {
            if (this.asyncClose_) {
                this.loading = true
            } else {
                this.$emit('input', false)
            }
            const res = {
                type: 'confirm',
                detail: {
                    value: true
                }
            }
            this.$emit('confirm', res)
            this.$emit('change', res)
        }
    }
}
</script>

<style lang="scss" scoped>
.c-modal {
    width: 600rpx;
    text-align: center;
    padding: 24rpx;

    &__title {
        height: auto;
        font-size: 32rpx;
        padding: 24rpx;
        line-height: 46rpx;
        @include ellipsis(2);
        font-weight: bold;
        word-wrap: break-word;
        word-break: break-all;
        white-space: pre-wrap;
    }

    &__content {
        padding: 24rpx 0;
    }

    &-bd {
        min-height: 80rpx;
        font-size: 28rpx;
        line-height: 40rpx;
        color: #666;
        // min-height: 150rpx;
        max-height: 400rpx;
        max-height: 30vh;
        overflow-y: auto;
    }

    &-ft {
        position: relative;
        font-size: 36rpx;
        line-height: 96rpx;
        @include flex(row);
        justify-content: center;
    }

    &__btn {
        flex: 1;
        max-width: 50%;
        margin: 0 12rpx;
    }
}
</style>
