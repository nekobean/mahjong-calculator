<template>
  <div class="dora_indicators">
    <template v-for="(tile, i) in Wanpai">
      <TileImage v-if="tile == -1" :key="i" :tile="tile" />
      <TileButton v-else :key="i" :tile="tile" @click-tile="removeDora" />
    </template>
  </div>
</template>

<script>
import TileButton from "./TileButton.vue";
import TileImage from "./TileImage.vue";

export default {
  name: "DoraTiles",
  components: {
    TileButton,
    TileImage,
  },
  props: {
    DoraIndicators: {
      type: Array,
      required: true,
    },
  },
  computed: {
    Wanpai: function () {
      let tiles = Array(7).fill(-1);

      for (const [i, tile] of this.DoraIndicators.entries())
        tiles[i + 2] = tile;

      return tiles;
    },
  },
  methods: {
    // ドラを削除するイベントを送出する
    removeDora(tile) {
      this.$emit("remove-dora", tile);
    },
  },
};
</script>

<style scoped>
.dora_indicators {
  display: flex;
  flex-wrap: wrap;
}
</style>
