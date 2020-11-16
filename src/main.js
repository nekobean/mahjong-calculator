import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import App from "./App.vue";
import Vue from "vue";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
