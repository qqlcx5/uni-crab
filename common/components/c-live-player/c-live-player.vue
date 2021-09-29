<template>
	<view>
		<!-- #ifdef MP -->
		<live-player
		  src="rtmp://v12345678.live.126.net/live/abcdefghijklmnopqrstuvmxyz123456"
		  autoplay
		  @statechange="statechange"
		  @error="error"
		  style="width: 300px; height: 225px;"
		/>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
	    methods:{
	        statechange(e){
	            console.log('live-player code:', e.detail.code)
	        },
	        error(e){
	            console.error('live-player error:', e.detail.errMsg)
	        }
	    }
	}
</script>

<style>
</style>
