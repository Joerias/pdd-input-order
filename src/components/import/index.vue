<script setup lang="ts" name="import">
import { writeFile } from "fs";
import Excel from "@util/xlsx";
import { IImportTableItem } from "@type/index";
import config from "@/config";

type Props = {
	data?: IImportTableItem[];
};
const props = withDefaults(defineProps<Props>(), {
	data: () => [],
});
const excel = new Excel(props.data);

const handleDayOutput = () => {};
</script>

<template>
	<el-button size="large" plain @click="handleDayOutput"> {{ config.导入 }} </el-button>
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
