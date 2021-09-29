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
                    <c-colors :theme="[selectIndex_ === index ? 't' : color]">
                        <view class="c-tabbar__image">
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
                        </view>
                    </c-colors>
                    <c-colors
                        class="c-tabbar__text"
                        :theme="[selectIndex_ === index ? 't' : color]"
                        :class="[!item.name ? 'bright-card' : '']"
                        :pro="['c']"
                    >
                        <view>{{ item.name }}</view>
                    </c-colors>
                </view>
            </view>
        </c-fixed-menu>
    </view>
</template>

<script>
export default {
    name: 'CTabbar',
    props: {
        bgColor: {
            type: String,
            default: '#fff'
        },
        color: {
            type: String,
            default: '#666'
        },
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
@import "~@/common/styles/tarbar.css";
.c-tabbar {
    &-bd {
        .flex-1 {
            @include flex(column);
            align-items: center;
            padding-top: 6px;
        }
    }

    &__image {
        width: 20px;
        height: 20px;
        position: relative;
        overflow: hidden;
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
