<script setup lang="ts" name="app">
import { ref } from "vue";
import Import from "@comp/import/index.vue";
import Output from "@comp/output/index.vue";
import Table from "@comp/table/index.vue";
import { IImportTableItem } from "@type/index";
import config from "@/config";

const tableData = ref<IImportTableItem[]>([
	{
		order_sn: "2016-05-03",
		shipping_sn: "YT2309680523400",
	},
	{
		order_sn: "2016-05-02",
		shipping_sn: "2309680527655",
	},
]);

const outputData = ref<IImportTableItem[]>([]);
const showOutputData = (val: IImportTableItem[]) => {
	outputData.value = val;
};
</script>

<template>
	<div class="container">
		<div class="tac">
			<Import />
			<Output :data="tableData" @showOutputData="showOutputData" />
		</div>
		<div class="w96per mauto">
			<Table :data="tableData" />
			<Table v-if="outputData.length > 0" :data="outputData" :label="`${config.导出发单}预览`" />
		</div>
	</div>
</template>

<style lang="less" scoped></style>
