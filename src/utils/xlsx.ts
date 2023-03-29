import * as xlsx from "xlsx";
import TransitionDate from "@utils/transitionDate";

const today = new TransitionDate(new Date());

export default class Excel {
	array: any[];
	sheetName: string;
	constructor(array: any[], sheetName = "Sheet1") {
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
