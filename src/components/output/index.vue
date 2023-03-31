<script setup lang="ts" name="output">
import { ref, watch } from "vue";
import Excel from "@util/xlsx";
import { OutputStandard } from "@util/common";
import { IImportTableItem } from "@type/index";
import config from "@/config";

type Props = {
	data: IImportTableItem[];
};
const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(["showOutputData"]);

const outputData = ref<IImportTableItem[]>();
const excel = new Excel();

watch(
	props.data,
	(val) => {
		if (val.length === 0) return;
		outputData.value = new OutputStandard(props.data).processing();
		emit("showOutputData", outputData.value);
	},
	{ deep: true }
);

const handleDayOutput = () => {
	excel.export(outputData.value, config.导出发单);
};
</script>

<template>
	<el-button type="primary" size="large" plain @click="handleDayOutput"> {{ config.导出发单 }} </el-button>
</template>

<style lang="less" scoped></style>
