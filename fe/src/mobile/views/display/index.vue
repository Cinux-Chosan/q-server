<template>
  <f7-page>
    <f7-navbar title>
      <BreadCrumb />
    </f7-navbar>

    <f7-fab position="right-bottom" slot="fixed" color="orange">
      <f7-icon ios="f7:add" md="material:add"></f7-icon>
      <f7-icon ios="f7:close" md="material:close"></f7-icon>
      <f7-fab-buttons position="top">
        <f7-fab-button label href="/settings/">设置</f7-fab-button>
        <f7-fab-button
          label
          :href="`/upload/?dir=${$f7route.query.dir || '/'}`"
          v-if="config.uploadable"
        >上传</f7-fab-button>
      </f7-fab-buttons>
    </f7-fab>
    <!-- <Upload :opened="uploadOpened" @onClose="uploadOpened = false" v-if="config.uploadable" /> -->
    <ListView @onDirChange="onDirChange" />
  </f7-page>
</template>

<script>
import Upload from "../upload/index.vue";
import Settings from "../settings/index.vue";
import { mapActions, mapGetters, mapState } from "vuex";
import ListView from "./list.vue";
import BreadCrumb from "@m/components/BreadCrumb.vue";
import path from "path";

export default {
  components: {
    ListView,
    BreadCrumb
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["config"])
  },
  methods: {
    ...mapActions(["fetchFiles"]),
    /**
     * 如果是目录则进入目录，如果是文件则新窗口打开文件
     */
    async onDirChange(file) {
      const { path: filePath, isDir } = file;
      const parent = this.$f7route.query.dir || "/";
      const dir = path.join(parent, filePath);
      if (parent !== dir) {
        if (isDir) {
          console.log("this.$f7route.query.dir", this.$f7route.query.dir);
          this.$f7router.navigate(
            { name: "fileList", query: { dir } },
            { animate: false }
          );
        } else {
          window.open(dir);
        }
      }
    }
  }
};
</script>