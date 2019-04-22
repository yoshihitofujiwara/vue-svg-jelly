import Magnet from "./Magnet";


/**
 * @class SvgCommand
 */
export default class SvgCommand {
	/**
	 * @constructor
	 */
	constructor(command, magnetOptions, scale) {
		this.type = SvgCommand.getType(command);
		this.points = this.getPoints(command);
		this.magnets = null;
		this.magnetOptions = magnetOptions;
		this.scale = scale;
	}


	setup(){
		if (this.points){
			this.magnets = this.points.map(item => {
				// console.log(this.magnetOptions)
				return new Magnet(item.x * this.scale, item.y * this.scale, this.magnetOptions);
			});
		}
	}


	update(position){
		if (this.magnets){
			this.magnets.forEach(element => {
				element.jelly(position);
			});
		}
	}


	getPoints(command) {
		let data = command.replace(this.type, "");
		data = data.replace(/,/g, " ");
		let list = data.split(/\s+/g);

		let itemList = [];
		list.forEach((item) => {
			if (item != "") {
				itemList.push(+item);
			}
		});

		if (0 == itemList.length) {
			return null

		} else if (1 == itemList.length) {
			return [{
				x: itemList[0],
				y: itemList[0]
			}];

		} else {
			let points = [];
			let i = 0, l = ~~(itemList.length / 2);
			for (; i < l; i += 1) {
				points.push({
					x: itemList[i * 2],
					y: itemList[i * 2 + 1]
				});
			}
			return points;
		}
	}


	getCommand() {
		let commnad = this.type;

		// if (commnad.match(/H|V/)){
		// 	commnad += ` ${this.points[0].x}`;
		// } else {
		this.magnets.forEach(item => {
			commnad += ` ${item.position.x} ${item.position.y}`;
			});
		// }

		return commnad;
	}


	static getType(command) {
		return command.match(/[a-zA-Z]/)[0];
	}


	/**
	 *
	 * @param {*} pathData
	 */
	static getCommandList(pathData) {
		let data = pathData.replace(/[a-zA-Z]/g, (str) => {
			return "$" + str;
		});
		return data.split("$").slice(1);
	}
}

