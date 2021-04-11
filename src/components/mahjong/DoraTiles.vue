<template>
  <div class="dora_indicators">
    <TileButton
      v-on:add-tile="remove_dora"
      v-for="(tile, i) in dora_indicators"
      :key="i"
      :tile="tile"
    />
    <TileImage
      v-for="(tile, i) in 5 - dora_indicators.length"
      :key="i + 'ura'"
      :tile="-1"
      size="sm"
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
    TileImage
  },
  props: {
    dora_indicators: {
      type: Array,
      required: true
    }
  },
  methods: {
    remove_dora(tile) {
      this.$emit("remove-dora", tile);
    }
  }
};
</script>

<style scoped>
.dora_indicators {
  display: flex;
  flex-wrap: wrap;
}
</style>
