<template>
	<view class="c-col" :style="{
		padding: `0 ${Number(gutter)/2 + 'rpx'}`,
		marginLeft: 100 / 12 * offset + '%',
		flex: `0 0 ${100 / 12 * span}%`
	}" :class="[
		'c-col--' + span
	]">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: 'c-col',
		props: {
			span: {
				type: [ String, Number ],
				default: 1
			},
			offset: {
				type: [ String, Number ],
				default: 0
			}
		},
		data() {
			return {
				gutter: 0
			}
		},
		mounted() {
			// 获取父组件实例，并赋值给对应的参数
			this.parent = this.$c.getParent.call(this, 'c-row');
			if (this.parent) {
				this.gutter = this.parent.gutter;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-col{
		@include flex(row);
		float: left;
		&--1{
			width: calc(100% / 12);
		}
		&--2{
			width: calc(100% / 6);
		}
		&--3{
			width: calc(100% / 4);
		}
		&--4{
			width: calc(100% / 3);
		}
		&--5{
			width: calc(100%/12 * 5);
		}
		&--6{
			width: calc(100% / 2);
		}
		&--7{
			width: calc(100%/12 * 7);
		}
		&--8{
			width: calc(100%/12 * 8);
		}
		&--9{
			width: calc(100%/12 * 9);
		}
		&--10{
			width: calc(100%/6 * 5);
		}
		&--11{
			width: calc(100%/12 * 11);
		}
		&--12{
			width: 100%;
		}
	}
</style>
