<template>
  <div
    :class="disabled ? 'disabled' : 'enabled'"
    v-on:click="$emit('add-tile', tile)"
  >
    <TileImage :tile="tile" :size="size" />
  </div>
</template>
 
<script>
import TileImage from "./TileImage.vue";

export default {
  name: "TileButton",
  components: { TileImage },
  props: {
    tile: {
      type: Number,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "sm",
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
