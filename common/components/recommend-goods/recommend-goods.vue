<template>
    <view class="c-recommend-goods">
        <view
            v-if="!finish"
            class="bright-card"
        >
            <c-image
                :src="skeleton_"
                width="100%"
                mode="widthFix"
            />
        </view>
        <view :style="[outerLayer_]">
            <c-recommend
                v-if="title_"
                :title="title_"
                :desc="desc"
            ></c-recommend>
        </view>
        <gc-list
            v-if="pageList.length"
            :full="full"
            :list="pageList"
            :img-size="imgSize"
            :img-radius="imgRadius"
            :radius="radius"
            :mode="mode"
            :bg-color="outerLayer_.backgroundColor || bgColor"
            :show-shopping-cart="showShoppingCart_"
            :img-key="imgKey_"
            :title-key="titleKey_"
            :type="type"
            :load-more="loadMore_"
        />
        <c-no-data
            v-if="lodingText"
            :show-img="noData"
            :text="lodingText"
        ></c-no-data>
    </view>
</template>

<script>
import listMixins from '@/common/mixins/list.js'
import homeComponentMixins from '@/home/components/component/home-component-mixins'

export default {
    name: 'CRecommendGoods',
    mixins: [listMixins, homeComponentMixins],
    props: {
        mode: {
            type: String,
            default: 'column'
        },
        title: {
            type: [String, Boolean],
            default: '推荐商品'
        },
        desc: {
            type: String,
            default: ''
        },
        ajaxName: {
            type: String,
            default: 'orderRecommend'
        },
        ajaxParams: {
            type: Object,
            default: () => {
                return {}
            }
        },
        loadMore: {
            type: [String, Boolean],
            default: true
        },
        imgSize: {
            type: [String, Number],
            default: 340
        },
        radius: {
            type: [String, Number],
            default: 16
        },
        imgRadius: {
            type: [String, Number],
            default: 16
        },
        full: {
            type: [String, Boolean],
            default: false
        },
        bgColor: {
            type: String,
            default: '#f5f5f5'
        },
        // 是否显示购物车，仅mode = normal 或 weiyvLike 或 normal_no_title 时有效
        showShoppingCart: {
            type: [Boolean, String],
            default: true
        },
        /**
        * 主要是用来区分展示字段，或样式
        * normal 正常产品列表(精选好物、)
        * normal_no_title 无标题的正常产品列表，用于与package公用tab栏时
        * giftPack 新人礼包
        * setMeal 旧套餐包
        * group 团购
        * seckill 限时秒杀
        * package 新套餐包
        */
        type: {
            type: String,
            default: 'normal'
        }
    },
    data() {
        return {
            autoReq: false,
            reqParams: {},
            reqName: '',
            noDataText: '暂无推荐商品',
            curRouteName: ''// 当前路由名称，由于下面pageShow采用全局监听，页面跳转掉后还能监听到，所以要屏蔽
        }
    },
    computed: {
        title_() {
            return String(this.title) === 'false' ? false : this.title
        },
        showShoppingCart_() {
            return String(this.showShoppingCart) !== 'false'
        },
        skeleton_() {
            switch (this.type) {
                case 'normal_no_title': return 'skeleton-screen/c-recommend-goods-no-title.png'
                case 'package': return 'skeleton-screen/c-recommend-goods-no-cart.png'
                default: return 'skeleton-screen/c-recommend-goods.png'
            }
        },
        loadMore_() {
            return String(this.loadMore) !== 'false'
        },
        imgKey_() {
            return this.type === 'package' ? 'cover_img' : 'goods_img'
        },
        titleKey_() {
            return this.type === 'package' ? 'name' : 'goods_name'
        }
    },
    watch: {
        ajaxParams: {
            handler(val) {
                if (this.reqName === this.ajaxName && this.$c.diffByObj(this.reqParams, val)) return
                this.reqName = this.ajaxName
                this.reqParams = this.$deepClone(val)
                if (this.reqName === 'personalRecommendGoods' && !val.personal_card_id) return
                this.initPage()
            },
            immediate: true,
            deep: true
        },
        ajaxName: {
            handler(val) {
                // 屏蔽掉重复请求
                if (this.reqName === this.ajaxName && this.$c.diffByObj(this.reqParams, this.ajaxParams)) return
                this.reqName = val
                this.initPage()
            },
            deep: true
        }
    },
    created() {
        const that = this
        that.curRouteName = that.$Route.name
        that.loadMore && uni.$on('pageReachBottom', function () {
            that.curRouteName === that.$Route.name && that.reachBottomFn()
        })
    },
    methods: {
        finishInit(data) {
            this.$emit('backData', {// 设置或者重置新安全密码
                type: 'click',
                detail: {
                    value: data.list
                }
            })
        }
    }
}
</script>

<style>
</style>
