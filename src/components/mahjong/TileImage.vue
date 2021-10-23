<template>
  <img :src="getSrc()" :class="getClass()" />
</template>

<script>
export default {
  name: "TileImage",
  props: {
    // 牌の種類
    tile: {
      type: Number,
      required: true,
    },
    // 牌の向き
    type: {
      type: String,
      default: "upright",
    },
  },
  methods: {
    getSrc() {
      return `./tiles/${this.tile}_small.png`;
    },

    getClass() {
      if (this.type == "rotate1") return "rotated_1st";
      else if (this.type == "rotate2") return "rotated_2nd";

      return "";
    },
  },
};
</script>

<style scoped>
/* 横向きの牌 1段目 */
.rotated_1st {
  margin-left: 16px;
  transform-origin: bottom right;
  transform: rotate(270deg) translate(100%);
}

/* 横向きの牌 2段目 */
.rotated_2nd {
  margin-left: -46px;
  transform-origin: bottom right;
  transform: rotate(270deg) translate(200%);
}
</style>
