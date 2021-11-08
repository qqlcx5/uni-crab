<!--
 * @Descripttion: 
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-07-20 14:10:08
-->
<template>
    <view>
        <view
            v-if="isSlide_"
            class="c-mask"
            :class="[
                show ? 'c-mask--visible' : ''
            ]"
            :style="[ parentStyle_ ]"
            catchtouchmove="true"
            @click="handleClick"
            @touchmove.stop.prevent
        ></view>
        <view
            v-else
            class="c-mask"
            :class="[
                show ? 'c-mask--visible' : ''
            ]"
            :style="[ parentStyle_ ]"
            @click="handleClick"
        >
        </view>
    </view>
</template>

<script>
export default {
    props: {
        show: {
            type: [Boolean, String],
            default: false
        },
        /**
        * 点击蒙板是否关闭,默认true关闭
        */
        maskabled: {
            type: [Boolean, String],
            default: true
        },
        // 动画时长 单位ms  250ms = 0.25s
        duration: {
            type: [String, Number],
            default: 250
        },
        position: {
            type: String,
            default: 'fixed'
        },
        zIndex: {
            type: [String, Number],
            default: 1000
        },
        bgColor: {
            type: [String],
            default: 'rgba(0, 0, 0, 0.55)'
        },
        stopPrevent: {
            type: [Boolean, String],
            default: true
        },
        radius: {
            type: [String, Number],
            default: 0
        },
        isSlide: {
            type: [Boolean, String],
            default: true
        }
    },
    computed: {
        stopPrevent_() {
            return String(this.stopPrevent) !== 'false'
        },
        parentStyle_() {
            // const transitionProperty = 'transform'
            return {
                position: this.position,
                zIndex: this.zIndex,
                backgroundColor: this.bgColor,
                borderRadius: this.$c.formatUnit(this.radius),
                transitionDuration: `${this.duration}ms`
            }
        },
        maskabled_() {
            return String(this.maskabled) !== 'false'
        },
        isSlide_() {
            return String(this.isSlide) !== 'false'
        }
    },
    methods: {
        handleClick() {
            if (!this.maskabled_) return
            this.$emit('click')
        }
    }
}
</script>

<style scoped lang="scss">
// 蒙层
.c-mask {
    background-color: $mask-bg;
    @include fixed(0, 0, 0, 0);
    transition-delay: 0ms;
    opacity: 0;
    z-index: 999;
    transition-timing-function: linear;
    transition-property: opacity;
    &--visible {
        opacity: 1;
    }
}
</style>
