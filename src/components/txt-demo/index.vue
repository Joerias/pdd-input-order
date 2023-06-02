<script setup lang="ts" name="txt-demo">
// type Props = {};
</script>

<template>
	<div class="box mt20">
		<div class="title">格式示例</div>
		<div class="con">
			<p class="split">=</p>
			<p class="split">=</p>
			<p class="order-no">230601-065981684600888</p>
			<p class="sku">uv印+彩页内页+赠送资料<span class="red">!</span>2<span class="red">#</span>2</p>
			<p class="name">孙权(9740)[4361]</p>
			<p class="phone">17288888888</p>
			<p class="add">安徽省 合肥市 张辽对面(9740)[4361]</p>
		</div>
	</div>
</template>

<style lang="less" scoped>
.box {
	position: relative;
	width: 600px;
	padding: 20px 15px 10px;
	border: 1px solid #ddd;
	border-radius: 4px;
	font-size: 13px;
}
.title {
	position: absolute;
	left: 15px;
	top: -10px;
	line-height: 20px;
	background: #fff;
	font-size: 14px;
	color: #999;
	font-weight: 700;
	padding: 0 10px;
}
.con p {
	line-height: 22px;
	&::after {
		color: #999;
		margin-left: 10px;
		font-size: 12px;
	}
}
.split:after {
	content: "店铺分割线，以第一行起，遇到第一个等号后之间为店1；第一个等号到第二个之间为店2，以此类推";
}
.order-no:after {
	content: "订单号";
}
.sku:after {
	content: "sku信息，!后为数量，大于1必填，#后为产品，新增产品源必填，从3开始";
}
.name:after {
	content: "姓名";
}
.phone:after {
	content: "手机号";
}
.add:after {
	content: "地址信息";
}
</style>
