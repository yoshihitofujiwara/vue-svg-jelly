/*==========================================================================
	template
==========================================================================*/
<template>
  <svg @mousemove="mousemove" @touchmove="mousemove" @mouseout="mouseout" @touchout="mouseout" :viewBox="viewBox">
    <image :xlink:href="image" width="100%" height="100%" x="0" y="0" clip-path="url(#clipPath)"></image>
    <clipPath id="clipPath">
      <path :d="d"></path>
    </clipPath>
  </svg>
</template>


/*==========================================================================
	script
==========================================================================*/
<script>
import SvgCommand from "../assets/js/SvgCommand.js";

export default {
  name: "SvgJelly",

  /**
   * @props
   */
  props: {
    image: String,
    path: String,
		viewBox: String,
    options: {
      type: Object,
      default: () => {
        return {
          mass: 1,
          friction: 0.85,
          k: 0.25,
          maxSpeed: 20,
          range: 180,
        };
      }
    },
		scale: {
			type: Number,
			default: 1
		}
  },

  /**
   * @data
   */
  data() {
    return {
      isActive: true,
      // @private
      d: "",
      commands: [],
      mouse: {
        x: Number.MAX_VALUE,
        y: Number.MAX_VALUE
      }
    };
  },

  /**
   * @created
   */
  created() {
    this.createCommands();
    this._$update();
  },

  /**
   * @beforeDestroy
   */
  beforeDestroy() {
    this.isActive = false;
  },

  /**
   * @methods
   */
  methods: {
    createCommands(){
      let path = SvgCommand.getCommandList(this.path);
      let commands = [];

			console.log(path);

      path.forEach((item, index) => {
        let svgCommand = new SvgCommand(item, this.options);

        if (svgCommand.type.match(/H|V/)) {
          let prevSvgCommand = commands[index - 1];

          if (svgCommand.type == "H") {
            svgCommand.points = [
              {
                x: svgCommand.points[0].x,
                y: prevSvgCommand.points[prevSvgCommand.points.length - 1].y
              }
            ];
          } else {
            svgCommand.points = [
              {
                x: prevSvgCommand.points[prevSvgCommand.points.length - 1].x,
                y: svgCommand.points[0].y
              }
            ];
          }
          svgCommand.type = "L";
        }

        svgCommand.setup();
        // console.log(svgCommand);
        commands.push(svgCommand);
      });

      this.commands = commands;
    },

    mousemove(event) {
			if(event.touches){
				this.mouse.x = event.touches[0].clientX / this.scale;
				this.mouse.y = event.touches[0].clientY / this.scale;
			} else {
				this.mouse.x = event.offsetX / this.scale;
				this.mouse.y = event.offsetY / this.scale;
			}
    },

    mouseout() {
      this.mouse.x = Number.MAX_VALUE;
      this.mouse.y = Number.MAX_VALUE;
    },

    _$update() {
      let d = "";
      this.commands.forEach(item => {
        item.update(this.mouse);
        d += item.getCommand();
      });

      this.d = d;

      if (this.isActive) {
        requestAnimationFrame(this._$update.bind(this));
      }
    }
  }
};
</script>



/*==========================================================================
	style
==========================================================================*/
<style scoped>
svg{
	-webkit-tap-highlight-color: transparent;
}
</style>
