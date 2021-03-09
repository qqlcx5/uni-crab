<template>
	<view class="c-colors" :style="[ style_ ]" @click="onClick">
		<slot></slot>
	</view>
</template>

<script>
	const colorEnum = {
		t: 'theme',
		s1: 'subColor1',
		s2: 'subColor2',
	}
	const proEnum = {
		c: 'color',
		bgc: 'background-color',
		bglg: 'background-image',
		bdc: 'border-color'
	}
	import {
		mapState
	} from 'vuex'
	export default {
		props: {
			//多个颜色选择  c, bgc
			pro: {
				type: Array,
				default: () => {
					return ['c']
				}
			},
			/**
			 * 跟pro个数对应，如果只有一个则取相同
			 * 如果pro中设置了bglg,则对应项应为：'角度|渐变开始颜色|渐变结束颜色'
			 * 如果是透明度  请传入    颜色|透明度
			 * */
			theme: {
				type: Array,
				default: () => {
					return ['t']
				}
			},
			/**
			 * 子元素是圆角的话  背景颜色继承会有问题，所以这边要设置背景颜色（H5端、app端）
			 * */
			radius: {
				type: [String, Number],
				default: 0
			}
		},
		data() {
			return {
				defaultColors: {
					theme: '#FF5D0C',
					subColor1: '#FFAE37',
					subColor2: '#FF5D0C'
				},
				themeColors: null
			}
		},
		computed: {
			colors_() {
				return this.themeColors ? this.themeColors : this.defaultColors;
			},
			style_() {
				let style_ = {
					borderRadius: this.radius + 'rpx'
				};
				this.pro.forEach((key, index) => {
					let cKey = this.theme[index] ? this.theme[index] : this.theme[0];
					style_[proEnum[key]] = this.getColor(cKey, key)
				})
				return style_;
			}
		},
		created() {
			// this.getSystemColor();
		},
		methods: {
			getColor(cKey, key = 'c') {
				let cKeyArr = cKey.split('|');
				if(key === 'bglg' && cKeyArr.length === 3){//渐变
					return `linear-gradient(${cKeyArr[0]},${this.getColor(cKeyArr[1])} 0%,${this.getColor(cKeyArr[2])} 100%)`;
				} else if(cKeyArr.length === 2){//透明度
					return this.$c.colorToRgba(colorEnum.hasOwnProperty(cKeyArr[0]) ? this.colors_[colorEnum[cKeyArr[0]]] : colorEnum[cKeyArr[0]], cKeyArr[1]);
				} else {
					return colorEnum.hasOwnProperty(cKey) ? this.colors_[colorEnum[cKey]] : cKey;
				}
			},
			async getSystemColor() {
				// 获取颜色
				// let {
				// 	data
				// } = await this.$http('themeColors');
				// this.themeColors = data.color;
			},
			onClick(e) {
				this.$emit('click', e)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-colors {
		@include flex(column);
		/* #ifndef APP-PLUS-NVUE */
		@include tst((color, background-color, opacity));
		/* #endif */
	}
</style>
