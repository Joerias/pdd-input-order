<script setup lang="ts" name="import-excel">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import * as xlsx from "xlsx";
import config from "@/config";

// type Props = {};
// const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(["transitionList"]);

const beforeUpload = (file: any) => {
	//获取上传文件
	let formData = new FormData(); //FormData对象，添加参数只能通过append('key', value)的形式添加
	formData.append("file", file); //添加文件对象
	const Xls = file.name.split(".");
	if (Xls[1] === "xls" || Xls[1] === "xlsx" || Xls[1] === "csv") {
		return file;
	} else {
		ElMessage.error("请上传excel格式的文件!");
		return false;
	}
};

const data = ref<any>([]);
const uploadHttpRequest = (e: any) => {
	const fileReader = new FileReader();
	fileReader.onload = (ev) => {
		const workbook = xlsx.read(ev.target?.result, {
			type: "binary",
		});
		const wsname = workbook.SheetNames[0];
		const ws = xlsx.utils.sheet_to_json(workbook.Sheets[wsname]);
		// dealExcel(ws); //转换数据格式
		data.value = ws;
		emit("transitionList", data.value);
	};
	fileReader.readAsBinaryString(e.file);
};

const dealExcel = (ws) => {
	let keymap = {
		// 转换的开头
		姓名: "name",
		工资月份: "month",
		工资总金额: "money",
		部门: "section",
		职位: "job",
	};
	ws.forEach((sourceObj) => {
		Object.keys(sourceObj).map((keys) => {
			let newKey = keymap[keys];
			if (newKey) {
				sourceObj[newKey] = sourceObj[keys];
				delete sourceObj[keys];
			}
		});
	});
	tableData.value = ws;
};
</script>

<template>
	<el-upload class="upload ml20" :before-upload="beforeUpload" :http-request="uploadHttpRequest">
		<el-button type="primary" plain size="large"> {{ config.导入excel按钮描述 }} </el-button>
	</el-upload>
</template>

<style lang="less" scoped>
:deep(.el-upload-list) {
	display: none;
}
</style>
