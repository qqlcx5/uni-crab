<template>
	<view class="c-tabbar">
		<c-fixed-menu height="50px" position="bottom">
			<view class="flex c-tabbar-bd c-underline__top">
				<view class="flex-1" v-for="(item, index) in list_" :key="index" @click="changeTab(item.app_page, index)">
					<c-colors :theme="[selectIndex_ === index ? 't' : color]">
						<view class="c-tabbar__image">
							<c-image v-if="isImg_(item.img)" :src="selectIndex_ === index ? item.img_active : item.img" size="20px"></c-image>
							<c-icons v-else color="false" :type="selectIndex_ === index ? item.img_active : item.img" size="20px"></c-icons>
						</view>
					</c-colors>
					<c-colors class="c-tabbar__text" :theme="[selectIndex_ === index ? 't' : color]" :class="[!item.name ? 'bright-card' : '']" :pro="['c']">
						<view>{{item.name}}</view>
					</c-colors>
				</view>
			</view>
		</c-fixed-menu>
	</view>
</template>

<script>
	export default {
		name: 'c-tabbar',
		props: {
			bgColor: {
				type: String,
				default: '#fff'
			},
			color: {
				type: String,
				default: '#666'
			}
		},
		data() {
			return {
				shieldReview: false,
				newList: [],
				shopConfig: {}
			}
		},
		computed: {
			list_() {
				let tabbarArr = [];
				if (!!this.shieldReview) {
					// -- 审核 模式
					tabbarArr = [{
							app_page: 'pages/index/client',
							img: 'newTabbar/tabBar_8.png',
							img_active: 'newTabbar/tabBar_cur_8.png',
							name: '商城'
						},
						{
							app_page: 'pages/cart/cart',
							img: 'newTabbar/tabBar_3.png',
							img_active: 'newTabbar/tabBar_cur_3.png',
							name: '购物车'
						},
						{
							app_page: 'pages/user/user',
							img: 'newTabbar/tabBar_4.png',
							img_active: 'newTabbar/tabBar_cur_4.png',
							name: '我的'
						}
					]
				} else {
					// 初始化空
					tabbarArr = this.shopConfig.menu || [{
						app_page: '/',
						img: '',
						img_active: '',
						name: ''
					}, {
						app_page: '/',
						img: '',
						img_active: '',
						name: ''
					}, {
						app_page: '/',
						img: '',
						img_active: '',
						name: ''
					}, {
						app_page: '/',
						img: '',
						img_active: '',
						name: ''
					}];
				}
				return tabbarArr;
			},
			selectIndex_() {
				return this.list_.findIndex(o => o.app_page === this.$Route.path || o.app_page === this.$Route.aliasPath);
			},
			isImg_() {
				return (icon) => {
					return this.$c.isImg(icon);
				}
			}
		},
		created() {
			this.getShopConfig();
		},
		methods: {
			changeTab(url, index) {
				if (this.selectIndex_ === index || !url) return;
				if (url.length === 1) {
					return this.$jump('home', {}, 'replace');
				}
				this.$Router.replace({
					path: url
				})
			},
			async getShopConfig() {
				let {
					data
				} = await this.$http('shopConfig');
				this.shopConfig = data;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-tabbar {

		&-bd {

			.flex-1 {
				@include flex(column);
				align-items: center;
				padding-top: 6px;
			}
		}

		&__image {
			width: 20px;
			height: 20px;
			position: relative;
			overflow: hidden;
		}

		&__text {
    		text-align: center;
			font-size: 12px;
			line-height: 16px;
			height: 16px;
			color: inherit;
			margin-top: 4px;
			/* #ifndef APP-PLUS-NVUE */
			min-width: 50%;
			/* #endif */
		}

		&__doted {
			@include abs(0, 0);
			width: 6px;
			height: 6px;
			background-color: red;
			border-radius: 100%;
			z-index: 2;
		}
	}
</style>
