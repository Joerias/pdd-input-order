export default class Date {
	constructor() {}
	currentDate() {
		return new Date();
	}
	output(type: number) {
		console.log(this.currentDate());
		return type;
		const year = this.currentDate().getFullYear();
		const month = this.currentDate().getMonth() + 1;
		const day = this.currentDate().getDate();
		const rst = type === 1 ? `${year}年${month}月${day}日` : `${year}/${month}/${day}`;
		return rst;
	}
}
