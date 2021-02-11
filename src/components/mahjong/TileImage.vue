<template>
  <img :src="get_src()" :class="get_classes()" />
</template>

<script>
export default {
  name: "TileImage",
  props: {
    tile: {
      type: Number,
      required: true
    },
    size: {
      type: String,
      default: "sm"
    },
    type: {
      type: String,
      default: "upright"
    }
  },
  methods: {
    get_src() {
      return this.size == "sm"
        ? `./tiles/${this.tile}_small.png`
        : `./tiles/${this.tile}.png`;
    },

    get_classes() {
      let classes = [];

      if (this.size == "sm") {
        if (this.type == "rotate1") classes.push("rotated_small");
        else if (this.type == "rotate2") classes.push("rotated2_small");
      } else {
        if (this.type == "rotate1") classes.push("rotated_large");
        else if (this.type == "rotate2") classes.push("rotated2_large");
        classes.push("large");
      }

      return classes.join(" ");
    }
  }
};
</script>

<style scoped>
.large {
  width: 40px;
}

.rotated_large {
  margin-left: 14px;
  transform-origin: bottom right;
  transform: rotate(270deg) translate(100%);
}

.rotated2_large {
  margin-left: -40px;
  transform-origin: bottom right;
  transform: rotate(270deg) translate(200%);
}

.rotated_small {
  margin-left: 16px;
  transform-origin: bottom right;
  transform: rotate(270deg) translate(100%);
}

.rotated2_small {
  margin-left: -46px;
  transform-origin: bottom right;
  transform: rotate(270deg) translate(200%);
}
</style>
