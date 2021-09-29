<template>
    <c-popup
        v-model="selectFlag"
        mode="bottom"
        show-close="true"
        radius="16rpx 16rpx 0 0"
    >
        <view class="pop-box">
            <view
                class="c-row pt48"
                :class="{'pb48': mode == 'list'}"
            >
                <view
                    v-if="mode == 'home'"
                    class="c-col-12"
                >
                    <view>
                        <view class="appoint-title">{{ title }}</view>
                    </view>
                    <view class="apppoint-content">服务内容：{{ content }}</view>
                    <view class="apppoint-ps">稍后客服将会联系您!</view>
                </view>
                <view v-else-if="mode == 'list'">
                    <view class="c-col-12">
                        <view
                            class="appoint-title"
                            :class="[mode]"
                        >{{ content }}</view>
                        <view
                            v-if="info.start_time && info.end_time"
                            class="apppoint-ps"
                            :class="[mode]"
                        >活动时间：{{ info.start_time }}-{{ info.end_time }}</view>
                    </view>
                </view>
                <view class="c-col-12">
                    <view class="apppoint-phone">请确定手机号以便享受优惠</view>
                    <view class="apppoint-input">
                        <c-input
                            ref="checkTelRef"
                            v-model="mobile"
                            maxlength="11"
                            pattern="mobile"
                            msg-name="手机号"
                            placeholder="请输入手机号"
                            :disabled="isEdit"
                            type="number"
                        >
                            <text
                                v-show="isEdit"
                                class="apppoint-input__text"
                                @click="handleEdit"
                            >修改</text>
                        </c-input>
                    </view>
                </view>
                <view
                    v-if="mode == 'home'"
                    class="copyright"
                >
                    <c-checkbox-group @change="handleChange">
                        <view class="flex align-center flex-wrap">
                            <c-checkbox
                                name="1"
                                checked
                            >
                                我已阅读并同意
                            </c-checkbox>
                            <text
                                v-if="agreement.status === 1"
                                class="copyright-link"
                                @click="$jumpDetail('agreement', agreement.id)"
                            >《{{ agreement.title }}》</text>
                            <text v-if="agreement.status === 1 && privacy.status === 1">和</text>
                            <text
                                v-if="privacy.status === 1"
                                class="copyright-link"
                                @click="$jumpDetail('agreement', privacy.id)"
                            >《{{ privacy.title }}》</text>
                        </view>
                    </c-checkbox-group>
                </view>
            </view>

            <view class="appoint-btn">
                <c-colors
                    radius="16"
                    :theme="['t', '#fff']"
                    :pro="['bgc', 'c']"
                >
                    <c-button
                        type="inherit"
                        :loading="loading"
                        @click="appoint"
                    >{{ btnText_ }}</c-button>
                </c-colors>
            </view>
        </view>
    </c-popup>
</template>
<script>

export default {
    options: {
        styleIsolation: 'shared'
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        type: {
            type: [String, Number],
            default: 1
        },
        source: {
            type: [String, Number],
            default: ''
        },
        title: {
            type: String,
            default: '限时免费'
        },
        content: {
            type: String,
            default: '免费提供平面方案和全景效果图'
        },
        /**
         * 根据不用的mode显示的内容样式不同
         * home: 首页装修活动
         * list: 活动列表的活动详情
         */
        mode: {
            type: String,
            default: 'home'
        },
        // 活动详情
        info: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            isEdit: false,
            agreeCheck: true,
            selectFlag: false,
            mobile: '',
            loading: false,
            agreement: {}, // 用户协议
            privacy: {} // 隐私协议
        }
    },
    computed: {
        btnText_() {
            // if (this.mode === 'list') return '立即参与';
            return '立即预约'
        }
    },
    watch: {
        value: {
            handler(val) {
                this.selectFlag = val
            },
            immediate: true
        },
        selectFlag(val) {
            this.$emit('input', val)
        }
    },
    created() {
        this.handleGetUser()
        this.getAgreementStatus()
    },
    methods: {
        async handleGetUser() {
            const userInfoRes = await this.$http('userInfo', {}, { source: 'catch' })
            if (userInfoRes.data) {
                this.mobile = userInfoRes.data.mobile
                this.isEdit = !!userInfoRes.data.mobile
            }
        },
        handleChange(e) {
            this.agreeCheck = e.detail.value[0] * 1 === 1
        },
        handleEdit() {
            this.mobile = ''
            this.isEdit = false
        },
        async appoint() {
            const validateObj = this.$refs.checkTelRef.validate(true)
            if (!validateObj.validate) return
            if (!this.agreeCheck) {
                return this.$toast('请同意条款')
            }
            this.loading = true
            try {
                await this.$http('applySignUp', {
                    phone: this.mobile,
                    type: this.type,
                    source_id: this.source
                })
                this.$toast('预约报名成功！')
            } catch (e) {
                console.log(e)
            }
            this.loading = false
            this.selectFlag = false
        },
        // 商家是否开启协议
        async getAgreementStatus() {
            const { data: agreement } = await this.$http('agreementStatus', { type: 1 }) // 1 用户协议 2会员购买协议 3会员资料协议4商家套餐升级协议 6 隐私协议
            this.agreement = agreement
            const { data: privacy } = await this.$http('agreementStatus', { type: 6 }) // 1 用户协议 2会员购买协议 3会员资料协议4商家套餐升级协议 6 隐私协议
            this.privacy = privacy
        }
    }
}
</script>
<style lang="scss" scoped>
.pop-box {
    background: #fff;
    border-radius: 24rpx 24rpx 0px 0px;
    .appoint-title {
        height: 50rpx;
        font-size: 36rpx;
        font-weight: bold;
        color: #fa3f1e;
        line-height: 50rpx;
        &.list {
            font-size: 36rpx;
            font-weight: bold;
            color: #333;
        }
    }
    .apppoint-content {
        padding: 4rpx 0 8rpx;
        font-weight: 400;
        font-size: 28rpx;
        color: #333333;
        line-height: 40rpx;
    }
    .apppoint-ps {
        height: 33rpx;
        font-size: 24rpx;
        font-weight: 400;
        color: #999999;
        line-height: 33rpx;
        &.list {
            padding: 0;
        }
    }
    .apppoint-phone {
        // padding: 12rpx 0 16rpx;
        padding-bottom: 12rpx;
        font-size: 24rpx;
        font-weight: 400;
        color: #333333;
        line-height: 33rpx;
    }
    .apppoint-input {
        // margin: 0 12rpx;
        padding: 20rpx 20rpx 20rpx 0;
        display: block;
        width: 100%;
        background: #f5f5f5;
        border-radius: 16rpx;
        position: relative;
        &__text {
            color: $color-primary;
            font-size: 24rpx;
        }
        /deep/ .c-input-bd {
            padding-left: 0;
        }
    }
    // .apppoint-agree {
    //     padding: 16rpx 12rpx 36rpx;
    //     font-size: 24rpx;
    //     font-weight: 400;
    //     color: #999999;
    //     @include flex(row);
    //     .agree-server {
    //         font-size: 28rpx;
    //         .server {
    //             color: $color-primary;
    //         }
    //     }
    //     /deep/ .c-checkbox__label {
    //         margin-right: 0 !important;
    //     }
    // }
    .copyright {
        padding: 16rpx 12rpx 36rpx;
        font-size: 28rpx;
        font-weight: 400;
        color: #999999;
        &-link {
            color: $color-primary;
        }
        /deep/ .c-checkbox__label {
            margin-right: 0 !important;
        }
    }

    .appoint-btn {
        padding: 24rpx;
        border-top: 1px solid #ededed;
        .btn-error {
            height: 88rpx;
            border-radius: 16rpx;
            line-height: 88rpx;
        }
    }
}
</style>
