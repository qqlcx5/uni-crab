<template>
	<view class="ss-content ss-cmp-modal-content">
		<c-cell-group title="状态">
			<c-cell>
				<c-subsection :list="list1" :current="modalFlag ? 0 : 1" @change="handleChange"></c-subsection>
			</c-cell>
		</c-cell-group>
		<c-cell-group title="蒙层关闭">
			<c-cell>
				<c-subsection :list="list2" :current="maskabled ? 0 : 1" @change="handleChange($event, 'list2','maskabled')"></c-subsection>
			</c-cell>
		</c-cell-group>
		<c-cell-group title="弹出方向">
			<c-cell>
				<c-subsection :list="list3" :current="modeCurrent_" @change="handleChange($event, 'list3','modalMode')"></c-subsection>
			</c-cell>
		</c-cell-group>
		<c-cell-group title="关闭按钮">
			<c-cell>
				<c-subsection :list="list4" :current="showClose ? 0 : 1" @change="handleChange($event, 'list4', 'showClose')"></c-subsection>
			</c-cell>
		</c-cell-group>
		<c-cell-group title="关闭按钮位置">
			<c-cell>
				<c-subsection :list="list5" :current="closePosCurrent_" @change="handleChange($event, 'list5','closePos')"></c-subsection>
			</c-cell>
		</c-cell-group>
		<c-popup v-model="modalFlag" :mode="modalMode" :closePos="closePos" :maskabled="maskabled" :showClose="showClose">
			<view class="flex flex-column align-center">
				<c-image src="https://img.yzcdn.cn/vant/cat.jpeg" size="500" mode="widthFix"></c-image>
				<view class="p12">
					<c-button @click="modalFlag = false">关闭弹窗</c-button>
				</view>
			</view>
		</c-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalFlag: false,//弹窗
				isCustom: false,//是否开启自定义
				showClose: true,//是否显示关闭按钮
				modalMode: 'middle',//弹窗弹出方向
				closePos: 'top-right',//关闭按钮位置
				title: '提示',
				maskabled: false,
				content: '您确定要退出登录',
				list1: [{
					name: '打开',
					value: true
				}, {
					name: '关闭',
					value: false
				}],
				list2: [{
					name: '开启',
					value: true
				}, {
					name: '关闭',
					value: false
				}],
				list3: [{
					name: '上',
					value: 'top'
				}, {
					name: '下',
					value: 'bottom'
				}, {
					name: '中',
					value: 'middle'
				}, {
					name: '左',
					value: 'left'
				}, {
					name: '右',
					value: 'right'
				}],
				list4: [{
					name: '显示',
					value: true
				}, {
					name: '隐藏',
					value: false
				}],
				list5: [{
					name: '右上角',
					value: 'top-right'
				}, {
					name: '左上角',
					value: 'top-left'
				}, {
					name: '右下角',
					value: 'bottom-right'
				}, {
					name: '左下角',
					value: 'bottom-left'
				}]
			}
		},
		computed: {
			modeCurrent_() {
				return this.list3.findIndex(o => o.value === this.modalMode)
			},
			closePosCurrent_() {
				return this.list5.findIndex(o => o.value === this.closePosCurrent)
			}
		},
		methods: {
			handleChange(e, list = false, pro = false) {
				list && pro && (this[pro] = this[list][e].value);
				this.modalFlag = true;
			}
		}
	}
</script>