import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";

import App from "./App.vue";
import Vue from "vue";
import VueClipboard from "vue-clipboard2";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueClipboard);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
