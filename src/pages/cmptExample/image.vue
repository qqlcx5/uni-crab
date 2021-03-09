<template>
	<view class="ss-content ss-cmp-image-content">
		<view class="c-font-lg c-sub-text p24">基础用法</view>
		<view class="c-row">
			<view class="c-col-4 c-tc" v-for="(item, index) in imgSizes" :key="index">
				<c-image :size="item.size" :width="item.width" :height="item.height" :src="imgUrl" mode="aspectFill" :effect="item.effect" :duration="item.duration"></c-image>
				<view class="c-font-sm c-sub-text mt12">{{ item.text }}</view>
			</view>
		</view>
		<view class="c-font-lg c-sub-text p24">图片动画</view>
		<view class="c-row">
			<view class="c-col-4 c-tc" v-for="(item, index) in imgEffects" :key="index">
				<c-image :size="imgAttr.size" :src="imgUrl" mode="aspectFill" :effect="item.effect" :duration="item.duration"></c-image>
				<view class="c-font-sm c-sub-text mt12">{{ item.text }}</view>
			</view>
		</view>
		<view class="c-font-lg c-sub-text p24">填充模式（同image的mode）</view>
		<view class="c-row">
			<view class="c-col-4 c-tc" v-for="item in imgModes" :key="item">
				<c-image :size="imgAttr.size" :src="imgUrl" bgColor="transparent" :mode="item"></c-image>
				<view class="c-font-sm c-sub-text mt12">{{ item }}</view>
			</view>
		</view>
		<view class="c-font-lg c-sub-text p24">圆角图片</view>
		<view class="c-row">
			<view class="c-col-4 c-tc" v-for="(item, index) in imgRadius" :key="index">
				<c-image :size="imgAttr.size" :src="imgUrl" mode="aspectFill" :radius="item.radius" :shape="item.shape"></c-image>
				<view class="c-font-sm c-sub-text mt12">{{ item.radius || item.shape }}</view>
			</view>
		</view>
		<view class="c-font-lg c-sub-text p24">图片404</view>
		<view class="c-row">
			<view class="c-col-4 c-tc" v-for="(item, index) in errImg" :key="index">
				<c-image :size="imgAttr.size" :errSrc="item.errSrc" :src="item.src" mode="aspectFill"></c-image>
				<view class="c-font-sm c-sub-text mt12">{{ item.text }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	const imgUrl = 'https://img.yzcdn.cn/vant/cat.jpeg';
	export default {
		data() {
			return {
				imgUrl: imgUrl,
				imgAttr: {
					size: 220,
					width: 220,
					height: 220
				},
				imgSizes: [{
					size: 220,
					text: '用size设置大小'
				}, {
					width: 220,
					height: 220,
					text: '常规设置'
				}],
				//图片常用模式
				imgModes: ['scaleToFill', 'aspectFit', 'aspectFill', 'widthFix', 'heightFix'],
				// 图片是否使用过度动画
				imgEffects: [{
					effect: false,
					text: '无动画',
					duration: 0
				}, {
					effect: true,
					text: '动画时长300ms',
					duration: 300
				}, {
					effect: true,
					text: '动画时长1s',
					duration: 1000
				}],
				// 图片圆角
				imgRadius: [{
					shape: 'square',
					radius: 12
				}, {
					shape: 'square',
					radius: '24rpx'
				}, {
					shape: 'circle',
					radius: ''
				}],
				// 404图片
				errImg: [{
					errSrc: '',
					src: imgUrl + '1',
					text: '默认404'
				}, {
					// #ifdef MP-WEIXIN
					errSrc: '../../../static/404_1.jpg',
					// #endif
					// #ifndef MP-WEIXIN
					errSrc: '../../static/404_1.jpg',
					// #endif
					src: imgUrl + '1',
					text: '自定义404'
				}]
			}
		}
	}
</script>
<style>
	page{
		background-color: #fff;
	}
</style>
