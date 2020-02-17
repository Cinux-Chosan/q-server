<template>
  <div class="home">
    <ul class="fileList">
      <li
        v-for="file in filterdFileList"
        :key="file.fullPath"
        @click="onDirChange(file.path, file.isDir)"
        class="fileItem"
      >
        <Popover
          title
          placement="topLeft"
          arrowPointAtCenter
          :mouseEnterDelay="1"
          v-if="file.path !== '..'"
        >
          <template slot="content">
            <div class="popoverContent">
              <p>文件名：{{file.basename}}</p>
              <p>创建时间：{{file.stats.birthtime | formatTime}}</p>
              <p>最后修改于：{{file.stats.mtime | formatTime}}</p>
            </div>
          </template>
          <div>
            <SvgIcon :icon-class="file | fileType" class="iconItem" />
            <p class="fileName ellipsis">{{file.basename}}</p>
          </div>
        </Popover>
        <template v-else>
          <SvgIcon :icon-class="file | fileType" class="iconItem" />
          <p class="fileName ellipsis">{{file.basename}}</p>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import { Popover } from "ant-design-vue";
import moment from "moment";
import request from "@req";
import SvgIcon from "@comp/SvgIcon";
import iconMap from "@icons/map";
import path from "path";

export default {
  name: "Home",
  data() {
    return {
      path: location.pathname,
      fileList: []
    };
  },
  components: {
    Popover,
    SvgIcon
  },
  watch: {
    "$route.query.dir": {
      immediate: true,
      async handler() {
        const fileList = await this.getFileList(this.currentPath);
        if (!this.isRoot) {
          fileList.unshift({
            path: "..",
            basename: "..",
            fullPath: "..",
            isDir: true
          });
        }
        this.$store.commit("updateFileList", fileList);
      }
    }
  },
  computed: {
    currentPath() {
      return decodeURIComponent(this.$route.query.dir || "/");
    },
    isRoot() {
      return this.currentPath === "/";
    },
    filterdFileList() {
      return this.$store.getters.filterdFileList;
    }
  },
  methods: {
    async getFileList(path) {
      const fileList = await request("/api/files", { path });
      return fileList;
    },
    /**
     * 如果是目录则进入目录，如果是文件则新窗口打开文件
     */
    onDirChange(filePath, isDir) {
      const parent = this.$route.query.dir || "/";
      const dir = path.join(parent, filePath);
      if (parent !== dir) {
        if (isDir) {
          this.$router.push({
            query: { dir }
          });
        } else {
          window.open(dir);
        }
      }
    }
  },
  filters: {
    fileType(file) {
      if (file.isDir) return "dir";
      return iconMap[file.fileExt] || "file";
    },
    formatTime(time) {
      return moment(time).format("YYYY/MM/DD HH:mm:ss");
    }
  }
};
</script>

<style lang="less">
.fileList {
  padding: 0;
}
.fileItem {
  @size: 100px;
  @hoverSize: 120px;
  width: @size;
  height: @size;
  float: left;
  overflow: hidden;
  cursor: pointer;
  margin: 5px;
  &:hover {
    .iconItem {
      font-size: 80px;
    }
  }

  .iconItem {
    transition: all ease 0.1s;
    font-size: 60px;
  }
}
</style>
