<template>
  <Dropdown :trigger="['contextmenu']" @visibleChange="visibleChange" v-model="showContextMenu">
    <slot />
    <Menu slot="overlay">
      <MenuItem key="0" @click="download">{{isBatch ? '合并下载' : '下载'}}</MenuItem>
      <MenuItem key="1" @click="download(true)" v-if="isBatch">逐个下载</MenuItem>
      <MenuItem key="2" @click="goToUpload" v-if="$store.state.config.uploadable">上传</MenuItem>
      <Divider />
      <MenuItem key="3">拷贝名称</MenuItem>
      <MenuItem key="4">拷贝地址</MenuItem>
    </Menu>
  </Dropdown>
</template>


<script>
import request from "@req";
import path from "path";
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
    }
  },
  methods: {
    async batchDownload(fileList, isSeperate) {
      const parent = this.$route.query.dir || "/";

      const downloadList = fileList.map(item => {
        const { path, fullPath, isDir, basename } = item;
        return { path, fullPath, isDir, basename };
      });
      if (isSeperate) {
        // 逐个下载
        while (downloadList.length) {
          const file = downloadList.shift();
          if (file.isDir) {
            await request("/api/download", { downloadList: [file] }, "post");
            window.open("/api/download?isDownload");
          } else {
            const fullPath = path.join(parent, file.basename);
            window.open(fullPath);
          }
        }
      } else {
        // 通知服务器下载数量
        await request("/api/download", { downloadList }, "post");
        window.open("/api/download?isDownload");
      }
    },
    async download(isSeperate) {
      const parent = this.$route.query.dir || "/";
      const { batchDownload, filesSelected, file } = this;
      if (this.isBatch) {
        // 批量下载
        batchDownload(filesSelected, isSeperate);
      } else {
        // 单独下载
        const filePath = path.join(parent, file.basename);
        file.isDir ? batchDownload([file]) : window.open(filePath);
      }
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
    }
  }
};
</script>