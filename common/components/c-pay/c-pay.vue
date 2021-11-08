<template>
    <view>
        <block v-if="mode === 'modal'">
            <c-popup
                mode="bottom"
                v-model="modalFlag"
                showClose="true"
                radius="24rpx 24rpx 0 0"
            >
                <view class="c-modal__title">选择支付方式</view>
                <scroll-view
                    scrollY
                    class="pay-content"
                >
                    <c-radio-list
                        v-model="payId"
                        :list="payList"
                        :loading="!payFinish"
                    />
                </scroll-view>
                <view class="p24 c-underline__top">
                    <c-colors
                        :theme="['t', '#fff']"
                        :pro="['bgc', 'c']"
                        radius="16"
                    >
                        <c-button
                            size="large"
                            @click="submitPay"
                        >确定</c-button>
                    </c-colors>
                </view>
            </c-popup>
        </block>
        <block v-else>
            <c-radio-list
                v-model="payId"
                :list="payList"
                :loading="!payFinish"
            />
        </block>
        <!-- 分账  star -->
        <!-- 余额支付，需要验证码 -->
        <c-payment-password
            ref="paymentPassword"
            :memberType="memberType"
            v-model="saModalFlag"
            @submit="handleSubmitPassword"
        />
        <!-- 绑定手机 -->
        <c-fa-sms-modal
            :memberType="memberType"
            v-model="faSmsFlag"
            @submit="handleBindPhone"
        />
        <!-- 分账  end -->
    </view>
</template>

<script>
import { mapState } from 'vuex'
// #ifdef H5
import jweixin from 'jweixin-module'
// #endif
export default {
    data() {
        return {
            balanceCodeFlag: false, // 余额密码弹窗
            faSmsFlag: false, // 绑定手机弹窗
            payList: [],
            payId: '',// 选中的支付id
            payFinish: false,//列表数据加载
            saModalFlag: false,
            bizOrderSn: '',
            payment_mode: undefined,
            autoVerify: false,//是否开启分账校验
            hasBindTel: false,//是否绑定手机
            realBusy: false,
            curRouteName: '' // 当前的路由名称
        }
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        // 支付类型,normal 普通 modal  弹窗
        mode: {
            type: String,
            default: 'normal'
        },
        /**
         * 订单类型
         * 0: 商品订单 10: 会员等级订单  50:充值订单
        */
        orderSource: {
            type: [String, Number],
            default: 0
        },
        // 订单id
        orderId: {
            type: [String, Number],
            default: 0
        },
        // 支付请求地址
        payReqName: {
            type: String,
            default: 'orderPay'
        },
        // 支付请求额外参数
        payReqParams: {
            type: Object,
            default: () => {
                return {}
            }
        },
        //0元时候开启自动支付
        zeroAutoPay: {
            type: [String, Boolean],
            default: false
        },
        // 支付金额,仅在zeroAutoPay开启时（true）有效
        payPrice: {
            type: [String, Number],
            default: ''
        },
        //是开设置默认支付
        setDefaultPay: {
            type: [String, Boolean],
            default: true
        },
        //只能填入这种格式，通用（支付宝那边需要用到）
        returnUrl: {
            type: String,
            default: '/goods/order/success'
        },
        memberType: {
            type: [Number, String],
            default: 3
        },
        // 支付成功是否toast
        showToast: {
            type: [String, Boolean],
            default: true
        }
    },
    mounted() {
        this.mode !== 'modal' && this.getShopPayList();
        this.getRealVerify();
        this.curRouteName = this.$Route.name
        uni.$on('pageShow', () => {
            if (this.curRouteName === this.$Route.name && this.paymentMode_ === 10) {
                this.getRealVerify();
            }
        });
    },
    computed: {
        ...mapState('config', ['shopInfo']),
        modalFlag: {
            get(val) {
                return val.value;
            },
            set(val) {
                this.$emit('input', val);
            }
        },
        wechatAuth_() {
            const { wechat_auth = 0 } = this.shopInfo || {}
            return wechat_auth === 1 ? true : false; // 商家是否开通了微信公众号
        },
        paymentMode_() {
            const { payment_mode = 0 } = this.shopInfo || {}
            return payment_mode; //    0:自营支付 10:分账系统'
        },
        payPrice_() {
            return this.payPrice === '' ? 1 : Number(this.payPrice)
        },
        payValue_() {
            return String(this.payValue)
        },
        setDefaultPay_() {
            return String(this.setDefaultPay) !== 'false'
        },
        zeroAutoPay_() {
            return String(this.zeroAutoPay) !== 'false'
        },
        showToast_() {
            return String(this.showToast) !== 'false'
        }
    },
    watch: {
        payPrice_(val) {
            // 0元自动提交支付
            if (this.zeroAutoPay_ && val === 0) {
                this.submitPay();
            }
        },
        paymentMode_: {
            handler(val) {
                if (val === 10) {
                    this.getRealVerify();
                }
            },
            immediate: true
        },
        modalFlag(val) {
            if (val && !this.payList.length) {
                this.getShopPayList()
            }
        },
        payList(val) {
            let len = val.length;
            if (len === 0) return;
            this.payFinish = true;
            let firstValue = val[0] ? val[0].value : '';
            this.setDefaultPay_ ? (this.payId = firstValue) : '';
            //说明是余额支付，自动提交订单
            if (this.zeroAutoPay_ && len === 1 && firstValue == 99) {
                this.submitPay();
            }
        }
    },
    methods: {
        // #ifdef MP
        getCode(provider) { // 获取登录code
            return new Promise((resolve, reject) => {
                uni.login({
                    provider,
                    success: (loginRes) => {
                        resolve(loginRes)
                    },
                    fail: (res) => {
                        reject(res)
                        this.$toast(res.errMsg)
                    }
                })
            })
        },
        // #endif
        // 支付方法
        /**
         * params支付需要传入的额外参数
         * */
        async submitPay() {
            console.log('------支付开始submitPay------');
            // #ifdef H5
            let baseUrl = window.location.origin + this.$router.options.base;
            let frontUrl = baseUrl + uni.getStorageSync(this.$config.fullPageCatch);
            // #endif

            // 校验分账开启的时候，是否绑定手机
            if (!this.checkBindPhone(true)) return this.faSmsFlag = true;
            else this.faSmsFlag = false;

            let userRes = {
                code: ''
            }; //小程序端用户的code
            // #ifdef MP
            userRes = await this.getCode('weixin');
            // #endif

            let payObj = this.payList.find(o => o.value == this.payId) || this.payList[0];
            if (!payObj) return this.$toast('支付方式失效');

            // h5小程序端没有公众号无法支付
            // #ifdef H5
            let userInfoRes = await this.$http('userInfo', {}, {
                source: 'catch'
            });
            if (this.$isWechatBrowser && !this.wechatAuth_ && payObj.type === 'w') return this.$toast('商家未开通公众号');
            let openId = userInfoRes.openid || this.$Route.query.open_id || this.$session.get(this.$config.gzhOpenIdCatchName);
            // #endif

            let res = await this.$http(this.payReqName, {
                ...this.payReqParams,
                pay_method: this.payId,
                // #ifdef H5
                /**
                 * H5微信支付需要的参数  开始
                 * */
                front_url: uni.getSystemInfoSync.platform === 'ios' ? window.entryUrl : frontUrl,
                openId,
                /**
                 * 结束
                 * */
                /**
                 * H5支付宝支付需要的回调地址   开始
                 * */
                return_url: this.returnUrl ? `${baseUrl}${this.returnUrl.substr(1)}` : '',
                /**
                 * 结束
                 * */
                // #endif
                // #ifdef MP-WEIXIN
                /**
                 * 小程序端需要用户的code去反解openid 开始
                 * */
                code: userRes.code,
                /**
                 * 结束
                 * */
                // #endif
            });
            // 如果是分账,并且金额为0就跳过所有支付方式直接成功
            if (this.paymentMode_ === 10 && res.data && res.data.amount === 0) {
                this.paySuccess(res);
                return;
            }
            // #ifdef H5
            // 阿里云
            if (payObj.type === 'a') { //支付宝跳转页面了,所以无回调
                this.alipayAction(res.data);
                return;
            }
            // #endif
            // 余额
            if (payObj.type === 'b') {
                //分账支付
                if (payObj.value === '91') {
                    if (res.data && res.data.bizOrderNo) {
                        this.saModalFlag = true;
                        this.bizOrderSn = res.data.bizOrderNo;
                    } else {
                        this.paySuccess(res);
                    }
                    return;
                }
                this.paySuccess(res);
                return;
            } else if (payObj.type === 'c' || payObj.type === 's') { // 积分支付或者账期支付
                this.paySuccess(res);
                return;
            } else { // 微信支付
                let payResult = await this.appPayAction(res.data, payObj.type === 'a' ? 'alipay' : 'wxpay');
                this.paySuccess(payResult);
            }
        },
        /**
         * 支付成功
         */
        paySuccess(res) {
            let {
                code,
                msg
            } = res;
            if (code === 0) {
                let payObj = this.payList.find(o => o.value == this.payId) || {};
                payObj.type === 'b' && this.showToast_ && this.$toast(msg, 1);
                this.handlePayCompleted(res);
                if (this.$Route.path === this.returnUrl) return;
                setTimeout(() => {
                    let replaceAllWhite = ['/goods/order/success', '/goods/group/success'];
                    // let pages = getCurrentPages()
                    // let prePage = pages[pages.length - 2] || {};
                    if (this.returnUrl) {
                        // if (prePage.route && this.returnUrl.indexOf(prePage.route) !== -1) {
                        //     this.$back();
                        // } else {
                        //     this.$jump(this.returnUrl, {}, replaceAllWhite.find(o => this.returnUrl.indexOf(o) !== -1) ? 'replaceAll' : 'push');
                        // }
                        this.$jump(this.returnUrl, {}, replaceAllWhite.find(o => this.returnUrl.indexOf(o) !== -1) ? 'replaceAll' : 'push');
                    } else {
                        this.$back();
                    }
                }, 500)
            }
        },
        // 获取通联认证状态
        async getRealVerify() {
            if (this.realBusy) return;
            this.realBusy = true;
            try {
                await this.isRealVerify();
                this.realBusy = false;
            } catch (e) {
                this.realBusy = false;
                //TODO handle the exception
            }
        },
        // 是否通联认证
        async isRealVerify() {
            const { data: isVerifyStatus = {} } = await this.$http('isRealVerify', { member_type: this.memberType }) // 2: 企业 3： 个人
            this.isVerifyStatus = isVerifyStatus || {};
            if (!isVerifyStatus.is_auth.status && !isVerifyStatus.is_bank.status && !isVerifyStatus.is_mobile.status && !isVerifyStatus.is_sign.status) this.$http('createMember')
        },
        handlePayCompleted(res) {
            this.$emit('success', {
                type: 'pay',
                detail: res
            })
        },
        // 分账密码输入完成提交函数
        async handleSubmitPassword(e) {
            try {
                let res = await this.$http('payByBackSMS', {
                    biz_order_sn: this.bizOrderSn,
                    verification_code: e.detail.value
                })
                this.saModalFlag = false;
                this.paySuccess(res);
            } catch (e) {
                console.log(e);
                //TODO handle the exception
                this.$refs.paymentPassword ? this.$refs.paymentPassword.clear() : '';
            }
        },
        async handleBindPhone() {
            await this.getRealVerify();
            this.submitPay();
        },
        // 校验是否绑定手机
        checkBindPhone(intercept = false) {
            let { is_mobile = {} } = this.isVerifyStatus;
            let { status, msg } = is_mobile;
            let hasBindTel = true;
            // 商家是否开启分账,并且没绑定手机
            if (this.paymentMode_ === 10 && status === 0) {
                if (intercept) {
                    this.bindModalFlag = true,
                        this.bindModalMsg = msg;
                }
                hasBindTel = false;
            }
            this.hasBindTel = hasBindTel;
            return hasBindTel;
        },
        async getShopPayList() {
            let {
                data
            } = await this.$http('getPayListByOrderConfirm', {
                payment_mode: this.paymentMode_,
                orderId: this.orderId,
                orderSource: this.orderSource
            });
            this.payFinish = true;
            this.payList = data
        },
        /**
         * 支付宝支付
         * 原理：后台返回的是一个表单，我们这边要创建一个承载表单的容器，然后直接提交
         */
        alipayAction(data) {
            let zfbPayId = 'zfbPayDiv';
            document.getElementById(zfbPayId) && document.body.removeChild(zfbPayDiv);
            let zfbPayDiv = document.createElement('div');
            zfbPayDiv.id = zfbPayId;
            zfbPayDiv.innerHTML = data;
            document.body.appendChild(zfbPayDiv);
            let form = document.getElementById(zfbPayId).getElementsByTagName('form')[0];
            form.submit();
        },
        /**
         * 除支付宝以为的支付
         */
        async appPayAction(data, provider = 'wxpay') {
            return new Promise(async (resolve, reject) => {
                // #ifdef H5
                if (typeof data === 'string') { //微信扫码支付
                    this.$toast('暂不支持');
                } else {
                    jweixin.config({
                        debug: data.debug ? data.debug : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: data.appId, // 必填，公众号的唯一标识
                        timestamp: data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: data.nonceStr, // 必填，生成签名的随机串
                        signature: data.paySign, // 必填，签名
                        jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
                    });
                    jweixin.ready(() => {
                        jweixin.chooseWXPay({
                            ...data,
                            success: (res) => {
                                this.showToast_ && this.$toast('支付成功', 1, 2000);
                                resolve({
                                    code: 0,
                                    msg: '支付成功',
                                    data: res
                                });
                            },
                            fail: (err) => {
                                this.$toast('支付异常', 0, 2000);
                                resolve({
                                    code: 20000,
                                    msg: '支付未完成',
                                    data: err
                                });
                            },
                            cencel: (res) => {
                                this.$toast('支付未完成', 0, 2000);
                                resolve({
                                    code: 20000,
                                    msg: '支付未完成',
                                    data: res
                                });
                            },
                        });
                    });
                }
                // #endif
                // #ifndef H5
                let package_ = data.package.split('=')
                data.orderInfo = {
                    [package_[0]]: package_[1]
                }
                uni.requestPayment({
                    provider: provider,
                    ...data,
                    success: (res) => {
                        this.showToast_ && this.$toast('支付成功', 1, 2000);
                        resolve({
                            code: 0,
                            msg: '支付成功',
                            data: res
                        });
                    },
                    fail: (err) => {
                        this.$toast('支付未完成', 0, 2000);
                        resolve({
                            code: 20000,
                            msg: '支付未完成',
                            data: err
                        });
                    }
                });
                // #endif
            })
        },
    }
}
</script>

<style lang="scss">
.pay-content {
    padding: 24rpx;
    height: 452rpx;
}
</style>
