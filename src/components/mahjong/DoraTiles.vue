<template>
  <div class="dora_tiles">
    <TileButton
      v-on:add-tile="remove_dora"
      v-for="(tile, i) in dora_tiles"
      :key="i"
      :tile="tile"
    />
    <TileImage
      v-for="(tile, i) in 5 - dora_tiles.length"
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
    TileImage,
  },
  props: {
    dora_tiles: {
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
.dora_tiles {
  display: flex;
  flex-wrap: wrap;
}
</style>
