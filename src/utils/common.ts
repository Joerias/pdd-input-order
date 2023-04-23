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
		const rst = type ? `${year}${type}${month}${type}${day}` : `${year}年${month}月${day}日`;
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

export class ParseDocument {
	#fileHandle: any;
	#generateData: any;

	// 导入.txt
	/**
	 * 订单号
	 * 商品信息（分解为：版本、款式、颜色、数量、价格）
	 * 买家姓名
	 * 买家电话
	 * 买家地址
	 */
	async documentImport() {
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
			const validateMsg = this.#validate(spaceMarkArr, untreatedArr, Object.keys(config.分解txt表格字段).length);
			if (validateMsg) {
				ElMessage.error(`${config.errMsg.上传txt} ${validateMsg}`);
				return;
			}
			return untreatedArr;
		} catch (e) {}
	}

	/**
	 * @description 导入验证
	 * @param markArr 含分割标签的位置序列数组
	 * @param baseArr 原始数据数组
	 * @param cycleLen 一条完整信息的行长度
	 * @return string
	 */
	#validate(markArr: number[], baseArr: any, cycleLen: number) {
		if (markArr.length === 0) {
			// 仅有一个店铺的情况
			if (baseArr.length % cycleLen !== 0) return "当前数据仅为默认店铺，且录入数据条目不成对";
		} else {
			// 不止一个店铺的情况
			for (let i = 0; i <= markArr.length; i++) {
				switch (i) {
					case 0:
						if (markArr[i] % cycleLen !== 0) return "当前数据为多组店铺，其中第1组数据条目不成对";
						break;
					case markArr.length:
						if ((baseArr.length - markArr[i - 1] - 1) % cycleLen !== 0)
							return "当前数据为多组店铺，其中最后一组数据条目不成对";
						break;
					default:
						if ((markArr[i] - markArr[i - 1] - 1) % cycleLen !== 0)
							return `当前数据为多组店铺，其中第${i + 1}组数据条目不成对`;
						break;
				}
			}
		}
	}

	/**
	 * @description 处理数据生成结果
	 * @param arr 导入后生成的符合规格的数组
	 * @return void
	 */
	async generate(arr: string[]) {
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
		const ver1SuitGreen: any = [];
		const ver1SuitPink: any = [];
		const ver1SuitBlue: any = [];
		const ver2Cover: any = [];
		const ver2SuitGreen: any = [];
		const ver2SuitPink: any = [];
		const ver2SuitBlue: any = [];
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
			let premium = false;
			config.补价地区.find((v2) => {
				if (v.地址.includes(v2)) premium = true;
			});
			const price =
				(sku === config.组装excel表格款式.全套
					? config.组装excel表格价格.全套
					: config.组装excel表格价格.书皮) + (premium ? config.补价 : 0);
			const shop = config.组装excel表格店铺[v.shop];
			const obj = {
				物流单号: "",
				[config.分解txt表格字段.姓名]: v.姓名,
				[config.分解txt表格字段.电话]: v.电话,
				[config.分解txt表格字段.地址]: v.地址,
				[config.组装excel表格字段.商品]: `${version} ${sku} ${color}`,
				[config.组装excel表格字段.数量]: num,
				[config.组装excel表格字段.价格]: price,
				[config.分解txt表格字段.订单号]: v.订单号,
				[config.组装excel表格字段.店铺]: shop,
			};
			if (version === config.组装excel表格版本[1]) {
				if (sku === config.组装excel表格款式.全套) {
					switch (color) {
						case config.组装excel表格颜色.绿:
							ver1SuitGreen.push(obj);
							break;
						case config.组装excel表格颜色.粉:
							ver1SuitPink.push(obj);
							break;
						case config.组装excel表格颜色.蓝:
							ver1SuitBlue.push(obj);
							break;
					}
				} else {
					ver1Cover.push(obj);
				}
			} else {
				if (sku === config.组装excel表格款式.全套) {
					switch (color) {
						case config.组装excel表格颜色.绿:
							ver2SuitGreen.push(obj);
							break;
						case config.组装excel表格颜色.粉:
							ver2SuitPink.push(obj);
							break;
						case config.组装excel表格颜色.蓝:
							ver2SuitBlue.push(obj);
							break;
					}
				} else {
					ver2Cover.push(obj);
				}
			}
		});
		this.#generateData = {
			ver1Cover,
			ver1SuitGreen,
			ver1SuitPink,
			ver1SuitBlue,
			ver2Cover,
			ver2SuitGreen,
			ver2SuitPink,
			ver2SuitBlue,
		};
	}

	getCollectData() {
		const {
			ver1Cover,
			ver1SuitGreen,
			ver1SuitPink,
			ver1SuitBlue,
			ver2Cover,
			ver2SuitGreen,
			ver2SuitPink,
			ver2SuitBlue,
		} = this.#generateData;
		return [
			...ver1Cover,
			...ver1SuitGreen,
			...ver1SuitPink,
			...ver1SuitBlue,
			...ver2Cover,
			...ver2SuitGreen,
			...ver2SuitPink,
			...ver2SuitBlue,
		];
	}

	getShopsData() {
		const {
			ver1Cover,
			ver1SuitGreen,
			ver1SuitPink,
			ver1SuitBlue,
			ver2Cover,
			ver2SuitGreen,
			ver2SuitPink,
			ver2SuitBlue,
		} = this.#generateData;
		return {
			1: [...ver1Cover, ...ver1SuitGreen, ...ver1SuitPink, ...ver1SuitBlue],
			2: [...ver2Cover, ...ver2SuitGreen, ...ver2SuitPink, ...ver2SuitBlue],
		};
	}
}
