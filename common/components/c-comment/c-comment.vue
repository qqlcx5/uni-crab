<template>
    <view class="c-comment">
        <view class="c-comment__hd">
            <!--标题栏-->
            <c-cell
                :title="'宝贝评价 (' + (total || 0) + ')'"
                @tap="handleTap"
            >
                <view
                    v-show="total"
                    slot="value"
                >
                    <c-colors
                        :theme="['t']"
                        :pro="['c']"
                    >
                        <view class="flex align-center">查看更多
                            <c-icons
                                size="32"
                                type="icon-tiaozhuan"
                            ></c-icons>
                        </view>
                    </c-colors>
                </view>
            </c-cell>

            <!--标签栏 暂时隐藏-->
            <!-- <view
                v-if="total"
                class="c-comment-tag"
            >-->
            <!-- TODO 这里还需要请求标签数据-->
            <!-- <view class="c-comment-tag-item">水汽足(3)</view>
                <view class="c-comment-tag-item">出雾很细致(32)</view>
                <view class="c-comment-tag-item">出雾很细致(32)</view>
                <view class="c-comment-tag-item">出雾很细致(32)</view>
            </view> -->
        </view>
        <view class="c-comment__bd">
            <c-comment-item
                v-for="(item,index) in list"
                :key="index"
                :comment-id="item.id"
                :icon="item.user_img"
                :title="item.user_name"
                :comment-text="item.content"
                :comment-video-list="item.video_urls || []"
                :comment-img-list="item.img_urls || []"
                :diff-days="item.diff_days"
                :first-time="item.first_time"
                :append-comment-list="item.review_list || []"
                :views="item.views"
                :reply="item.replay_content"
                @handleItemClick="handleCommentItemClick"
                @handleVideoClick="handleVideoClick"
                @handleImageClick="handleImageClick"
            ></c-comment-item>

            <!--无数据-->
            <c-no-data
                v-if="!total"
                show-img
                text="暂无评价"
            ></c-no-data>
        </view>

        <!--视频弹层，用于c-comment-item里的视频播放-->
        <c-popup-video
            v-model="showVideoPopup"
            popup-mode="right"
            popup-width="750"
            :video-src="videoSrc"
            :video-width="'100%'"
            :video-height="'100vh'"
        ></c-popup-video>
    </view>
</template>

<script>
export default {
    name: 'CComment',
    props: {
        list: {
            type: Array,
            default: () => []
        },
        total: {
            type: [String, Number],
            default: 0
        }
    },
    data() {
        return {
            detailId: '',
            showVideoPopup: false,
            videoSrc: ''
        }
    },
    computed: {

    },
    created() {
        this.detailId = this.$Route.query.detailId
    },
    mounted() {
    },
    methods: {
        handleTap() {
            // 当有评价数据时，才允许跳转查看全部评价
            this.total && this.$jumpDetail('comment', this.$Route.query.detailId)
        },

        // 跳转详情
        handleCommentItemClick(id) {
            this.$jump('commentDetail', { id })
        },

        // 视频点击
        handleVideoClick(e) {
            this.videoSrc = e

            console.log('this.videoSrc', this.videoSrc)
            this.showVideoPopup = true
        },

        // 图片点击
        handleImageClick(payload) {
            uni.previewImage({
                current: payload.index,
                urls: payload.imgs,
                indicator: 'number' // 该属性只有App支持，坑啊~ 
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.c-comment {
    background: #fff;
    /*  &__hd {
        padding-bottom: 24rpx;
    } */
    &-tag {
        @include flex(row);
        flex-wrap: wrap;
        padding: 0 20rpx;
        &-item {
            @include flex(row);
            align-items: center;
            height: 54rpx;
            padding: 0 24rpx;
            margin-right: 20rpx;
            margin-bottom: 20rpx;
            background-color: rgba(250, 63, 30, 0.15);
            font-size: 26rpx;
            border-radius: 40rpx;
        }
    }
}
</style>
