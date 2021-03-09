<template>
    <view class="c-fixed-menu" :class="[
		`c-fixed-menu--${position}`
	]" :style="[ parentStyle_ ]">
        <view :class="[ 
			`c-${position}-menu__fixed`,
			value ? 'c-fixed-menu--active' : '',
			hasBorder_ ? (position === 'top' ? ' c-underline' : ' c-underline__top') : ''
		]" :style="[
            childrenStyle_
        ]">
            <view class="c-fixed-menu__content" :style="[ style_ ]">
                <slot></slot>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            // 浮动方向,值为top或者bottom
            position: {
                type: String,
                default: 'top'
            },
            // 清楚浮动的高度,支持rpx px,不写单位默认为rpx
            height: {
                type: [ String, Number ],
                default: 88
            },
            fixedHeight: {
                type: [ String, Number ],
                default: 'inherit'
            },
            value: {
                type: Boolean,
                default: true
            },
            bgColor: {
                type: String,
                default: '#fff'
            },
            border: {
                type: [ Boolean, String ],
                default: false
            },
            hasTab: {
                type: [ Boolean, String ],
                default: false
            },
            hasNav: {
                type: [Boolean, String],
                default: true
            }
        },
		data() {
			return {
				paddingTop: 0,
				paddingRight: 0
			}
		},
        computed: {
            hasNav_() {
                return String(this.hasNav) === 'false' ? false : true;
            },
            hasBorder_() {
                return String(this.border) === 'false' ? false : true;
            },
            hasTab_() {
                return String(this.hasTab) === 'false' ? false : true;
            },
            fixedHeight_() {
                return this.$c.formatUnit(this.fixedHeight === 'auto' ? 'auto' : this.height, 'rpx', this.height);
            },
            height_() {
                if(!this.value) return 0;
                return this.$c.formatUnit(this.height);
            },
            parentStyle_() {
                return {
                    height: `calc(${this.height_} + ${this.hasNav_ ? '0px' : this.paddingTop})`
                }
            },
            childrenStyle_() {
                let childrenStyle = {
                    ...this.parentStyle_,
                    backgroundColor: this.bgColor,
                    paddingTop: this.hasNav_ ? 0 : this.paddingTop,
                    top: this.hasNav_ ? null : 0
                };
                this.hasTab_ && (childrenStyle.transform = `translateY(${this.hasTab_ ? '-50px': 0})`);
                return childrenStyle;
            },
            style_() {
                let style_ = {
                    height: this.fixedHeight_,
                    ...this.menuStyle
                };
                return style_
            }
        },
		created() {
			let systemInfo = uni.getSystemInfoSync();
		    // #ifdef MP-WEIXIN
		    const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
		    this.paddingTop = menuButtonInfo.top + 'px';
			this.paddingRight = menuButtonInfo.width + (systemInfo.screenWidth - menuButtonInfo.right) + 'px';
		    // #endif
		    // #ifdef APP-PLUS
		    this.paddingTop = systemInfo.statusBarHeight + 'px';
		    // #endif
		},
    }
</script>

<style lang="scss" scoped>
    .c-top-menu__fixed, .c-bottom-menu__fixed{
        transform: translateY(-120%);
        background-color: #fff;
        margin: 0 auto;
        z-index: 10;
        opacity: 0;
        @include tst();
        // /deep/ button{
        //     width: 160rpx;
        //     height: 72rpx;
        //     border-radius: 8rpx;
        //     font-size: 28rpx;
        //     &::after{
        //         border-radius: 16rpx;
        //     }
        //     &.full-width{
        //         border-radius: 16rpx;
        //         font-size: 32rpx;
        //         height: 88rpx;
        //         &::after{
        //             border-radius: 32rpx;
        //         }
        //     }
        // }
    }
    .c-fixed-menu__content{
        @include flex(column);
    }
	.c-top-menu__fixed{
        @include fixed(0, 0, none, 0);
        /* #ifdef H5 */
        @include iosSafeArea(top, 44px, top);
        /* #endif */
        /* #ifndef H5 */
        @include iosSafeArea(top, 0px, top);
        /* #endif */
	}
    .c-bottom-menu__fixed{
		box-sizing: content-box;
        transform: translateY(120%);
        @include fixed(null, 0, 0, 0);
        @include iosSafeArea(padding, 0px, bottom, bottom);
    }
	
	.c-fixed-menu{
		box-sizing: content-box;
		&--bottom{
			@include iosSafeArea(padding, 0px, bottom, bottom);
		}
		&--active{
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>