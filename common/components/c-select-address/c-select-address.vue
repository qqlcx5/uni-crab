<template>
    <view>
        <c-popup
            mode="bottom"
            close
            v-model="selectFlag"
            radius="24rpx 24rpx 0 0"
        >
            <view class="select-address-modal">
                <view class="c-modal__title">发送至</view>
                <scroll-view
                    scroll-y
                    class="c-row select-address__scroll ptb0 c-underline"
                >
                    <block v-if="pageList && pageList.length">
                        <c-radio-group
                            v-model="selectIndex"
                            v-for="(item, index) in pageList"
                            :key="index"
                            @change="changeAddress(item,index)"
                            wrap
                        >
                            <view class="c-col-12 ptb24 c-underline">
                                <c-radio :name="index">
                                    <c-address-item
                                        :config="item"
                                        edit="false"
                                    ></c-address-item>
                                </c-radio>
                            </view>
                        </c-radio-group>
                    </block>
                    <c-no-data
                        showImg
                        text="暂无地址"
                        v-else
                    ></c-no-data>
                </scroll-view>
                <view class="p24">
                    <c-colors
                        :theme="['t', '#fff']"
                        :pro="['bgc', 'c']"
                        radius="40"
                    >
                        <c-button
                            type="inherit"
                            @click="handleOther"
                        >{{mode === 'local' ? '选择其他地区': '新增地址'}}</c-button>
                    </c-colors>
                </view>
            </view>
        </c-popup>
        <!-- 新增地址 -->
        <c-edit-address
            v-model="selectOtherFlag"
            @change="changeAddress($event,'refresh')"
        />
        <!-- 选择地址 -->
        <c-select-city
            v-model="selectLocalFlag"
            @confirm="handleSelectCity"
        />

    </view>
</template>

<script>
import listMixins from '@/common/mixins/list.js'
export default {
    mixins: [listMixins],
    data() {
        return {
            selectFlag: false,
            selectOtherFlag: false,
            selectLocalFlag: false,
            selectIndex: -1,
            reqName: 'userShippingAddressList',
            autoReq: false,
            isFirst: true
        }
    },
    async created() {
        let { data } = await this.$http('userInfo', {}, { source: 'catch' })
        Object.keys(data).length && this.initPage();
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        // local 商品详情=>展示地区
        mode: {
            type: String,
            default: 'normal'
        },
        addressId: {
            type: [String, Number],
            default: 'normal'
        }
    },
    watch: {
        value: {
            handler(val) {
                if (val && !this.pageList.length && this.mode === 'local') {
                    this.selectLocalFlag = val
                } else {
                    this.selectFlag = val;
                }
                if (val && this.addressId) {
                    this.selectIndex = this.pageList.findIndex(o => o.id === this.addressId);
                }
            },
            immediate: true
        },
        selectFlag(val) {
            this.$emit('input', val)
        },
        selectLocalFlag(val) {
            this.$emit('input', val)
        },
        pageList(val) {
            if (this.mode === 'local' && this.isFirst) {
                this.isFirst = false;
                let defaultAddr = val.find(o => o.is_default) || val[0]
                this.$emit('change', {
                    type: 'change',
                    detail: defaultAddr
                })
            }
        }
    },
    computed: {
        completeAdd_() {
            return (obj) => {
                return `${obj.province}${obj.city}${obj.district}${obj.address}`
            }
        },
    },
    methods: {
        changeAddress(e, index) {
            if (index === 'refresh') {
                this.initPage()
            } else {
                this.selectIndex = index;
                this.selectFlag = false;
                this.$emit('change', {
                    type: 'change',
                    detail: e
                })
            }
        },
        handleOther() {
            // 展示地区
            if (this.mode === 'local') {
                this.selectLocalFlag = true
                return
            }
            this.selectOtherFlag = true
        },
        handleSelectCity(e) {
            this.selectIndex = -1;
            this.$emit('change', e)
            if (this.mode === 'local') this.selectFlag = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.select-address-modal {
    background-color: #fff;
    border-radius: 24rpx 24rpx 0px 0px;
    .ss-modal__title::after {
        display: none;
    }
    .select-address {
        &:last-child::after {
            display: none;
        }
        &__scroll {
            height: 67vh;
        }
        // &__btn{
        //     height: 88rpx;
        //     font-size: 32rpx;
        //     border-radius: 16rpx;
        //     &::after{
        //         border-radius: 32rpx;
        //     }
        // }
        &__name {
            // font-size: 32rpx;
            font-size: 26rpx;
            font-weight: bold;
            color: #333333;
            line-height: 46rpx;
            // padding-left: 0;
            padding-left: 40rpx;
            position: relative;
            @include tst();
        }
        &__icon {
            @include site();
            &--right {
                opacity: 0;
                @include site(auto, 0);
            }
        }
        &__active {
            .select-address__name {
                padding-right: 40rpx;
            }
            .select-address__icon--right {
                opacity: 1;
            }
        }
        &__address {
            position: relative;
            font-size: 28rpx;
            color: #999;
            line-height: 40rpx;
            padding-left: 40rpx;
            margin-top: 8rpx;
            .select-address__icon {
                opacity: 1;
            }
        }
    }
}
</style>
