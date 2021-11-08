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
            <block v-if="mode === 'confirm-order'">
                <view
                    :class="[mode]"
                    class="c-modal__list-title"
                >
                    您已选中优惠券{{ coupon_id ? 1 : 0 }}张，可抵用
                    <c-colors>{{ pricePrefix_ }}{{ temp_coupon_price }}</c-colors>
                </view>
            </block>
            <scroll-view
                scroll-y
                class="c-modal__content"
                :style="[{ height: height}]"
                :lower-threshold="100"
                @scrolltolower="loadMornList"
            >
                <view
                    v-if="showTips_"
                    class="c-modal__tips"
                >
                    <view class="c-modal__tips-promotion">
                        <view class="coupon-tag-wrapper">
                            <c-colors
                                type="button"
                                :pro="['bgc']"
                                :theme="['t|0.1']"
                                radius="4rpx"
                            >
                                <view class="coupon-tag">{{ tipTitle_ }}</view>
                            </c-colors>
                        </view>
                        <view class="c-modal__tips-promotion-list">
                            <template v-if="mode != 'integral'">
                                <text
                                    v-for="tip in promotionTips"
                                    :key="tip.coupon_relation_activity_id"
                                    class="coupon-promotion-text"
                                >{{ tip.describe }}</text>
                            </template>
                            <template v-else>
                                <text class="coupon-promotion-text">{{ integralInfo.credit }}</text>
                                <text
                                    v-if="integralInfo.order"
                                    class="coupon-promotion-text"
                                >{{ integralInfo.order || '' }}</text>
                                <text
                                    v-if="integralInfo.time"
                                    class="coupon-promotion-subText"
                                >{{ integralInfo.time || '' }}</text>
                            </template>
                        </view>
                    </view>
                    <!-- 定金的界面 -->
                    <!-- <view class="c-modal__tips-promotion mt24" v-if="mode == 'integral' && depositInfo">
                            <view class="coupon-tag-wrapper">
                                <c-colors type="button" :pro="['bgc']" :theme="['t|0.1']" radius="4rpx">
                                    <view class="coupon-tag">定金</view>
                                </c-colors>
                            </view>
                            <view class="c-modal__tips-promotion-list">
                                <text class="coupon-promotion-text">{{ depositInfo.msg }}</text>
                                <text class="coupon-promotion-subText">{{ depositInfo.activityTime || '' }}</text>
                            </view>
                        </view> -->
                </view>
                <view class="c-modal__list">
                    <view
                        v-if="showListTitle_"
                        class="c-modal__list-title"
                    >{{ listTilte }}</view>
                    <view
                        v-if="radioType_"
                        :class="[mode]"
                    >
                        <c-radio-group
                            v-model="temp_coupon_id"
                            class="c-modal__list-content"
                            wrap
                            @change="changeCoupon"
                        >
                            <block
                                v-for="(item, index) in pageList"
                                :key="index"
                            >
                                <c-radio
                                    shape="circle"
                                    :name="item.user_coupon_record_id"
                                    :disabled="item.can_use === 0"
                                    cancel-enble
                                >
                                    <c-coupons
                                        hide-ticket-status
                                        :show-rule="false"
                                        :item="item"
                                        :index="index"
                                        :switch-page="false"
                                        mode="confirm-order"
                                    />
                                </c-radio>
                            </block>
                        </c-radio-group>
                    </view>
                    <block v-else>
                        <view
                            v-for="(item, index) in pageList"
                            :key="index"
                            class="coupons-wrapper"
                        >
                            <view class="coupons-wrapper__item">
                                <c-coupons
                                    :item="item"
                                    :index="index"
                                    :switch-page="false"
                                    mode="goods"
                                    @click="handleGiveCoupon"
                                />
                            </view>
                        </view>
                    </block>
                    <c-no-data
                        v-if="lodingText && mode !== 'integral'"
                        :show-img="noData"
                        :text="lodingText"
                        icon="common/no-coupon.png"
                    > </c-no-data>
                </view>
            </scroll-view>
            <view
                v-if="showBottomBtn_"
                :class="[mode]"
                class="p24"
            >
                <c-colors
                    :theme="['t', '#fff']"
                    :pro="['bgc', 'c']"
                    radius="8"
                >
                    <c-button @click="popupConfirm">确定</c-button>
                </c-colors>
            </view>
        </view>
    </c-popup>
</template>

<script>
import listMixins from '@/common/mixins/list'
export default {
    name: 'SsCouponPopup',
    options: {
        styleIsolation: 'shared'
    },
    mixins: [listMixins],
    props: {
        /**
         * 双向绑定值
         */
        value: {
            type: Boolean,
            default: false
        },
        /**
         * 优惠券列表数据
         */
        list: {
            type: Array,
            default: () => []
        },
        /**
         * popup弹出层的标题
         */
        title: {
            type: String,
            default: '优惠'
        },
        /**
         * 列表的标题
         */
        listTilte: {
            type: String,
            default: '可领取优惠券'
        },
        height: {
            type: String,
            default: '968rpx'
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
        /**
         * 请求的接口
         */
        ajaxName: {
            type: String,
            default: ''
        },
        /**
         * 外部传入的请求参数
         */
        ajaxParams: {
            type: Object,
            default: () => { }
        },
        /**
         * onload是否自己去请求
         */
        autoLoad: {
            type: Boolean,
            default: true
        },
        // confirm-order确认订单使用, common公共使用, good-detail商品详情, integral积分调用
        mode: {
            type: String,
            default: 'common'
        },
        integralInfo: {
            type: Object,
            default: () => {
                return {}
            }
        },
        // 定金的信息
        depositInfo: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            modalFlag: false, // popup显示/隐藏控制参数
            defaultParams: {}, // 默认的参数
            pageCouponList: [],
            pageList: [],
            reqName: '',
            autoReq: '',
            page: 1,
            limit: 500,
            coupon_id: null, // 确认订单优惠券id
            temp_coupon_id: null, // confirm-order模式时临时的优惠券id
            coupon_price: null, // 确认订单优惠券价格
            temp_coupon_price: null,
            couponList: [], // 确认订单优惠券列表
            promotionTips: [] // 商品详情促销信息
        }
    },
    computed: {
        // popup弹框中底部的按钮
        showBottomBtn_() {
            if (this.mode === 'confirm-order') return true
            return false
        },
        // 促销相关提示信息
        showTips_() {
            if (this.mode === 'good-detail' && this.promotionTips.length) return true
            if (this.mode === 'integral') return true
            return false
        },
        // 列表数据的标题
        showListTitle_() {
            if (this.mode === 'common' || this.mode === 'good-detail') return true
            return false
        },
        // 列表是否为c-radio类型
        radioType_() {
            if (this.mode === 'confirm-order') return true
            return false
        },
        tipTitle_() {
            if (this.mode === 'integral') return '积分'
            return '促销'
        }
    },
    watch: {
        value: {
            handler(val) {
                this.modalFlag = val
                if (val) {
                    this.temp_coupon_id = this.coupon_id
                    this.temp_coupon_price = this.coupon_price
                }
            },
            immediate: true
        },
        ajaxParams: {
            handler(val) {
                if (this.mode === 'confirm-order' && val.address_id === undefined) return
                this.reqName = this.ajaxName
                this.defaultParams = this.ajaxParams
                this.autoLoad && this.initPage(false)
            },
            deep: true,
            // #ifdef H5
            immediate: true
            // #endif
        },
        modalFlag(val) {
            this.$emit('input', val)
            if (!val) {
                if (this.mode === 'confirm-order' || this.mode === 'good-detail') {
                    this.splitCoupons(this.couponList)
                } else {
                    this.splitCoupons(this.list)
                }
            }
        },
        list(val) {
            this.splitCoupons(val)
        }
    },
    methods: {
        /**
         * 商品详情优惠券领取弹框点击
         * @param {Object} val
         */
        async handleGiveCoupon(e) {
            if (this.mode === 'good-detail') {
                const { user_receive_status, index } = e.detail
                this.couponList[index] && this.$set(this.couponList[index], 'user_receive_status', user_receive_status)
                this.pageList[index] && this.$set(this.pageList[index], 'user_receive_status', user_receive_status)
            }
            this.$emit('btnClick', e)
        },
        /**
         * 请求数据完成
         */
        finishInit(data) {
            this.noData = false
            if (this.mode === 'confirm-order') {
                const { coupon_price, user_coupon_record_id, list = [] } = data
                // 将最优的优惠券放在第一位
                user_coupon_record_id &&
                    list.map((item, index) => {
                        if (item.user_coupon_record_id === user_coupon_record_id) {
                            list.unshift(list.splice(index, 1)[0])
                        }
                    })
                this.couponList = list
                this.coupon_id = user_coupon_record_id
                this.temp_coupon_id = user_coupon_record_id
                this.coupon_price = coupon_price
                this.temp_coupon_price = coupon_price
                this.splitCoupons(this.couponList)
            } else if (this.mode === 'good-detail') {
                const { no_threshold = {}, threshold = {} } = data
                this.couponList = no_threshold.list || []
                this.promotionTips = threshold.list || []
                this.splitCoupons(this.couponList)
            }
            this.$emit('loaded', {
                type: 'loaded',
                detail: data
            })
        },
        loadMornList() {
            if (this.pageCouponList.length) {
                const item = this.pageCouponList.shift()
                this.pageList.push.apply(this.pageList, item)
                !this.pageCouponList.length && (this.lodingText = '- 我是有底线的 -')
            } else {
                this.lodingText = '- 我是有底线的 -'
            }
        },
        /**
         * 当优惠券过多时,防止卡顿,先进行分组,利用scrollView的触底事件一点点的加载
         * @param arr 优惠券列表
         * @param size 划分数组的大小
         */
        chunk(arr, size) {
            const list = []
            let current = []
            arr.forEach((t) => {
                current.push(t)
                if (current.length === size) {
                    list.push(current)
                    current = []
                }
            })
            if (current.length) {
                list.push(current)
            }
            return list
        },
        /**
         * 对优惠券进行分组
         */
        splitCoupons(arr = []) {
            if (arr.length > 10) {
                this.lodingText = '数据加载中'
                this.pageCouponList = this.chunk(arr, 10)
                this.pageList = this.pageCouponList.shift()
            } else {
                this.pageList = arr
                if (arr.length === 0) {
                    this.noData = true
                    this.lodingText = '- 暂无优惠券 -'
                } else {
                    this.lodingText = '- 我是有底线的 -'
                }
            }
        },
        /**
         * 选择优惠券时radio改变的事件
         */
        async changeCoupon(evt) {
            const index = evt.detail.value
            if (index) {
                const { data } = await this.$http('orderGetDeductionPrice', {
                    ...this.$Route.query,
                    address_id: this.ajaxParams.address_id || '',
                    expand: {
                        user_coupon_record_id: index
                    }
                })
                const { coupon_price } = data
                this.temp_coupon_price = coupon_price
            } else {
                this.temp_coupon_price = 0
            }
        },
        /**
         * 底部按钮点击事件抛出
         */
        popupConfirm() {
            this.coupon_id = this.temp_coupon_id
            this.coupon_price = this.temp_coupon_price
            this.$emit('popupConfirm', {
                type: 'popupConfirm',
                detail: {
                    coupon_id: this.coupon_id ? this.coupon_id : -1 // 不使用优惠券时传-1
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.select-coupon-modal {
    background-color: #fff;
    .c-modal__title::after {
        display: none;
    }
    .confirm-order {
        &.c-modal__list-title {
            padding: 24rpx;
            @include flex(row);
            font-size: 24rpx;
        }

        .c-modal__list-content {
            /deep/.c-radio {
                /* #ifndef H5 */
                float: none !important;
                /* #endif */
                flex-direction: row-reverse;
                margin-top: 24rpx;
                border-radius: 16rpx;
                box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.1);

                .c-radio__icon-wrap {
                    margin-right: 20rpx;
                }

                .c-radio__label {
                    line-height: initial;
                    font-size: 28rpx;
                    margin: 0;

                    .ticket {
                        flex-direction: row-reverse;

                        .left {
                            width: auto;
                            flex: 1;
                        }

                        .right {
                            border-left: none;
                            border-right: 4rpx dashed #f5f5f5;

                            &::after,
                            &::before {
                                content: "";
                                width: 24rpx;
                                height: 24rpx;
                                background: #f5f5f5;
                                border-radius: 24rpx;
                            }

                            &::before {
                                @include abs(0, 0, null, auto);
                                transform: translate3d(50%, -12rpx, 0);
                            }

                            &::after {
                                @include abs(null, 0, 0, auto);
                                transform: translate3d(50%, 12rpx, 0);
                            }

                            &.confirm-order {
                                // background: #FFEDEA;

                                &.is-use {
                                    background: #ccc;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .c-modal__content {
        .c-modal__tips {
            &-promotion {
                margin: 0 24rpx;
                @include flex(row);
                align-items: flex-start;

                &-list {
                    flex: 1;
                    @include flex;
                    margin-bottom: 8rpx;

                    &:last-child {
                        margin-bottom: 0;
                    }

                    .coupon-promotion-text {
                        font-size: 24rpx;
                        padding-bottom: 8rpx;
                        align-content: flex-start;
                        color: #333;
                    }

                    .coupon-promotion-subText {
                        font-size: 22rpx;
                        padding-bottom: 8rpx;
                        align-content: flex-start;
                        color: #999;
                    }
                }

                .coupon-tag-wrapper {
                    flex: 0 0 auto;
                    margin-right: 24rpx;

                    .coupon-tag {
                        height: 32rpx;
                        line-height: 32rpx;
                        padding: 0 8rpx;
                        font-size: 20rpx;
                    }
                }
            }
        }

        .c-modal__list {
            padding: 0 24rpx 0;

            &-title {
                margin-bottom: 24rpx;
                font-size: 24rpx;
                font-weight: 400;
                color: #999;
                // position: sticky;
                // top: 0;
            }

            .coupons-wrapper {
                padding-bottom: 24rpx;

                &__item {
                    border-radius: 16rpx;
                    box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.1);
                }
            }
        }
    }
}
</style>
