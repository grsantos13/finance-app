import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import currencyFormatter from "currency-formatter";
import api from "./service/api";

Vue.prototype.$http = api;
Vue.prototype.$curr = currencyFormatter;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
