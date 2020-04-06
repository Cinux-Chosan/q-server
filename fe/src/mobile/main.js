// import './eruda';

// Import Vue
import Vue from "vue";

// Import Framework7
import Framework7 from "framework7/framework7.esm.bundle.js";

// Import Framework7-Vue Plugin
import Framework7Vue from "framework7-vue/framework7-vue.esm.bundle.js";

// Import Framework7 Styles
import "framework7/css/framework7.css";

// Import Icons and App Custom Styles
import "@common/styles/global.less";
import "./styles/icons.css";
import "./styles/app.less";

// Import App Component
import App from "./app.vue";
import store from "@9/store";
import { plugin as Commands } from "@m/commands";
import "@icons";
// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);
// Init @chosan-commands
Framework7.use(Commands);

// Init App
new Vue({
  el: "#app",
  render: h => h(App),
  store,
  // Register App Component
  components: {
    app: App
  }
});
