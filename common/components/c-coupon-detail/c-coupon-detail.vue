<template>
    <c-popup
        v-model="modalFlag"
        :z-index="zIndex"
        mode="bottom"
        radius="24rpx 24rpx 0 0"
    >
        <view
            class="select-coupon-modal"
            :style="[modalStyle]"
        >
            <view class="c-modal__title">{{ title }}</view>
            <view class="coupon-detail-box">
                <view class="coupon-detail-box__item">
                    <view class="coupon-detail-box__item-title">商品总额</view>
                    <view class="coupon-detail-box__item-val d-din-bold">{{ pricePrefix_ }}{{ goodsPrice }}</view>
                </view>
                <view class="coupon-detail-box__item">
                    <view class="coupon-detail-box__item-title">优惠券</view>
                    <view class="coupon-detail-box__item-val d-din-bold">->{{ pricePrefix_ }}{{ couponPrice }}</view>
                </view>
                <view class="coupon-detail-box__item">
                    <view class="coupon-detail-box__item-title">共优惠</view>
                    <c-colors>
                        <view class="coupon-detail-box__item-val d-din-bold">->{{ pricePrefix_ }}{{ deductionPrice }}</view>
                    </c-colors>
                </view>
            </view>
        </view>
    </c-popup>
</template>

<script>
export default {
    name: 'SsCouponDetail',
    props: {
        /**
         * 双向绑定值
         */
        value: {
            type: Boolean,
            default: false
        },
        /**
         * popup弹出层的标题
         */
        title: {
            type: String,
            default: '优惠'
        },
        // 默认999 比系统高1
        zIndex: {
            type: [String, Number],
            default: 999
        },
        /**
         * 外部传入的modal样式
         */
        modalStyle: {
            type: Object,
            default: () => { }
        },
        goodsPrice: {
            type: [String, Number],
            default: 0
        },
        couponPrice: {
            type: [String, Number],
            default: 0
        },
        deductionPrice: {
            type: [String, Number],
            default: 0
        }
    },
    data() {
        return {
            modalFlag: false
        }
    },
    watch: {
        value: {
            handler(val) {
                this.modalFlag = val
            },
            immediate: true
        },
        modalFlag(val) {
            this.$emit('input', val)
        }
    }
}
</script>

<style lang="scss" scoped>
.select-coupon-modal {
    background-color: #fff;

    .coupon-detail-box {
        @include flex;
        height: 500rpx;
        padding: 50rpx 24rpx 0;

        &__item {
            @include flex(row);
            justify-content: space-between;
            margin-bottom: 40rpx;

            &-val {
                font-weight: bold;
                font-size: 28rpx;
            }

            &-title {
                font-weight: bold;
                font-size: 26rpx;
            }

            &:last-child {
                .coupon-detail-box__item-title {
                    font-weight: bold;
                    font-size: 28rpx;
                }

                .coupon-detail-box__item-val {
                    font-size: 32rpx;
                }
            }
        }
    }
}
</style>
