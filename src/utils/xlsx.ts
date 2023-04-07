import * as xlsx from "xlsx";
import xlsxStyle from "xlsx-style";
import fileSaver from "file-saver";
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
		// const workBook = {
		// 	SheetNames: [sheetName],
		// 	Sheets: {
		// 		[sheetName]: xlsx.utils.json_to_sheet(array),
		// 	},
		// };
		// const fileNames = `${today.output()}${fileName}.xlsx`;
		// return xlsx.writeFile(workBook, fileNames);
		let table = [
			// 表格表头
			["幼儿园课表", null, null, null],
			["序号", "时间", "姓名", "地址"],
		];
		array.forEach((item, index) => {
			let rowData = [];
			//导出内容的字段
			rowData = [index + 1, item.date, item.name, item.address];
			table.push(rowData);
		});

		let bookNew = xlsx.utils.book_new();
		let workSheet = xlsx.utils.aoa_to_sheet(table);
		xlsx.utils.book_append_sheet(bookNew, workSheet, "作品名称"); // 设置工作簿名称

		// 设置标题行单元格合并
		// s即start, e即end, r即row, c即column
		// 合并从--0行0列开始,到0行3列
		workSheet["!merges"] = [
			{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
			{ s: { r: 7, c: 1 }, e: { r: 8, c: 2 } },
		];
		const s2ab = (s) => {
			var buf = new ArrayBuffer(s.length);
			var view = new Uint8Array(buf);
			for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
			return buf;
		};

		// 设置表格的样式
		const setExlStyle = (data) => {
			//单元格外侧框线
			let borderAll = {
				top: {
					style: "thin",
				},
				bottom: {
					style: "thin",
				},
				left: {
					style: "thin",
				},
				right: {
					style: "thin",
				},
				diagonal: {
					style: "thin",
					color: "red",
				},
			};

			for (let key in data) {
				// 判断是否为excel表头
				if (key === "A1") {
					data[key].s = {
						font: {
							name: "宋体", //字体类型
							sz: 20, //字体大小
							color: { rgb: "ff0000" }, //字体颜色
							bold: true, //是否加粗
						},
						fill: {
							patternType: "solid", // 默认 solid，设为 none 时，fgColor 失效
							bgColor: {
								// 无效
								rgb: "0000FF",
							},
							fgColor: {
								// 背景色
								theme: "2",
								tint: "-0.25",
							},
						},
					};
					continue;
				}

				if (data[key] instanceof Object) {
					data[key].s = {
						// 边框
						border: borderAll,
						// 对齐方式相关样式
						alignment: {
							vertical: "center", //垂直对齐方式
							horizontal: "center", //水平对齐方式
							// wrapText: true,  //自动换行
						},
						//字体相关样式
						font: {
							name: "宋体", //字体类型
							sz: 20, //字体大小
							color: { rgb: "" }, //字体颜色
							bold: false, //是否加粗
						},
						//背景相关样式

						bold: true,
						numFmt: 0,
					};
				}
			}

			return data;
		};
		// 调用 设置表格样式的方法
		setExlStyle(workSheet);

		// 设置单元格宽度
		workSheet["!cols"] = [{ wpx: 80 }, { wpx: 100 }, { wpx: 180 }, { wpx: 400 }];

		// 导出Excel, 注意这里用到的是xlsxStyle对象
		let wbout = xlsxStyle.write(bookNew, {
			bookType: "xlsx",
			bookSST: false,
			type: "binary",
		});

		fileSaver.saveAs(
			new Blob([s2ab(wbout)], {
				type: "application/octet-stream",
			}),
			"全部人员.xlsx" // 保存的文件名
		);
	}

	// 使用xlsx 方式直接导出excel
	// let workSheet = XLSX.utils.aoa_to_sheet(table);
	// let bookNew = XLSX.utils.book_new();
	// XLSX.utils.book_append_sheet(bookNew, workSheet, '作品名称') // 设置工作簿名称
	// XLSX.writeFile(bookNew, '全部人员.xlsx')   // 保存的文件名
	// 工具方法
}
