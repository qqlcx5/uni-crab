<template>
	<view class="c-loading" :style="style_">
		<text v-for="i in 12" :key="i" class="c-loading__text" :style="style_" :class="['c-loading__text--' + i]"></text>
	</view>
</template>

<script>
	export default {
		name: 'c-loading',
		props: {
			size: {
				type: [ String, Number ],
				default: 40
			},
			color: {
				type: String,
				default: '#fff'
			}
		},
		computed: {
			style_() {
				return {
					width: `${this.size}rpx`,
					height: `${this.size}rpx`,
					color: this.color
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-loading{
		position: relative;
		width: 40rpx;
		height: 40rpx;
		/* #ifndef APP-PLUS-NVUE */
		display: inline-block;
		max-width: 100%;
		max-height: 100%;
		animation: c-spin 0.8s linear infinite;
		/* #endif */
		&__text{
			position: absolute;
			top: 0;
			left: 0;
			width: 40rpx;
			height: 40rpx;
			@for $i from 1 to 12 {
				&--#{$i}{
					transform: rotate(30deg * $i);
					opacity: 1.0625 - 0.0625 * $i;
				}
			}
			/* #ifndef APP-PLUS-NVUE */
			&::before{
				display: block;
				width: 2px;
				height: 25%;
				margin: 0 auto;
				background-color: currentColor;
				border-radius: 40%;
				content: ' ';
			}
			/* #endif */
		}
	}
</style>
