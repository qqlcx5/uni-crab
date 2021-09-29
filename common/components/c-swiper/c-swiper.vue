<template>
    <view class="details-swiper-box">
        <swiper
            class="details-swiper"
            :autoplay="autoplay_"
            :style="{ width: width_, height: height_ }"
            :current="current"
            :interval="interval_"
            :duration="duration_"
            @animationfinish="handleChange"
        >
            <swiper-item
                v-if="videoSrc"
                class="video-swiper"
                @click="handleVideo(true)"
            >
                <c-icons
                    class="icon"
                    size="80"
                    color="#fff"
                    type="icon-bofang"
                />
                <!-- :src="videoSrc + '?x-oss-process=video/snapshot,t_300,f_jpg'" -->
                <c-image
                    :width="width_"
                    :height="height_"
                    :src="list_[0]"
                    :radius="radius"
                ></c-image>
            </swiper-item>
            <swiper-item
                v-for="(item, index) in list_"
                :key="index"
                @click="previewImage(list_, index)"
            >
                <c-image
                    :width="width_"
                    :height="height_"
                    :src="item"
                    :radius="radius"
                    mode="aspectFill"
                ></c-image>
            </swiper-item>
        </swiper>
        <c-popup
            v-model="isVideo"
            mode="right"
            width="750"
        >
            <view class="video-box flex-ajcenter">
                <video
                    v-if="isVideo"
                    id="swiperVideo"
                    :src="videoSrc"
                    :style="{ width: width_, height: height_ }"
                    controls
                    :enable-progress-gesture="false"
                    :show-fullscreen-btn="false"
                    :show-center-play-btn="true"
                    :object-fit="objectFit"
                    autoplay
                    loop
                ></video>
            </view>
        </c-popup>
        <!-- 1/5 -->
        <view
            v-if="showDoted_"
            class="dot"
        >{{ totalNum_ }}</view>
        <!-- dot样式 -->
        <view
            class="swiper-dots"
            v-if="cssDots_"
        >
            <view
                v-for="(item,index) in list_"
                :key="index"
                class="swiper-dot"
                :class="[{'active': current == index }]"
            ></view>
        </view>
    </view>
</template>
<script>
// #ifdef APP-PLUS
const systemInfo = uni.getSystemInfoSync()
// #endif
export default {
    props: {
        list: {
            type: Array,
            default: () => {
                return []
            }
        },
        videoSrc: {
            type: String,
            default: ''
        },
        // easy 纯数组
        mode: {
            type: String,
            default: 'normal'
        },
        showDoted: {
            type: [String, Boolean],
            default: true
        },
        cssDots: {
            type: [String, Boolean],
            default: false
        },
        value: {
            type: Number,
            default: 0
        },
        imgKey: {
            type: String,
            default: 'url'
        },
        autoplay: {
            type: [String, Boolean],
            default: false
        },
        interval: {
            type: [Number, String],
            default: 8000
        },
        duration: {
            type: [Number, String],
            default: 500
        },
        width: {
            type: [Number, String],
            default: 750
        },
        height: {
            type: [Number, String],
            default: 750
        },
        radius: {
            type: [Number, String],
            default: 0
        },
        isJump: {
            type: [String, Boolean],
            default: false
        }
    },
    data() {
        return {
            current: 0,
            isVideo: false,
            // #ifdef APP-PLUS
            objectFit: systemInfo.platform === 'ios' ? 'fill' : 'cover',
            // #endif
            // #ifndef APP-PLUS
            objectFit: 'cover',
            // #endif

        }
    },
    computed: {
        height_() {
            return this.$c.formatUnit(this.height)
        },
        width_() {
            return this.$c.formatUnit(this.width)
        },
        list_() {
            return (typeof (this.list[0]) === 'string') ? this.list : this.list.map(o => o[this.imgKey])
        },
        totalNum_() {
            return `${this.current + 1}/${this.videoSrc ? this.list.length + 1 : this.list.length}`
        },
        interval_() {
            return parseInt(this.interval)
        },
        duration_() {
            return parseInt(this.duration)
        },
        autoplay_() {
            return String(this.autoplay) !== 'false'
        },
        showDoted_() {
            return String(this.showDoted) !== 'false'
        },
        cssDots_() {
            return String(this.cssDots) !== 'false'
        },
        isJump_() {
            return String(this.isJump) !== 'false'
        }


    },
    watch: {
        value: {
            handler(val) {
                this.current = val
            },
            immediate: true
        },
        current(val) {
            this.$emit('input', val)
        }
    },
    methods: {
        handleVideo(val) {
            this.isVideo = val
        },
        handleChange(event) {
            this.current = event.detail.current
        },
        previewImage(urls, current) {
            console.log('个人简介', this.list[current]);
            if (this.isJump_) return this.$serverJump(this.list[current])
            uni.previewImage({
                current,
                urls
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.details-swiper-box {
    position: relative;

    .details-swiper {
        width: 100%;
        height: 750rpx;

        .swiper-item {
            width: 100%;
            height: 100%;
        }
    }

    .dot {
        position: absolute;
        bottom: 30rpx;
        right: 30rpx;
        background: #000000;
        border-radius: 30rpx;
        opacity: 0.4;
        padding: 8rpx 14rpx;
        box-sizing: border-box;
        font-size: 22rpx;
        color: #ffffff;
    }
    .video-swiper {
        position: relative;
        &::after {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            z-index: 5;
            display: block;
            width: 750rpx;
            height: 750rpx;
            background: rgba(0, 0, 0, 0.3);
        }
        .icon {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate3d(-50%, -50%, 0);
            z-index: 10;
        }
    }
    .video-box {
        height: 100vh;
        width: 100%;
        background: rgba(0, 0, 0, 0.9);
    }

    .swiper {
        &-dots {
            display: flex;
            align-items: center;
            justify-content: center;
            @include abs(null, 24rpx, 24rpx, null);
            //   transform: translate(-50%, 0);
        }
        &-dot {
            margin: 0 4rpx;
            border-radius: 3rpx;
            @include tst();
            width: 10rpx;
            height: 10rpx;
            background: rgba(255, 255, 255, 0.23);
            border-radius: 6rpx;
            &.active {
                width: 22rpx;
                height: 10rpx;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 6rpx;
            }
        }
    }
}
</style>
