let pageScrollFn = (() => {
    let pageScrollTop = 0;
    return function(e) {
        this.rollDirection = pageScrollTop <= e.scrollTop ? 'up' : 'down';
        pageScrollTop = e.scrollTop;
        uni.$emit('pageScroll', {
            ...e,
            direction: this.rollDirection
        })
    }
})();

import shareMixins from '@/common/mixins/shareMixins'
export default {
    mixins: [ shareMixins ],
    data() {
        return {
            rollDirection: 'up'
        }
    },
    // #ifndef APP-PLUS-NVUE
    onPageScroll(e) {
        let that = this;
        this.$c.debounce(function pageScrollDebounce() {
            pageScrollFn.call(that, e)
        }, 1000 / 60)
    },
    // #endif
    onHide() {
        uni.$emit('pageHide');
    },
    onShow() {
        uni.$emit('pageShow');
    },
    onLoad() {
        const {
            parent_id, detailId
        } = this.$Route.query
        if(parent_id){
            console.log(this.$config);
            uni.setStorageSync(this.$config.shareParentName, parent_id);
            uni.setStorageSync(this.$config.shareOriginName, {
                parent_id: parent_id,
                routeName: this.$Route.name,
                detailId: detailId
            })
        }

    },
    onPullDownRefresh() {
        uni.$emit('pagePullDownRefresh');
    },
    onReachBottom() {
        uni.$emit('pageReachBottom');
    },
}
