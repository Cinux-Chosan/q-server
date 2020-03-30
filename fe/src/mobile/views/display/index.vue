<template>
  <f7-page @page:init="pageMounted" @page:beforein="pageBeforeIn">
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
  mounted() {
    debugger;
    this.fetchFiles(this.$f7route.query.dir || "/");
  },
  methods: {
    ...mapActions(["fetchFiles"]),
    pageMounted() {
      this.fetchFiles(this.$f7route.query.dir || "/");
    },
    pageBeforeIn() {
      this.fetchFiles(this.$f7route.query.dir || "/");
    },
    /**
     * 如果是目录则进入目录，如果是文件则新窗口打开文件
     */
    async onDirChange(file) {
      const { path: filePath, isDir } = file;
      const parent = this.$f7route.query.dir || "/";
      const dir = path.join(parent, filePath);
      if (parent !== dir) {
        if (isDir) {
          this.$f7router.navigate({
            name: "fileList",
            query: { dir }
          });
        } else {
          window.open(dir);
        }
      }
    }
  }
};
</script>