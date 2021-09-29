<template>
    <view class="c-fa-sms-modal">
        <c-modal
            v-model="modalFlag"
            title="手机验证"
            show-close="true"
            show-cancel="false"
            show-confirm="false"
            :hd-style="hdStyle_"
        >
            <view class="flex-column align-center">
                <view class="c-tc ptb24">
                    <view
                        v-for="(item, index) in content_"
                        :key="index"
                    >{{ item }}</view>
                </view>
                <c-digital-input
                    v-model="paymentPwd"
                    size="80"
                    :active-index="activeInput"
                    @click="handleDigitalInput"
                >
                </c-digital-input>
                <view class="mt36">
                    <c-send-sms-code
                        ref="sendSMSEl"
                        mode="button"
                        width="240"
                        phone-key="phone"
                        ajax-name="sendPhone"
                        :ajax-params="ajaxParams_"
                    />
                </view>
            </view>
            <view slot="other">
                <!-- 密码键盘 -->
                <c-popup
                    v-model="dkFlag"
                    mode="bottom"
                    z-index="2"
                    show-close="false"
                    maskabled="false"
                    mask="false"
                >
                    <c-digital-keyboard
                        v-model="paymentPwd"
                        show-down
                        :digits="digits_"
                        :active-index="activeInput"
                        @close="handleDKClose"
                        @change="handleKeyboardChange"
                        @submit="handleKeyboardSubmit"
                    ></c-digital-keyboard>
                </c-popup>
            </view>
        </c-modal>
    </view>
</template>

<script>
// 定时器
const smsTime = null
// 总秒数
const baseCout = 10

export default {
    props: {
        value: {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            default: '手机验证'
        },
        content: {
            type: String,
            default: ''
        },
        // 2: 企业 3： 个人
        memberType: {
            type: [String, Number],
            default: 3
        },
        // 绑定类型 9绑定手机 6解绑手机
        bindType: {
            type: [String, Number],
            default: 9
        }
    },
    data() {
        return {
            activeInput: -1, // 当前输入的下标
            paymentPwd: '', // 安全密码内容
            userInfo: {},
            count: 0,
            smsNum: 0, // 获取验证码次数
            dkFlag: false
        }
    },
    computed: {
        modalFlag: {
            get(val) {
                return val.value
            },
            set(val) {
                this.$emit('input', val)
            }
        },
        digits_() {
            return isNaN(this.digits) ? 6 : parseInt(this.digits)
        },
        content_() {
            let tel = this.userInfo.mobile
            if (!tel || this.content) return []
            tel = tel.substr(0, 3) + '****' + tel.substr(7)
            const content = this.content ? this.content : `首次支付请确认本人操作<br/>短信验证码已发送至${tel}`
            return content.split('<br/>')
        },
        hdStyle_() {
            return {
                top: this.activeInput >= 0 ? '-150rpx' : '0rpx'
            }
        },
        ajaxParams_() {
            return {
                phone: this.userInfo.mobile,
                type: this.bindType,
                member_type: this.memberType
            }
        }
    },
    watch: {
        modalFlag(val) {
            // 显示弹窗要重置密码
            if (val) {
                this.clearInputData()
                this.getSmsCode()
            }
        }
    },
    created() {
        this.getUserInfo()
    },
    methods: {
        getSmsCode() {
            this.$refs.sendSMSEl.getSmsCode()
        },
        // 关闭密码键盘
        handleDKClose() {
            this.dkFlag = false
            this.activeInput = -1
        },
        // 重置数据
        clearInputData() {
            this.paymentPwd = ''
            this.activeInput = 0
        },
        // 提交操作（绑定手机）
        async handleKeyboardSubmit(e) {
            // console.log('handleKeyboardSubmit', e);
            const {
                value,
                activeIndex
            } = e.detail
            this.activeInput = activeIndex
            try {
                await this.$http('doBindPhone', {
                    phone: this.userInfo.mobile,
                    verify_code: value,
                    type: this.bindType,
                    member_type: this.memberType
                })
                this.$emit('submit', e)
                this.$emit('input', false)
            } catch (err) {
                console.log(err)
                // TODO handle the exception
                this.clearInputData()
            }
            // this.$toast(this.bindType === 9 ? '绑定成功' : '解绑成功');
        },
        handleKeyboardChange(e) {
            this.activeInput = e.detail.activeIndex
        },
        // 开关键盘
        changeKeyboard(flag = true) {
            this.dkFlag = flag
            flag ? '' : this.handleDKClose()
        },
        async getUserInfo() {
            const {
                data
            } = await this.$http('userInfo')
            this.userInfo = data
        },
        handleDigitalInput(e) {
            const index = e ? e.detail.value : undefined
            if (index === undefined) {
                this.activeInput = 0
                this.changeKeyboard(false)
            } else {
                var length_ = this.paymentPwd.length
                this.activeInput = index <= length_ ? index : length_
                this.changeKeyboard()
            }
        }
    }
}
</script>
