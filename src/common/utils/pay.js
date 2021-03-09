/**
 * 页面调用示例
 * import payment from '@/common/utils/pay'
 * payment.call(this, params);
 */

// #ifdef H5
import jweixin from 'jweixin-module'
// #endif
function paymentFn (params) {
    let payment = 'wxpay';
    return new Promise(async (resolve, reject) => {
        if(!this || !this._isVue){
            return reject({
                code: -1,
                msg: '请用『方法名』.call(this, params)来调用'
            })
        }
        let res = await this.$http('payInfo', params);
        // #ifdef H5
        if(payment === 'zfb'){//支付宝
            alipayFn(res.data);
            return resolve({
                code: 0,
                msg: '成功跳转支付宝，支付情况未知'
            });
        }
        // #endif
        this.$loading('正在拉起支付');
        let payResult = await payAction.call(this ,payment, JSON.parse(res.payInfo) );
        return resolve(payResult);
    })
}

/**
 * 支付宝支付
 * 原理：后台返回的是一个表单，我们这边要创建一个承载表单的容器，然后直接提交
 */
function alipayFn(data) {
    let zfbPayId = 'zfbPayDiv';
    document.getElementById(zfbPayId) && document.body.removeChild(zfbPayDiv);
    let zfbPayDiv = document.createElement('div');
    zfbPayDiv.id = zfbPayId;
    zfbPayDiv.innerHTML = data;
    document.body.appendChild(zfbPayDiv);
    document.getElementById(zfbPayId).getElementsByTagName('form')[0].submit();
}


function payAction(payment, data) {
    return new Promise(async (resolve, reject) => {
        // #ifdef H5
        data.timestamp = data.timeStamp;
        delete data.timeStamp;
        jweixin.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.noncestr, // 必填，生成签名的随机串
            signature: data.sign, // 必填，签名
            jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
        });
        jweixin.ready(() => {
            this.$hideLoading();
            jweixin.chooseWXPay({
                ...data,
                success: (res) => {
                    this.$toast('支付成功', 1);
                    resolve({code: 0, msg: '支付成功', data: res});
                },
                fail: (err) => {
                    this.$toast('支付异常');
                    resolve({code: 20000, msg: '支付未完成', data: err});
                },
                cencel: (res) => {
                    this.$toast('支付未完成');
                    resolve({code: 20000, msg: '支付未完成', data: res});
                },
            });
        });
        // #endif
        // #ifndef H5
        let package_ = data.package.split('=')
        data.orderInfo = {
            [package_[0]]: package_[1]
        }
        uni.requestPayment({
            provider: payment,
            ...data,
            success: (res) => {
                this.$toast('支付成功', 1);
                resolve({code: 0, msg: '支付成功', data: res});
                cb && cb(res, orderId)
            },
            fail: (err) => {
                this.$toast('支付异常');
                resolve({code: 20000, msg: '支付未完成', data: err});
            }
        });
        // #endif
    })
}

export default paymentFn;
