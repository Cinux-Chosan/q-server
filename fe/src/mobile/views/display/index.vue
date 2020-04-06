<template>
  <f7-page>
    <f7-navbar title :innerClass="$style.navbar">
      <f7-nav-left :class="$style.navbarLeft">
        <f7-checkbox v-if="selecting" :class="$style.selectAll" @change="toggleSelectAll">全选</f7-checkbox>
        <BreadCrumb v-else />
      </f7-nav-left>
      <f7-nav-title></f7-nav-title>
      <f7-nav-right v-if="selecting">
        <f7-link @click="selecting = false">取消</f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-fab position="right-bottom" slot="fixed" color="blue">
      <template v-if="selecting">
        <div @click="isDownload">
          <f7-icon ios="f7:cloud_download_fill" md="material:cloud_download"></f7-icon>
          <f7-icon ios="f7:cloud_download_fill" md="material:cloud_download"></f7-icon>
        </div>
        <f7-fab-buttons position="top">
          <template v-if="selectedFiles.length > 1">
            <f7-fab-button label="批量下载" @click="batchDownload(false)">
              <f7-icon ios="f7:arrow_merge" md="material:call_merge"></f7-icon>
            </f7-fab-button>
            <f7-fab-button label="逐个下载" @click="batchDownload(true)">
              <f7-icon ios="f7:arrow_branch" md="material:call_split"></f7-icon>
            </f7-fab-button>
          </template>
        </f7-fab-buttons>
      </template>
      <template v-else>
        <f7-icon ios="f7:plus" md="material:add"></f7-icon>
        <f7-icon ios="f7:xmark" md="material:close"></f7-icon>
        <f7-fab-buttons position="top">
          <f7-fab-button label @click="settingsOpened = true">
            <f7-icon ios="f7:gear_alt_fill" md="material:settings"></f7-icon>
          </f7-fab-button>
          <!-- :href="`/upload/?dir=${$f7route.query.dir || '/'}`" -->
          <f7-fab-button label @click.prevent="openUpload" v-if="config.uploadable">
            <f7-icon ios="f7:cloud_upload_fill" md="material:cloud_upload"></f7-icon>
          </f7-fab-button>
        </f7-fab-buttons>
      </template>
    </f7-fab>
    <!-- <Upload :opened="uploadOpened" @onClose="uploadOpened = false" v-if="config.uploadable" /> -->
    <Settings :opened="settingsOpened" @onClose="settingsOpened = false" />
    <ListView
      @onDirChange="onDirChange"
      @onContextMenu="onContextMenu"
      @download="(file) => batchDownload(true, [file])"
      :selecting="selecting"
    />
  </f7-page>
</template>

<script>
import Settings from "../settings/index.vue";
import { mapActions, mapGetters, mapState } from "vuex";
import ListView from "./list.vue";
import BreadCrumb from "@m/components/BreadCrumb.vue";
import path from "path";
import { download as doDownload } from "@utils";

export default {
  components: {
    ListView,
    Settings,
    BreadCrumb
  },
  data() {
    return {
      selecting: false,
      settingsOpened: false
    };
  },
  computed: {
    ...mapState(["config"]),
    ...mapGetters(["selectedFiles", "filteredFiles"])
  },
  methods: {
    ...mapActions(["fetchFiles", "setSelectFiles"]),
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
            { name: "Display", query: { dir } },
            { animate: false }
          );
        } else {
          window.open(dir);
        }
      }
    },
    onContextMenu() {
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
    },
    /**
     * 执行下载逻辑
     */
    async batchDownload(isSeperate, downloadList) {
      downloadList = downloadList || this.selectedFiles || [];
      const path = this.$f7route.query.dir || "/";
      if (isSeperate) {
        downloadList.forEach(file => doDownload([file], path)); // 逐个下载
      } else {
        doDownload(downloadList, path); // 批量下载
      }
    },
    toggleSelectAll(evt) {
      this.setSelectFiles([!evt.target.checked, []]);
    },
    isDownload() {
      const { selectedFiles } = this;
      if (selectedFiles.length === 1) {
        this.batchDownload();
      }
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
    border-color: inherit !important;
  }
}
</style>