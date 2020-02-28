<template>
  <Dropdown :trigger="['contextmenu']" @visibleChange="visibleChange" v-model="showContextMenu">
    <!-- 提供鼠标右键复制地址、新窗口打开等浏览器自带功能 -->
    <a class="block" ref="link" :href="getHref()" @click.prevent draggable="false">
      <slot />
    </a>
    <Menu slot="overlay">
      <MenuItem key="open" v-if="!isBatch" @click="open">打开</MenuItem>
      <MenuItem key="batchDownload" @click="download()">{{isBatch ? '合并下载' : '下载'}}</MenuItem>
      <MenuItem key="seperateDownload" @click="download(true)" v-if="isBatch">逐个下载</MenuItem>
      <MenuItem key="toUpload" @click="goToUpload" v-if="isShowUpload">上传</MenuItem>
      <Divider v-show="false" />
      <MenuItem key="copyName" v-if="!isBatch" @click="copyName">拷贝名称</MenuItem>
      <MenuItem key="copyUrl" v-if="!isBatch" @click="copyHref">拷贝地址</MenuItem>
    </Menu>
  </Dropdown>
</template>


<script>
import path from "path";
import { download as doDownload, copyTextToClipBoard } from "@utils";
import { mapActions, mapGetters, mapState } from "vuex";
import { Dropdown, Menu } from "ant-design-vue";
const { Item: MenuItem, Divider } = Menu;

export default {
  components: {
    Dropdown,
    Menu,
    MenuItem,
    Divider
  },
  props: {
    file: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showContextMenu: false
    };
  },
  computed: {
    ...mapState(['config']),
    ...mapGetters(["selectedFiles"]),
    isBatch() {
      return this.selectedFiles.length > 1;
    },
    isShowUpload() {
      const { file, isBatch, config } = this;
      return config.uploadable && file.isDir && !isBatch;
    }
  },
  methods: {
    ...mapActions(["setSelectFiles"]),
    open() {
      this.$emit("open", this.file);
    },
    copyName() {
      copyTextToClipBoard(this.file.basename) && (this.showContextMenu = false);
    },
    copyHref() {
      // 复制到剪切板
      const url = this.$refs.link.href;
      copyTextToClipBoard(url) && (this.showContextMenu = false);
    },
    async batchDownload(downloadList, isSeperate) {
      const path = this.$route.query.dir || "/";
      if (isSeperate) {
        // 逐个下载
        downloadList.forEach(file => doDownload([file], path));
      } else {
        // 全部下载
        doDownload(downloadList, path);
      }
    },
    download(isSeperate) {
      const { batchDownload, selectedFiles, file } = this;
      const downloadList = this.isBatch ? selectedFiles : [file];
      batchDownload(downloadList, isSeperate);
      this.showContextMenu = false;
    },
    goToUpload() {
      const { file } = this;
      let dir = path.join(this.$route.query.dir, file.basename);
      this.showContextMenu = false;
      this.$nextTick(() =>
        this.$router.push({ path: "upload", query: { dir } })
      );
    },
    visibleChange(visible) {
      const { file } = this;
      if (visible && !file.selected) {
        this.setSelectFiles([true, [file]]);
      }
    },
    getHref() {
      const { file } = this;
      if (file.isDir) {
        const { query, ...rest } = this.$route;
        const { dir = "/" } = query;
        const { href } = this.$router.resolve({
          ...rest,
          query: { ...query, dir: path.join(dir, file.basename) }
        });
        return href;
      } else {
        return file.fullPath;
      }
    }
  }
};
</script>


