<script setup lang="ts">
import { ref } from "vue";
import Table from "@/components/table/index.vue";
const tableData = ref([
	{
		date: "2016-05-03",
		name: "Tom",
		address: "No. 189, Grove St, Los Angeles",
	},
	{
		date: "2016-05-02",
		name: "Tom",
		address: "No. 189, Grove St, Los Angeles",
	},
	{
		date: "2016-05-04",
		name: "Tom",
		address: "No. 189, Grove St, Los Angeles",
	},
	{
		date: "2016-05-01",
		name: "Tom",
		address: "No. 189, Grove St, Los Angeles",
	},
]);
</script>

<template>
	<div class="tac mt10">
		<a class="btn">导出</a>
	</div>
	<div class="w90per mauto">
		<Table :data="tableData" />
	</div>
</template>

<style lang="less" scoped>
.btn {
	display: inline-block;
	padding: 6px 20px;
	color: #fff;
	background: #2065fc;
	border-radius: 4px;
	margin-bottom: 10px;
	font-size: 14px;
	cursor: pointer;
	&:hover {
		opacity: 0.8;
	}
}
</style>
