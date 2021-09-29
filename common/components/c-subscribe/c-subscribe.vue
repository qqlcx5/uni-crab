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
                <block v-if="mode == 'home'">
                    <view class="c-col-12">
                        <view class="appoint-title">{{ title }}</view>
                    </view>
                    <view class="apppoint-content">服务内容：{{ content }}</view>
                    <view class="apppoint-ps">稍后装修公司将会电话联系你，沟通具体的装修方案流程</view>
                </block>
                <block v-else-if="mode == 'list'">
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
                </block>
                <view class="apppoint-phone">请确定手机号以便享受优惠</view>
                <view class="apppoint-input">
                    <c-input
                        ref="checkTelRef"
                        v-model="mobile"
                        maxlength="11"
                        pattern="mobile"
                        msg-name="手机号"
                        placeholder="请输入手机号"
                        after-width="100"
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
                <block v-if="mode == 'home'">
                    <c-checkbox-group
                        class="apppoint-agree"
                        @change="handleChange"
                    >
                        <c-checkbox
                            name="1"
                            checked
                        >
                            <text class="agree-server">我已阅读并同意<text class="server">《服务须知》</text></text>
                        </c-checkbox>
                    </c-checkbox-group>
                </block>
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
            loading: false
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
    },
    methods: {
        async handleGetUser() {
            const userInfoRes = await this.$http('userInfo', {}, {
                source: 'catch'
            })
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
            await this.$http('applySignUp', {
                phone: this.mobile,
                type: this.type,
                source_id: this.source
            })
            this.loading = false
            this.selectFlag = false
            this.$toast('预约报名成功！')
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
        font-weight: 500;
        color: #fa3f1e;
        line-height: 50rpx;

        &.list {
            height: auto;
            line-height: initial;
            font-size: 36rpx;
            font-weight: bold;
            color: #333;
        }
    }

    .apppoint-content {
        padding: 4rpx 12rpx 8rpx;
        font-weight: 400;
        font-size: 28rpx;
        color: #333333;
        line-height: 40rpx;
    }

    .apppoint-ps {
        padding: 0 12rpx;
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
        padding: 33rpx 12rpx 16rpx;
        font-size: 24rpx;
        font-weight: 400;
        color: #333333;
        line-height: 33rpx;
    }

    .apppoint-input {
        margin: 0 12rpx;
        padding: 20rpx 0;
        display: block;
        width: 100%;
        background: #f5f5f5;
        border-radius: 16rpx;
        position: relative;

        &__text {
            color: $color-primary;
            font-size: 24rpx;
        }
    }

    .apppoint-agree {
        padding: 16rpx 12rpx 36rpx;
        font-size: 24rpx;
        font-weight: 400;
        color: #999999;
        @include flex(row);

        .agree-server {
            .server {
                color: $color-primary;
            }
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
