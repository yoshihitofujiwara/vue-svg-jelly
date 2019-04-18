// utils.js
// version: 0.0.6
// author: yoshihito fujiwara

const toString = Object.prototype.toString;


/**
 * ラジアンからに角度変換する積数
 * @static
 * @property RAD_TO_DEG
 * @type {number}
 */
export const RAD_TO_DEG = 180 / Math.PI;


/**
 * 角度からラジアンに変換する積数
 * @static
 * @property DEG_TO_RAD
 * @type {number}
 */
export const DEG_TO_RAD = Math.PI / 180;


/*
--------------------------------------------------------------------------*/
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


/*
--------------------------------------------------------------------------*/
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
 * 乱数の生成
 * @static
 * @param {number} min 最小値 ※省略可
 * @param {number} max 最大値 ※省略可
 * @return {number} 乱数を返します
 */
export function random(min = 0, max = 1) {
	let random = Math.random();

	if (min > max) {
		let num = min;
		min = max;
		max = num;
	}
	return random * (max - min) + min;
};


/**
 * ラジアンから角度を求める
 * @static
 * @method radToDeg
 * @param {number} rad ラジアン
 * @return {number} degree
 */
export function radToDeg(rad) {
	return rad * RAD_TO_DEG;
};


/**
 * 角度をラジアンに変換して返す
 * @static
 * @method degToRad
 * @param {number} deg 角度
 * @return {number} radian
 */
export function degToRad(deg) {
	return deg * DEG_TO_RAD;
};


/*
--------------------------------------------------------------------------*/
/**
 * オブジェクト型判定
 * @static
 * @method isObject
 * @param {object} obj 判定するオブジェクト
 * @return {boolean}
 */
export function isObject(obj) {
	return !!obj && toString.call(obj) === "[object Object]";
};


/**
 * 数値型判定
 * @static
 * @method isNumber
 * @param {object} obj 判定するオブジェクト
 * @return {boolean}
 */
export function isNumber(obj) {
	return toString.call(obj) === "[object Number]";
};
