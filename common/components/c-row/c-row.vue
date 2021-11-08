<template>
	<view class="c-row--view" :style="{
		justifyContent: cJustify,
		alignItems: cAlignItem
	}">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: 'c-row',
		props: {
			/**
			 * 垂直对其方式
			 * 可选值：star / tend / center / around / between或者同justify-content的可选值
			*/
			justify: {
				type: String,
				default: 'start'
			},
			/**
			 * 垂直对其方式
			 * 可选值：center / top / bottom或者同align-items的可选值
			*/
			align: {
				type: String,
				default: 'center'
			},
			gutter: {
				type: [ String, Number ],
				default: 0
			}
		},
		computed: {
			cJustify() {
				if (this.justify == 'end' || this.justify == 'start') return 'flex-' + this.justify;
				else if (this.justify == 'around' || this.justify == 'between') return 'space-' + this.justify;
				else return this.justify;
			},
			cAlignItem() {
				if (this.align == 'top') return 'flex-start';
				if (this.align == 'bottom') return 'flex-end';
				else return this.align;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-row--view{
		// 由于微信小程序编译后奇怪的页面结构，只能使用float布局实现，flex无法实现
		/* #ifndef MP-WEIXIN || MP-QQ || MP-TOUTIAO */
		@include flex(row);
		/* #endif */
		flex-wrap: wrap;
	}
</style>
