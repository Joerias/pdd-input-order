import ExcelJS from "exceljs";

declare module "exceljs" {
	interface Row {
		singleWidth: number[];
	}
}
