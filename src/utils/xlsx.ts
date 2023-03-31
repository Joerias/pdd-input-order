import * as xlsx from "xlsx";
// import * as xlsx from "xlsx-style";
import { FormatDate } from "@/utils/common";
import { IImportTableItem } from "@type/index";

const today = new FormatDate(new Date());

export default class Excel {
	array: IImportTableItem[];
	sheetName: string;
	constructor(array: IImportTableItem[], sheetName = "Sheet1") {
		this.array = array;
		this.sheetName = sheetName;
	}
	export(name: string) {
		const workBook = {
			SheetNames: [this.sheetName],
			Sheets: {
				[this.sheetName]: xlsx.utils.json_to_sheet(this.array),
			},
		};
		const fileName = `${today.output()}${name}.xlsx`;
		return xlsx.writeFile(workBook, fileName);
	}
}
