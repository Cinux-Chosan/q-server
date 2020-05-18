import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import(/* webpackChunkName: "login" */ "../views/Login")
  },
  {
    path: "/test",
    name: "Test",
    component: () => import(/* webpackChunkName: "login" */ "../components/SmartSelect")
  },
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home"),
    children: [
      {
        path: "/upload",
        name: "Upload",
        component: () =>
          import(/* webpackChunkName: "upload" */ "../views/Upload")
      },
      {
        path: "*",
        name: "Display",
        component: () =>
          import(/* webpackChunkName: "display" */ "../views/Display")
      }
    ]
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
