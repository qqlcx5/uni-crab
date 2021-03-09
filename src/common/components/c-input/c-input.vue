<template>
	<view class="c-input-view" :style="[ style_ ]" :class="['c-input-view--' + type]" @click="onClick">
		<view class="c-input-hd" :style="[ beforeStyle_ ]" v-if="$slots.before">
			<slot name="before"></slot>
		</view>
		<view class="c-input-bd">
			<input class="c-input" v-if="type !== 'textarea'" ref="input" :disabled="disabled_" :confirm-type="confirmType"
			 :maxlength="maxlength_" :focus="focus_" :type="inputType" :value="value" @input="onInput" :placeholder="placeholder"
			 :password="type === 'password' && !showPassword" @focus="onFocus" @blur="onBlur" @confirm="onConfirm"
			 placeholder-class="c-input-placeholder" />
			<textarea class="c-textarea" v-else :auto-height="autoHeight_" :disabled="disabled_" :confirm-type="confirmType"
			 :maxlength="maxlength_" :focus="focus_" :type="inputType" :value="value" @input="onInput" :placeholder="placeholder"
			 :password="type === 'password' && !showPassword" @focus="onFocus" @blur="onBlur" @confirm="onConfirm"
			 placeholder-class="c-input-placeholder"></textarea>
		</view>
		<!-- 操作事件 -->
		<view v-if="displayable_" class="c-input-icon" @click="display">
			<c-icons :color="showPassword ? '#f92028' : '#d4d4d4'" type="crab-yanjing" size="34"></c-icons>
		</view>
		<view v-if="clearable_" class="c-input-icon" @click="clear">
			<c-icons color="#d4d4d4" type="icon-guanbi" size="34"></c-icons>
		</view>
		<view v-if="arrows_" class="c-input-icon c-input-icon__arrows" @click="handleSelect">
			<c-icons color="#d4d4d4" type="icon-tiaozhuan" size="34"></c-icons>
		</view>
		<view class="c-input-ft" :style="[ afterStyle_ ]" v-if="$slots.default">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	import validateReg  from "@/common/utils/validate.js";
	export default {
		name: 'c-input',
		props: {
			/**
			 * 输入类型
			 */
			type: {
				type: String,
				default: "text"
			},
			/**
			 * 值
			 */
			value: {
				type: [String, Number],
				default: ""
			},
			/**
			 * 占位符
			 */
			confirmType: {
				type: String,
				default: "done"
			},
			placeholder: String,
			/**
			 * 是否显示清除按钮
			 */
			clearable: {
				type: [Boolean, String],
				default: false
			},
			/**
			 * 是否自动增高，设置auto-height时，style.height不生效  type为textarea时才生效
			 */
			autoHeight: {
				type: [Boolean, String],
				default: false
			},
			/**
			 * 是否显示密码可见按钮，仅在type为password下有效
			 */
			displayable: {
				type: [Boolean, String],
				default: false
			},
			arrows: {
				type: [Boolean, String],
				default: false
			},
			disabled: {
				type: [Boolean, String],
				default: false
			},
			maxlength: {
				type: [Number, String],
				default: 140
			},
			/**
			 * 自动获取焦点
			 */
			focus: {
				type: [Boolean, String],
				default: false
			},
			decimal: {
				type: [Number, String],
				default: 1
			},
			max: {
				type: [Number, String],
				default: 0 //0表示不限制
			},
			min: {
				type: [Number, String],
				default: 0
			},
			// 输入框圆角
			radius: {
				type: [String, Number],
				default: 0
			},
			//before之前的宽度，默认auto
			beforeWidth: {
				type: [String, Number],
				default: 'auto'
			},
			//after之前的宽度，默认auto
			afterWidth: {
				type: [String, Number],
				default: 'auto'
			},
            pattern: {
                type: String,
                default: ''
            },
            msgName: {
                type: String,
                default: ''
            }
		},
		model: {
			prop: 'value',
			event: 'input'
		},
		data() {
			return {
				/**
				 * 显示密码明文
				 */
				showPassword: false
			}
		},
		computed: {
			beforeStyle_() {
				return {
					width: this.$c.formatUnit(this.beforeWidth)
				}
			},
			afterStyle_() {
				return {
					width: this.$c.formatUnit(this.afterWidth)
				}
			},
			maxlength_() {
				return parseInt(this.maxlength);
			},
			decimal_() {
				return parseInt(this.decimal);
			},
			max_() {
				return this.reservedDecimal(this.max, this.decimal_) * 1;
			},
			min_() {
				return this.reservedDecimal(this.min, this.decimal_) * 1;
			},
			inputType() {
				let inputType = (this.type === 'password' ? 'text' : (this.type === 'price' ? 'digit' : this.type)).toLocaleLowerCase();
				return inputType.indexOf('text,number,idcard,digit') === -1 ? 'text' : inputType;
			},
			clearable_() {
				return String(this.clearable) !== 'false' && String(this.value).length
			},
			autoHeight_() {
				return String(this.autoHeight) !== 'false'
			},
			displayable_() {
				return String(this.displayable) !== 'false' && String(this.value).length
			},
			arrows_() {
				return String(this.arrows) !== 'false' || this.type === 'select';
			},
			disabled_() {
				return String(this.disabled) !== 'false';
			},
			focus_() {
				return String(this.focus) !== 'false'
			},
			style_() {
				return {
					borderRadius: this.radius + 'rpx'
				};
			}
		},
		mounted() {
			// #ifdef H5
			if (uni.getSystemInfoSync().platform === 'ios' && this.decimal_ === 0) { //修改金额类型为tel（整数数字--->针对ios）
				this.type === 'price' && (this.$refs.input.$el.getElementsByTagName('input')[0].type = 'tel');
			}
			// #endif
		},
		methods: {
			onClick(e) {
				this.$emit('click', e)
			},
			handleSelect(e) {
				this.$emit('select', e)
			},
			clear() {
				this.$emit('input', '')
				this.$emit('clear')
			},
			display() {
				this.showPassword = !this.showPassword
			},
			onFocus() {
				this.$emit('focus');
			},
			onBlur(e) {
				this.onInput(e, true);
				this.$emit('blur', e.target.value);
				// if (this.type === 'price') {
				// 	uni.pageScrollTo({
				// 		scrollTop: 0,
				// 		duration: 0
				// 	})
				// }
			},
			validate(hasMsg = true) {
			    if (!this.pattern) return true;
			    let validateObj = validateReg(this.pattern, this.value, hasMsg);
			    if (hasMsg) {
			        if (!validateObj.validate) {
			            this.$toast(this.msgName + validateObj.message);
			        }
			    } else {
			        if (!validateObj) {
			            this.$toast('格式错误');
			        }
			    }
			    return validateObj;
			},
			onConfirm(e) {
				this.$emit('confirm', e)
			},
			onInput(e, isBlur) {
				let val = e.target.value;
				this.$emit('input', val);
				if (this.type === 'price') {
					var valIndexOf = val.indexOf('.') + 1;
					if (valIndexOf === val.length && val.length) { //在ios端会进行小数点input输出
						if (isBlur || this.decimal_ === 0) {
							val = this.reservedDecimal(val, this.decimal_);
						}
					} else {
						val = /\d+(?:\.)?(?:\d*)?/.exec(val);
						val = val ? val[0] : '';
						if (isBlur || valIndexOf > 0) {
							val!=='' && (val = this.reservedDecimal(val, this.decimal_));
						}
						if (val.length > 1) {
							if (val * 1 == 0) {
								val = '';
							} else {
								val *= 1;
							}
						}
					}
					if (val && this.max_) {
						val = val > this.max_ ? this.max_ : val;
					}
					if (isBlur && val) {
						val = val < this.min_ ? this.min_ : val;
					}
					setTimeout(() => {
						this.$emit('input', val);
					}, 30)
				}
			},
			reservedDecimal(num, fixed = 1) {
				if (!num) return Number(0).toFixed(fixed);
				num = String(num);
				let splitNum = num.split('.')
				let firstNum = splitNum[0];
				let lastNum = splitNum[1] ? String(splitNum[1]) : (new Array(fixed + 1)).join('0');
				let toFixedNum = (lastNum && lastNum.length) || 0;
				toFixedNum = toFixedNum > fixed ? fixed : toFixedNum;
				//toFixed会进行四舍五入 所以我们用裁剪
				// return .toFixed(toFixedNum);
				return firstNum + (toFixedNum > 0 ? '.' : '') + lastNum.substr(0, toFixedNum)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-input {

		&-hd {
			@include flex(row);
			align-items: flex-start;
		}

		&-bd{
			height: $input-height;
			padding: 0 $spacing-row-base;
			flex: 1;
		}

		&-ft{
			@include flex(row);
			align-items: center;
		}

		&-icon {
			padding-right: $spacing-row-sm;
		}

		&-view {
			position: relative;
			/* #ifdef MP-WEIXIN */
			background-color: inherit;
			/* #endif */
			@include flex(row);
			justify-content: center;
			align-items: center;
			flex: 1;

			.c-input,
			.c-textarea {
				flex: 1;
				width: 100%;
				line-height: inherit;
				height: inherit;
				font-size: $font-base;
				color: #333;
				padding: 0;
				min-height: 0;
				background-color: transparent;
			}

			&--select {
				.c-input-icon__arrows {
					@include abs(0, 0, 0, 0);
					z-index: 2;
					display: flex;
					align-items: center;
					justify-content: flex-end;
					width: 100%;
				}
			}

			&--textarea {
				align-items: flex-start;
				.c-input-hd{
					min-height: $input-height;
				}
				.c-input-bd{
					height: auto;
				}
				.c-textarea{
					height: 120rpx;
				}
			}

			.c-input-placeholder {
				color: #B3B3B3;
			}
		}
	}
</style>
