<template>
	<view class="c-cell" @tap="handleClick" :hover-class="hoverClass_" :class="[
		'c-cell--' + size,
		arrow ? 'c-cell__arrow':  '',
		center ? 'c-cell__center': '',
	]"
	:style="[ cellStyle ]">
		<view class="c-cell__underline" v-if="border_" :style="[
			lineStyle
		]"></view>
		<view class="c-cell__required" v-if="required">*</view>
		<view v-if="icon" class="c-cell__icon">
			<c-image class="c-cell__left-icon" v-if="isImg_" :size="iconSize" :radius="iconRadius" :src="icon"></c-image>
			<c-icons class="c-cell__left-icon" v-else :size="iconSize" :type="icon"></c-icons>
		</view>
		<view class="c-cell__title" :class="[
			'c-cell__title--' + size,
		]" :style="[ titleStyle_ ]">
			{{title}}
			<view class="c-cell__label" :class="[
				'c-cell__label--' + size,
				!title ? 'c-cell__label--notitle' : ''
			]" :style="[ labelStyle ]" v-if="$slots.default || label">
				{{label}}
				<slot></slot>
			</view>
		</view>
		<view class="c-cell__value" :class="[
				'c-cell__value--' + size,
			]" v-if="value || $slots.value" :style="[ valueStyle ]">
			{{value}}
			<slot name="value"></slot>
		</view>
		<c-icons class="c-cell__right-icon" :color="rightIconColor" :size="rightIconSize" :type="rightIcon" v-if="rightIcon"></c-icons>
		<c-icons class="c-cell__right-icon" :color="arrowColor" :size="arrowSize" type="icon-tiaozhuan" v-if="arrow" :rotate="rotate_"></c-icons>
	</view>
</template>

<script>
	/**
	 * cellItem 单元格Item
	 * @description cell单元格一般用于一组列表的情况，比如个人中心页，设置页等。搭配c-cell-group使用
	 * @property {String} title 左侧标题
	 * @property {String} icon 左侧图标名，可以支持图片
	 * @property {Object} iconSize 左边图标的大小
	 * @property {Object} iconRadius 左边图标圆角
	 * @property {String} value 右侧内容
	 * @property {String} label 标题下方的描述信息
	 * @property {Boolean} border 是否显示cell的下边框（默认true）
	 * @property {Boolean} center 是否使内容垂直居中（默认false）
	 * @property {String} hover-class 是否开启点击反馈，none为无效果（默认true）class="c-cell-hover"
	 * @property {Boolean} required 是否显示*号必填
	 * @property {Boolean} arrow 是否显示右侧箭头（默认false）
	 * @property {Boolean} arrow-direction 箭头方向
	 * @property {String} rightIconColor 箭头颜色
	 * @property {String} rightIconSize 箭头大小
	 * @property {Object} title-style 标题样式，对象形式
	 * @property {Object} value-style 右侧内容样式，对象形式
	 * @property {Object} label-style 标题下方描述信息的样式，对象形式
	 * @property {String Number} index 用于在click事件回调中返回，标识当前是第几个Item
	 * @property {String Number} title-width 标题的宽度，单位rpx
	 */
	export default {
		name: "c-cell",
		options: {
			// multipleSlots: false, // 在微信小程序中关闭当前组件的多slot支持，默认启用
			virtualHost: true // 在微信小程序中将组件节点渲染为虚拟节点，更加接近Vue组件的表现
		},
		props: {
			// 控制组件的样式
			cellStyle: {
				type: Object,
				default () {
					return {};
				}
			},
			// 下划线样式，一般只改颜色或者left right
			lineStyle: {
				type: Object,
				default () {
					return {};
				}
			},
			// 左侧图标名，可以支持图片
			icon: {
				type: String,
				default: ""
			},
			// 左侧图标大小
			iconSize: {
				type: [String, Number],
				default: 40
			},
			/**
			 * cell 大小
			 * normal 正常大小
			 * large 大按钮
			 */
			size: {
				type: String,
				default: 'normal'
			},
			// 一般图片的时候才会搭配圆角
			iconRadius: {
				type: [String, Number],
				default: 0
			},
			// 左侧标题
			title: {
				type: [String, Number],
				default: ""
			},
			// 控制标题的样式
			titleStyle: {
				type: Object,
				default () {
					return {};
				}
			},
			// 右侧内容
			value: {
				type: [String, Number],
				default: ""
			},
			// 右侧显示内容的样式
			valueStyle: {
				type: Object,
				default () {
					return {};
				}
			},
			// 标题下方的描述信息
			label: {
				type: [String, Number],
				default: ""
			},
			// 描述信息的样式
			labelStyle: {
				type: Object,
				default () {
					return {};
				}
			},
			// 是否显示下边框
			border: {
				type: [String, Boolean],
				default: false
			},
			// 是否开启点击反馈，即点击时cell背景为灰色，false为无效果
			hoverClass: {
				type: [String, Boolean],
				default: false
			},
			// 内容是否垂直居中
			center: {
				type: Boolean,
				default: true
			},
			// 是否显示左边表示必填的星号
			required: {
				type: Boolean,
				default: false
			},
			// 标题的宽度，单位rpx
			titleWidth: {
				type: [Number, String],
				default: ""
			},
			// 是否显示右侧图标
			arrow: {
				type: Boolean,
				default: false
			},
			// 右侧图标大小
			arrowSize: {
				type: [String, Number],
				default: 32
			},
			arrowColor: {
				type: String,
				default: '#B8B8B8'
			},
			// 右侧图标方向，可选值：right|up|down，默认为right
			direction: {
				type: String,
				default: "right"
			},
			rightIcon: {
				type: String,
				default: ""
			},
			// 右侧图标大小
			rightIconSize: {
				type: [String, Number],
				default: 24
			},
			rightIconColor: {
				type: String,
				default: '#B8B8B8'
			},
			//点击后跳转的目标路由对象，同 vue-router 的 to 属性
			to: {
				type: [String, Object],
				default: ""
			}
		},
		data() {
			return {};
		},
		computed: {
			hoverClass_() {
				let noneArr = [ 'false', 'none' ]
				return noneArr.includes(String(this.hoverClass)) ? 'none' : 'c-cell-hover';
			},
			titleStyle_() {
				let titleStyle = {};
				this.titleWidth && (titleStyle.width = this.titleWidth + 'rpx');
				return {
					...titleStyle,
					...this.titleStyle
				};
			},
			border_() {
				return String(this.border) === "false" ? false : true;
			},
			rotate_() {
				if (this.direction == "up") return -90;
				else if (this.direction == "down") return 90;
				else return 0;
			},
			isImg_() {
				return this.$c.isImg(this.icon);
			}
		},
		methods: {
			handleClick() {
				this.$emit("click", this.index);
				if (this.to) {
					this.$jump(this.to);
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.c-underline::after {
		left: 24rpx;
		right: 24rpx;
	}

	.c-cell {
		position: relative;
		@include flex(row);
		align-items: center;
		justify-content: flex-start;
		position: relative;
		padding: $spacing-col-base $spacing-row-base;
		font-size: $font-base;
		line-height: 1.71428571 * $font-base;
		color: $color-text;
		background-color: #fff;

		&-hover {
			background-color: $bg-color;
		}

		&__underline{
			@include abs(null, 24rpx, 0, 24rpx);
			z-index: 2;
			height: 1px;
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
			background-color: #EDEDED;
		}

		&__center {
			align-items: center;
		}

		&__required {
			color: $color-danger;
			font-size: 24rpx;
		}

		&__icon {
			padding-right: $spacing-col-sm;
			@include flex(row);
			align-items: center;
			justify-content: center;
		}

		&__right-icon {
			padding-left: $spacing-col-sm;
			@include flex(row);
			align-items: center;
		}


		&__title {
			flex: 3;
			color: $color-text;

			&--large {
				font-size: $font-lg;
			}
		}

		&__label {
			font-weight: 400;
			line-height: 1.4;
			margin-top: $spacing-col-sm / 2;
			color: $color-gray;
			font-size: $font-sm;

			&--large {
				font-size: $font-base;
			}

			&--notitle{
				margin-top: 0;
			}
		}

		&__value {
			@include flex(row);
			justify-content: flex-end;
			flex: 2;
			color: $color-gray;
			font-size: $font-sm;

			&--large {
				font-size: $font-base;
			}
		}
	}
</style>
