<template>
	<view class="c-cell-group" :style="[ groupStyle ]">
		<view class="c-cell-group__title" v-if="title" :style="[ titleStyle ]">
			{{title}}
		</view>
		<view class="c-cell-group__content" :style="[ contetnStyle ]" :class="{'c-underline c-underline__top': border_}">
			<slot />
		</view>
	</view>
</template>

<script>
	/**
	 * c-cell-group 单元格父组件Group
	 * @description c-cell-group单元格一般用于一组列表的情况，比如个人中心页，设置页等。搭配c-cell
	 * @property {String} title 分组标题
	 * @property {Boolean} border 是否显示外边框（默认true）
	 * @property {Object} title-style 分组标题的的样式，对象形式，如{'font-size': '24rpx'} 或 {'fontSize': '24rpx'}
	 * @example <c-cell-group title="设置喜好">
	 */
	export default {
		name: "c-cell-group",
		props: {
			// 分组标题
			title: {
				type: String,
				default: ''
			},
			// 是否显示外边框
			border: {
				type: [ Boolean, String ],
				default: false
			},
			// 分组标题的样式，对象形式，注意驼峰属性写法
			// 类似 {'font-size': '24rpx'} 和 {'fontSize': '24rpx'}
			titleStyle: {
				type: Object,
				default () {
					return {};
				}
			},
            // 分组样式，对象形式，注意驼峰属性写法
			// 类似 {'font-size': '24rpx'} 和 {'fontSize': '24rpx'}
            groupStyle: {
				type: Object,
				default () {
					return {};
				}
			},
			// 分组内容的样式
			contetnStyle: {
				type: Object,
				default () {
					return {};
				}
			}
		},
        computed: {
            border_() {
                return String(this.border) === 'false' ? false : true;
            }
        }
	}
</script>

<style lang="scss" scoped>
	.c-cell-group {
		width: 100%;
        overflow: hidden;
        &__title {
            padding: 30rpx 32rpx 10rpx 32rpx;
            font-size: 30rpx;
            color: #909399;
        }
        &__content {
            background-color: #FFFFFF;
			@include flex(column);
			overflow: hidden;
        }
	}
</style>
