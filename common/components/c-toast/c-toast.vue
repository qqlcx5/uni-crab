<template>
	<c-popup class="c-toast" v-model="modalFlag" bgColor="rgba(0, 0, 0, .6)" showClose="false" radius="8" mask="false" zoom="false">
		<view class="c-toast__content" :class="[ row_ ? 'c-toast__content--row' : '']">
			<c-image v-if="isImg_" :src="icon" :width="iconSize" mode="widthFix" />
			<c-icons v-else :type="icon" :size="iconSize" color="#fff" />
			<view class="c-toast__text" :style="[ textStyle ]">
				{{ text }}
				<slot />
			</view>
		</view>
	</c-popup>
</template>

<script>
	export default {
		name: 'c-toast',
		props: {
			value: {
				type: Boolean,
				default: false
			},
			icon: {
				type: String,
				default: 'icon-queding'
			},
			iconSize: {
				type: [ String, Number ],
				default: 110
			},
			// 是否开启行排列
			row: {
				type: [ Boolean, String ],
				default: false
			},
			text: {
				type: String,
				default: ''
			},
			textStyle: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		computed: {
			row_() {
				return String(this.row) === 'false' ? false : true;
			},
			isImg_() {
				return this.$c.isImg(this.icon);
			},
			modalFlag: {
				get(val) {
					return val.value;
				},
				set(val) {
					this.$emit('input', val);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-toast{
		&__content{
			padding: 24rpx;
			color: #fff;
			min-width: 256rpx;
			@include flex();
			align-items: center;
			justify-content: center;
			&--row{
				flex-direction: row;
			}
		}
		&__text{
			padding: 0 8rpx;
			font-size: 28rpx;
			line-height: 40rpx;
		}
	}
</style>
