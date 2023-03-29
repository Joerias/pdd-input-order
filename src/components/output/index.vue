<script setup lang="ts">
import { writeFile } from "fs";
import Excel from "@utils/xlsx";
type Props = {
	data?: any;
};
const props = withDefaults(defineProps<Props>(), {
	data: () => [],
});

const handleDayOutput = () => {
	new Excel(props.data).export("统计");
};
</script>

<template>
	<div class="tac mt10">
		<a class="btn" @click="handleDayOutput">导出当天</a>
	</div>
</template>

<style lang="less" scoped>
.btn {
	display: inline-block;
	padding: 6px 20px;
	color: #409eff;
	background: #ecf5ff;
	border: 1px solid #a0cfff;
	border-radius: 4px;
	margin-bottom: 10px;
	font-size: 14px;
	cursor: pointer;
	transition: 0.2s ease-in-out;
	&:hover {
		opacity: 0.8;
	}
}
</style>
