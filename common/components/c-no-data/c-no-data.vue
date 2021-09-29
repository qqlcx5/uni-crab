<template>
	<view class="c-no-data">
		<block v-if="showImg_">
			<c-image v-if="isImg_" :static="isStatic_" :src="icon" :width="size" mode="widthFix" />
			<!-- #ifndef APP-PLUS-NVUE -->
			<c-icons v-else class="c-no-data__img" :type="icon" :size="size"></c-icons>
			<!-- #endif -->
		</block>
		<text class="c-no-data__text" :style="[ textStyle ]" v-if="text_">{{text_}}</text>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		props: {
			showImg: {
				type: [String, Boolean],
				default: false,
			},
			icon: {
				type: String,
				default: 'common/no-data.png',
			},
			size: {
				type: [String, Number],
				default: 350,
			},
			static: {
				type: [String, Boolean],
				default: false,
			},
			text: {
				type: [String, Boolean],
				default: '暂无数据',
			},
			textStyle: {
				type: Object,
				default: () => {
					return {};
				},
			},
		},
		computed: {
			isImg_() {
				return this.$c.isImg(this.icon);
			},
			isStatic_() {
				return String(this.static) === 'false' ? false : true;
			},
			showImg_() {
				return String(this.showImg) === 'false' ? false : true;
			},
			text_() {
				return String(this.text) === 'false' ? false : this.text;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-no-data {
		padding: 20rpx 0;
		text-align: center;
		@include flex(column);
		align-items: center;

		&__text {
			font-size: $font-base;
			color: #999;
			line-height: 64rpx;
			// margin-top: 20rpx;
		}
	}
</style>
