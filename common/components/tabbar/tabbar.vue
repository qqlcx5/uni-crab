<template>
    <view class="c-tabbar">
        <c-fixed-menu
            v-model="showTabbar_"
            duration="0"
            height="50px"
            position="bottom"
        >
            <view class="flex c-tabbar-bd c-underline__top">
                <view
                    v-for="(item, index) in list_"
                    :key="index"
                    class="flex-1"
                    @click="changeTab(item.app_page, index)"
                >
                    <view
                        v-if="!isIm_ && item.app_page_type==='user_page' && getUnread_"
                        class="c-tabbar-tip"
                    ></view>
                    <view
                        v-if="item.app_page_type==='im_page' && getUnread_"
                        class="c-tabbar-tip__badge"
                    >{{ getUnread_ }}</view>
                    <c-colors :theme="[selectIndex_ === index ? selColor : color]">
                        <c-image
                            v-if="isImg_(item.img)"
                            :src="selectIndex_ === index ? item.img_active : item.img"
                            size="20px"
                        ></c-image>
                        <c-icons
                            v-else
                            color="false"
                            :type="selectIndex_ === index ? item.img_active : item.img"
                            size="20px"
                        ></c-icons>
                    </c-colors>
                    <c-colors
                        class="c-tabbar__text"
                        :theme="[selectIndex_ === index ? selColor : color]"
                        :class="[!item.name ? 'bright-card' : '']"
                    >
                        <view>{{ item.name }}</view>
                    </c-colors>
                </view>
            </view>
        </c-fixed-menu>
    </view>
</template>

<script>
import {
    mapGetters
} from 'vuex'
export default {
    name: 'CTabbar',
    props: {
        // 背景颜色
        bgColor: {
            type: String,
            default: '#fff'
        },
        // 字体颜色
        color: {
            type: String,
            default: '#666'
        },
        /**
         * 选中颜色
         * t 主题颜色
         */
        selColor: {
            type: String,
            default: 't'
        },
        // 是否展示tabbar
        showTabbar: {
            type: [String, Boolean],
            default: true
        }
    },
    data() {
        return {
            shieldReview: false,
            newList: [],
            shopConfig: {},
            curRoute: {
                query: {}
            }
        }
    },
    computed: {
        list_() {
            let tabbarArr = []
            // 初始化空
            tabbarArr = this.shopConfig_ && this.shopConfig_.menu ? this.shopConfig_.menu : [{
                app_page: '/',
                img: '',
                img_active: '',
                name: ''
            }, {
                app_page: '/',
                img: '',
                img_active: '',
                name: ''
            }, {
                app_page: '/',
                img: '',
                img_active: '',
                name: ''
            }, {
                app_page: '/',
                img: '',
                img_active: '',
                name: ''
            }]

            return tabbarArr
        },
        ...mapGetters('im', ['getUnread']),
        getUnread_() {
            return this.getUnread > 99 ? '99+' : this.getUnread
        },
        selectIndex_() {
            return this.list_.findIndex(o => {
                const routeObj = this.$c.getUrlQuery(o.app_page)
                const { query = {} } = this.curRoute
                const { query: tabQuery } = routeObj
                const isCurrent = (routeObj.path === this.curRoute.path || routeObj.path === this.curRoute.aliasPath || routeObj.path === this.curRoute.name)
                if (isCurrent) {
                    let isExit = true
                    for (const k in tabQuery) {
                        if (!this.$c.diffByObj(tabQuery[k], query[k])) {
                            isExit = false
                            break
                        }
                    }
                    return isExit
                }
                return false
            })
        },
        showTabbar_() {
            const showTabbar = String(this.showTabbar) !== 'false'
            return showTabbar && this.selectIndex_ !== -1
        },
        // 是否有开启 im 导航
        isIm_() {
            return this.list_.filter(item => item.app_page_type === 'im_page').length
        },
        isImg_() {
            return (icon) => {
                return this.$c.isImg(icon)
            }
        }
    },
    created() {
        // #ifdef H5
        this.curRoute = this.$Route
        // #endif
        // #ifndef H5
        this.$nextTick(() => {
            this.curRoute = this.$Route
        })
        // #endif
    },
    methods: {
        changeTab(url, index) {
            if (this.selectIndex_ === index || !url) return
            this.$jump(url.length <= 1 ? 'home' : url, {}, 'replace')
        }
    }
}
</script>

<style lang="scss" scoped>
.c-tabbar {
    &-bd {
        .flex-1 {
            @include flex(column);
            align-items: center;
            padding-top: 6px;
        }
    }
    &-tip {
        @include abs(10rpx, null, null, 50%);
        width: 15rpx;
        margin-left: 20rpx;
        height: 15rpx;
        border-radius: 50%;
        background: #fa543e;
    }
    &-tip__badge {
        @include abs(6rpx, null, null, 50%);
        z-index: 1;
        font-size: 24rpx;
        margin-left: 14rpx;
        color: #fff;
        background: #fa543e;
        border-radius: 20rpx;
        padding: 0 10rpx;
        text-align: center;
        min-width: 34rpx;
    }

    &__text {
        text-align: center;
        font-size: 12px;
        line-height: 16px;
        height: 16px;
        color: inherit;
        margin-top: 4px;
        /* #ifndef APP-PLUS-NVUE */
        min-width: 50%;
        /* #endif */
    }

    &__doted {
        @include abs(0, 0);
        width: 6px;
        height: 6px;
        background-color: red;
        border-radius: 100%;
        z-index: 2;
    }
}
</style>
