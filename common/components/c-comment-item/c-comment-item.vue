<template>
    <view
        class="c-comment-item"
        @tap="handleItemClick(commentId)"
    >
        <view class="c-comment-item__hd">
            <!--用户信息-->
            <c-cell
                :icon="icon"
                :title="title || '***'"
                :label="diffDays || firstTime | formatTime"
                icon-size="64"
                icon-radius="64"
                :title-style="{
                    'font-weight': 600
                }"
                :label-style="{ 
                    'margin-top': 0,
                }"
            ></c-cell>
        </view>

        <!--首评-->
        <view class="c-comment-item__bd">
            <view class="c-comment-item__item">
                <!--评价文本-->
                <view class="c-comment-item__text c-ellipsis-2">{{ commentText }}</view>
                <!--评价图片、视频-->
                <view
                    v-if="showCommentMedia && mediaLength('first', commentImgList, commentVideoList)"
                    class="c-comment-item__media flex flex-space-between"
                    :class="{ 'media-radius' : mediaLength('first', commentImgList, commentVideoList) !== 1}"
                >
                    <!-- 循环视频 -->
                    <view
                        v-for="(item, index) in commentVideoList"
                        :key="index"
                        class="media-item"
                        @tap.stop="handleVideoClick(item)"
                    >
                        <c-image
                            :radius="mediaLength('first', commentImgList, commentVideoList) === 1 ? 12: 0"
                            :size="mediaSize('first', commentImgList, commentVideoList)[0]"
                            shape="square"
                            mode="aspectFill"
                            :show-loading="true"
                            :src="item + '?x-oss-process=video/snapshot,t_0,f_jpg'"
                        ></c-image>
                        <c-image
                            class="video-mask"
                            src="goods/comment/comment-video-play.png"
                            :size="mediaSize('first', commentImgList, commentVideoList)[1]"
                        ></c-image>
                    </view>

                    <!-- 循环图片集 -->
                    <view
                        v-for="(item, index) in commentImgList.slice(0, imgShowLen('first', commentVideoList))"
                        :key="item"
                        class="media-item"
                        @tap.stop="handleImageClick(index, commentImgList)"
                    >
                        <c-image
                            :size="mediaSize('first', commentImgList, commentVideoList)[0]"
                            shape="square"
                            mode="aspectFill"
                            :show-loading="true"
                            :src="item"
                        ></c-image>
                    </view>

                    <!-- 查看全部遮罩 -->
                    <view
                        v-if="mediaLength('first', commentImgList, commentVideoList) > 4 "
                        class="img-mask"
                    >
                        <view>{{ mediaLength('first', commentImgList, commentVideoList) }} 个</view>
                        <text class="img-mask-text">查看全部</text>
                    </view>

                </view>
            </view>
        </view>

        <!--掌柜首评回复-->
        <view
            v-if="showReply && reply"
            class="c-comment-item__fd"
        >
            <view class="c-comment-reply">
                <view class="c-comment-reply__hd flex align-center">
                    <c-icons type="icon-kefu"></c-icons>
                    <text class="fs26 pl12">掌柜回复</text>
                </view>
                <view class="c-comment-reply__bd">
                    <view class="comment-reply-text">
                        <view :class="[{'c-ellipsis-2' : !openComment}]">
                            {{ reply }}
                        </view>
                        <view
                            v-if="needCutStr(reply, 94)"
                            class="text-mask fs26"
                            @tap.stop="openComment = !openComment"
                        >
                            <c-colors
                                v-if="!openComment"
                                :theme="['s']"
                            >... 展开</c-colors>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!--追评-->
        <view v-if="showAppend && appendCommentList.length">
            <view
                v-for="(item, index) in appendCommentList"
                :key="index"
                class="c-comment-item__bd"
            >
                <view class="append-comment-label">{{ item.diff_days }}</view>
                <view class="c-comment-item__item mt12">
                    <!--评价文本-->
                    <view class="c-comment-item__text c-ellipsis-2">{{ item.content }}</view>
                    <!--评价图片、视频-->
                    <view
                        v-if="mediaLength('append', item)"
                        class="c-comment-item__media flex flex-space-between"
                        :class="{ 'media-radius' : mediaLength('append', item) !== 1}"
                    >

                        <!-- 循环视频 -->
                        <view
                            v-for="(child_item,child_index) in item.video_urls"
                            :key="child_index"
                            class="media-item"
                            @tap.stop="handleVideoClick(child_item)"
                        >
                            <c-image
                                :radius="mediaLength('append', item) === 1 ? 12: 0"
                                :size="mediaSize('append', item, 0)[0]"
                                shape="square"
                                mode="aspectFill"
                                :show-loading="true"
                                :src="child_item + '?x-oss-process=video/snapshot,t_0,f_jpg'"
                            ></c-image>
                            <c-image
                                class="video-mask"
                                src="goods/comment/comment-video-play.png"
                                :size="mediaSize('append', item, 0)[1]"
                            ></c-image>
                        </view>

                        <!-- 循环图片集 -->
                        <view
                            v-for="(child_item, child_index) in item.img_urls.slice(0, imgShowLen('append', item))"
                            :key="child_item"
                            class="media-item"
                            @tap.stop="handleImageClick(child_index, item.img_urls)"
                        >
                            <c-image
                                :size="mediaSize('append', item, 0)[0]"
                                shape="square"
                                mode="aspectFill"
                                :show-loading="true"
                                :src="child_item"
                            ></c-image>
                        </view>

                        <!-- 查看全部遮罩 -->
                        <view
                            v-if="mediaLength('append', item) > 4 "
                            class="img-mask"
                        >
                            <view>{{ mediaLength('append', item) }} 个</view>
                            <text class="img-mask-text">查看全部</text>
                        </view>
                    </view>
                </view>

                <!--掌柜追评回复-->
                <view
                    v-if="item.replay_content"
                    class="c-comment-item__fd"
                >
                    <view class="c-comment-reply">
                        <view class="c-comment-reply__hd flex align-center">
                            <c-icons type="icon-kefu"></c-icons>
                            <text class="fs26 pl12">掌柜回复</text>
                        </view>
                        <view class="c-comment-reply__bd">
                            <view class="comment-reply-text">
                                <view :class="[{'c-ellipsis-2' : !openAppendComment}]">
                                    {{ item.replay_content }}
                                </view>
                                <view
                                    v-if="needCutStr(item.replay_content, 94)"
                                    class="text-mask fs26"
                                    @tap.stop="openAppendComment = !openAppendComment"
                                >
                                    <c-colors
                                        v-if="!openAppendComment"
                                        :theme="['s']"
                                    >... 展开</c-colors>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!--相关商品插槽-->
        <view
            class="c-comment-item__goods-card"
            @tap.stop="()=>{}"
        >
            <slot name="goods_card_slot"></slot>
        </view>

        <view
            class="c-comment-item__extra"
            :class="{'flex-end': !showViews}"
        >
            <!--浏览次数-->
            <text
                v-if="showViews"
                class="views"
            >浏览 {{ views }} 次</text>

            <!--右侧插槽-->
            <view
                class="c-comment-item__extra-right"
                @tap.stop="()=>{}"
            >
                <slot name="right_slot"></slot>
            </view>
        </view>

    </view>
</template>

<script>
export default {
    name: 'CCommentItem',
    props: {

        // commentId 用于跳转
        commentId: {
            type: [String, Number],
            default: ''
        },

        // 头像
        icon: {
            type: String,
            default: ''
        },

        // 用户名
        title: {
            type: String,
            default: 'zzz'
        },

        // 首评文本
        commentText: {
            type: String,
            default: ''
        },

        // 首评视频
        commentVideoList: {
            type: Array,
            default: () => []
        },

        // 首评图片
        commentImgList: {
            type: Array,
            default: () => []
        },

        // 追评内容
        appendCommentList: {
            type: Array,
            default: () => []
        },

        // 浏览数
        views: {
            type: [String, Number],
            default: ''
        },

        // 掌柜首评回复
        reply: {
            type: String,
            default: ''
        },

        // 是否显示掌柜首评回复
        showReply: {
            type: Boolean,
            default: false
        },

        // 首评时间差
        diffDays: {
            type: String,
            default: ''
        },

        // 首评时间
        firstTime: {
            type: [String, Number],
            default: ''
        },

        // 是否显示首评附件
        showCommentMedia: {
            type: Boolean,
            default: false
        },

        // 是否显示追评内容
        showAppend: {
            type: Boolean,
            default: false
        },

        // 是否显示浏览数
        showViews: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            openComment: false,
            openAppendComment: false
        }
    },
    computed: {

        // 附件尺寸
        mediaSize(type, item, item1) {
            var val
            return (type, item, item1) => {
                switch (this.mediaLength(type, item, item1)) {
                    case 1:
                    case 2:
                        val = [348, 70]; break
                    case 3:
                        val = [230, 56]; break
                    default:
                        val = [172, 48]
                }
                return val
            }
        },

        // 追评图片最多展示几张
        imgShowLen(type, item) {
            return (type, item) => {
                return 4 - this.videoLength(type, item)
            }
        },

        // 没用到
        imgLength(type, item) {
            return (type, item) => {
                if (type === 'first') {
                    return item.length
                }
                return item.img_urls.length
            }
        },
        videoLength(type, item) {
            return (type, item) => {
                if (type === 'first') {
                    return item.length
                }
                return item.video_urls.length
            }
        },
        mediaLength(type, item, item1) {
            return (type, item, item1) => {
                if (type === 'first') {
                    return item.length + item1.length
                }
                return item.video_urls.length + item.img_urls.length
            }
        }
    },
    mounted() {
    },
    methods: {

        // 判断字符串是否需要截取,
        /* str 字符串
        /* len 字符数，注意一个汉字2个字符
        * */
        needCutStr(str, len) {
            if (str.length * 2 <= len) {
                return false
            }

            var str_len = 0
            //  = ''
            for (let i = 0; i < str.length; i++) {
                // result += str.charAt(i)
                if (str.charCodeAt(i) > 128) {
                    str_len += 2
                    if (str_len >= len) {
                        return true
                        // return result.substring(0, result.length-1) + "...";
                    }
                } else {
                    str_len += 1
                    if (str_len >= len) {
                        return true
                        // return result.substring(0, result.length-2) + "...";
                    }
                }
            }
            // return result;
        },

        // 整个item的点击事件，这里会不捕获子事件
        handleItemClick() {
            // console.log('handleItemClick');
            this.$emit('handleItemClick', this.commentId)
        },

        // media里的video点击
        handleVideoClick(videoSrc) {
            console.log('handleVideoClick', videoSrc)
            this.$emit('handleVideoClick', videoSrc)
        },
        // media里的img点击
        handleImageClick(index, commentImgList) {
            // console.log('handleImageClick', index, commentImgList)
            this.$emit('handleImageClick', {
                index: index,
                imgs: commentImgList
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.c-comment-item {
    background: #fff;
    ss & + & {
        margin-top: 24rpx;
    }
    &__bd {
        .c-comment-item__item {
            padding: 12rpx 0 0;
            .c-comment-item__text {
                padding: 0 24rpx;
                margin-bottom: 24rpx;
                line-height: 38rpx;
                font-size: 26rpx;
            }
        }
        .media-item {
            position: relative;
            //padding: 0 6rpx;
        }
    }
    &__media {
        margin: 24rpx;
        position: relative;
    }
    .media-radius {
        border-radius: 12rpx;
        overflow: hidden;
    }
    .video-mask {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
    }
    .img-mask {
        color: #fff;
        text-align: center;
        position: absolute;
        width: 172rpx;
        height: 172rpx;
        @include flex(column);
        justify-content: center;
        align-items: center;
        top: 0;
        right: 0;
        z-index: 1;
        background: rgba(51, 51, 51, 0.4);
        .img-mask-text {
            font-size: 22rpx;
            margin-top: 6rpx;
        }
    }
    .append-comment-label {
        padding-left: 24rpx;
        font-size: 22rpx;
        color: #ff5b09;
    }
    .views {
        padding-left: 24rpx;
        font-size: 22rpx;
        color: #999;
    }
    &__fd {
        padding: 0 24rpx 24rpx;
        .c-comment-reply {
            padding: 24rpx;
            background: #f5f5f5;
            border-radius: 12rpx;
        }
        .comment-reply-text {
            position: relative;
            margin-top: 12rpx;
            font-size: 26rpx;
            line-height: 38rpx;
            color: #666;
        }
        .text-mask {
            position: absolute;
            bottom: 0;
            right: 0;
            z-index: 1;
            background: linear-gradient(
                to right,
                rgba(245, 245, 245, 0.1) 0%,
                rgba(245, 245, 245, 1) 30%,
                rgba(245, 245, 245, 1) 100%
            );
            padding-left: 60rpx;
        }
    }
    &__extra {
        @include flex(row);
        justify-content: space-between;
        align-items: center;
        &-right {
            padding-right: 24rpx;
        }
        &.flex-end {
            justify-content: flex-end;
        }
    }
}
</style>
