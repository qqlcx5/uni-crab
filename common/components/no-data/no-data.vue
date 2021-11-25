<template>
    <view class="c-no-data">
        <view
            v-if="showImg_"
            :style="[style_]"
        >
            <c-image
                v-if="isImg_"
                :static="isStatic_"
                :src="icon"
                :width="size"
                mode="widthFix"
            />
            <!-- #ifndef APP-PLUS-NVUE -->
            <c-icons
                v-else
                class="c-no-data__img"
                :type="icon"
                :size="size"
            ></c-icons>
            <!-- #endif -->
            <text
                v-if="text_"
                class="c-no-data__text"
                :style="[ textStyle ]"
            >{{ text_ }}</text>
            <slot></slot>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        showImg: {
            type: [String, Boolean],
            default: false
        },
        icon: {
            type: String,
            default: 'common/no-data.png'
        },
        size: {
            type: [String, Number],
            default: 350
        },
        static: {
            type: [String, Boolean],
            default: false
        },
        text: {
            type: [String, Boolean],
            default: '暂无数据'
        },
        textStyle: {
            type: Object,
            default: () => {
                return {}
            }
        },
        boxStyle: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    computed: {
        isImg_() {
            return this.$c.isImg(this.icon)
        },
        isStatic_() {
            return String(this.static) !== 'false'
        },
        showImg_() {
            return String(this.showImg) !== 'false'
        },
        text_() {
            return String(this.text) === 'false' ? false : this.text
        },
        style_() {
            return this.boxStyle
        }
    }
}
</script>

<style lang="scss" scoped>
.c-no-data {
    padding: 20rpx 0;
    text-align: center;
    @include flex(column);
    align-items: center;

    &__text {
        font-size: $font-base;
        color: #999;
        line-height: 64rpx;
        // margin-top: 20rpx;
    }
}
</style>
