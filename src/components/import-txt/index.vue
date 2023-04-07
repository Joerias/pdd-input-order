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
const handleClick = async (type: number) => {
	judgeLoading(type);
	try {
		const impData = await data.import();
		list.value = data.generate(impData);
		totalPrice.value = total.calc(list.value);
		emit("transitionList", list.value, totalPrice.value, type);
		if (type) excel.export(list.value, config.生成原始excel文件名);
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

const test = () => {
	const arr = [
		{
			date: "2016-05-03",
			name: "Tom",
			address: "123",
		},
		{
			date: "2016-05-02",
			name: "Tom",
			address: "456",
		},
		{
			date: "2016-05-04",
			name: "Tom",
			address: "789",
		},
		{
			date: "2016-05-01",
			name: "Tom",
			address: "147",
		},
		{
			date: "2016-05-08",
			name: "Tom",
			address: "258",
		},
		{
			date: "2016-05-06",
			name: "Tom",
			address: "369",
		},
		{
			date: "2016-05-07",
			name: "Tom",
			address: "No. 189, Grove St, Los Angeles",
		},
	];
	excel.export(arr, "ss");
};
</script>

<template>
	<el-button size="large" type="success" plain :loading="loading1" @click="handleClick(0)">
		{{ config.仅导入txt按钮描述 }}
	</el-button>
	<el-button size="large" type="warning" plain :loading="loading2" @click="handleClick(1)">
		{{ config.导入txt按钮描述 }}
	</el-button>
	<el-button size="large" type="warning" plain @click="test"> export </el-button>
</template>

<style lang="less" scoped></style>
