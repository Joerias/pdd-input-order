export class FormatDate {
	value: Date;
	constructor(value: Date) {
		this.value = value;
	}
	output(type?: string) {
		const year = this.value.getFullYear();
		const month = this.value.getMonth() + 1;
		const day = this.value.getDate();
		const rst = type === "/" ? `${year}/${month}/${day}` : `${year}年${month}月${day}日`;
		return rst;
	}
}

import { IImportTableItem } from "@type/index";
export class OutputStandard {
	#list: IImportTableItem[];

	constructor(list: IImportTableItem[]) {
		this.#list = list;
	}

	processing() {
		const keyArr = Object.keys(this.#list[0]);
		if (!keyArr.includes("nashipping_name")) {
			const list = this.#list.map((v) => ({
				order_sn: v.order_sn,
				nashipping_name: v.shipping_sn.includes("YT") ? "圆通快递" : "中通快递",
				shipping_sn: v.shipping_sn,
			}));
			this.#list = list;
		}
		return this.#list;
	}
}
