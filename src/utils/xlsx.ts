import * as xlsx from "xlsx";
// import * as xlsx from "xlsx-style";
import FormatDate from "@util/formatDate";
import { ITableItem } from "@type/index";

const today = new FormatDate(new Date());

export default class Excel {
	array: ITableItem[];
	sheetName: string;
	constructor(array: ITableItem[], sheetName = "Sheet1") {
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
