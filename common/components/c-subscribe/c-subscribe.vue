<template>
    <c-popup
        v-model="selectFlag"
        mode="bottom"
        show-close="true"
        radius="24rpx 24rpx 0 0"
    >
        <view class="c-subscribe c-content">
            <view v-if="mode === 'home'">
                <view class="c-subscribe__title">{{ title }}</view>
                <view class="c-subscribe__content pt16">服务内容：{{ content }}</view>
                <view class="c-subscribe__desc pt8">稍后客服将会联系您!</view>
            </view>
            <view v-else-if="mode === 'list'">
                <view class="c-subscribe__content">{{ content }}</view>
                <view class="c-subscribe__desc pt8">活动时间：{{ info.start_time }}-{{ info.end_time }}</view>
            </view>

            <text class="c-subscribe__input-title pt32">
                请确定手机号以便享受优惠
            </text>
            <view class="c-subscribe__input-box">
                <c-input
                    ref="checkTelRef"
                    v-model="mobile"
                    class="flex-1"
                    maxlength="11"
                    pattern="mobile"
                    msg-name="手机号"
                    placeholder="请输入手机号"
                    :disabled="isEdit"
                    type="number"
                >
                    <text
                        v-show="isEdit"
                        class="c-subscribe__input-operate"
                        @click="handleEdit"
                    >修改</text>
                </c-input>
            </view>
            <view v-if="mode === 'home'">
                <c-checkbox-group @change="handleCheckbox($event)">
                    <view class="c-subscribe__agreement pt16">
                        <c-checkbox
                            icon-size="28"
                            label-size="28"
                            name="checked"
                            checked
                        >我已阅读并同意</c-checkbox>
                        <text
                            v-if="agreement.status === 1"
                            class="c-subscribe__agreement-text"
                            @click="$jumpDetail('agreement', agreement.id)"
                        >《{{ agreement.title }}》</text>
                        <text v-if="agreement.status === 1 && privacy.status === 1">和</text>
                        <text
                            v-if="privacy.status === 1"
                            class="c-subscribe__agreement-text"
                            @click="$jumpDetail('agreement', agreement.id)"
                        >《{{ privacy.title }}》</text>
                    </view>
                </c-checkbox-group>
            </view>
            <view class="c-underline pt24"></view>
            <view class="flex ptb24">
                <view class="flex-1">
                    <c-colors
                        radius="16"
                        type="button"
                        :theme="['t', '#fff']"
                        :pro="['bgc', 'c']"
                    >
                        <c-button
                            height="88"
                            type="inherit"
                            :loading="loading"
                            @click="handleSubmit"
                        >立即预约</c-button>
                    </c-colors>
                </view>
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
        // 1案例 2免费量房 3免费设计 4免费报价 5工长 6装修活动 7 共享官网 8 邀请函
        type: {
            type: [String, Number],
            default: 1
        },
        // 来源id
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
            selectFlag: false,
            mobile: '',
            agreement: {},
            privacy: {},
            isEdit: false,
            isCheckAgree: true,
            loading: false
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
        // 商家是否开启协议
        async getAgreementStatus() {
            const { data: agreement } = await this.$http('agreementStatus', { type: 1 }) // 1 用户协议 2会员购买协议 3会员资料协议4商家套餐升级协议 6 隐私协议
            const { data: privacy } = await this.$http('agreementStatus', { type: 6 }) // 1 用户协议 2会员购买协议 3会员资料协议4商家套餐升级协议 6 隐私协议
            this.agreement = agreement
            this.privacy = privacy
        },
        handleCheckbox(e) {
            const val = e.detail.value
            this.isCheckAgree = val[0] === 'checked'
        },
        handleEdit() {
            this.isEdit = false
            this.mobile = ''
        },
        async handleSubmit() {
            const validateObj = this.$refs.checkTelRef.validate(true)
            if (!this.isCheckAgree) return this.$toast('请同意条款')
            if (!validateObj.validate) return
            this.loading = true
            try {
                await this.$http('applySignUp', {
                    phone: this.mobile,
                    type: this.type,
                    source_id: this.source
                })
            } catch (e) { console.log(e) }
            this.loading = false
            this.selectFlag = false
        }
    }

}
</script>
<style lang="scss">
.c-subscribe {
    padding: 58rpx 24rpx 0;
    font-size: 24rpx;
    @include flex;
    &__title {
        font-size: 36rpx;
        font-weight: bold;
        color: #fa3f1e;
    }
    &__content {
        font-size: 28rpx;
        color: #333333;
    }
    &__desc {
        color: #999999;
    }
    &__input-title {
        color: #333333;
    }
    &__input-box {
        margin-top: 16rpx;
        padding: 0 24rpx 0 12rpx;
        display: flex;
        align-items: center;
        background: #f5f5f5;
        border-radius: 16rpx;
        height: 88rpx;
    }
    &__input-operate {
        color: #43548f;
    }
    &__agreement {
        font-size: 28rpx;
        @include flex(row);
        align-items: center;
        flex-wrap: wrap;
        /deep/ .c-checkbox__label {
            margin-right: 0;
        }
        &-text {
            color: #43548f;
        }
    }
}
</style>
