<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			this.$store.dispatch('config/setShopConfig')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	/* #ifndef APP-PLUS-NVUE */
	@import '~@/common/index.scss';
	@import '~@/assets/styles/iconfont.css';
	/* #endif */
</style>
