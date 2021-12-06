/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-11-23 11:42:17
 */
const pageScrollFn = (() => {
    let pageScrollTop = 0
    return function (e) {
        this.rollDirection = pageScrollTop <= e.scrollTop ? 'up' : 'down'
        pageScrollTop = e.scrollTop
        uni.$emit('pageScroll', {
            ...e,
            direction: this.rollDirection
        })
    }
})()

import { mapState } from 'vuex'
export default {
    data() {
        return {
            rollDirection: 'up',
            routeName: ''
        }
    },
    computed: {
        ...mapState({
            // 当前请求域名
            curDomain_: state => state.zzspui?.domain
        }),
        proxyImgUrl_() {
            return this.curDomain_ + '/Tools/reGetImg?img='
        }
    },
    // #ifndef APP-PLUS-NVUE
    onPageScroll(e) {
        this.$c.debounce(() => {
            pageScrollFn.call(this, e)
        }, 1000 / 60)
    },
    // #endif
    onLoad() {
        this.routeName = this.$Route.name
    },
    onHide() {
        uni.$emit('pageHide')
    },
    onShow() {
        uni.$emit('pageShow')
    },
    onPullDownRefresh() {
        uni.$emit('pagePullDownRefresh')
    },
    onReachBottom() {
        uni.$emit('pageReachBottom')
    }
}
