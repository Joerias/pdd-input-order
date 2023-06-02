<script setup lang="ts" name="app">
import { ref } from "vue";
import ImportTxt from "@/components/import-txt/index.vue";
import Tables from "@/components/table/index.vue";
import TxtDemo from "@/components/txt-demo/index.vue";
import config from "@/config";

const importBaseData = ref<any>([]);
const importTotalPrice = ref<number>(0);
const importTxtType = ref<string>("");
const handleImport = (arr: any, total: number, type: number) => {
	importBaseData.value = arr;
	importTotalPrice.value = total;
	importTxtType.value = type === 1 ? "green" : "yellow";
};

const importOrderNoData = ref<any>([]);
const handleReturnOrderList = (val: any) => {
	importOrderNoData.value = val;
};
</script>

<template>
	<div class="container" :class="{ data: importBaseData.length > 0 }">
		<div class="btns">
			<ImportTxt @transitionList="(arr:any, total:number, type:number) => handleImport(arr, total, type)" />
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
		<TxtDemo />
	</div>
</template>

<style lang="less" scoped>
.data {
	justify-content: flex-start;
}
</style>
