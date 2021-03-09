<template>
	<view class="c-mask" :class="[
		show ? 'c-mask--visible' : ''
	]" :style="[ parentStyle_ ]" catchtouchmove="true" @click="handleClick" @touchmove.stop.prevent></view>
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
			//动画时长 单位ms  250ms = 0.25s
			duration: {
				type: [ String, Number ],
				default: 250
			},
			position: {
				type: String,
				default: 'fixed'
			},
			zIndex: {
				type: [ String, Number ],
				default: 1000
			}
		},
		computed: {
			parentStyle_() {
				let transitionProperty = 'transform'
				return {
					position: this.position,
					zIndex: this.zIndex,
					transitionDuration: `${this.duration}ms`
				}
			},
			maskabled_() {
			    return String(this.maskabled) === 'false' ? false : true;
			},
		},
		methods: {
			handleClick() {
                if (!this.maskabled_) return;
				this.$emit('click')
			}
		}
	}
</script>

<style scoped lang="scss">
	// 蒙层
	.c-mask{
		background-color: $mask-bg;
		@include fixed(0, 0, 0, 0);
		transition-delay: 0ms;
		opacity: 0;
		z-index: 999;
		transition-timing-function: linear;
		transition-property: opacity;
		&--visible{
			opacity: 1;
		}
	}
</style>
