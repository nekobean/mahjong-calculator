<template>
  <div
    :class="disabled ? 'disabled' : 'enabled'"
    @click="$emit('add-tile', tile)"
  >
    <TileImage :tile="tile" />
  </div>
</template>
 
<script>
import TileImage from "./TileImage.vue";

export default {
  name: "TileButton",
  components: { TileImage },
  props: {
    // 牌の種類
    tile: {
      type: Number,
      required: true,
    },
    // 無効にするかどうか
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.enabled:hover {
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
  transform: translateY(-3px);
}

.disabled {
  pointer-events: none;
  opacity: 0.4;
  filter: brightness(80%);
}
</style>
