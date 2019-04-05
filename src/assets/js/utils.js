// utils.js
// version: 0.0.5
// author: yoshihito fujiwara



export const RAD2DEG = 180 / Math.PI;


/**
 * lerp - 線形補間
 *
 * @export
 * @param  {number} val 線形補間する指定の値
 * @param  {number} min   最小値
 * @param  {number} max   最大値
 * @returns {number}       線形補間した値
 */
export function lerp(val, min, max) {
	return (max - min) * val + min;
};


/**
 * distance - 距離関数
 *
 * @param  {vector2} vec2A
 * @param  {vector2} vec2B
 * @returns {number} 距離
 */
export function distance(vec2A, vec2B){
	let x =	vec2B.x - vec2A.x;
	let y = vec2B.y - vec2A.y;
	return Math.sqrt(x * x + y * y);
};


/**
 * getMouseEventAngle - マウスイベントが起こったアングルの取得
 *
 * @param {Object} event - マウスイベントデータ
 */
export function getMouseEventAngle(event) {
	let cx = event.srcElement.offsetWidth * 0.5;
	let cy = event.srcElement.offsetHeight * 0.5;
	let rad = Math.atan2(cy - event.offsetY, event.offsetX - cx);
	return rad;
}

export function getAngle(vec2A, vec2B){
	return Math.atan2(vec2A.y - vec2B.y, vec2B.x - vec2A.x);

}


/**
 * getNormalizeOffset - 正規化した座標を返す (-1 to +1)
 *
 * @param {Object} event - マウスイベントデータ
 */
export function getNormalizeOffset(event) {
	let cx = event.srcElement.offsetWidth * 0.5;
  let cy = event.srcElement.offsetHeight * 0.5;
	let y = cy - event.offsetY;
	let x = event.offsetX - cx;

	return {
    x: x / cx,
		y: y / cy
  };
}




/**
 * getDirection - 四角を対角線で分割し、マウス座標がどのエリアにあるのか返す
 *
 * @export
 * @param {rectangle} rect
 * @param {point} point
 * @returns {index, dirction}
 */
export function getDirection(rect, point) {
	let directions = ["top", "right", "bottom", "left"],
		w = rect.width,
		h = rect.height,
		x = (point.x - rect.x - (w / 2)) * (w > h ? (h / w) : 1),
		y = (point.y - rect.y - (h / 2)) * (h > w ? (w / h) : 1),
		index = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4;

	return {
		index: index,
		direction: directions[index]
	}
}


/**
 * getMouseEventDirection マウスイベントが発生した方向の取得
 *
 * @export
 * @param {Object} event - マウスイベントデータ
 * @returns {index, dirction}
 */
export function getMouseEventDirection(event) {
	let rect = {
		x: 0,
		y: 0,
		width: event.srcElement.offsetWidth,
		height: event.srcElement.offsetHeight
	};
	let point = {
		x: event.offsetX,
		y: event.offsetY
	};

	return getDirection(rect, point);
}


/**
 * createStyle - cssスタイル生成
 *
 * @export
 * @param {Object} event - マウスイベントデータ
 * @returns
 */
export function createStyle(event) {
	let dir = getMouseEventDirection(event),
		isOver = event.type === "mouseenter" || event.type === "mouseover",
		style01 = { left: 0, top: 0 },
		style02 = { left: 0, top: 0 },
		style = isOver ? style01 : style02;

	if (dir.direction === "top") {
		style.top = "-100%";
	} else if (dir.direction === "bottom") {
		style.top = "100%";
	} else if (dir.direction === "left") {
		style.left = "-100%";
	} else {
		style.left = "100%";
	}

	return {
		from: style01,
		to: style02
	};
};
