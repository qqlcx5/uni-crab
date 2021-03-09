<template>
	<view class="ss-content ss-cmp-input-content">
		<c-cell-group title="按钮类型">
			<view class="c-row c-tc">
				<view class="c-col-4" v-for="(item, index) in buttonTypes" :key="index">
					<c-button :type="item.type">{{item.label}}</c-button>
				</view>
			</view>
		</c-cell-group>
		<c-cell-group class="mt12" title="镂空按钮">
			<view class="c-row c-tc">
				<view class="c-col-4" v-for="(item, index) in buttonTypes" :key="index">
					<c-button plain :type="item.type">{{item.label}}</c-button>
				</view>
			</view>
		</c-cell-group>
		<c-cell-group class="mt12" title="按钮尺寸">
			<view class="c-row align-center c-tc">
				<view class="c-col-4" v-for="(item, index) in buttonSizes" :key="index">
					<c-button :size="item.size" :type="item.type">{{item.label}}</c-button>
				</view>
			</view>
		</c-cell-group>
		<c-cell-group class="mt12" title="按钮形状">
			<view class="c-row align-center c-tc">
				<view class="c-col-4" v-for="(item, index) in buttonShapes" :key="index">
					<c-button :shape="item.shape" :type="item.type">{{item.label}}</c-button>
				</view>
			</view>
		</c-cell-group>
		<c-cell-group class="mt12" title="加载中">
			<view class="c-row align-center c-tc">
				<view class="c-col-4">
					<c-button type="primary" loading>加载中</c-button>
				</view>
			</view>
		</c-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				buttonTypes: [{
					type: "primary",
					label: "主要按钮"
				}, {
					type: "info",
					label: "信息按钮"
				}, {
					type: "default",
					label: "默认按钮"
				}, {
					type: "warning",
					label: "警告按钮"
				}, {
					type: "danger",
					label: "危险按钮"
				}],
				buttonSizes: [{
					type: "primary",
					label: "小按钮",
					size: "mini"
				}, {
					type: "primary",
					label: "正常按钮",
					size: "normal"
				}, {
					type: "primary",
					label: "大按钮",
					size: "large"
				}],
				buttonShapes: [{
					type: "primary",
					label: "直角",
					shape: "square"
				}, {
					type: "primary",
					label: "圆角",
					shape: "circle"
				}]
			}
		}
	}
</script>

<style>
</style>
