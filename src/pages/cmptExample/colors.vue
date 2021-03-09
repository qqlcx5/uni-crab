<template>
	<view class="ss-content ss-cmp-input-content">
		<c-cell-group title="按钮用法">
			<c-cell :cellStyle="cellStyle">
				<view class="c-row">
					<view class="c-col-4" v-for="(item, index) in buttonTypes" :key="index">
						<c-colors :theme="item.theme" :pro="item.pro">
							<c-button :type="item.type" :plain="item.plain" :size="item.size" :radius="item.radius">{{item.label}}</c-button>
						</c-colors>
					</view>
				</view>
			</c-cell>
		</c-cell-group>
		<c-cell-group title="字体用法">
			<c-cell>
				<c-colors :theme="['t']">
					<text>我是主题色</text>
				</c-colors>
			</c-cell>
			<c-cell>
				<c-colors :theme="['s1']">
					<text>我是辅色1</text>
				</c-colors>
			</c-cell>
			<c-cell>
				<c-colors :theme="['s2']">
					<text>我是辅色2</text>
				</c-colors>
			</c-cell>
		</c-cell-group>
		<c-cell-group title="背景颜色">
			<c-cell :cellStyle="cellStyle">
				<c-colors :theme="['t', '#fff']" :pro="['bgc', 'c']">
					<view class="p24">我是有背景的人</view>
				</c-colors>
			</c-cell>
		</c-cell-group>
		<c-cell-group title="背景颜色">
			<c-cell :cellStyle="cellStyle">
				<c-colors :theme="['t|0.5', '#fff']" :pro="['bgc', 'c']">
					<view class="p24">我是有背景的人</view>
				</c-colors>
			</c-cell>
		</c-cell-group>
		<c-cell-group title="渐变颜色">
			<c-cell :cellStyle="cellStyle">
				<!-- linear-gradient(180deg, rgb(250, 63, 30) 0%, rgb(255, 152, 0) 100%) -->
				<c-colors :theme="['180deg,t,s1', '#fff']" :pro="['bglg', 'c']">
					<view class="p24">我的背景会渐变</view>
				</c-colors>
			</c-cell>
		</c-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cellStyle: {padding: 0},
				buttonTypes: [{
					type: "inherit",
					label: "按钮1",
					size: 'mini',
					theme: ['#fff', 't'],
					plain: false,
					radius: 0,
					pro: ['c', 'bgc']
				}, {
					type: "inherit",
					label: "按钮2",
					theme: ['#fff', 's1'],
					size: 'normal',
					plain: false,
					radius: 0,
					pro: ['c', 'bgc']
				}, {
					type: "inherit",
					label: "按钮2",
					theme: ['#fff', 's2'],
					plain: false,
					radius: 0,
					pro: ['c', 'bgc']
				}, {
					type: "inherit",
					label: "按钮1",
					theme: ['t', 't'],
					size: 'normal',
					plain: true,
					radius: 8,
					pro: ['c', 'bdc']
				}, {
					type: "inherit",
					label: "按钮2",
					theme: ['t', 's1'],
					size: 'normal',
					plain: true,
					radius: 16,
					pro: ['c', 'bdc']
				}, {
					type: "inherit",
					label: "按钮2",
					theme: ['t', 's2'],
					size: 'normal',
					plain: true,
					radius: 32,
					pro: ['c', 'bdc']
				}]
			}
		}
	}
</script>

<style>
</style>
