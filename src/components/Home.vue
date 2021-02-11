<template>
  <div id="simulator" class="p-3">
    <Description />

    <Calculator />

    <footer class="footer">
      <p class="text-muted">
        牌画像の配布元
        <b-link href="https://casinoconcierge.cc/mahjong-images" target="_blank"
          >カジノコンシェルジュ</b-link
        >
      </p>
    </footer>
  </div>
</template>

<script>
import Description from "./Description.vue";
import Calculator from "./Calculator.vue";

export default {
  name: "Home",
  components: {
    Description,
    Calculator
  }
};
</script>

<style scoped>
#simulator {
  width: 900px;
}
</style>
