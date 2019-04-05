/*==========================================================================
	template
==========================================================================*/
// https://tyru.github.io/svg-circle-misc-algorithm/
<template>
    <svg
			viewBox="0, 0, 500, 500"
			ref="svg"
			@mousemove="mousemove"
			@mouseout="mouseout"
		>
		<a xlink:href="http://google.com" target="_blank">
			<image class="mask" xlink:href="static/assets/img/img02x500.jpg" x="0" y="0" width="500" height="500" />
		</a>
		<clipPath id="svgPath">
			<path ref="morph" :d="d" />
		</clipPath>
	</svg>
</template>


/*==========================================================================
	script
==========================================================================*/
<script>
import dat from "dat.gui";
import * as utils from "../assets/js/utils";
import * as is from "../assets/js/ink/utils/is.js";
import Magnet from "../assets/js/Magnet.js";

let isFireFox;


export default {
  name: "SvgJelly",

	/**
	 * mounted
	 */
  data() {
    return {
			d: `
				M 475 250
				Q 475 343 409 409
				Q 343 475 250 475
				Q 157 475 91 409
				Q 25 343 25 250
				Q 25 157 91 91
				Q 157 25 250 25
				Q 343 25 409 91
				Q 475 157 475 250
			`,
      magnets: [],
      mouse: {
				x: Number.MAX_VALUE,
				y: Number.MAX_VALUE
			}
    };
  },

	/**
	 * mounted
	 */
  mounted() {
		isFireFox = is.isFirefox();

    let anchor = this.d.split("Q ");
    let points = [];

    anchor.forEach((item, index) => {
      let _vals;

      if (index === 0) { // M
        _vals = item.split("M ")[1].split(" ").map(v => +v);
        if (1 == _vals.length) {
          _vals[1] = _vals[0];
        }
        points.push(_vals);

      } else { // Q|C
        _vals = item.split(" ").map(v => +v);
        for (let i = 0; i < 2; i += 1) {
          points.push([_vals[2 * i], _vals[2 * i + 1]]);
        }
      }
    });

		// [] Magnet
    this.magnets = points.map(item => new Magnet(item[0], item[1]));

		// dat.gui
		(()=>{
			const gui = new dat.GUI({ autoPlace: false });
			gui.domElement.style.position = "fixed";
			gui.domElement.style.top = "0";
			gui.domElement.style.right = "0";
			document.body.appendChild(gui.domElement);

			let params = {
				// mass: 1,
				friction: 0.85,
				k: 0.25,
				restLength: 0,
				maxSpeed: 20,
				range: 180
			};

			gui.add(params, "friction", 0.1, 0.9).onChange((e)=>{
				this.magnets.forEach(item => item.friction = e);
			});
			gui.add(params, "k", 0.01, 3).onChange((e)=>{
				this.magnets.forEach(item => item.k = e);
			});
			gui.add(params, "maxSpeed", 1, 50).onChange((e)=>{
				this.magnets.forEach(item => item.maxSpeed = e);
			});
			gui.add(params, "range", 30, 300).onChange((e)=>{
				this.magnets.forEach(item => item.range = e);
			});
		})();


    this._$update();
  },

	/**
	 * methods
	 */
  methods: {
    mousemove(event) {
			this.mouse.x = event.offsetX * 2;
			this.mouse.y = event.offsetY * 2;

			// NOTE: FFだけ座標が狂う
			if(isFireFox && event.target.tagName != "svg"){
				this.mouse.x = event.offsetX;
				this.mouse.y = event.offsetY;
			}
    },

		mouseout(){
      this.mouse.x = Number.MAX_VALUE;
      this.mouse.y = Number.MAX_VALUE;
		},

    _$update() {
			let cPoints = this.magnets.map((item, index) => {
				item.jelly(this.mouse);
				return " " + item.position.x + " " + item.position.y;
      });

			let d = "M" + cPoints[0],
			c = cPoints.slice(1),
			i = 0,
			l = c.length / 2;
			for(; i < l; i += 1){
				d += " Q " + c[i*2];
				d += " " + c[i*2+1];
			}

			this.d = d;

      requestAnimationFrame(this._$update.bind(this));
    }
  }
};
</script>



/*==========================================================================
	style
==========================================================================*/
<style scoped>
svg {
  height: 250px;
  width: 250px;
	cursor: pointer;
	background: #ccc;
}
.mask {
  clip-path: url(#svgPath);
}
image{
	display: block;
}
</style>
