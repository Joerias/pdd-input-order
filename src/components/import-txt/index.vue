<script setup lang="ts" name="import-txt">
import { ref, reactive } from "vue";
import { ParseDocument, Total } from "@util/common";
import { Excel, type mergeListType } from "@/utils/excel";
import config from "@/config";

// type Props = {};
// const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(["transitionList"]);
const data = new ParseDocument();
const total = new Total();
const excel = new Excel();
const mergeList: mergeListType[] = reactive([
	// { startRow: 1, endRow: 2, startColumn: 3, endColumn: 3 },
	// { startRow: 3, endRow: 5, startColumn: 3, endColumn: 3 },
]);

const list = ref<any>([]);
const totalPrice = ref<number>(0);
const loading1 = ref<boolean>(false);
const loading2 = ref<boolean>(false);
const handleClick = async (type: number) => {
	judgeLoading(type);
	try {
		const impData = await data.documentImport();
		list.value = data.generate(impData);
		totalPrice.value = total.calc(list.value);
		emit("transitionList", list.value, totalPrice.value, type);
		if (type)
			excel.exportExcel({
				name: config.生成原始excel文件名,
				data: list.value,
				cellStyle: {
					singleWidth: [20, 15, 15, 40, 8, 20, 5, 5, 5, 30, 10],
				},
				mergeList,
			});
	} catch (e) {
	} finally {
		judgeLoading(type);
	}
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
