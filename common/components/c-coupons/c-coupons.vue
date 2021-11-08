<template>
    <view>
        <view
            class="ticket"
            :class="{'ticket-radius': isOpen}"
        >
            <view
                v-if="isUse_ && !hideTicketStatus && statusImage_"
                class="ticket-status"
                :class="[mode, couponEndClass_]"
            >
                <c-image
                    width="94"
                    :src="`guest/coupons/${statusImage_}`"
                    mode="widthFix"
                />

            </view>
            <view class="left p24">
                <view
                    v-show="tempItem.goods_img && mode != 'confirm-order'"
                    class="pr16"
                >
                    <c-image
                        size="144"
                        :src="tempItem.goods_img"
                        mode="widthFix"
                    />
                </view>
                <view class="left-content">
                    <view class="ticket__title">
                        <view class="c-ellipsis-2">{{ tempItem.full_name }}</view>
                    </view>
                    <view class="ticket__desc clamp clamp-1">{{ tempItem.coupon_time }}</view>
                    <view
                        class="ticket__bottom"
                        :class="[mode]"
                    >
                        <block v-if="mode == 'confirm-order' && isUse_">
                            <view class="ticket__info">
                                <c-colors>
                                    <c-icons
                                        class="ticket__info-icon"
                                        size="28"
                                        type="icon-jiaoyishibai"
                                    >
                                    </c-icons>
                                </c-colors>
                                <view class="ticket__info-wrapper">
                                    <c-colors>
                                        <text class="ticket__info-wrapper-txt c-ellipsis-2">{{ tempItem.reason }}</text>
                                    </c-colors>
                                </view>
                            </view>
                        </block>
                        <view
                            v-if="showRule"
                            class="ticket__time flex-space-between pt8"
                        >
                            <view class="flex">
                                <c-colors
                                    v-if="tempItem.write_off_channel_label"
                                    :pro="['c', 'bdc']"
                                    type="button"
                                    radius="8"
                                    :theme="couponsStatus_"
                                >
                                    <c-button
                                        class="channel-text"
                                        height="36"
                                        font-size="24"
                                        type="mini"
                                    >{{ tempItem.write_off_channel_label }}</c-button>
                                </c-colors>
                            </view>
                            <view
                                class="rule flex-ajcenter"
                                @click="isOpen = !isOpen"
                            >
                                <text class="c-999">规则说明</text>
                                <c-icons
                                    size="30"
                                    class="ticket__xiala"
                                    color="#ccc"
                                    type="icon-tiaozhuan"
                                    :rotate="isOpen ? 270 : 90"
                                ></c-icons>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <c-colors
                :pro="['bgc']"
                :theme="['t|0.1']"
                style="display: flex;"
            >
                <view
                    class="right"
                    :style="[ bgColor_ ]"
                    :class="[mode, {'is-use': isUse_}, couponEndClass_]"
                >
                    <c-colors :theme="textTheme_">
                        <view
                            v-if="tempItem.coupon_type !== 2 && tempItem.coupon_type !== 4 && tempItem.coupon_type !== 5"
                            class="price-com"
                            :data-price_prefix="pricePrefix_"
                        >
                            {{ tempItem.coupon_price }}</view>
                        <view
                            v-else-if="tempItem.coupon_type == 2"
                            class="discount"
                        >
                            {{ tempItem.show_coupon_price }}</view>
                        <view
                            v-else-if="tempItem.coupon_type == 4"
                            class="exchange"
                        >{{ tempItem.condition }}
                        </view>
                        <view
                            v-else-if="tempItem.coupon_type == 5"
                            class="exchange z-index"
                        >免邮券
                        </view>
                    </c-colors>
                    <c-colors
                        v-if="tempItem.coupon_type !== 4 && tempItem.coupon_type !== 5"
                        :theme="textTheme_"
                    >
                        <view class="ticket__desc">{{ tempItem.condition }}</view>
                    </c-colors>
                    <c-colors
                        v-show="showbtn_"
                        :theme="theme_"
                        class="mt12"
                        :pro="['c', 'bdc', 'bgc']"
                        radius="26"
                    >
                        <view
                            class="ticket__btn"
                            @click="handleUse(index)"
                        >{{ btnText_ }}</view>
                    </c-colors>
                </view>
            </c-colors>
        </view>
        <view
            v-show="isOpen"
            class="ticket-more p24 c-underline__top"
        >
            <view v-if="tempItem.rule && tempItem.rule.length">
                <block
                    v-for="text in tempItem.rule"
                    :key="text"
                >
                    <text class="mr24">{{ text }}</text>
                </block>
            </view>
            <view v-else>无</view>
        </view>
    </view>
</template>
<script>
import pushMessage from '@/common/mixins/pushMessage'

export default {
    name: 'CCoupons',
    props: {
        item: {
            type: Object,
            default() {
                return {}
            }
        },
        // receive领券中心 my-coupon我的优惠券 confirm-order确认订单, goods商品详情和购物车
        mode: {
            type: String,
            default: 'my-coupon'
        },
        // 数组的下标
        index: {
            type: Number,
            default: 0
        },
        // 当使用状态为去使用时,点击去使用时是否跳转页面
        switchPage: {
            type: Boolean,
            default: true
        },
        // 是否显示规则说明
        showRule: {
            type: Boolean,
            default: true
        },
        // 隐藏优惠券状态
        hideTicketStatus: {
            type: Boolean,
            default: false
        },
        // 是否显示按钮
        showbtn: {
            type: [Boolean, String],
            default: true
        },
        // 优惠券右边背景颜色
        bgColor: {
            type: [Boolean, String],
            default: false
        },
        // 优惠券右边字体颜色
        textColor: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isOpen: false,
            tempItem: {}
        }
    },
    computed: {
        // 优惠券右边背景颜色
        bgColor_() {
            const style = {}
            if (this.bgColor) {
                style.background = this.isUse_ ? this.mode === 'receive' ? '#fff' : '#ccc' : this.bgColor
            }
            return style
        },
        // 字体颜色控制
        textTheme_() {
            if (this.mode === 'receive') return ['#FA3F1E']
            if (this.mode === 'my-coupon') return [this.isUse_ ? '#fff' : '#FA3F1E']
            if (this.mode === 'confirm-order') return this.isUse_ ? ['#fff'] : ['t']
            if (this.mode === 'goods') return this.tempItem.user_receive_status === 2 ? ['#fff'] : [this.textColor ? this.textColor : 't']
            if (this.mode === 'copartner') return (this.tempItem.coupon_invalid === 1 || this.tempItem.coupon_invalid === 2) ? ['#fff'] : [this.textColor ? this.textColor : 't']
            return ['t']
        },
        theme_() {
            if (this.mode === 'receive' || this.mode === 'my-coupon') {
                return this.isUse_ ? ['#FA3F1E', '#FA3F1E', '#fff'] : [
                    '#fff',
                    'transparent', '#FA3F1E'
                ]
            }
            if (this.mode === 'goods' || this.mode === 'copartner') {
                return this.isUse_ ? ['t', 't', 'transparent'] : [
                    '#fff',
                    'transparent', 't'
                ]
            }
            if (this.mode === 'confirm-order') {
                return this.isUse_ ? ['t', 't', 'transparent'] : ['#fff', 'transparent',
                    't'
                ]
            }
            return ['#497FD4', 'transparent', '#fff']
        },
        // 图片状态logo
        statusImage_() {
            if (this.mode === 'receive' || this.mode === 'confirm-order') {
                return this.tempItem.user_receive_status !== 2 ? 'coupons-receiveds.png' : 'coupons-end.png'
            }

            if (this.mode === 'my-coupon') return this.tempItem.status === 1 ? (this.tempItem.used_channel === 10 ? 'offline-use.png' : 'online-use.png') : 'coupons-fail.png'
            if (this.mode === 'goods') {
                return this.tempItem.user_receive_status === 0 ? 'coupons-receiveds.png'
                    : 'coupons-end.png'
            }
            if (this.mode === 'copartner') {
                if (this.tempItem.coupon_invalid === 1) {
                    return 'coupons-fail.png'
                } else if (this.tempItem.coupon_invalid === 2) {
                    return 'coupons-end.png'
                }
                return ''
            }
            return ''
        },
        // 优惠券是否使用
        isUse_() {
            if (this.mode === 'receive') return this.tempItem.user_receive_status !== 1
            if (this.mode === 'my-coupon') return this.tempItem.status !== 0
            if (this.mode === 'confirm-order') return this.tempItem.can_use === 0
            if (this.mode === 'goods') return this.tempItem.user_receive_status !== 1
            if (this.mode === 'copartner') return this.tempItem.coupon_invalid === 1 || this.tempItem.coupon_invalid === 2
            return false
        },
        showbtn_() {
            if (String(this.showbtn) === 'false') return false
            if (this.mode === 'receive') return this.tempItem.user_receive_status !== 2
            if (this.mode === 'my-coupon' || this.mode === 'goods') return !this.isUse_
            if (this.mode === 'confirm-order' || this.mode === 'copartner') return false
            return false
        },
        btnText_() {
            if (this.mode === 'receive' || this.mode === 'goods') return this.isUse_ ? '去使用' : '立即领取'
            return '去使用'
        },
        // 图片状态logo的class
        couponEndClass_() {
            if (this.mode === 'goods' && this.tempItem.user_receive_status === 2) return 'coupons-end'
            if (this.mode === 'copartner' && (this.tempItem.coupon_invalid === 1 || this.tempItem.coupon_invalid === 2)) return 'coupons-end'
            return ''
        },
        couponsStatus_() {
            if (this.mode === 'receive') return ['t', 't']
            return this.tempItem.status === 0 ? ['t', 't'] : ['#999', '#999']
        }
    },
    watch: {
        item: {
            handler(val) {
                this.tempItem = val
            },
            immediate: true
        }
    },
    methods: {
        handleUse(value) {
            console.log(this.tempItem.use_type, this.tempItem.obj_id)
            const params = {}
            // 当优惠券存在线下核销时, 不走原本的跳转逻辑
            if ((this.mode === 'my-coupon' || (this.mode === 'receive' && this.isUse_)) && Array.isArray(this.tempItem.write_off_channel_text) && this.tempItem.write_off_channel_text.findIndex(o => Number(o.value) === 10) !== -1) {
                this.$emit('change', this.tempItem)
                return
            }
            if (this.tempItem.use_type === 2) {
                params.cat_id = this.tempItem.obj_id
            } else if (this.tempItem.use_type === 3 && (this.tempItem.user_receive_status === 0 || this.mode ===
                'my-coupon')) {
                params.goods_id = this.tempItem.obj_id
                if (String(this.tempItem.obj_id).indexOf(',') !== -1) {
                    console.log(params)
                    this.$jump('searchList', params)
                    return
                }
                this.$jumpDetail('goodsDetails', this.tempItem.obj_id)
                return
            } else if (this.tempItem.use_type === 4 && (this.tempItem.user_receive_status === 0 || this.mode ===
                'my-coupon')) {
                params.no_goods_ids = this.tempItem.obj_id
            }
            if (this.mode === 'my-coupon') {
                return this.$jump('searchList', params)
            }
            if (this.isUse_ && this.switchPage) return this.$jump('searchList', params)
            this.handleGiveCoupon(value)
            // let val = { detail: { value } }
            // this.$emit('click', val)
        },
        async handleGiveCoupon(index) {
            const params = {}
            params.coupon_relation_activity_id = this.tempItem.coupon_relation_activity_id || -1
            params.coupon_id = this.tempItem.coupon_id
            let coupon_status = null
            try {
                const { data } = await this.$http('giveCoupon', params)
                this.$set(this.tempItem, 'user_receive_status', 0)
                if (data.offline_scan_code) {
                    this.$set(this.tempItem, 'offline_scan_code', data.offline_scan_code || '')
                }
                coupon_status = 0
                // #ifdef MP-WEIXIN
                pushMessage.call(this, 'coupon')
                // #endif
            } catch ({ data }) {
                const {
                    user_receive_status
                } = data
                user_receive_status && this.$set(this.tempItem, 'user_receive_status', user_receive_status)
                coupon_status = user_receive_status
            }
            /**
             * 抛出优惠券状态
             */
            if (coupon_status !== '' && coupon_status !== undefined) {
                this.$emit('click', {
                    detail: {
                        user_receive_status: coupon_status,
                        index
                    }
                })
            }
        }
    }
}
</script>
<style lang="scss">
.ticket {
    display: flex;
    min-height: 192rpx;
    border-radius: 16rpx;
    overflow: hidden;
    position: relative;
    z-index: 10;
    background: #fff;
    &-status {
        position: absolute;
        right: 200rpx;
        top: 20rpx;
        z-index: 5;

        // &.goods,
        // &.copartner {
        //     right: 12rpx;
        //     top: 0;

        //     &.coupons-end {
        //         right: 180rpx;
        //         top: 22rpx;
        //     }
        // }
    }

    &-radius {
        //border-radius: 16rpx 16rpx 0 0;
        box-shadow: 0 5rpx 12rpx 0 rgba(0, 0, 0, 0.05);
    }

    &-more {
        @include tst();
        background: #ffffff;
        border-radius: 0px 0px 16rpx 16rpx;
        font-size: 22rpx;
        color: #999;
        @include flex(column);
        // 小圆圈样式问题
        position: relative;
        margin-top: -12rpx;
        padding-top: 36rpx !important;
    }

    .left {
        flex: 1;
        width: 500rpx;
        display: flex;
        background-color: #fff;

        .left-content {
            flex: 1;
            @include flex(column);
            z-index: 5;
            position: relative;
        }
    }

    .right {
        flex: 1;

        .price-com {
            font-size: 48rpx;
            line-height: 1;
            z-index: 10;
            position: relative;
        }

        .discount {
            display: inline-flex;
            align-items: flex-end;
            font-size: 48rpx;
            color: inherit;
            line-height: 1;
            position: relative;
            z-index: 10;

            &::after {
                position: relative;
                bottom: 6rpx;
                font-weight: normal;
                content: "折";
                font-size: 46%;
                color: inherit;
            }
        }

        .exchange {
            white-space: normal;
            font-size: 32rpx;
            font-weight: bold;
            // padding-bottom: 12rpx;
            white-space: normal;
            z-index: 10;
            position: relative;
        }

        //领券中心&&我的优惠券
        &.receive {
            // background: #FFEDEA;

            &.is-use {
                background: #fff;
                border-left: 4rpx dashed #f5f5f5;
            }
        }

        //商品详情&&购物车
        &.goods {
            // background: #FFEDEA;

            &.is-use {
                background: #fff;
                border-left: 4rpx dashed #f5f5f5;
            }

            &.coupons-end {
                background: #ccc;
            }
        }
        &.copartner {
            &.coupons-end {
                background: #ccc;
            }
        }

        &.my-coupon {
            background-color: #2e75e5;
            background: linear-gradient(135deg, #56aaff 0%, #2e75e5 100%);

            &.is-use {
                background: #ccc;
            }
        }

        @include flex(column);
        justify-content: center;
        align-items: center;
        position: relative;
        width: 200rpx;

        &::after,
        &::before {
            content: "";
            width: 24rpx;
            height: 24rpx;
            background: #f5f5f5;
            border-radius: 24rpx;
        }

        &::before {
            @include abs(0, null, null, 0);
            transform: translate3d(-50%, -12rpx, 0);
        }

        &::after {
            @include abs(null, null, 0, 0);
            transform: translate3d(-50%, 12rpx, 0);
        }
    }

    &__title {
        font-weight: bold;
        line-height: 1.2;
        .c-ellipsis-2 {
            width: 100%;
        }
    }

    &__desc {
        padding-top: 8rpx;
        font-size: 24rpx;
    }

    &__time {
        font-size: 24rpx;
        color: #999999;
        .rule {
            white-space: nowrap;
        }
    }

    &__bottom:not(.confirm-order) {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 1;
    }

    &__btn {
        font-size: 24rpx;
        color: inherit;
        background-color: inherit;
        border-width: 2rpx;
        border-style: solid;
        border-color: inherit;
        padding: 8rpx 0;
        width: 144rpx;
        text-align: center;
        border-radius: 26rpx;
    }

    &__info {
        @include flex(row);
        align-items: center;

        &-wrapper {
            min-width: 0;

            &-txt {
                font-size: 20rpx;
            }
        }

        &-icon {
            @include flex(row);
            padding-right: 8rpx;
        }
    }
    .channel-text {
        display: inline-block;
        width: 120%;
        transform-origin: 0 center;
        transform: scale(0.9);
        // #ifdef H5
        line-height: 34rpx;
        // #endif
    }
}
</style>
