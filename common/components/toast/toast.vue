<template>
    <c-popup
        v-model="modalFlag"
        class="c-toast"
        bg-color="rgba(0, 0, 0, .6)"
        show-close="false"
        radius="8"
        mask="false"
        zoom="false"
    >
        <view
            class="c-toast__content"
            :class="[ row_ ? 'c-toast__content--row' : '']"
        >
            <template v-if="icon">
                <c-image
                    v-if="isImg_"
                    :src="icon"
                    :width="iconSize"
                    mode="widthFix"
                />
                <c-icons
                    v-else
                    :type="icon"
                    :size="iconSize"
                    color="#fff"
                />
            </template>
            <view
                class="c-toast__text"
                :style="[ textStyle ]"
            >
                {{ text }}
                <slot />
            </view>
        </view>
    </c-popup>
</template>

<script>
export default {
    name: 'CToast',
    props: {
        /**
         * 是否显示
         */
        value: {
            type: Boolean,
            default: false
        },
        // 图标
        icon: {
            type: String,
            default: ''
        },
        // 图标大小
        iconSize: {
            type: [String, Number],
            default: 110
        },
        // 是否开启行排列
        row: {
            type: [Boolean, String],
            default: false
        },
        // 文本
        text: {
            type: String,
            default: ''
        },
        // 文本样式
        textStyle: {
            type: Object,
            default: () => {
                return {}
            }
        },
        // 动画时长 单位ms  200ms = 0.2s
        duration: {
            type: [String, Number],
            default: 1500
        }
    },
    computed: {
        row_() {
            return String(this.row) !== 'false'
        },
        isImg_() {
            return this.$c.isImg(this.icon)
        },
        modalFlag: {
            get(val) {
                return val.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    watch: {
        modalFlag: {
            handler(val) {
                if (val) {
                    this.$c.throttle(() => {
                        this.$emit('input', false)
                    }, this.duration)
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.c-toast {
    &__content {
        padding: 24rpx;
        color: #fff;
        min-width: 256rpx;
        @include flex();
        align-items: center;
        justify-content: center;
        &--row {
            flex-direction: row;
        }
    }
    &__text {
        padding: 0 8rpx;
        font-size: 28rpx;
        line-height: 40rpx;
    }
}
</style>
