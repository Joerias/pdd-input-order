<script setup lang="ts" name="output">
import { ref, watch } from "vue";
import Excel from "@util/xlsx";
// import { OutputStandard } from "@util/common";
import config from "@/config";

// type Props = {};
// const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(["showOutputData"]);

const excel = new Excel();

// watch(
// 	props.data,
// 	(val) => {
// 		if (val.length === 0) return;
// 		outputData.value = new OutputStandard(props.data).processing();
// 		emit("showOutputData", outputData.value);
// 	},
// 	{ deep: true }
// );

const handleClick = () => {
	// 	excel.export(outputData.value, config.导出发单);
};
</script>

<template>
	<el-button type="primary" size="large" plain @click="handleClick"> {{ config.导出发单 }} </el-button>
</template>

<style lang="less" scoped></style>
