import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/upload",
    name: "Upload",
    component: () => import(/* webpackChunkName: "upload" */ "../views/Upload")
  },
  {
    path: "*",
    name: "Home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home")
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
