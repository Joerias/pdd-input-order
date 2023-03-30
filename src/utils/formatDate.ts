export default class FormatDate {
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
