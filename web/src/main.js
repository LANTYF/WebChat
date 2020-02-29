import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import io from "socket.io-client";
import Vant from "vant";
import "vant/lib/index.css";
import store from "./store";

Vue.use(Vant);

Vue.prototype.$http = axios.create({
  baseURL: "http://127.0.0.1:3000/web/api"
});

Vue.prototype.$socket = io.connect("http://127.0.0.1:3000");

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
