<template>
    <view>
        <view class="c-recommend flex-ajcenter ptb24">
            <c-colors
                class="c-recommend-block1 move"
                :theme="['t|0.5']"
                :pro="['bgc']"
                radius="8"
            >
                <text class="c-recommend-block1__text"></text>
            </c-colors>
            <c-colors
                class="c-recommend-block2"
                :theme="['t']"
                :pro="['bgc']"
                radius="8"
            >
                <text class="c-recommend-block2__text"></text>
            </c-colors>
            <c-colors>
                <view class="plr24">{{ title }}</view>
            </c-colors>
            <c-colors
                class="c-recommend-block1"
                :theme="['t|0.5']"
                :pro="['bgc']"
                radius="8"
            >
                <text class="c-recommend-block1__text"></text>
            </c-colors>
            <c-colors
                class="c-recommend-block2 move"
                :theme="['t']"
                :pro="['bgc']"
                radius="8"
            >
                <text class="c-recommend-block2__text"></text>
            </c-colors>
        </view>
        <view
            v-if="desc"
            class="c-recommend-desc"
        >
            <text class="c-recommend-desc--text">{{ desc }}</text>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: '推荐商品'
        },
        desc: {
            type: String,
            default: ''
        }
    }
}
</script>
<style lang="scss" scoped>
.c-recommend {
    font-size: 32rpx;
    &-block1,
    &-block2 {
        transform: rotate(-45deg);
        position: relative;
        &__text {
            height: 8rpx;
        }
    }
    &-block1 {
        top: -2rpx;
        &__text {
            width: 28rpx;
        }
        &.move {
            left: 16rpx;
        }
    }
    &-block2 {
        top: 2rpx;
        &__text {
            width: 36rpx;
        }
        &.move {
            left: -16rpx;
        }
    }
    &-desc {
        text-align: center;
        line-height: 40rpx;
        position: relative;
        &::before {
            content: '';
            background-color: #e0e0e0;
            height: 1px;
            transform: translateY(-50%) scaleY(0.5);
            @include abs(50%, 0, null, 0);
        }
        &--text {
            display: inline-block;
            background-color: $bg-color;
            padding: 0 24rpx;
            position: relative;
            z-index: 2;
            font-size: 24rpx;
            color: #666666;
        }
    }
}
</style>
