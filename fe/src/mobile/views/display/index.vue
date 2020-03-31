<template>
  <f7-page>
    <f7-navbar title :innerClass="$style.navbar">
      <f7-nav-left :class="$style.navbarLeft">
        <f7-checkbox v-if="selecting" :class="$style.selectAll">全选</f7-checkbox>
        <BreadCrumb v-else />
      </f7-nav-left>
      <f7-nav-title></f7-nav-title>
      <f7-nav-right v-if="selecting">
        <f7-link @click="selecting = false">取消</f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-fab position="right-bottom" slot="fixed" color="orange">
      <f7-icon ios="f7:add" md="material:add"></f7-icon>
      <f7-icon ios="f7:close" md="material:close"></f7-icon>
      <f7-fab-buttons position="top">
        <f7-fab-button label href="/settings/">设置</f7-fab-button>
        <!-- :href="`/upload/?dir=${$f7route.query.dir || '/'}`" -->
        <f7-fab-button label @click.prevent="openUpload" v-if="config.uploadable">上传</f7-fab-button>
      </f7-fab-buttons>
    </f7-fab>
    <!-- <Upload :opened="uploadOpened" @onClose="uploadOpened = false" v-if="config.uploadable" /> -->
    <ListView @onDirChange="onDirChange" @onContextMenu="onContextMenu" :selecting="selecting" />
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
    return {
      selecting: false
    };
  },
  computed: {
    ...mapState(["config"])
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
          console.log("this.$f7route.query.dir", this.$f7route.query.dir);
          this.$f7router.navigate(
            { name: "fileList", query: { dir } },
            { animate: false }
          );
        } else {
          window.open(dir);
        }
      }
    },
    onContextMenu(e) {
      this.selecting = true;
    },
    openUpload() {
      this.$f7router.navigate(
        {
          name: "upload",
          query: { dir: this.$f7route.query.dir || "/" }
        },
        {
          pushState: true
        }
      );
    }
  }
};
</script>

<style lang="less" module>
.navbar {
  padding: 0 15px;
  // 覆盖 f7 overflow: hidden; 使面包屑可滑动
  overflow-x: auto !important;
}
.selectAll {
  display: flex;
  justify-content: center;
  align-items: center;
  :global(.icon-checkbox) {
    margin-right: 1em;
  }
}
</style>