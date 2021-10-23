<template>
  <div class="dora_indicators">
    <TileImage v-for="(tile, i) in 2" :key="i + 'ura1'" :tile="-1" />
    <TileButton
      @add-tile="remove_dora"
      v-for="(tile, i) in dora_indicators"
      :key="i"
      :tile="tile"
    />
    <TileImage
      v-for="(tile, i) in 5 - dora_indicators.length"
      :key="i + 'ura2'"
      :tile="-1"
    />
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
    dora_indicators: {
      type: Array,
      required: true,
    },
  },
  methods: {
    remove_dora(tile) {
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
