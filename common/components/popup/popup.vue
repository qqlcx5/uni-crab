<template>
    <view
        v-if="popupFlag"
        hover-stop-propagation
        :class="[customClass]"
        @click.stop
    >
        <view
            class="c-modal"
            :class="[`c-modal--${mode}`, innerPopupFlag ? 'c-modal--visible' : '',fixed ? 'c-modal--fixed': '']"
            :style="{ zIndex: zIndex }"
        >
            <c-mask
                v-if="mask_"
                :show="innerPopupFlag"
                z-index="1"
                :maskabled="maskabled"
                :bg-color="maskBgColor"
                @click="maskClose"
            ></c-mask>
            <view
                class="c-modal-hd"
                :class="[
                    `c-modal-hd--${mode}`,
                    hasTabbar_ ? 'c-modal-hd--hastabbar' : '',
                    zoom_ ? 'c-modal-hd--zoom' : '',
                    innerPopupFlag ? 'c-modal-hd--visible' : '',
                ]"
                :style="[childStyle_]"
                @touchmove.stop.prevent
                @click="handleClick"
            >
                <!-- 父级加这个会导致子元素scroll-view无法滑动 -->
                <!-- @touchmove.stop.prevent -->
                <c-status-bar v-if="custom_" />
                <view
                    class="c-modal__close"
                    :class="[`c-modal__close--${closePos}`]"
                >
                    <!-- #ifdef APP-PLUS-NVUE -->
                    <c-image
                        v-if="showClose_"
                        :size="closeSize / 3 * 2"
                        src="guest/close@2x.png"
                        @click="close"
                    />
                    <!-- #endif -->
                    <!-- #ifndef APP-PLUS-NVUE -->
                    <c-icons
                        v-if="showClose_"
                        type="zsuicon-guanbi"
                        :color="closeColor"
                        :size="closeSize"
                        @click="close"
                    />
                    <!-- #endif -->
                </view>
                <slot></slot>
            </view>
            <slot name="other"></slot>
        </view>
    </view>
</template>

<script>
// #ifdef APP-PLUS-NVUE
import * as utilFn from '@/common/utils'
// #endif
export default {
    name: 'CModal',
    props: {
        // 自定义class
        customClass: {
            type: String,
            default: ''
        },
        // 是否销毁弹窗
        destroyEle: {
            type: [Boolean, String],
            default: false
        },
        /**
         * 参数说明（定位）
         * top  right bottom left middle
         */
        mode: {
            type: String,
            default: 'middle'
        },
        // 默认使用fixed模式，否则是relative
        fixed: {
            type: Boolean,
            default: true
        },
        /**
         * 是否含有tabbar，仅在H5下生效
         */
        hasTabbar: {
            type: [Boolean, String],
            default: false
        },
        /**
         * 是否显示关闭按钮
         */
        showClose: {
            type: [Boolean, String],
            default: true
        },
        /**
         * 关闭按钮位置  可选值 top-right | top-left | bottom-right | bottom-left
         */
        closePos: {
            type: String,
            default: 'top-right'
        },
        /**
         * 关闭按钮颜色
         */
        closeColor: {
            type: String,
            default: '#D8D8D8'
        },
        /**
         * mode = top | center | bottom时有效
         * 弹窗内容的高度
         */
        height: {
            type: [Number, String],
            default: 'auto'
        },
        /**
         * mode = left | right时有效
         * 弹窗内容的宽度
         */
        width: {
            type: [Number, String],
            default: '80%'
        },
        /**
         * 关闭按钮大小
         */
        closeSize: {
            type: [Number, String],
            default: 40
        },
        /**
         * 是否显示蒙板
         */
        mask: {
            type: [Boolean, String],
            default: true
        },
        /**
         * 点击蒙板是否关闭,默认true关闭
         */
        maskabled: {
            type: [Boolean, String],
            default: true
        },
        /**
         * 是否显示modal框
         */
        value: {
            type: Boolean,
            default: false
        },
        /**
         * 模态框背景颜色
         */
        bgColor: {
            type: String,
            default: '#fff'
        },
        maskBgColor: {
            type: [String],
            default: 'rgba(0, 0, 0, 0.55)'
        },
        /**
         * 模态框圆角
         */
        radius: {
            type: [String, Number],
            default: 0
        },
        // 仅在mode 为 middle时有效
        zoom: {
            type: [Boolean, String],
            default: true
        },
        // 动画时长 单位ms  200ms = 0.2s
        duration: {
            type: [String, Number],
            default: 200
        },
        // 默认999 比系统高1
        zIndex: {
            type: [String, Number],
            default: 999
        },
        // 是否开启沉浸式导航,会帮你清空顶部电池栏
        custom: {
            type: [Boolean, String],
            default: false
        },
        // 内容体额外样式
        hdStyle: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            popupFlag: false, // 外层显示隐藏状态
            innerPopupFlag: false, // 内层动画状态
            timer: null
        }
    },
    computed: {
        destroyEle_() {
            return String(this.destroyEle) !== 'false'
        },
        custom_() {
            const needClear = ['top', 'left', 'right']
            return (
                (String(this.custom) !== 'false') &&
                needClear.includes(this.mode)
            )
        },
        zoom_() {
            return (
                (String(this.zoom) !== 'false') && this.mode === 'middle'
            )
        },
        mask_() {
            return String(this.mask) !== 'false'
        },
        radius_() {
            return this.$c.formatUnit(this.radius)
        },
        showClose_() {
            return String(this.showClose) !== 'false'
        },
        hasTabbar_() {
            return String(this.hasTabbar) !== 'false'
        },
        maskabled_() {
            return String(this.maskabled) !== 'false'
        },
        parentStyle_() {
            return {}
        },
        childClass_() {
            return `c-modal__content--${this.mode}`
        },
        childStyle_() {
            const otherStyle = {}
            if (this.mode === 'top') {
                otherStyle.transform = 'translate3d(0px, -100%, 0px)'
            } else if (this.mode === 'bottom') {
                otherStyle.transform = 'translate3d(0px, 100%, 0px)'
            } else if (this.mode === 'left') {
                otherStyle.transform = 'translate3d(-100%, 0px, 0px)'
            } else if (this.mode === 'right') {
                otherStyle.transform = 'translate3d(100%, 0px, 0px)'
            }
            if (!this.fixed) {
                otherStyle.transform = null
            }
            if (this.mode === 'left' || this.mode === 'right') {
                otherStyle.width = this.$c.formatUnit(this.width)
            } else {
                otherStyle.height = this.$c.formatUnit(this.height)
            }

            return {
                ...this.hdStyle,
                backgroundColor: this.bgColor,
                borderRadius: this.radius_,
                overflow: 'hidden',
                transitionDuration: `${this.duration}ms`,
                ...otherStyle
            }
        }
    },
    watch: {
        value: {
            handler(val) {
                this.modalFun(val ? 'open' : 'close')
            },
            immediate: true
        },
        innerPopupFlag(val) {
            this.$emit('input', val)
            this.$emit('change', {
                detail: {
                    value: val
                }
            })
        }
    },
    created() {
        // #ifdef APP-PLUS-NVUE
        !this.$c ? (this.$c = {}) : ''
        this.$c.formatUnit = utilFn.formatUnit
        // #endif
    },
    methods: {
        moveHandle() {
            return
        },
        handleClick(e) {
            this.$emit('contentClick', e)
        },
        maskClose() {
            if (!this.maskabled_) return
            this.close()
        },
        open() {
            this.change('popupFlag', 'innerPopupFlag', true)
            return true
        },
        close() {
            this.change('innerPopupFlag', 'popupFlag', false)
            return false
        },
        toggle() {
            return !this.popupFlag ? this.open() : this.close()
        },
        modalFun(pro = 'open') {
            this[pro]()
        },
        change(pro1, pro2, status) {
            this[pro1] = status
            // 先清空延时函数
            clearTimeout(this.timer)
            this.timer = null
            if (status) {
                // #ifdef H5 || MP
                this.timer = setTimeout(() => {
                    this[pro2] = status
                }, 50)
                // #endif
                // #ifndef H5 || MP
                this.$nextTick(() => {
                    this[pro2] = status
                })
                // #endif
            } else {
                this.timer = setTimeout(() => {
                    this.destroyEle_ ? (this[pro2] = status) : ''
                }, this.duration)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
// 弹窗公用样式
.c-modal {
    overflow: hidden;
    flex: 1;
    &--fixed {
        @include fixed(0, 0, 0, 0);
        pointer-events: none;
        z-index: -1;
        .c-modal {
            &-hd {
                position: relative;
                z-index: 10;
                transition-delay: 0ms;
                transition-timing-function: linear;
                transition-duration: 200ms;
                transition-property: transform, opacity, top;

                &--middle {
                    opacity: 0;
                    /* #ifndef APP-PLUS-NVUE */
                    max-width: 600rpx;
                    /* #endif */
                }

                &--zoom {
                    transform: scale(1.2);
                }

                &--top {
                    @include fixed(0, 0, null, 0);
                }

                &--bottom {
                    @include fixed(null, 0, 0, 0);
                    @include iosSafeArea(padding, 0px, bottom, bottom);
                }

                &--left {
                    @include fixed(0, null, 0, 0);
                    @include iosSafeArea(padding, 0px, bottom, bottom);
                }

                &--right {
                    @include fixed(0, 0, 0, null);
                    @include iosSafeArea(padding, 0px, bottom, bottom);
                }

                &--cover {
                    @include fixed(0, 0, 0, 0);
                }

                &--visible {
                    opacity: 1;
                    transform: scale(1) translateZ(0) !important;
                }

                /* #ifndef H5 || APP-PLUS-NVUE */
                &--hastabbar {
                    @include iosSafeArea(bottom, 50px, bottom);
                }

                /* #endif */
            }
        }
    }

    &--visible {
        pointer-events: auto;
        z-index: 999;
    }

    &--middle {
        @include flex(row);
        align-items: center;
        justify-content: center;
    }

    &__close {
        z-index: 2;

        &--top-right {
            @include abs($spacing-col-lg, $spacing-row-base * 2);
        }

        &--top-left {
            @include abs($spacing-col-lg, null, null, $spacing-row-base * 2);
        }

        &--bottom-right {
            @include abs(null, $spacing-col-lg, $spacing-row-base * 2);
        }

        &--bottom-left {
            @include abs(null, null, $spacing-col-lg, $spacing-row-base * 2);
        }
    }
}
</style>
