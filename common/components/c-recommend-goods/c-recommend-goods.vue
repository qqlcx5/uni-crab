<template>
    <view class="c-recommend-goods">
        <view
            v-if="!finish"
            class="bright-card plr24"
        >
            <c-image
                src="skeleton-screen/c-recommend-goods.png"
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
