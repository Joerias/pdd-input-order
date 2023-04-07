<script setup lang="ts" name="app">
import { ref } from "vue";
import ImportTxt from "@comp/import-txt/index.vue";
// import ImportExcel from "@comp/import-excel/index.vue";
import Tables from "@comp/table/index.vue";
import config from "@/config";

const importBaseData = ref<any>([]);
const importTotalPrice = ref<number>(0);
const importTxtType = ref<string>("");
const handleImport = (arr: any, total: number, type: number) => {
	importBaseData.value = arr;
	importTotalPrice.value = total;
	importTxtType.value = type ? "yellow" : "green";
};

const importOrderNoData = ref<any>([]);
const handleReturnOrderList = (val: any) => {
	importOrderNoData.value = val;
};
</script>

<template>
	<div class="container">
		<div class="df">
			<ImportTxt @transitionList="(arr:any, total:number, type:number) => handleImport(arr, total, type)" />
			<!-- <ImportExcel @transitionList="handleReturnOrderList" /> -->
		</div>
		<div class="w96per mauto">
			<Tables
				:data="importBaseData"
				:total="importTotalPrice"
				:label="config.导入txt表格标题"
				:borderColor="importTxtType"
			/>
			<Tables :data="importOrderNoData" :label="config.导入excel按钮描述" />
		</div>
	</div>
</template>

<style lang="less" scoped></style>
