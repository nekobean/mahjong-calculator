<template>
  <div id="simulator" class="p-3">
    <Description />
    <Calculator />
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
  width: 700px;
}
</style>
