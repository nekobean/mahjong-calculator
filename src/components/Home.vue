<template>
  <div id="simulator" class="p-3">
    <h1>麻雀何切るシミュレーター</h1>
    <Description class="mb-3" />
    <Calculator class="mb-3" />
  </div>
</template>

<script>
import Description from "./Description.vue";
import Calculator from "./Calculator.vue";

export default {
  name: "Home",
  components: {
    Description,
    Calculator,
  },
};
</script>

<style scoped>
#simulator {
  max-width: 900px;
}
</style>
