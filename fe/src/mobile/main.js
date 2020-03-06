import Vue from "vue";
import Framework7 from "framework7";
import Framework7Vue from "framework7-vue";
// 引入 f7 样式，后期改为按需加载
import "framework7/css/framework7.bundle.css"
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;
Framework7.use(Framework7Vue);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
