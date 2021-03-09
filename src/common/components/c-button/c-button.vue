<template>
	<button :open-type="openType" :disabled="disabled_" class="c-btn" @click="handleClick" :loading="loading_" :class="[
		plain_ ? `c-btn--${type}__plain`: '',
		disabled_ ? 'c-btn--disabled': '',
		`c-btn--${type}`,
		`c-btn--${size}`,
		`c-btn--${shape}`
		]"
	 :style="[ style_ ]" @getphonenumber="handleGetphonenumber" @getuserinfo="handleGetuserinfo" @error="handleError"
	 @opensetting="handleOpensetting" @launchapp="handleLaunchapp">
		<slot></slot>
	</button>
</template>

<script>
	export default {
		name: 'c-button',
		props: {
			type: {
				type: String,
				default: 'inherit'
			},
			/**
			 * 按钮大小
			 * mini 小
			 * normal 正常大小
			 * large 大按钮
			 */
			size: {
				type: String,
				default: 'normal'
			},
			//是否镂空
			plain: {
				type: [String, Boolean],
				default: false
			},
			//禁用状态
			disabled: {
				type: [String, Boolean],
				default: false
			},
			//是否开启加载状态
			loading: {
				type: [String, Boolean],
				default: false
			},
			/**
			 * 按钮形状
			 * square 圆角矩形
			 * circle 两边为半圆形
			 */
			shape: {
				type: String,
				default: 'square'
			},
			openType: {
				type: String,
				default: ''
			},
			height: {
				type: [String, Number],
				default: ''
			},
			width: {
				type: [String, Number],
				default: ''
			},
			radius: {
				type: [String, Number],
				default: ''
			}
		},
		computed: {
			loading_() {
				return String(this.loading) === 'false' ? false : true;
			},
			plain_() {
				return String(this.plain) === 'false' ? false : true;
			},
			disabled_() {
				return String(this.disabled) === 'false' ? false : true;
			},
			style_() {
				let style = {};
				this.width && (style.width = this.$c.formatUnit(this.width));
				this.height && (style.height = this.$c.formatUnit(this.height));
				this.radius && (style.borderRadius = this.$c.formatUnit(this.radius));
				return style;
			}
		},
		methods: {
			handleGetphonenumber(e) {
				this.$emit('getphonenumber', e);
			},
			handleGetuserinfo(e) {
				this.$emit('getuserinfo', e);
			},
			handleError(e) {
				this.$emit('error', e);
			},
			handleOpensetting(e) {
				this.$emit('opensetting', e);
			},
			handleLaunchapp(e) {
				this.$emit('launchapp', e);
			},
			handleClick(e) {
				this.$emit('click', e)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-btn {
		height: $button-height;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1.4;
		font-size: $font-base;
		text-align: center;
		position: relative;
		font-weight: 400;
		border-radius: $border-radius-base;
		background-color: #fff;
		color: #333;
		padding: 0 $spacing-row-base;
		margin: 0;
		border: none;

		&--inherit__plain {
			border-color: inherit;
			border-width: 1px;
			border-style: solid;
		}

		/* #ifndef APP-PLUS-NVUE */
		&::after {
			content: "";
			width: 200%;
			height: 200%;
			position: absolute;
			top: 0;
			left: 0;
			border: 1px solid rgba(0, 0, 0, .2);
			transform: scale(.5);
			transform-origin: 0 0;
			border-radius: 2 * $border-radius-base;
		}

		/* #endif */

		&--mini {
			height: $button-height-sm;
			font-size: $font-sm;
			padding: 0 $spacing-row-sm;
			border-radius: $border-radius-sm;

			&::after {
				border-radius: 2 * $border-radius-sm;
			}
		}

		&--large {
			height: $button-height-lg;
			font-size: $font-lg;
			padding: 0 $spacing-row-lg;
			border-radius: $border-radius-lg;

			&::after {
				border-radius: 2 * $border-radius-lg;
			}
		}

		&--primary {
			color: #fff;
			background-color: $color-primary;

			&::after {
				border-color: $color-primary;
			}
		}

		&--default {
			color: #666666;
			background-color: #fff;

			&::after {
				border-color: #E0E0E0;
			}
		}

		&--info {
			color: #fff;
			background-color: $color-info;

			&::after {
				border-color: $color-info;
			}
		}

		&--success {
			color: #fff;
			background-color: $color-success;

			&::after {
				border-color: $color-success;
			}
		}

		&--warning {
			color: #fff;
			background-color: $color-warning;

			&::after {
				border-color: $color-warning;
			}
		}

		&--danger {
			color: #fff;
			background-color: $color-danger;

			&::after {
				border-color: $color-danger;
			}
		}

		&--disabled {
			opacity: .5;
			cursor: not-allowed;
		}

		&--circle {
			border-radius: $button-height-lg / 2;

			&::after {
				border-radius: $button-height-lg;
			}
		}

		&--primary__plain {
			background-color: transparent;
			color: $color-primary;
		}

		&--info__plain {
			background-color: transparent;
			color: $color-info;
		}

		&--success__plain {
			background-color: transparent;
			color: $color-success;
		}

		&--warning__plain {
			background-color: transparent;
			color: $color-warning;
		}

		&--danger__plain {
			background-color: transparent;
			color: $color-danger;
		}

		&--default__plain {
			color: #666666;
			background-color: transparent;
		}

		&--inherit {
			color: inherit;
			background-color: inherit;
			overflow: hidden;
			border-radius: inherit;

			/* #ifndef APP-PLUS-NVUE */
			&::after {
				display: none;
			}

			/* #endif */
		}
	}
</style>
