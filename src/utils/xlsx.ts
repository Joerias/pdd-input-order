import * as xlsx from "xlsx";
// import * as xlsx from "xlsx-style";
import { FormatDate } from "@/utils/common";

const today = new FormatDate(new Date());

export default class Excel {
	import(excelRcFileBuffer: ArrayBuffer) {
		// 读取表格对象
		const workbook = xlsx.read(excelRcFileBuffer, { type: "buffer" });
		// 找到第一张表
		const sheetNames = workbook.SheetNames;
		const sheet1 = workbook.Sheets[sheetNames[0]];
		// 读取内容
		return xlsx.utils.sheet_to_json(sheet1);
	}

	export(array: any[], fileName: string, sheetName = "Sheet1") {
		const workBook = {
			SheetNames: [sheetName],
			Sheets: {
				[sheetName]: xlsx.utils.json_to_sheet(array),
			},
		};
		const fileNames = `${today.output()}${fileName}.xlsx`;
		return xlsx.writeFile(workBook, fileNames);
	}
}
