<template>
	<view :style="{ height: statusBarHeight }" class="uni-status-bar">
		<slot />
	</view>
</template>

<script>
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px'
	export default {
		name: 'UniStatusBar',
		data() {
			return {
				statusBarHeight: statusBarHeight
			}
		}
	}
</script>

<style>
	.uni-status-bar {
		height: 20px;
        width: 750rpx;
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		height: var(--status-bar-height);
		/* #endif */
	}
</style>
