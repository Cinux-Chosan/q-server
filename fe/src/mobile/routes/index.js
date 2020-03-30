import Upload from "../views/upload/index.vue";
import Settings from "../views/settings/index.vue";
import FileList from "../views/display/index.vue";
import NotFound from "../views/404.vue";

import store from "@9/store";

const routes = [
  {
    path: "/",
    name: "fileList",
    component: FileList,
    on: {
      async pageBeforeIn(evt, page) {
        const dir = page.route.query.dir || "/";
        const preloader = page.app.preloader;
        preloader.show();
        try {
          await store.dispatch("fetchFiles", dir);
        } catch (error) {
          //
        } finally {
          preloader.hide();
        }
      }
    }
  },
  {
    path: "/upload/",
    name: "upload",
    popup: {
      component: Upload
    },
    options: {
      pushState: false,
      // animate: false
    }
  },
  {
    path: "/settings/",
    name: "settings",
    popup: {
      component: Settings
    }
  },
  {
    path: "(.*)",
    component: NotFound
  }
];

export default routes;
