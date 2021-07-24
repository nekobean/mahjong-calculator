import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue"
import App from "./App.vue"
import VueClipboard from "vue-clipboard2"
import VueMeta from "vue-meta"
import VueSocialSharing from "vue-social-sharing"
import Vue from "vue"
import VueGtag from "vue-gtag"
import VueAdsense from 'vue-adsense'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueClipboard)
Vue.use(VueMeta)
Vue.use(VueSocialSharing)
Vue.config.productionTip = false
Vue.component('adsense', VueAdsense)
Vue.use(VueGtag, {
  config: { id: "UA-125035771-2" }
})

new Vue({
  render: h => h(App)
}).$mount("#app")
