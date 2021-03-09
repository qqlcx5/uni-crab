<template>
	<view class="c-content index-content">
		<view class="c-row">
			<view class="c-col-12">
				<view class="flex align-center">
					<c-icons class="logo" size="80" color="#FA3F1E" type="icon-shupai"></c-icons>
					<view class="flex-1 pl24">
						<text class="c-font-xl">{{ brandInfo.name }}</text>
					</view>
				</view>
				<view class="mt12">
					<text class="c-font c-sub-text">{{ brandInfo.desc }}</text>
				</view>
			</view>
		</view>
		<c-cell-group title="基础组件">
			<c-cell :lineStyle="{left: '76rpx'}" v-for="(item, index) in baseCmpt" :key="index" @click="$jump(item.routeName)" :icon="item.icon" :title="item.title" :arrow="item.arrow" :border="item.border"></c-cell>
		</c-cell-group>
		<c-cell-group title="反馈组件">
			<c-cell :lineStyle="{left: '76rpx'}" v-for="(item, index) in feedbackCmpt" :key="index" @click="$jump(item.routeName)" :icon="item.icon" :title="item.title" :arrow="item.arrow" :border="item.border"></c-cell>
		</c-cell-group>
		<c-tabbar></c-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				brandInfo: {
					name: 'SaaS通用组件',
					desc: '请遵循开发命名，把组件最大化利用。'
				},
				baseCmpt: [{
					icon: 'xmmall-daifukuan',
					title: 'colors 组件',
					routeName: 'cmptColors',
					border: true,
					arrow: true
				}, {
					icon: 'xmmall-daifukuan',
					title: 'Image 图片',
					routeName: 'cmptImg',
					border: true,
					arrow: true
				}, {
					icon: 'xmmall-daishouhuo',
					title: 'Cell 单元格',
					routeName: 'cmptCell',
					border: true,
					arrow: true
				}, {
					icon: 'xmmall-daifahuo',
					title: 'Button 组件',
					routeName: 'cmptButton',
					border: true,
					arrow: true
				}, {
					icon: 'xmmall-daifahuo',
					title: 'Input 输入框',
					routeName: 'cmptInput',
					border: true,
					arrow: true
				}, {
					icon: 'xmmall-daifahuo',
					title: 'Layout 布局',
					routeName: 'cmptLayout',
					border: true,
					arrow: true
				}],
				feedbackCmpt: [{
					icon: 'xmmall-daifahuo',
					title: 'Modal 模态框',
					routeName: 'cmptModal',
					border: true,
					arrow: true
				}, {
					icon: 'xmmall-daifahuo',
					title: 'Popup 弹出层',
					routeName: 'cmptPopup',
					border: true,
					arrow: true
				}, {
					icon: 'xmmall-daifahuo',
					title: '浮动顶部/底部',
					routeName: 'cmptFixedMenu',
					border: true,
					arrow: true
				}]
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>
<style lang="scss" scoped>
	.index-content {
		@include flex(column);
	}
</style>
