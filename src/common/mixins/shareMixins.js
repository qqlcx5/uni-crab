// #ifndef MP-WEIXIN
import shareFn from '@/common/mixins/share'
// #endif
export default {
    data() {
        return {

            shareParams: {},
            userCatchInfo: {}
        }
    },
    onLoad(){
		this.shareParams = Object.assign({}, this.$config.shareDefault);
        this.h5CommonShare();
    },
    // #ifdef MP-WEIXIN
    //微信小程序分享，其他端分享文件@/common/mixins/share
    async onShareAppMessage() {
        let { title, path, allowShare } = Object.assign({}, this.shareParams, this.$config.shareDefault)
        let pathUrl = await this.getShareUrl(allowShare ? '' : path);
        return { title, path: pathUrl }
    },
    // #endif
    methods: {
        async getShareUrl(path) {
            let { data } = await this.$http('userInfo', {}, {
                source: 'catch'
            });
            let query = this.$Route.query;
            if(data.uid){
                query.parent_id = data.uid;
            }
            if(path){
                if(path.indexOf('parent_id=') === -1 && query.parent_id){
                    path += path.indexOf('?') > 0 ? '&' : '?';
                    path += `parent_id=${query.parent_id}`;
                }
                return path;
            }else{
                return this.$Route.path + this.$c.parse(query)
            }
        },
        h5Share() {
            // #ifdef H5
            if(this.$isWechatBrowser){
                shareFn.call(this)
            }
            // #endif
        },
        appShare() {
            // #ifdef APP-PLUS
            shareFn.call(this)
            // #endif
        },
        async h5CommonShare(){
           // #ifdef H5
           if(this.$isWechatBrowser){
                if(!this.$Route.query.detailId || !(this.$Route.meta && this.$Route.meta.special)){//不是文章类分享内容都是一致的
               	if (uni.getSystemInfoSync().platform === 'ios') {// IOS
                       shareFn.call(this);
               	} else {
               		// 安卓
               		setTimeout(() => {
                        shareFn.call(this);
               		}, 100);
               	}
               }
           }
           // #endif
        }
    }
}
