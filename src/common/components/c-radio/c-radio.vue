<template>
	<view class="c-radio" :style="[radioStyle]" @tap="onClickLabel">
		<view class="c-radio__label c-radio__label--before" v-if="$slots.before" :style="{ fontSize: addUnit(labelSize),flex: this.parent.wrap ? 1 : 'auto' }">
			<slot name="before" />
		</view>
		<view class="c-radio__icon-wrap" @tap.stop="toggle">
			<c-icons class="c-radio__icon-wrap__icon" :type="select_ ? 'icon-xuanzhong' : 'icon-weixuan'" :size="elIconSize" :color="iconColor"/>
		</view>
		<view class="c-radio__label" v-if="$slots.default" :style="{ fontSize: addUnit(labelSize),flex: this.parent.wrap ? 1 : 'auto' }">
			<slot />
		</view>
	</view>
</template>

<script>
	/**
	 * radio 单选框
	 * @description 单选框用于有一个选择，用户只能选择其中一个的场景。搭配c-radio-group使用
	 * @tutorial https://www.uviewui.com/components/radio.html
	 * @property {String Number} icon-size 图标大小，单位rpx（默认24）
	 * @property {String Number} label-size label字体大小，单位rpx（默认28）
	 * @property {String Number} name radio组件的标示符
	 * @property {String} shape 形状，见上方说明（默认circle）
	 * @property {Boolean} disabled 是否禁用（默认false）
	 * @property {Boolean} label-disabled 点击文本是否可以操作radio（默认true）
	 * @property {String} active-color 选中时的颜色，如设置parent的active-color将失效
	 * @event {Function} change 某个radio状态发生变化时触发(选中状态)
	 * @example <c-radio :label-disabled="false">门掩黄昏，无计留春住</c-radio>
	 */
    import { mapState } from 'vuex'
	export default {
		name: "c-radio",
		props: {
			// radio的名称
			name: {
				type: [String, Number],
				default: ''
			},
			// 形状，square为方形，circle为原型
			shape: {
				type: String,
				default: ''
			},
			// 是否禁用
			disabled: {
				type: [String, Boolean],
				default: ''
			},
			// 是否禁止点击提示语选中复选框
			labelDisabled: {
				type: [String, Boolean],
				default: ''
			},
			// 选中状态下的颜色，如设置此值，将会覆盖parent的activeColor值
			activeColor: {
				type: String,
				default: ''
			},
			// 图标的大小，单位rpx
			iconSize: {
				type: [String, Number],
				default: ''
			},
			// label的字体大小，rpx单位
			labelSize: {
				type: [String, Number],
				default: ''
			},
		},
		data() {
			return {
				// 父组件的默认值，因为头条小程序不支持在computed中使用this.parent.shape的形式
				// 故只能使用如此方法
				parentData: {
					iconSize: null,
					labelDisabled: null,
					disabled: null,
					shape: null,
					activeColor: null,
					size: null,
					width: null,
					height: null,
					value: null,
					wrap: null
				},
				defaultColors: {
					theme: '#FF5D0C',
					subColor1: '#FFAE37',
					subColor2: '#FF5D0C'
				},
				themeColors: null
			};
		},
		created() {
			// 支付宝小程序不支持provide/inject，所以使用这个方法获取整个父组件，在created定义，避免循环引用
			this.updateparent();
            if(!this.parent) return this.$toast('请嵌套c-radio-group使用');
			this.parent.children.push(this);
		},
		computed: {
			colors_() {
				return this.themeColors ? this.themeColors : this.defaultColors;
			},
			// 是否禁用，如果父组件c-raios-group禁用的话，将会忽略子组件的配置
			elDisabled() {
				return this.disabled !== '' ? this.disabled : this.parent.disabled !== null ? this.parent.disabled : false;
			},
			// 是否禁用label点击
			elLabelDisabled() {
				return this.labelDisabled !== '' ? this.labelDisabled : this.parent.labelDisabled !== null ? this.parent.labelDisabled : false;
			},
			// 组件尺寸，对应size的值，默认值为34rpx
			elSize() {
				return this.size ? this.size : (this.parent.size ? this.parent.size : 34);
			},
			// 组件的勾选图标的尺寸，默认20
			elIconSize() {
				return this.iconSize ? this.iconSize : (this.parent.iconSize ? this.parent.iconSize : 42);
			},
			// 组件选中激活时的颜色
			elActiveColor() {
				return this.activeColor ? this.activeColor : (this.parent && this.parent.activeColor ? this.parent.activeColor : this.colors_.theme);
			},
			// 组件的形状
			elShape() {
				return this.shape ? this.shape : (this.parent.shape ? this.parent.shape : 'circle');
			},
			// 设置radio的状态，要求radio的name等于parent的value时才为选中状态
			iconStyle() {
				let style = {};
				if (this.elActiveColor && this.parent.value == this.name && !this.elDisabled) {
					style.borderColor = this.elActiveColor;
					style.backgroundColor = this.elActiveColor;
				}
				style.width = this.addUnit(this.elSize);
				style.height = this.addUnit(this.elSize);
				return style;
			},
            select_() {
                return this.name ==  this.parent.value;
            },
			iconColor() {
				return  this.select_ ? this.elActiveColor : '#E0E0E0';
			},
			iconClass() {
				let classes = [];
				classes.push('c-radio__icon-wrap--' + this.elShape);
				if (this.name == this.parent.value) classes.push('c-radio__icon-wrap--checked');
				if (this.elDisabled) classes.push('c-radio__icon-wrap--disabled');
				if (this.name == this.parent.value && this.elDisabled) classes.push(
					'c-radio__icon-wrap--disabled--checked');
				// 支付宝小程序无法动态绑定一个数组类名，否则解析出来的结果会带有","，而导致失效
				return classes.join(' ');
			},
			radioStyle() {
				let style = {};
				if (this.parent.width) {
					style.width = this.addUnit(this.parent.width);
					// #ifdef MP
					// 各家小程序因为它们特殊的编译结构，使用float布局
					style.float = 'left';
					// #endif
					// #ifndef MP
					// H5和APP使用flex布局
					style.flex = `0 0 ${this.addUnit(this.parent.width)}`;
					// #endif
				}
				if (this.parent.wrap) {
					style.width = '100%';
					// #ifndef MP
					// H5和APP使用flex布局，将宽度设置100%，即可自动换行
					style.flex = '0 0 100%';
					// #endif
				}
				return style;
			}
		},
		methods: {
            addUnit(value = 'auto', unit = 'rpx') {
                value = String(value);
            	// 用uView内置验证规则中的number判断是否为数值
                return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value) ? `${value}${unit}` : value;
            },
			updateparent() {
				this.parent = this.getParent('c-radio-group');
			},
            getParent(name = undefined) {
            	let parent = this.$parent;
            	// 通过while历遍，这里主要是为了H5需要多层解析的问题
            	while (parent) {
            		// 父组件
            		if (parent.$options && parent.$options.name !== name) {
            			// 如果组件的name不相等，继续上一级寻找
            			parent = parent.$parent;
            		} else {
            			return parent;
            		}
            	}
            	return false;
            },
			onClickLabel() {
				if (!this.elLabelDisabled && !this.elDisabled) {
					this.setRadioCheckedStatus();
				}
			},
			toggle() {
				if (!this.elDisabled) {
					this.setRadioCheckedStatus();
				}
			},
			emitEvent() {
				// c-radio的name不等于父组件的v-model的值时(意味着未选中)，才发出事件，避免多次点击触发事件
				if(this.parentData.value != this.name) this.$emit('change', this.name);
			},
			// 改变组件选中状态
			// 这里的改变的依据是，更改本组件的parent.value值为本组件的name值，同时通过父组件遍历所有c-radio实例
			// 将本组件外的其他c-radio的parent.value都设置为空(由computed计算后，都被取消选中状态)，因而只剩下一个为选中状态
			setRadioCheckedStatus() {
				this.emitEvent();
				if(this.parent) {
					this.parent.setValue(this.name);
					this.parentData.value = this.name;
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.c-radio {
		/* #ifndef APP-NVUE */
		display: inline-flex;
		/* #endif */
		align-items: center;
		overflow: hidden;
		user-select: none;
		line-height: 1.8;

		&__icon-wrap {
			color: $color-sub-text;
			@include flex(row);
			flex: none;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
			width: 42rpx;
			height: 42rpx;
			color: transparent;
			text-align: center;
			transition-property: color, border-color, background-color;
			font-size: 20rpx;
			// border: 1px solid #c8c9cc;
			transition-duration: 0.2s;

			/* #ifdef MP-TOUTIAO */
			// 头条小程序兼容性问题，需要设置行高为0，否则图标偏下
			&__icon {
				line-height: 0;
			}
			/* #endif */

			&--circle {
				border-radius: 100%;
			}

			&--square {
				border-radius: 3px;
			}

			&--checked {
				color: #fff;
				background-color: $color-primary;
				border-color: $color-primary;
			}

			&--disabled {
				background-color: #ebedf0;
				border-color: #c8c9cc;
			}

			&--disabled--checked {
				color: #c8c9cc !important;
			}
		}

		&__label {
			word-wrap: break-word;
			margin-left: 24rpx;
			margin-right: 24rpx;
			color: $color-sub-text;
			font-size: 30rpx;

			&--before{
				margin-left: 0;
			}

			&--disabled {
				color: #c8c9cc;
			}
		}
	}
</style>
