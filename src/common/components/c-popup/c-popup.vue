<template>
    <view v-if="popupFlag" hover-stop-propagation>
        <view class="c-modal" :class="[
			`c-modal--${mode}`,
		]" :style="{ zIndex: zIndex }">
			<c-mask v-if="mask_" :show="innerPopupFlag" position="absolute" zIndex="1" :maskabled="maskabled" @click="maskClose"></c-mask>
            <view class="c-modal-hd" :class="[ 
				`c-modal-hd--${mode}`,
				hasTabbar_ ? 'c-modal-hd--hastabbar' : '',
				zoom_ ? 'c-modal-hd--zoom' : '',
				innerPopupFlag ? 'c-modal-hd--visible' : ''
			]" :style="[ childStyle_ ]" @touchmove.stop.prevent>
				<c-status-bar v-if="custom_" />
				<c-icons v-if="showClose_" @click="close" class="c-modal__close" :class="['c-modal__close--' + closePos]" type="icon-guanbi" :color="closeColor" :size="closeSize" />
				<slot></slot>
			</view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'c-modal',
        data() {
            return {
                popupFlag: false,//外层显示隐藏状态
				innerPopupFlag: false,//内层动画状态
				timer: null
            }
        },
        props: {
            /**
             * 参数说明（定位）
             * top  right bottom left middle
             */
            mode: {
                type: String,
                default: 'middle'
            },
            /**
            * 是否含有tabbar，仅在H5下生效
            */
            hasTabbar: {
                type: [ Boolean, String ],
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
                default: 36
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
			/**
			* 模态框圆角
			*/
			radius: {
				type: [ String, Number ],
				default: 0
			},
			//仅在mode 为 middle时有效
			zoom: {
                type: [Boolean, String],
                default: true
			},
			//动画时长 单位ms  200ms = 0.2s
			duration: {
				type: [ String, Number ],
				default: 200
			},
			// 默认999 比系统高1
			zIndex: {
				type: [ String, Number ],
				default: 999
			},
			// 是否开启沉浸式导航,会帮你清空顶部电池栏
			custom: {
				type: [Boolean, String],
				default: false
			}
        },
        computed: {
			custom_() {
				let needClear = ['top', 'left', 'right'];
				return (String(this.custom) === 'false' ? false : true) && needClear.includes(this.mode);
			},
			zoom_() {
                return (String(this.zoom) === 'false' ? false : true) && this.mode === 'middle';
			},
            mask_() {
                return String(this.mask) === 'false' ? false : true;
            },
			radius_() {
				return this.$c.formatUnit(this.radius);
			},
            showClose_() {
                return String(this.showClose) === 'false' ? false : true;
            },
            hasTabbar_() {
                return String(this.hasTabbar) === 'false' ? false : true;
            },
			maskabled_() {
			    return String(this.maskabled) === 'false' ? false : true;
			},
			parentStyle_() {
				return {
				}
			},
            childClass_() {
                return `c-modal__content--${this.mode}`;
            },
			childStyle_() {
				let otherStyle = {};
				if(this.mode === 'top'){
					otherStyle.transform = 'translate3d(0px, -100%, 0px)';
				}else if(this.mode === 'bottom'){
					otherStyle.transform = 'translate3d(0px, 100%, 0px)';
				}else if(this.mode === 'left'){
					otherStyle.transform = 'translate3d(-100%, 0px, 0px)';
				}else if(this.mode === 'right'){
					otherStyle.transform = 'translate3d(100%, 0px, 0px)';
				}
				if(this.mode === 'left' || this.mode === 'right'){
					otherStyle.width = this.$c.formatUnit(this.width);
				}else{
					otherStyle.height = this.$c.formatUnit(this.height);
				}
				
				return {
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
                    this.modalFun(val ? 'open' : 'close');
                },
                immediate: true
            },
            innerPopupFlag(val) {
                this.$emit('input', val);
                this.$emit('change', {
                    detail: {
                        value: val
                    }
                });
            }
        },
        methods: {
            moveHandle() {
                return;
            },
			maskClose() {
				console.log(this.maskabled_);
				if(!this.maskabled_) return ;
				this.close();
			},
            open() {
				this.change('popupFlag', 'innerPopupFlag', true);
                return true;
            },
            close() {
				this.change('innerPopupFlag', 'popupFlag', false);
                return false;
            },
            toggle() {
                return !this.popupFlag ? this.open() : this.close()
            },
            modalFun(pro = 'open') {
				this[pro]();
            },
			change(pro1, pro2, status) {
				this[pro1] = status;
				//先清空延时函数
				clearTimeout(this.timer);
				this.timer = null;
				if(status) {
					// #ifdef H5 || MP
					this.timer = setTimeout(() => {
						this[pro2] = status;
					}, 50);
					// #endif
					// #ifndef H5 || MP
					this.$nextTick(() => {
						this[pro2] = status;
					})
					// #endif
				} else {
					this.timer = setTimeout(() => {
						this[pro2] = status;
					}, this.duration);
				}
			}
        }
    }
</script>

<style lang="scss" scoped>
    // 弹窗公用样式
    .c-modal {
		@include fixed(0, 0, 0, 0);
        z-index: 999;
		overflow: hidden;
		
		&--middle{
			@include flex(row);
			align-items: center;
			justify-content: center;
		}
		
		&-hd{
			position: relative;
			z-index: 2;
			background-color: #fff;
			transition-delay: 0ms;
			transition-timing-function: linear;
			transition-property: transform, opacity;
			
			&--middle{
				opacity: 0;
				/* #ifndef APP-PLUS-NVUE */
				max-width: 600rpx;
				/* #endif */
			}

			&--zoom {
				transform: scale(1.2);
			}
			
			&--top{
				@include fixed(0, 0, null, 0);
			}
			
			&--bottom{
				@include fixed(null, 0, 0, 0);
			}
			
			&--left{
				@include fixed(0, null, 0, 0);
			}
			
			&--right{
				@include fixed(0, 0, 0, null);
			}
			
			&--visible{
				opacity: 1;
				transform: scale(1) translateZ(0)!important;
			}
		
			/* #ifndef H5 || APP-PLUS-NVUE */
			&--hastabbar {
				@include iosSafeArea(bottom, 50px, bottom);
			}
			/* #endif */
		}
		
        &__close {
            z-index: 2;
			
			&--top-right{
				@include abs($spacing-col-base, $spacing-row-base);
			}
			
			&--top-left{
				@include abs($spacing-col-sm, null, null, $spacing-row-sm);
			}
			
			&--bottom-right{
				@include abs(null, $spacing-col-sm, $spacing-row-sm);
			}
			
			&--bottom-left{
				@include abs(null, null, $spacing-col-sm, $spacing-row-sm);
			}
        }
    }
</style>
