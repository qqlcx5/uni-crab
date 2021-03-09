<template>
	<view class="ss-content ss-cmp-input-content">
		<c-cell-group title="基础用法">
			<c-cell hoverClass="none">
				<c-input class="cmp-input" placeholder="text输入框" v-model="formData.field0"></c-input>
			</c-cell>
		</c-cell-group>
		<c-cell-group class="mt12" title="Field 输入框">
			<c-cell border hoverClass="none">
				<c-input class="cmp-input" :beforeWidth="beforeWidth" placeholder="请输入文本" v-model="formData.field1">
					<view slot="before">文本</view>
				</c-input>
			</c-cell>
			<c-cell border hoverClass="none">
				<c-input class="cmp-input" :beforeWidth="beforeWidth" type="number" maxLenght="11" placeholder="请输入手机号" v-model="formData.field2">
					<view slot="before">手机号</view>
				</c-input>
			</c-cell>
			<c-cell border hoverClass="none">
				<c-input class="cmp-input" :beforeWidth="beforeWidth" type="price" decimal="0" placeholder="请输入整数" v-model="formData.field3">
					<view slot="before">整数</view>
				</c-input>
			</c-cell>
			<c-cell border hoverClass="none">
				<c-input class="cmp-input" :beforeWidth="beforeWidth" type="price" decimal="2" placeholder="请输入数字(最多2位小数,可自定义设置)" v-model="formData.field4">
					<view slot="before">数字</view>
				</c-input>
			</c-cell>
			<c-cell border hoverClass="none">
				<c-input class="cmp-input" :beforeWidth="beforeWidth" type="password" placeholder="请输入密码" v-model="formData.field5">
					<view slot="before">密码</view>
				</c-input>
			</c-cell>
			<c-cell border hoverClass="none">
				<c-input class="cmp-input" :beforeWidth="beforeWidth" type="select" @select="handleSelect" placeholder="请选择类型" v-model="formData.field6">
					<view slot="before">类型</view>
				</c-input>
			</c-cell>
			<c-cell border hoverClass="none">
				<c-input class="cmp-input" disabled :beforeWidth="beforeWidth" placeholder="输入框已禁用" v-model="formData.field7">
					<view slot="before">禁用框</view>
				</c-input>
			</c-cell>
			<c-cell border hoverClass="none">
				<c-input class="cmp-input" :beforeWidth="beforeWidth" type="textarea" placeholder="" v-model="formData.field8">
					<view slot="before">多行输入</view>
				</c-input>
			</c-cell>
		</c-cell-group>
		<c-cell-group class="mt12" title="默认图标">
			<c-cell border hoverClass="none">
				<c-input class="cmp-input" :beforeWidth="beforeWidth" placeholder="请输入文本" v-model="formData.field9" clearable>
					<view slot="before">清空</view>
				</c-input>
			</c-cell>
			<c-cell border hoverClass="none">
				<c-input class="cmp-input" :beforeWidth="beforeWidth" type="password" placeholder="请输入文本" v-model="formData.field10" displayable>
					<view slot="before">密码</view>
				</c-input>
			</c-cell>
			<c-cell border hoverClass="none">
				<c-input class="cmp-input" :beforeWidth="beforeWidth" placeholder="请输入文本" type="password" v-model="formData.field11" clearable displayable>
					<view slot="before">文本</view>
				</c-input>
			</c-cell>
		</c-cell-group>
		<c-cell-group class="mt12" title="自定义图标">
			<c-cell border hoverClass="none">
				<c-input class="cmp-input" placeholder="请输入手机号码" v-model="formData.field12" clearable>
					<view slot="before">
						<c-icons type="crab-shouji" size="40"></c-icons>
					</view>
				</c-input>
			</c-cell>
			<c-cell border hoverClass="none">
				<c-input class="cmp-input" placeholder="请输入手机号码" v-model="formData.field13" clearable>
					<view slot="before">
						<c-icons type="crab-mima" size="40"></c-icons>
					</view>
				</c-input>
			</c-cell>
			<c-cell border hoverClass="none">
				<c-input class="cmp-input" placeholder="请输入手机号码" v-model="formData.field14" clearable>
					<view slot="before">
						<c-icons type="crab-anquan" size="40"></c-icons>
					</view>
				</c-input>
			</c-cell>
		</c-cell-group>
		<c-cell-group class="mt12" title="插入按钮">
			<c-cell border hoverClass="none">
				<c-input class="cmp-input" placeholder="请输入短信验证码" v-model="formData.field15" clearable>
					<view slot="before">
						短信验证码
					</view>
					<c-button type="primary">发送验证码</c-button>
				</c-input>
			</c-cell>
		</c-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				beforeWidth: 100,
				formData: {
					field0: '',
					field1: '',
					field2: '',
					field3: '',
					field4: '',
					field5: '',
					field6: '',
					field7: '',
					field8: '',
					field9: '点×清空我',
					field10: '我被隐藏了',
					field11: '默认有2个操作按钮',
					field12: '',
					field13: '',
					field14: '',
					field15: '',
					field16: ''
				}
			}
		},
		methods: {
			handleSelect() {
				let itemList = ['身份证', '军官证', '港澳通行证']
				uni.showActionSheet({
					itemList: itemList,
					success: (res) => {
						this.formData.field6 = itemList[res.tapIndex];
					}
				})
			}
		}
	}
</script>
