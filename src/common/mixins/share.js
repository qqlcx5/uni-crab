/**
 * 页面调用示例
 * H5 和 APP示例
 * import wechatShare from '@/common/mixins/share'
 * wechatShare.call(this, params);
 */

// #ifdef H5
import jweixin from 'jweixin-module'
// 验证分享
function wxH5Share() {
    return new Promise(async (resolve, reject) => {
        if(!this){
            return reject({
                code: -1,
                msg: '请用『方法名』.call(this)来调用'
            })
        }

        let { allowShare, title, summary, imageUrl, jsApiList } = Object.assign({}, this.$config.shareDefault, this.shareParams);

        let baseUrl = window.location.origin + this.$router.options.base;
        let frontUrl = baseUrl + this.$route.fullPath.substr(1);
        let shareUrl = await this.getShareUrl(allowShare ? frontUrl : baseUrl);

        let shareConfig = {
            title: title,//分享的title
            desc: summary,//分享的文案
            link: encodeURIComponent(shareUrl),//分享点击后的跳转地址
            imgUrl: imageUrl,//分享图片
            success: (e) => {
                console.log(e);
              // 用户点击了分享后执行的回调函数
            }
        };

        let { data } = await this.$http('wechatShare', {
            url: frontUrl
        })

        jweixin.config({
            debug: data.debug,
            appId: data.appid, // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见附录1
            jsApiList: jsApiList
        });

        jweixin.ready(() => {
            // 分享设置
            jweixin.onMenuShareTimeline(shareConfig);
            jweixin.onMenuShareAppMessage(shareConfig);
        })
    })
}

export default wxH5Share
// #endif

// #ifdef APP-PLUS
function appShare(scene = 'WXSceneSession') {
    return new Promise(async (resolve, reject) => {

        if(!this){
            return reject({
                code: -1,
                msg: '请用『方法名』.call(this, params)来调用'
            })
        }

        let { imageUrl, path, webUrl, title, summary, allowShare } = Object.assign({}, this.$config.shareDefault, this.shareParams);
        
        uni.share({
            provider: 'weixin',
            scene: scene,
            type: 0,//0图文  5分享为小程序
            href: webUrl,
            title: title,
            summary: summary,
            imageUrl: imageUrl,
            //分享为小程序
            // miniProgram: {
            //     id: 'gh_abcdefg',
            //     path: path,
            //     type: 0,
            //     webUrl: webUrl
            // },
            success: (res) => {
                console.log(JSON.stringify(res));
                resolve({
                    code: 0,
                    data: res
                })
            },
            fail:  (err) => {
                console.log("fail:" + JSON.stringify(err));
                reject({
                    code: -1,
                    data: err
                })
            }
        })
    });
}

export default appShare
// #endif
