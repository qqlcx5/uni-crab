<template>
    <view
        class="search-box flex-ajcenter"
        :style="{backgroundColor: bgColor}"
    >
        <slot></slot>
        <c-input
            v-model="keyword"
            confirm-type="search"
            :focus="focus_"
            class="search-box__input flex-1"
            :radius="32"
            :disabled="!!linkUrl"
            :placeholder="placeholder"
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
                        type="icon-sousuo"
                    ></c-icons>
                </c-colors>
            </view>
        </c-input>
        <view
            v-if="mode === 'listMode'"
            class="search-box__after"
            @click="changeMode"
        >
            <c-icons
                v-if="newListMode === 'column'"
                size="48"
                color="#999999"
                type="icon-shupai"
            ></c-icons>
            <c-icons
                v-else
                type="icon-hengpai"
                size="48"
                color="#999999"
            ></c-icons>
        </view>
        <view
            v-if="mode === 'searchText' && confirmBtn_"
            class="search-box__after"
            @click="confirmInput"
        >搜索</view>
        <view
            v-if="mode === 'searchText' && cancleBtn_"
            class="search-box__after"
            @click="resetInput"
        >{{ cancelText }}</view>
    </view>
</template>

<script>
export default {
    props: {
        /**
         * listMode 列表模式，带切换的，会有@changeMode事件
         * searchText 搜索字眼  会有@confirm事件
         */
        mode: {
            type: String,
            default: 'none'
        },
        confirmBtn: {
            type: [Boolean, String],
            default: true
        },
        cancleBtn: {
            type: [Boolean, String],
            default: false
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        /**
         * 传入Route的name值，点击会跳转
         */
        linkUrl: {
            type: String,
            default: ''
        },
        value: {
            type: String,
            default: ''
        },
        focus: {
            type: [String, Boolean],
            default: false
        },
        bgColor: {
            type: String,
            default: '#fff'
        },
        listMode: {
            type: String,
            default: 'column'
        },
        placeholder: {
            type: String,
            default: '输入搜索关键词'
        },
        clearable: {
            type: Boolean,
            default: false
        },
        searchIconColor: {
            type: String,
            default: '#999'
        }
    },
    data() {
        return {
            keyword: '',
            newListMode: ''
        }
    },
    computed: {
        focus_() {
            return String(this.focus) !== 'false'
        },
        confirmBtn_() {
            return String(this.confirmBtn) !== 'false'
        },
        cancleBtn_() {
            return String(this.cancleBtn) !== 'false'
        }
    },
    watch: {
        value: {
            handler(val) {
                this.keyword = val
            },
            immediate: true
        },
        listMode: {
            handler(val) {
                this.newListMode = val
            },
            immediate: true
        },
        keyword(val) {
            this.$emit('input', val)
        }
    },
    methods: {
        changeMode() {
            this.newListMode = this.newListMode === 'column' ? 'row' : 'column'
            this.$emit('changeMode', {
                type: 'change',
                detail: {
                    value: this.newListMode
                }
            })
        },
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
        },
        resetInput(e) {
            this.$emit('reset')
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
        background-color: $bg-color;
        border-radius: 32px;
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
