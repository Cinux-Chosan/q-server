<template>
  <f7-page>
    <f7-navbar title="下载"></f7-navbar>
    <BreadCrumb />
    <ListView @onDirChange="onDirChange" />
  </f7-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ListView from "./list.vue";
import BreadCrumb from "@m/components/BreadCrumb.vue";
import path from "path";

export default {
  components: {
    ListView,
    BreadCrumb
  },
  created() {
    this.fetchFiles("/");
  },
  methods: {
    ...mapActions(["fetchFiles"]),
    /**
     * 如果是目录则进入目录，如果是文件则新窗口打开文件
     */
    onDirChange(file) {
      const { path: filePath, isDir } = file;
      debugger
      const parent = this.$f7route.query.dir || "/";
      const dir = path.join(parent, filePath);
      if (parent !== dir) {
        if (isDir) {
          this.$f7router.navigate({
            query: { dir }
          });
        } else {
          window.open(dir);
        }
        this.reset();
      }
    }
  }
};
</script>