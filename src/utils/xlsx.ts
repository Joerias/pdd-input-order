import * as xlsx from "xlsx";

export const exportExcel = (array: any[], fileName: string, sheetName = "Sheet1") => {
	const jsonSheet = xlsx.utils.json_to_sheet(array);
	const workBook = {
		SheetNames: [sheetName],
		Sheets: {
			[sheetName]: jsonSheet,
		},
	};
	return xlsx.writeFile(workBook, fileName);
};
