import config from "@/config";
import { ElMessage } from "element-plus";

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

export class Total {
	calc(arr: any) {
		return arr.reduce((prev: any, cur: any) => {
			return prev + Number(cur[config.组装excel表格字段.价格]) * cur[config.组装excel表格字段.数量];
		}, 0);
	}
}

// export class OutputStandard {
// 	#list: IImportTableItem[];

// 	constructor(list: IImportTableItem[]) {
// 		this.#list = list;
// 	}

// 	processing() {
// 		const keyArr = Object.keys(this.#list[0]);
// 		if (!keyArr.includes("nashipping_name")) {
// 			const list = this.#list.map((v) => ({
// 				order_sn: v.order_sn,
// 				nashipping_name: v.shipping_sn.includes("YT") ? "圆通快递" : "中通快递",
// 				shipping_sn: v.shipping_sn,
// 			}));
// 			this.#list = list;
// 		}
// 		return this.#list;
// 	}
// }

export class ParseDocument {
	#fileHandle: any;

	// 导入.txt
	/**
	 * 订单号
	 * 商品信息（分解为：版本、款式、颜色、数量、价格）
	 * 买家姓名
	 * 买家电话
	 * 买家地址
	 */
	async import() {
		try {
			[this.#fileHandle] = await window.showOpenFilePicker();
			const file = await this.#fileHandle.getFile();
			const res = await file.text();
			const untreatedArr = res
				.split("\r\n")
				.filter((v: string) => v)
				.map((v: string) => v.replace(/^\s+|\s+$/g, ""));
			let spaceMarkArr: number[] = [];
			untreatedArr.forEach((v: string, i: number) => {
				if (v === "=") spaceMarkArr.push(i);
			});
			if (this.validate(spaceMarkArr, untreatedArr, Object.keys(config.分解txt表格字段).length)) {
				ElMessage.error(
					`${config.errMsg.上传txt} ${this.validate(
						spaceMarkArr,
						untreatedArr,
						Object.keys(config.分解txt表格字段).length
					)}`
				);
				return;
			}
			return untreatedArr;
		} catch (e) {}
	}

	validate(markArr: number[], baseArr: any, cycleLen: number) {
		for (let i = 0; i <= markArr.length; i++) {
			switch (i) {
				case 0:
					if (markArr[i] % cycleLen !== 0) return "第1组数据异常";
					break;
				case markArr.length:
					if ((baseArr.length - markArr[i - 1] - 1) % cycleLen !== 0) return "最后一组数据异常";
					break;
				default:
					if ((markArr[i] - markArr[i - 1] - 1) % cycleLen !== 0) return `第${i + 1}组数据异常`;
					break;
			}
		}
	}

	// 处理数据
	generate(arr: string[]) {
		// 1 分解转换成基本格式
		/**
		 * 生成基本表格顺序
		 * 订单号
		 * 商品
		 * 姓名
		 * 电话
		 * 地址
		 */
		const cleanArr = arr.filter((v) => v !== "=");
		const binaryArr = [];
		const cycleLen = Object.keys(config.分解txt表格字段).length;
		for (let i = 0; i < cleanArr.length; i += cycleLen) {
			const obj: any = {};
			cleanArr.slice(i, i + cycleLen).forEach((v, j) => {
				switch (j) {
					case 0:
						obj[config.分解txt表格字段.订单号] = v;
						break;
					case 1:
						obj[config.分解txt表格字段.商品] = v;
						break;
					case 2:
						obj[config.分解txt表格字段.姓名] = v;
						break;
					case 3:
						obj[config.分解txt表格字段.电话] = v;
						break;
					case 4:
						obj[config.分解txt表格字段.地址] = v;
						const pos = arr.findIndex((w) => w === v);
						const prepArr = arr.slice(0, pos);
						let idx = prepArr.indexOf("=");
						let count = 1;
						while (idx !== -1) {
							count++;
							idx = prepArr.indexOf("=", idx + 1);
						}
						obj.shop = count;
						break;
				}
			});
			binaryArr.push(obj);
		}

		// 2 组装成仓库需要格式
		const ver1Cover: any = [];
		const ver1Suit: any = [];
		const ver2Cover: any = [];
		const ver2Suit: any = [];
		binaryArr.forEach((v: any) => {
			const version = !v.商品.includes("升级款") ? config.组装excel表格版本[1] : config.组装excel表格版本[2];
			const sku = v.商品.includes("+软皮活页夹") ? config.组装excel表格款式.全套 : config.组装excel表格款式.书皮;
			const color = v.商品.includes("绿")
				? config.组装excel表格颜色.绿
				: v.商品.includes("粉")
				? config.组装excel表格颜色.粉
				: v.商品.includes("蓝")
				? config.组装excel表格颜色.蓝
				: "异常";
			const num = v.商品.includes("!") ? v.商品.split("!")[1] * 1 : 1;
			const price = sku === config.组装excel表格款式.全套 ? 48 : 15;
			const obj = {
				物流单号: "",
				[config.分解txt表格字段.姓名]: v.姓名,
				[config.分解txt表格字段.电话]: v.电话,
				[config.分解txt表格字段.地址]: v.地址,
				[config.组装excel表格字段.版本]: version,
				[config.组装excel表格字段.款式]: sku,
				[config.组装excel表格字段.颜色]: color,
				[config.组装excel表格字段.数量]: num,
				[config.组装excel表格字段.价格]: price,
				[config.分解txt表格字段.订单号]: v.订单号,
				[config.组装excel表格字段.店铺]: v.shop,
			};
			if (version === config.组装excel表格版本[1]) {
				if (sku === config.组装excel表格款式.全套) {
					ver1Suit.push(obj);
				} else {
					ver1Cover.push(obj);
				}
			} else {
				if (sku === config.组装excel表格款式.全套) {
					ver2Suit.push(obj);
				} else {
					ver2Cover.push(obj);
				}
			}
		});
		return [...ver1Cover, ...ver1Suit, ...ver2Cover, ...ver2Suit];
	}
}
