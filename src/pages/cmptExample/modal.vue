<template>
	<view class="ss-content ss-cmp-modal-content">
		<c-cell-group title="状态">
			<c-cell>
				<c-subsection :list="list1" :current="modalFlag ? 0 : 1" @change="handleChange"></c-subsection>
			</c-cell>
		</c-cell-group>
		<c-cell-group title="是否显示标题">
			<c-cell>
				<c-subsection :list="list2" :current="title ? 0 : 1" @change="handleChange($event, 'list2','title')"></c-subsection>
			</c-cell>
		</c-cell-group>
		<c-cell-group title="自定义内容">
			<c-cell>
				<c-subsection :list="list3" :current="isCustom ? 0 : 1" @change="handleChange($event, 'list3','isCustom')"></c-subsection>
			</c-cell>
		</c-cell-group>
		<c-cell-group title="异步关闭">
			<c-cell>
				<c-subsection :list="list3" :current="asyncClose ? 0 : 1" @change="handleChange($event, 'list3','asyncClose')"></c-subsection>
			</c-cell>
		</c-cell-group>
		<c-modal v-model="modalFlag" :title="title" :asyncClose="asyncClose" :content="content_" ref="testModal1" @confirm="handleConfirm">
			<c-image v-if="isCustom" src="https://img.yzcdn.cn/vant/cat.jpeg" mode="widthFix"></c-image>
		</c-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalFlag: false,//弹窗1
				isCustom: false,//是否开启自定义
				asyncClose: false,//是否开启异步关闭
				title: '提示',
				content: '您确定要退出登录',
				list1: [{
					name: '显示',
					value: true
				}, {
					name: '隐藏',
					value: false
				}],
				list2: [{
					name: '是',
					value: '提示'
				}, {
					name: '否',
					value: false
				}],
				list3: [{
					name: '是',
					value: true
				}, {
					name: '否',
					value: false
				}]
			}
		},
		computed: {
			content_() {
				return this.isCustom ? '' : this.content;
			}
		},
		methods: {
			handleChange(e, list = false, pro = false) {
				list && pro && (this[pro] = this[list][e].value);
				this.modalFlag = true;
			},
			handleConfirm() {
				if(!this.asyncClose) return ;
				setTimeout(() => {
					// 2秒后自动关闭
					this.modalFlag = false;
					// 如果不想关闭，而单是清除loading状态，需要通过this.$refs.eleRef手动调用方法
					// this.$refs.testModal1.clearLoading();
				}, 2000)
			}
		}
	}
</script>
