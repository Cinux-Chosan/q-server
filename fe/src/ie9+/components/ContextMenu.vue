<template>
  <Dropdown
    overlayClassName="contextMenuDropdown"
    :trigger="['contextmenu']"
    :visible="showContextMenu"
  >
    <!-- 由于 antd 没有暴露出 contextmenu 事件的 event 对象，需要在中间做一层拦截以便获取到 event 坐标 -->
    <div class="contextMenuContainer" @contextmenu="onContextMenu">
      <slot />
    </div>
    <Menu slot="overlay" class="unselectable" v-if="showContextMenu">
      <MenuItem key="open" v-if="!isBatch" @click="open">打开</MenuItem>
      <MenuItem key="batchDownload" @click="download()">{{isBatch ? '合并下载' : '下载'}}</MenuItem>
      <MenuItem key="seperateDownload" @click="download(true)" v-if="isBatch">逐个下载</MenuItem>
      <MenuItem key="toUpload" @click="goToUpload" v-if="isShowUpload">上传</MenuItem>
      <Divider v-show="!isBatch" />
      <MenuItem key="copyName" v-if="!isBatch" @click="copyName">拷贝名称</MenuItem>
      <MenuItem key="copyUrl" v-if="!isBatch" @click="copyHref">拷贝地址</MenuItem>
    </Menu>
  </Dropdown>
</template>

<script>
import path from "path";
import {
  download as doDownload,
  copyTextToClipBoard,
  getPointerOn
} from "@utils";
import { mapActions, mapGetters, mapState } from "vuex";
import { Dropdown, Menu } from "ant-design-vue";
import Point from "@classes/Point";
const { Item: MenuItem, Divider } = Menu;

export default {
  components: {
    Dropdown,
    Menu,
    MenuItem,
    Divider
  },
  data() {
    return {
      showContextMenu: false
    };
  },
  computed: {
    ...mapState(["config", "boundingClientRects"]),
    ...mapGetters(["selectedFiles", "filteredFiles", "isBatch"]),
    firstSelectedFile() {
      return this.selectedFiles[0] || {};
    },
    isShowUpload() {
      const { firstSelectedFile: file, isBatch, config } = this;
      return config.uploadable && file.isDir && !isBatch;
    }
  },
  watch: {
    selectedFiles(selectedFiles) {
      if (!selectedFiles.length) this.showContextMenu = false;
    }
  },
  methods: {
    ...mapActions(["setSelectFiles"]),
    openContextMenu() {
      this.showContextMenu = true;
    },
    closeContextMenu() {
      this.showContextMenu = false;
    },
    /**
     * 打开文件或目录，同双击文件逻辑
     */
    open() {
      this.closeContextMenu();
      this.$emit("open", this.firstSelectedFile);
    },
    /**
     * 复制文件名到剪切板
     */
    copyName() {
      const { firstSelectedFile: file } = this;
      try {
        copyTextToClipBoard(file.basename);
        this.$message.success("拷贝成功!");
        this.closeContextMenu();
      } catch (error) {
        this.$message.error("拷贝失败!");
      }
    },
    /**
     * 复制文件链接到剪切板
     */
    copyHref() {
      const { firstSelectedFile: file } = this;
      const url = file.dom.querySelector("a.fileLink").href;
      try {
        copyTextToClipBoard(url);
        this.$message.success("拷贝成功!");
        this.closeContextMenu();
      } catch (error) {
        this.$message.error("拷贝失败!");
      }
    },
    /**
     * 执行下载逻辑
     */
    async batchDownload(downloadList, isSeperate) {
      const path = this.$route.query.dir || "/";
      if (isSeperate) {
        downloadList.forEach(file => doDownload([file], path)); // 逐个下载
      } else {
        doDownload(downloadList, path); // 批量下载
      }
    },
    /**
     * 执行下载逻辑
     */
    download(isSeperate) {
      this.batchDownload(this.selectedFiles, isSeperate);
      this.closeContextMenu();
    },
    /**
     * 进入对应文件夹的上传界面
     */
    goToUpload() {
      const { firstSelectedFile: file } = this;
      let dir = path.join(this.$route.query.dir, file.basename);
      this.closeContextMenu();
      this.$nextTick(() =>
        this.$router.push({ path: "upload", query: { dir } })
      );
    },
    /**
     * 响应 contextmenu 事件
     * 判断鼠标是否在某个元素上
     *   - 如果是在某个元素上
     *      - 如果已选中其他单个文件，则取消其他文件选中状态，选中当前文件，然后打开右键菜单
     *      - 如果已选中其他多个文件
     *         - 如果鼠标所在文件也在选中文件中，则认为此时为多选，直接展示右键菜单
     *         - 如果鼠标所在文件不在多选文件中，则取消其他文件的选中，直接选中当前文件并展示右键菜单
     *      - 如果没有其他文件被选中，则选中当前文件，然后打开右键菜单
     *   - 如果不是，则不显示右键菜单
     */
    onContextMenu(evt) {
      const { filteredFiles, isBatch } = this;
      const pointer = new Point(evt.pageX, evt.pageY);
      const pointerOn = getPointerOn(pointer, filteredFiles);
      if (pointerOn) {
        !isBatch && this.setSelectFiles([true, [pointerOn]]);
        this.openContextMenu();
      } else {
        this.closeContextMenu();
      }
    }
  }
};
</script>

<style lang="less">
.contextMenuDropdown {
  width: 100px !important;
  min-width: 100px !important;
}
</style>


