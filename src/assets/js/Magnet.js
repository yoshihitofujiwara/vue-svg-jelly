import Vector2 from "./Vector2";


/**
 * @class Magnet
 */
export default class Magnet {
	/**
	 * @constructor
	 * @param {number} x
	 * @param {number} y
	 * @param {object} options
	 */
	constructor(x, y, options) {
		this.origin = new Vector2(x, y);
		this.position = new Vector2(x, y);
		this.velocity = new Vector2(0, 0);

		let params = Object.assign({
			mass: 1,
			friction: 0.85,
			k: 0.25,
			maxSpeed: 20,
			range: 180,
			restLength: 0
		}, options);

		// 質量
		this.mass = params.mass;
		// 摩擦係数
		this.friction = params.friction;
		// バネの強さ
		this.k = params.k;
		// maxSpeed
		this.maxSpeed = params.maxSpeed;
		// 反応する範囲
		this.range = params.range;
		// バネの長さ
		this.restLength = params.restLength;
	}


	/**
	 * getSpringForce - バネの強さを取得
	 * @param {vector2} position
	 */
	getSpringForce(position) {
		let force = Vector2.sub(this.origin, position || this.position);
		let d = force.mag();
		let stretch = d - this.restLength;

		force.normalize();
		force.mult(this.k * stretch);

		return force;
	}


	/**
	 * distract - 逃げる動き
	 * @param {vector2} position
	 */
	distract(position) {
		position = new Vector2(position.x, position.y);
		let dist = Vector2.distance(position, this.position);
		let force = new Vector2(0, 0);

		if (dist > 0 && dist < this.range) {
			force = Vector2.sub(this.position, position);
			let m = force.magSq();
			force.normalize();
			force.mult(this.range / m * (this.range / 2));
			force.limit(this.maxSpeed);
			this.applyForce(force);
		}
	}


	/**
	 * applyForce - 加速度を追加
	 * @param {vector2} force
	 */
	applyForce(force) {
		let _force = new Vector2(force.x, force.y);
		this.velocity.add(_force);
		this.velocity.div(this.mass); // 質量
		this.velocity.mult(this.friction); // 摩擦
	}


	/**
	 * update - position更新
	 */
	update() {
		this.position.add(this.velocity);
	}


	/**
	 * jelly -
	 * @param {vector2} position
	 */
	jelly(position){
		let force = this.getSpringForce();
		this.applyForce(force);
		this.distract(position);
		this.update();
	}
}
