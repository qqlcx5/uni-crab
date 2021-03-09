// #ifdef MP-WEIXIN
import { getCode } from '@/home/login/common/wechat'
// #endif

// #ifdef H5
import jweixin from 'jweixin-module'
// #endif

let baseUrl = '', frontUrl;

export default {
    data() {
        return {
            payReqName: 'orderPay',
            payList: [],
            pay_id: '',
            returnUrl: '/goods/order/success',//只能填入这种格式，通用（支付宝那边需要用到）
            setDefaultPay: false,
            payFinish: false
        }
    },
    onLoad() {
        this.orderId = this.$Route.query.order_id || false;
        this.getOpenId();
        this.getShopPayList();
    },
    methods: {
        /**
         * 微信浏览器支付，需要用户的openid来确认支付用户
         * 原理：后台返回的是一个表单，我们这边要创建一个承载表单的容器，然后直接提交
         */
        getOpenId() {
            // #ifdef H5
            baseUrl = window.location.origin + this.$router.options.base;
            frontUrl = baseUrl + this.$route.fullPath.substr(1);
            let openId = this.$Route.query.key || this.$session.get(this.$config.gzhOpenIdCatchName);
            if (this.$isWechatBrowser) {
                if (!openId) {
                    let h5Redirect = encodeURIComponent(frontUrl);
                    return location.replace(
                        `${this.$config.hostUrl}/WxApp/getWxUrl?shop_uid=${this.$config.shopUid}&h5_redirect=${h5Redirect}&scope=snsapi_base`
                    );
                } else {
                    this.openId = openId;
                    this.$session.set(this.$config.gzhOpenIdCatchName, openId);
                }
            }
            // #endif
        },
        /**
         * 提交调用的支付方法
         */
        async submitPay(params) {
            let userRes = {
                    code: '',
                }; //小程序端用户的code

            // #ifdef MP-WEIXIN
            userRes = await getCode('weixin');
            // #endif
            let payObj = this.payList.find(o => o.value == this.pay_id);
            if(!payObj) return this.$toast('支付方式失效')
            let res = await this.$http(this.payReqName, {
                ...params,
                pay_method: this.pay_id,
                // #ifdef H5
                /**
                 * H5微信支付需要的参数  开始
                 * */
                front_url: frontUrl,
                openId: this.openId,
                /**
                 * 结束
                 * */
                /**
                 * H5支付宝支付需要的回调地址   开始
                 * */
                return_url: this.returnUrl ? `${baseUrl}${this.returnUrl.substr(1)}?order_id=${this.orderId}` : '',
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
            // #ifdef H5
            if (payObj.type === 'a') { //支付宝跳转页面了,所以无回调
                this.alipayAction(res.data);
                return ;
            }
            // #endif
            if (payObj.type === 'b') {
                this.paySuccess(res);
                return ;
            }
            let payResult = await this.appPayAction(res.data, payObj.type === 'a' ? 'alipay' : 'wxpay');
            this.paySuccess(payResult);
        },
        /**
         * 支付成功
         */
        paySuccess({ code,  msg}) {
            if(code === 0){
                let payObj = this.payList.find(o => o.value == this.pay_id) || {};
                payObj.type === 'b' && this.$toast(msg, 1);
                setTimeout(() => {
                    this.$Router.replaceAll({
                        path: this.returnUrl,
                        query: {
                            order_id: this.orderId
                        }
                    })
                }, 500)
            }
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
            document.getElementById(zfbPayId).getElementsByTagName('form')[0].submit();
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
                    this.$loading('正在拉起支付');
                    jweixin.config({
                        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: data.appId, // 必填，公众号的唯一标识
                        timestamp: data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: data.nonceStr, // 必填，生成签名的随机串
                        signature: data.paySign, // 必填，签名
                        jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
                    });
                    jweixin.ready(() => {
                        this.$hideLoading();
                        jweixin.chooseWXPay({
                            ...data,
                            success: (res) => {
                                this.$toast('支付成功', 1);
                                resolve({
                                    code: 0,
                                    msg: '支付成功',
                                    data: res
                                });
                            },
                            fail: (err) => {
                                this.$toast('支付异常');
                                resolve({
                                    code: 20000,
                                    msg: '支付未完成',
                                    data: err
                                });
                            },
                            cencel: (res) => {
                                this.$toast('支付未完成');
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
                        this.$toast('支付成功', 1);
                        resolve({
                            code: 0,
                            msg: '支付成功',
                            data: res
                        });
                    },
                    fail: (err) => {
                        this.$toast('支付未完成');
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
        async getShopPayList() {
            let { data } = await this.$http('shopPayList');
            this.payFinish = true;
            this.payList = data.filter(o => o.source.indexOf(this.$config.platformType) !== -1);
            this.setDefaultPay && this.handleCheckbox({
                detail: {
                    value: this.payList[0].value
                }
            })
        },
        handleCheckbox(e) {
            this.pay_id = e.detail.value;
        }
    }
}
