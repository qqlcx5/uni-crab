<template>
	<view>
		<view class="integral-browse__fixed" v-if="isOpenIntegral">
			<view class="integral-browse__box">
				<c-image src="integral/gold-coin-cloud.png" width="120" height="80"></c-image>
				<view class="integral-browse__progress">
					<c-progress :percent="percent" :showInfo="false" :stroke-width="u14" strokeBg="#792907" stroke-color="#FFEA18" />
				</view>
				<view class="integral-browse__text">
					<block v-if="percent === 100">
						<text>{{toastMsgArr_[0]}}</text>
						<text>{{toastMsgArr_[1]}}</text>
					</block>
					<block v-else>
						<text>浏览得积分</text>
					</block>
				</view>
			</view>
		</view>
		<c-toast v-model="showToast" :text="toastMsg" icon="integral/gold-coin.png" iconSize="30" row />
	</view>
</template>

<script>
	import TimeUtil from '../../utils/countDown'
	import integralMainMixin from '@/common/mixins/integral/main'
	let timer = null;
	export default {
		mixins: [ integralMainMixin ],
		data() {
			return {
				u14: uni.upx2px(14),
				percent: 0,
				showToast: false,
				toastMsg: ''
			}
		},
		computed: {
			toastMsgArr_(){
				return this.toastMsg.split(',');
			}
		},
		methods: {
			async stateFinish(state) {
				if(state){
					let { seconds } = await this.getExplainByType();
					timer = new TimeUtil();
					timer.addTask(seconds)
					timer.start(async (res) => {
						this.percent = Math.round(100 - res[0].timestamp * 100 / seconds);
						if(this.percent >= 100){
							let { data, msg } = await this.readArticle();
							this.toastMsg = msg;
							if(data.credit > 0){
								this.showToast = true;
								setTimeout(() => {
									this.showToast = false;
								}, 1500)
							}else{
								this.$toast(msg);
							}
						}
					})
				}
			},
			// 阅读文章
			async readArticle(relate_type) {
				return await this.$http('readArticle', {
					relate_id: this.$Route.query.detailId,
					relate_type: 1
				});
			}
		},
		destroyed() {
			timer ? timer.stop() : '';
			timer = null;
			this.showToast = false;
		}
	}
</script>

<style lang="scss" scoped>
	.integral-browse{
		&__fixed{
			@include fixed(null, 24rpx, 216rpx);
			z-index: 99;
		}
		&__box{
			position: relative;
			width: 120rpx;
		}
		&__progress{
			@include abs(50rpx, 0, null, 0);
		}
		&__text{
			height: 132rpx;
			width: 220rpx;
			transform-origin: 0 0;
			@include flex();
			align-items: center;
			justify-content: center;
			padding: 10rpx;
			font-size: 40rpx;
			transform: scale(.5) translateX(-50%);
			font-weight: 400;
			color: #FFFFFF;
			position: relative;
			left: 50%;
			line-height: 56rpx;
			background-color: rgba(0, 0, 0, .6);
			border-radius: 0rpx 0rpx 32rpx 32rpx;
		}
	}
</style>
