<template>
  <div id="app">
    <Home />
  </div>
</template>

<script>
import "normalize.css";

import Home from "./components/Home.vue";

export default {
  name: "App",
  components: {
    Home
  },
  metaInfo: {
    title: "麻雀何切るシミュレーター",
    titleTemplate: "pystyle - %s"
  }
};
</script>
