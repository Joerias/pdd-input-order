<script setup lang="ts" name="output">
import { ref, watch } from "vue";
import Excel from "@util/xlsx";
import { OutputStandard } from "@util/common";
import { IImportTableItem } from "@type/index";
import config from "@/config";

type Props = {
	data?: IImportTableItem[];
};
const props = withDefaults(defineProps<Props>(), {
	data: () => [],
});
const emit = defineEmits(["showOutputData"]);

const outputData = ref<IImportTableItem[]>(new OutputStandard(props.data).processing());
const excel = new Excel(outputData.value);

watch(
	outputData,
	(val) => {
		emit("showOutputData", val);
	},
	{ deep: true, immediate: true }
);

const handleDayOutput = () => {
	excel.export(config.导出发单);
};
</script>

<template>
	<el-button type="primary" size="large" plain @click="handleDayOutput"> {{ config.导出发单 }} </el-button>
</template>

<style lang="less" scoped></style>
