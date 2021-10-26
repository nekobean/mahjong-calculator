<template>
  <b-container class="pt-3" id="simulator">
    <Description />
    <Calculator />
  </b-container>
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
  min-width: 700px;
  max-width: 1000px;
}
</style>
