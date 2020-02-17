import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { message } from 'ant-design-vue'
import './styles'
import '@icons'

Vue.config.productionTip = false;
Vue.prototype.$message = message

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
