<template>
  <div id="app">
		<h1>vue-svg-jelly</h1>
    <SvgJelly
      ref="svg"
			viewBox="0 0 500 500"
      image="./assets/img/img02x500.jpg"
      path="M475 250 Q 475 343 409 409 Q 343 475 250 475 Q 157 475 91 409 Q 25 343 25 250 Q 25 157 91 91 Q 157 25 250 25 Q 343 25 409 91 Q 475 157 475 250"
      :options="{	mass: 1, friction: 0.85, k: 0.25, restLength: 0, maxSpeed: 20, range: 180}"
			:scale="scale"
    />
  </div>
</template>

<script>
import SvgJelly from "./components/SvgJelly.vue";
import * as utils from "./assets/js/utils.js";
import dat from "dat.gui";

export default {
  name: "app",
  components: {
    SvgJelly
  },
	data(){
		return {
			scale: 1
		}
	},
  mounted() {
    const gui = new dat.GUI({ autoPlace: false });
    gui.domElement.style.position = "fixed";
    gui.domElement.style.top = "0";
    gui.domElement.style.right = "0";
    document.body.appendChild(gui.domElement);

		if(utils.isSD()){
			gui.close();
		}


    let params = {
      mass: 1,
      friction: 0.85,
      k: 0.25,
      restLength: 0,
      maxSpeed: 20,
      range: 180
    };

    gui.add(params, "mass", 1, 3).onChange(e => {
      this.$refs.svg.commands.forEach(elemen => {
        elemen.magnets.forEach(item => (item.mass = e));
      });
    });

    gui.add(params, "friction", 0.1, 0.9).onChange(e => {
      this.$refs.svg.commands.forEach(elemen => {
        elemen.magnets.forEach(item => (item.friction = e));
      });
    });
    gui.add(params, "k", 0.01, 3).onChange(e => {
      this.$refs.svg.commands.forEach(elemen => {
        elemen.magnets.forEach(item => (item.k = e));
      });
    });
    gui.add(params, "maxSpeed", 1, 50).onChange(e => {
      this.$refs.svg.commands.forEach(elemen => {
        elemen.magnets.forEach(item => (item.maxSpeed = e));
      });
    });
    gui.add(params, "range", 30, 300).onChange(e => {
      this.$refs.svg.commands.forEach(elemen => {
        elemen.magnets.forEach(item => (item.range = e));
      });
    });


		window.addEventListener('resize', this.handleResize)
  },

	methods: {
		resize(){
			let style =	window.getComputedStyle(this.$refs.svg.$el);
			let width = +style.width.replace("px", "");
			this.scale = width / 500;
		}
	}

};
</script>

<style>
*{
	margin: 0;
	padding: 0;
	border: none;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
h1{
	margin-bottom: 20px;
}
svg {
  width: 500px;
  height: 500px;
	background: #f9f9f9;
  cursor: pointer;
}
@media all and (max-width: 768px){
	svg {
		width: 100vw;
		/* height: 56.25vw; */
		height: 100vw;
		/* height: 100%; */
	}
}
</style>
