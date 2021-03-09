<template>
	<view class="ss-content ss-cmp-layout-content">
		<c-cell-group title="基础用法">
			<c-cell>
				<c-row>
					<c-col v-for="(item, index) in bgColors" :key="index" :span="item.label">
						<view class="bg-color--view" :style="{backgroundColor: item.bgc}">{{item.label}}</view>
					</c-col>
				</c-row>
			</c-cell>
		</c-cell-group>
		<c-cell-group title="在列元素之间增加间距">
			<c-row gutter="24">
				<c-col v-for="(item, index) in bgColors.slice(0, 3)" :key="index" :span="4">
					<view class="bg-color--view" :style="{backgroundColor: item.bgc}">4</view>
				</c-col>
			</c-row>
		</c-cell-group>
		<c-cell-group title="偏移">
			<c-row v-for="(item, index) in bgColors.slice(0, 9)" :key="index">
				<c-col :span="4" :offset="index">
					<view class="bg-color--view" :style="{backgroundColor: item.bgc}">4</view>
				</c-col>
			</c-row>
		</c-cell-group>
		<c-cell-group title="样式用法-仅用来做等分布局">
			<view class="c-row">
				<view :class="item.className" v-for="(item, index) in bgColors" :style="{backgroundColor: item.bgc, color: '#fff'}" :key="index">{{item.label}}</view>
			</view>
		</c-cell-group>
		<c-cell-group title="经典等分布局">
			<view class="c-row goods-list pb0">
				<view class="c-col-4" v-for="item in 12 / 4" :key="item">
					<view class="goods-item">
						<c-image src="https://img.yzcdn.cn/vant/cat.jpeg"></c-image>
						<view class="goods-name">商品{{item + 1}}</view>
					</view>
				</view>
			</view>
			<view class="c-row goods-list ptb0">
				<view class="c-col-6" v-for="item in 12 / 6" :key="item">
					<view class="goods-item">
						<c-image src="https://img.yzcdn.cn/vant/cat.jpeg" height="232"></c-image>
						<view class="goods-name">商品{{item + 1}}</view>
					</view>
				</view>
			</view>
			<view class="c-row goods-list pt0">
				<view class="c-col-12" v-for="item in 1" :key="item">
					<view class="goods-item">
						<c-image src="https://img.yzcdn.cn/vant/cat.jpeg" height="232"></c-image>
						<view class="goods-name">商品{{item + 1}}</view>
					</view>
				</view>
			</view>
		</c-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bgColors: [{
					className: 'c-col-1',
					label: '1',
					bgc: '#66c6f2'
				}, {
					className: 'c-col-11',
					label: '11',
					bgc: '#39a9ed'
				}, {
					className: 'c-col-2',
					label: '2',
					bgc: '#66c6f2'
				}, {
					className: 'c-col-10',
					label: '10',
					bgc: '#39a9ed'
				}, {
					className: 'c-col-3',
					label: '3',
					bgc: '#66c6f2'
				}, {
					className: 'c-col-9',
					label: '9',
					bgc: '#39a9ed'
				}, {
					className: 'c-col-4',
					label: '4',
					bgc: '#66c6f2'
				}, {
					className: 'c-col-8',
					label: '8',
					bgc: '#39a9ed'
				}, {
					className: 'c-col-5',
					label: '5',
					bgc: '#66c6f2'
				}, {
					className: 'c-col-7',
					label: '7',
					bgc: '#39a9ed'
				}, {
					className: 'c-col-6',
					label: '6',
					bgc: '#66c6f2'
				}, {
					className: 'c-col-6',
					label: '6',
					bgc: '#39a9ed'
				}, {
					className: 'c-col-12',
					label: '12',
					bgc: '#39a9ed'
				}]
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.bg-color--view{
		color: #fff;
		@include flex;
		align-items: center;
		justify-content: center;
		height: 60rpx;
		margin-bottom: $spacing-col-base / 2;
	}
	.goods-list{
		background-color: #f5f5f5;
		.goods-item{
			width: 100%;
			background-color: #fff;
		}
		
		.goods-name{
			color: #333;
			text-align: center;
			line-height: 70rpx;
		}
	}
</style>
