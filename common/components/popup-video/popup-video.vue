<template>
    <!--全局视频弹层播放-->
    <view class="c-popup-video">
        <c-popup
            v-model="innerShowVideoPopup"
            :mode="popupMode"
            :width="popupWidth"
            close-pos="top-right"
        >
            <view class="video-box flex-ajcenter">
                <video
                    v-if="innerShowVideoPopup"
                    :src="videoSrc"
                    :style="{ width: width_, height: height_ }"
                    controls
                    :enable-progress-gesture="enableProgressGesture"
                    :show-fullscreen-btn="showFullscreenBtn"
                    :show-center-play-btn="showCenterPlayBtn"
                    :object-fit="objectFit_"
                    :autoplay="autoplay"
                    :loop="loop"
                    play-btn-position="bottom"
                ></video>
            </view>
        </c-popup>
    </view>
</template>

<script>
export default {
    name: 'CPopupVideo',
    props: {
        // 弹层是否显示
        value: {
            type: Boolean,
            default: false
        },
        // 弹层出现方式 right | left | bottom | top
        popupMode: {
            type: String,
            default: 'right'
        },
        // 弹层宽度
        popupWidth: {
            type: [String, Number],
            default: 750
        },
        // 视频链接
        videoSrc: {
            type: String,
            default: ''
        },
        // 视频宽度
        videoWidth: {
            type: String,
            default: ''
        },
        // 视频高度
        videoHeight: {
            type: String,
            default: ''
        },
        // 是否允许视频进度条手势拖动
        enableProgressGesture: {
            type: Boolean,
            default: false
        },
        // 是否显示全屏按钮
        showFullscreenBtn: {
            type: Boolean,
            default: false
        },
        // 是否显示中间播放按钮
        showCenterPlayBtn: {
            type: Boolean,
            default: true
        },
        // 视频封面裁剪方式 ios: fill, 其他：cover
        objectFit: {
            type: String,
            default: 'cover'
        },
        // 是否自动播放
        autoplay: {
            type: Boolean,
            default: true
        },
        // 是否循环播放
        loop: {
            type: Boolean,
            default: true
        }

    },
    options: { styleIsolation: 'shared' },
    data() {
        return {
            innerShowVideoPopup: false
        }
    },
    computed: {

        height_() {
            return this.$c.formatUnit(this.videoHeight)
        },
        width_() {
            return this.$c.formatUnit(this.videoWidth)
        },
        objectFit_() {
            // #ifdef APP-PLUS
            if (uni.getSystemInfoSync().platform === 'ios') {
                return 'fill'
            }
            return 'cover'
            // #endif
        }
    },
    watch: {
        value: {
            handler(val) {
                this.innerShowVideoPopup = val
                this.$emit('input', val)
            },
            immediate: true
        },
        innerShowVideoPopup(val) {
            this.$emit('input', val)
        }
    },
    mounted() {
    },
    methods: {}
}
</script>

<style lang="scss" scoped>
.c-popup-video {
    /* #ifdef MP-WEIXIN */
    /deep/.c-modal__close--top-right {
        top: 188rpx;
    }
    /deep/.c-modal__close--top-left {
        top: 122rpx;
    }
    /* #endif */
}
.video-box {
    height: 100vh;
    background: #000;
}
</style>
