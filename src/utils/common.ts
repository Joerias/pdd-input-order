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
		const pd1Cover: any = [];
		const pd1SuitGreen: any = [];
		const pd1SuitPink: any = [];
		const pd1SuitBlue: any = [];
		const pd2Cover: any = [];
		const pd2SuitGreen: any = [];
		const pd2SuitPink: any = [];
		const pd2SuitBlue: any = [];
		const pd3: any = [];
		binaryArr.forEach((v: any) => {
			// 标记产品序列
			const productType =
				v.商品.indexOf("#") !== -1
					? v.商品.substring(v.商品.indexOf("#") + 1, v.商品.indexOf("#") + 2) * 1
					: ["升级款", "高级版"].some((u) => v.商品.includes(u))
					? 2
					: 1;

			const num =
				v.商品.indexOf("!") !== -1 ? v.商品.substring(v.商品.indexOf("!") + 1, v.商品.indexOf("!") + 2) * 1 : 1;
			let premium = false;
			config.补价地区.find((u) => {
				if (v.地址.includes(u)) premium = true;
			});
			const shop = config.组装excel表格店铺[v.shop];

			let version: string, cover: string, sku: string, color: string, price: number;

			switch (productType) {
				case 1:
					version = config.组装excel表格版本.产品12[1];
					cover = config.组装excel表格封皮.产品12;
					sku = v.商品.includes("+软皮活页夹")
						? config.组装excel表格款式.产品12.全套
						: config.组装excel表格款式.产品12.书皮;
					color = v.商品.includes("绿")
						? config.组装excel表格颜色.产品12.绿
						: v.商品.includes("粉")
						? config.组装excel表格颜色.产品12.粉
						: v.商品.includes("蓝")
						? config.组装excel表格颜色.产品12.蓝
						: "异常";
					price =
						(sku === config.组装excel表格款式.产品12.全套
							? config.组装excel表格价格.产品12.全套
							: config.组装excel表格价格.产品12.书皮) +
						(premium ? config.组装excel表格价格.产品12.邮费补价 : 0);
					break;
				case 2:
					version = config.组装excel表格版本.产品12[2];
					cover = config.组装excel表格封皮.产品12;
					sku = v.商品.includes("+软皮活页夹")
						? config.组装excel表格款式.产品12.全套
						: config.组装excel表格款式.产品12.书皮;
					color = v.商品.includes("绿")
						? config.组装excel表格颜色.产品12.绿
						: v.商品.includes("粉")
						? config.组装excel表格颜色.产品12.粉
						: v.商品.includes("蓝")
						? config.组装excel表格颜色.产品12.蓝
						: "异常";
					price =
						(sku === config.组装excel表格款式.产品12.全套
							? config.组装excel表格价格.产品12.全套
							: config.组装excel表格价格.产品12.书皮) +
						(premium ? config.组装excel表格价格.产品12.邮费补价 : 0);
					break;
				case 3:
					version = config.组装excel表格版本.产品3;
					cover = v.商品.includes("凹印")
						? config.组装excel表格封皮.产品3.烫印
						: v.商品.includes("uv印")
						? config.组装excel表格封皮.产品3.白
						: v.商品.includes("无印")
						? config.组装excel表格封皮.产品3.无
						: "";
					sku = v.商品.includes("+彩页内页")
						? config.组装excel表格款式.产品3.全套
						: v.商品.includes("无内页")
						? config.组装excel表格款式.产品3.书皮
						: config.组装excel表格款式.产品3.内页;
					color = config.组装excel表格颜色.产品3;
					price =
						(sku === config.组装excel表格款式.产品3.全套
							? config.组装excel表格价格.产品3.全套
							: sku === config.组装excel表格款式.产品3.书皮
							? config.组装excel表格价格.产品3.书皮
							: config.组装excel表格价格.产品3.内页) +
						config.组装excel表格价格.产品3.邮费 +
						(premium ? config.组装excel表格价格.产品3.邮费补价 : 0);
					break;
			}

			// 组装输出单项obj
			const obj = {
				物流单号: "",
				[config.分解txt表格字段.姓名]: v.姓名,
				[config.分解txt表格字段.电话]: v.电话,
				[config.分解txt表格字段.地址]: v.地址,
				[config.组装excel表格字段.商品]: `${version} ${cover} ${sku} ${color}`,
				[config.组装excel表格字段.数量]: num,
				[config.组装excel表格字段.价格]: price,
				[config.分解txt表格字段.订单号]: v.订单号,
				[config.组装excel表格字段.店铺]: shop,
			};

			switch (productType) {
				case 1:
					if (sku === config.组装excel表格款式.产品12.全套) {
						switch (color) {
							case config.组装excel表格颜色.产品12.绿:
								pd1SuitGreen.push(obj);
								break;
							case config.组装excel表格颜色.产品12.粉:
								pd1SuitPink.push(obj);
								break;
							case config.组装excel表格颜色.产品12.蓝:
								pd1SuitBlue.push(obj);
								break;
						}
					} else {
						pd1Cover.push(obj);
					}
					break;
				case 2:
					if (sku === config.组装excel表格款式.产品12.全套) {
						switch (color) {
							case config.组装excel表格颜色.产品12.绿:
								pd2SuitGreen.push(obj);
								break;
							case config.组装excel表格颜色.产品12.粉:
								pd2SuitPink.push(obj);
								break;
							case config.组装excel表格颜色.产品12.蓝:
								pd2SuitBlue.push(obj);
								break;
						}
					} else {
						pd2Cover.push(obj);
					}
					break;
				case 3:
					pd3.push(obj);
					break;
			}
		});
		this.#generateData = {
			pd1Cover,
			pd1SuitGreen,
			pd1SuitPink,
			pd1SuitBlue,
			pd2Cover,
			pd2SuitGreen,
			pd2SuitPink,
			pd2SuitBlue,
			pd3,
		};
	}

	getCollectData() {
		const {
			pd1Cover,
			pd1SuitGreen,
			pd1SuitPink,
			pd1SuitBlue,
			pd2Cover,
			pd2SuitGreen,
			pd2SuitPink,
			pd2SuitBlue,
			pd3,
		} = this.#generateData;
		return [
			...pd1Cover,
			...pd1SuitGreen,
			...pd1SuitPink,
			...pd1SuitBlue,
			...pd2Cover,
			...pd2SuitGreen,
			...pd2SuitPink,
			...pd2SuitBlue,
			...pd3,
		];
	}

	getShopsData() {
		const {
			pd1Cover,
			pd1SuitGreen,
			pd1SuitPink,
			pd1SuitBlue,
			pd2Cover,
			pd2SuitGreen,
			pd2SuitPink,
			pd2SuitBlue,
			pd3,
		} = this.#generateData;
		return {
			1: [...pd1Cover, ...pd1SuitGreen, ...pd1SuitPink, ...pd1SuitBlue],
			2: [...pd2Cover, ...pd2SuitGreen, ...pd2SuitPink, ...pd2SuitBlue],
			3: [...pd3],
		};
	}
}
