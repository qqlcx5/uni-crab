<template>
	<view class="ss-content ss-cmp-fixed-menu-content">
		<c-fixed-menu height="84" v-model="showTop" hasNav="false">
			<view class="plr24 ptb12">
				<view class="search-box">
					<c-input placeholder="请输入">
						<c-icons class="search-box__icon" type="crab-sousuo" size="32" />
					</c-input>
				</view>
			</view>
		</c-fixed-menu>
		<c-fixed-menu height="84" position="bottom" v-model="showBottom">
			<view class="plr24 ptb12">
				<view class="search-box">
					<c-input placeholder="请输入">
						<c-icons class="search-box__icon" type="crab-sousuo" size="32" />
					</c-input>
				</view>
			</view>
		</c-fixed-menu>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showTop: true,
				showBottom: false
			}
		},
		onLoad() {
			// 可加入动画
			setTimeout(() => {
				this.showBottom = true
			}, 1500)
		}
	}
</script>

<style lang="scss">
	.ss-cmp-fixed-menu-content{
		.search-box{
			background-color: #f5f5f5;
			padding: $spacing-row-sm / 2;
			border-radius: $spacing-row-sm / 2;
			&__icon{
				padding: 0 $spacing-row-sm;
			}
		}
	}
</style>
