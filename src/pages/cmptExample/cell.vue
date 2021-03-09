<template>
	<view class="ss-content ss-cmp-input-content">
		<c-cell-group title="基础用法">
			<c-cell border  title="单元格" value="内容"></c-cell>
			<c-cell title="单元格" value="内容" label="描述信息"></c-cell>
		</c-cell-group>
		<c-cell-group title="单元格大小">
			<c-cell border  title="单元格" value="内容" size="large"></c-cell>
			<c-cell title="单元格" value="内容" size="large" label="描述信息"></c-cell>
		</c-cell-group>
		<c-cell-group title="展示图标 / 图片">
			<c-cell border title="单元格" value="内容" icon="crab-dingwei"></c-cell>
			<c-cell title="单元格" value="内容" icon="https://img.yzcdn.cn/vant/cat.jpeg"></c-cell>
		</c-cell-group>
		<c-cell-group title="展示箭头">
			<c-cell border arrow title="单元格"></c-cell>
			<c-cell border arrow title="单元格" value="内容"></c-cell>
			<c-cell arrow title="单元格" arrowDirection="down" value="内容"></c-cell>
		</c-cell-group>
		<c-cell-group title="页面导航">
			<c-cell border arrow title="路由跳转" to="home"></c-cell>
			<c-cell arrow title="路由跳转" :to="{name: 'home'}"></c-cell>
		</c-cell-group>
		<c-cell-group title="使用插槽">
			<c-cell border rightIcon="crab-sousuo" rightIconSize="32">
				<c-input placeholder="请输入" />
			</c-cell>
			<c-cell>
				<view class="cmp-input">
					<c-input placeholder="请输入">
						<view class="cmp-input__icon">
							<c-icons type="crab-sousuo" size="32" />
						</view>
					</c-input>
				</view>
			</c-cell>
		</c-cell-group>
		<c-cell-group title="垂直居中">
			<c-cell title="单元格" value="内容" label="描述信息" to="home" center></c-cell>
		</c-cell-group>
	</view>
</template>

<script>
</script>

<style lang="scss">
	.ss-cmp-input-content{
		.cmp-input{
			background-color: #f5f5f5;
			padding: $spacing-col-sm 0;
			border-radius: $border-radius-base;
			&__icon{
				padding: 0 $spacing-row-base;
			}
		}
	}
</style>
