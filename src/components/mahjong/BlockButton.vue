<template>
  <div
    :class="disabled ? 'disabled' : 'enabled'"
    v-on:click="$emit('add-block', block)"
  >
    <MeldedBlock :block="block" :seat="0" :size="size" />
  </div>
</template>
 
<script>
import MeldedBlock from "./MeldedBlock.vue";

export default {
  name: "BlockButton",
  components: { MeldedBlock },
  props: {
    block: {
      type: Object,
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
  box-shadow: 2px 4px 2px rgba(0, 0, 0, 0.5);
  transform: translateY(-4px);
}

.disabled {
  pointer-events: none;
  opacity: 0.4;
  filter: brightness(80%);
}
</style>
