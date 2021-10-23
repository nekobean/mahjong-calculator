<template>
  <div
    :class="disabled ? 'disabled' : 'enabled'"
    @click="$emit('add-block', block)"
  >
    <MeldedBlock :block="block" :seat="0" />
  </div>
</template>
 
<script>
import MeldedBlock from "./MeldedBlock.vue";

export default {
  name: "BlockButton",
  components: { MeldedBlock },
  props: {
    // ブロック
    block: {
      type: Object,
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
  transform: translateY(-4px);
}

.disabled {
  pointer-events: none;
  opacity: 0.4;
  filter: brightness(80%);
}
</style>
