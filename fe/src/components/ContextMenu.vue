<template>
  <Dropdown :trigger="['contextmenu']" @visibleChange="visibleChange" v-model="showContextMenu">
    <!-- 提供鼠标右键复制地址、新窗口打开等浏览器自带功能 -->
    <a class="block" ref="link" :href="getHref()" @click.prevent>
      <slot />
    </a>
    <Menu slot="overlay">
      <MenuItem key="open" v-if="!isBatch" @click="open">打开</MenuItem>
      <MenuItem key="batchDownload" @click="download()">{{isBatch ? '合并下载' : '下载'}}</MenuItem>
      <MenuItem key="seperateDownload" @click="download(true)" v-if="isBatch">逐个下载</MenuItem>
      <MenuItem key="toUpload" @click="goToUpload" v-if="isShowDownload">上传</MenuItem>
      <Divider v-show="false" />
      <MenuItem key="copyName" v-if="!isBatch" @click="copyName">拷贝名称</MenuItem>
      <MenuItem key="copyUrl" v-if="!isBatch" @click="copyHref">拷贝地址</MenuItem>
    </Menu>
  </Dropdown>
</template>


<script>
import path from "path";
import { download as doDownload, copyTextToClipBoard } from "@utils";
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
    },
    filesSelected: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showContextMenu: false
    };
  },
  computed: {
    isBatch() {
      return this.filesSelected.length > 1;
    },
    isShowDownload() {
      const { file, isBatch } = this;
      return this.$store.state.config.uploadable && !isBatch && file.isDir;
    }
  },
  methods: {
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
      if (isSeperate) {
        // 逐个下载
        downloadList.forEach(file => doDownload([file]));
      } else {
        // 全部下载
        doDownload(downloadList);
      }
    },
    download(isSeperate) {
      const { batchDownload, filesSelected, file } = this;
      const downloadList = this.isBatch ? filesSelected : [file];
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
        this.$emit("updateSelected", [file]);
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


