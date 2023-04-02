<script setup lang="ts" name="import-txt">
import { ref } from "vue";
import { ParseDocument, Total } from "@util/common";
import Excel from "@util/xlsx";
import config from "@/config";

// type Props = {};
// const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(["transitionList"]);
const data = new ParseDocument();
const total = new Total();
const excel = new Excel();

const list = ref<any>([]);
const totalPrice = ref<number>(0);
const loading1 = ref<boolean>(false);
const loading2 = ref<boolean>(false);
const handleClick = (type: number) => {
	judgeLoading(type);
	data.import()
		.then((res) => {
			list.value = data.assemble(data.decompose(res));
			totalPrice.value = total.calc(list.value);
			emit("transitionList", list.value, totalPrice.value, type);
			if (type) excel.export(list.value, config.生成原始excel文件名);
			judgeLoading(type);
		})
		.catch(() => {
			judgeLoading(type);
		});
};

const judgeLoading = (type: number) => {
	if (!type) {
		loading1.value = false;
	} else {
		loading2.value = false;
	}
};
</script>

<template>
	<el-button size="large" type="success" plain :loading="loading1" @click="handleClick(0)">
		{{ config.仅导入txt按钮描述 }}
	</el-button>
	<el-button size="large" type="warning" plain :loading="loading2" @click="handleClick(1)">
		{{ config.导入txt按钮描述 }}
	</el-button>
</template>

<style lang="less" scoped></style>
