<template>
    <view
        class="search-box flex-ajcenter"
        :style="{backgroundColor: bgColor}"
    >
        <slot name="before" />
        <c-input
            v-model="keyword"
            :confirm-type="confirmType"
            :focus="focus_"
            class="search-box__input flex-1"
            :style="{backgroundColor: inputColor}"
            :radius="32"
            :disabled="!!linkUrl || disabled_"
            :placeholder="placeholder"
            :placeholder-style="placeholderStyle"
            :clearable="clearable"
            @click="inputClick"
            @confirm="confirmInput"
        >
            <view
                slot="before"
                class="search-box__before flex-ajcenter"
            >
                <c-colors
                    :theme="[searchIconColor]"
                    :pro="['c']"
                >
                    <c-icons
                        size="32"
                        color="false"
                        type="zsuicon-sousuo"
                    ></c-icons>
                </c-colors>
            </view>
        </c-input>
        <slot name="after" />
    </view>
</template>

<script>
export default {
    options: { styleIsolation: 'shared' },
    props: {
        // 是否禁用
        disabled: {
            type: [Boolean, String],
            default: false
        },
        /**
         * 传入Route的name值，点击会跳转
         */
        linkUrl: {
            type: String,
            default: ''
        },
        // 默认值
        value: {
            type: String,
            default: ''
        },
        // 是否聚焦
        focus: {
            type: [String, Boolean],
            default: false
        },
        // 背景颜色
        bgColor: {
            type: String,
            default: '#fff'
        },
        // 搜索框背景颜色
        inputColor: {
            type: String,
            default: '#f5f5f5'
        },
        placeholder: {
            type: String,
            default: '输入搜索关键词'
        },
        // placeholder样式
        placeholderStyle: {
            type: String,
            default: ''
        },
        // 清除按钮
        clearable: {
            type: Boolean,
            default: false
        },
        // 搜索icon颜色
        searchIconColor: {
            type: String,
            default: '#999'
        }
    },
    data() {
        return {
            keyword: '',
            confirmType: 'search'
        }
    },
    computed: {
        focus_() {
            return String(this.focus) !== 'false'
        },
        disabled_() {
            return String(this.disabled) !== 'false'
        }
    },
    watch: {
        value: {
            handler(val) {
                this.keyword = val
            },
            immediate: true
        },

        keyword(val) {
            this.$emit('input', val)
        }
    },
    mounted() {
        // ios系统版本超过15会有搜索框
        // #ifdef H5
        if (uni.getSystemInfoSync().system.indexOf('iOS 15') !== -1) { this.confirmType = 'done' }
        // #endif
    },
    methods: {
        inputClick(e) {
            if (!this.linkUrl) return this.$emit('click', e)
            const pages = getCurrentPages()
            if (pages.length > 1 && this.linkUrl.indexOf(pages[pages.length - 2].route) !== -1) {
                this.$back()
            } else {
                this.$jump(this.linkUrl)
            }
        },
        confirmInput(e) {
            this.$emit('confirm', {
                type: e.type,
                detail: {
                    value: this.keyword
                }
            })
        }
    }
}
</script>

<style lang="scss">
.search-box {
    background-color: #fff;
    padding: 16rpx 24rpx;
    &__input {
        padding: 8rpx 0;
        border-radius: 32px;
        /deep/ .c-input-view {
            background-color: transparent;
        }
    }
    &__before {
        padding-left: 16rpx;
    }
    &__after {
        padding-left: 24rpx;
        font-size: 28rpx;
        color: #333333;
    }
    &__before--image {
        width: 32rpx;
        height: 32rpx;
        display: block;
    }
}
.search-box.flex-ajcenter {
    width: 100%;
}
</style>
