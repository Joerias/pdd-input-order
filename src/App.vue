<script setup lang="ts">
import { ref } from "vue";
import Output from "@comp/output/index.vue";
import Table from "@comp/table/index.vue";

type x = {
	a: number;
	b: string;
};
const v = <x>{};
console.log(v.a ?? "yes");
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
	<Output :data="tableData" />
	<div class="w90per mauto">
		<Table :data="tableData" />
	</div>
</template>

<style lang="less" scoped></style>
