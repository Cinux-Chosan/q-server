<template>
  <div class="home">
    <ul class="fileList clearfix">
      <li @dblclick="onDirChange({ path: '..', isDir: true})" class="fileItem" v-if="showParentDir">
        <SvgIcon icon-class="dir" class="iconItem" />
        <p class="fileName ellipsis">..</p>
      </li>
      <li
        v-for="(file, index) in filesFiltered"
        :key="file.fullPath"
        @click.stop="setSelect(file, index, $event)"
        @dblclick="onDirChange(file)"
        :class="['fileItem', file.selected ? 'selected' : '']"
      >
        <Popover title placement="topLeft" arrowPointAtCenter :mouseEnterDelay="1">
          <template #content>
            <div class="popoverContent">
              <p>文件名：{{file.basename}}</p>
              <p v-if="!file.isDir">文件大小：{{file.stats.size | bytes}}</p>
              <p>创建时间：{{file.stats.birthtime | formatTime}}</p>
              <p>最后修改于：{{file.stats.mtime | formatTime}}</p>
            </div>
          </template>
          <ContextMenu
            :file="file"
            :filesSelected="filesSelected"
            @updateSelected="updateSelected"
            @open="onDirChange"
          >
            <SvgIcon :icon-class="file | fileType" class="iconItem" />
            <p class="fileName ellipsis">{{file.basename}}</p>
          </ContextMenu>
        </Popover>
      </li>
    </ul>
    <Empty description="空空如也~" v-if="isEmpty" />
  </div>
</template>

<script>
import path from "path";
import moment from "moment";
import bytes from "bytes";
import request from "@req";
import SvgIcon from "@comp/SvgIcon";
import ContextMenu from "@comp/ContextMenu";
import iconMap from "@icons/map";
import { Popover, Empty } from "ant-design-vue";
import { isNull } from "@utils";

const originData = {
  rangeBegin: null
};

export default {
  name: "Home",
  data() {
    return {
      path: location.pathname,
      showParentDir: false,
      ...originData
    };
  },
  components: {
    Popover,
    Empty,
    SvgIcon,
    ContextMenu
  },
  mounted() {
    const { body } = document;
    const unset = () => {
      this.setMany(this.filesFiltered, false);
    };
    body.addEventListener("click", unset);
    this.$once("hook:beforeDestroy", () =>
      body.removeEventListener("click", unset)
    );
  },
  watch: {
    "$route.query.dir": {
      async handler() {
        await this.updateFileList();
        this.$store.commit("updateSearchText", "");
      }
    },
    filesFiltered() {
      this.showParentDir =
        this.$route.query.dir && this.$route.query.dir !== "/";
    }
  },
  activated() {
    this.updateFileList();
  },
  computed: {
    currentPath() {
      return decodeURIComponent(this.$route.query.dir || "/");
    },
    filesFiltered() {
      return this.$store.getters.filterdFileList;
    },
    filesSelected() {
      return this.filesFiltered.filter(({ selected }) => selected);
    },
    isEmpty() {
      return !this.filesFiltered.length;
    }
  },
  methods: {
    reset(o) {
      Object.assign(this, originData, o);
    },
    async getFileList(path) {
      let fileList = [];
      try {
        fileList = (await request("/api/files", { path })) || [];
      } catch (err) {
        this.$message.error(err.message);
      }
      return fileList;
    },
    async updateFileList() {
      try {
        const fileList = (await this.getFileList(this.currentPath)) || [];
        this.$store.commit("updateFileList", fileList);
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    /**
     * 如果是目录则进入目录，如果是文件则新窗口打开文件
     */
    onDirChange(file) {
      const { path: filePath, isDir } = file;
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
        this.reset();
      }
    },

    // 同时设置多个元素的选中状态
    setMany(list = [], selected, ...excludes) {
      const includes = list.filter(file => !excludes.includes(file));
      includes.forEach(
        file =>
          !!file.selected !== selected && this.$set(file, "selected", selected)
      );
      excludes.forEach(
        file =>
          !!file.selected === selected && this.$set(file, "selected", !selected)
      );
    },
    // 设置选中，取消选中状态
    setSelect(file, index, evt) {
      /**
       * 如果没有起始点，则设置起始点
       * 如果有起始点，则：
       * * 如果没按住 shift，则重置起始点
       * * 如果按住 shift，则不重置起始点
       */
      let { filesFiltered, rangeBegin, filesSelected } = this;
      if (isNull(rangeBegin) || !evt.shiftKey) {
        this.rangeBegin = rangeBegin = index;
      }

      // 本轮需要被选中的值
      let currentSelected = [...filesSelected];

      if (evt.metaKey || evt.ctrlKey) {
        // 设置多选状态
        if (file.selected) {
          currentSelected = currentSelected.filter(f => f !== file);
        } else {
          currentSelected.push(file);
        }
      } else if (evt.shiftKey) {
        // 设置范围多选状态
        const beginIndex = Math.min(rangeBegin, index);
        const endIndex = Math.max(rangeBegin, index);
        currentSelected = [];
        filesFiltered.forEach((file, idx) => {
          if (idx >= beginIndex && idx <= endIndex) {
            currentSelected.push(file);
          }
        });
      } else {
        if (currentSelected.length > 1) {
          // 如果当前页面已经有多个元素被选中，则取消其他元素的选中
          currentSelected = [file];
        } else {
          // 如果没有多个元素被选中，则看是否选中当前元素
          currentSelected = file.selected ? [] : [file];
        }
      }

      // 统一设置选中状态
      this.setMany(filesFiltered, false, ...currentSelected);
    },
    updateSelected(selectedList) {
      this.setMany(this.filesFiltered, false, ...selectedList);
    }
  },
  filters: {
    fileType(file) {
      if (file.isDir) return "dir";
      return iconMap[file.fileExt] || "file";
    },
    formatTime(time) {
      return moment(time).format("YYYY/MM/DD HH:mm:ss");
    },
    bytes
  }
};
</script>

<style lang="less">
.home {
  .fileList {
    padding: 0;
  }
  .fileItem {
    @size: 100px;
    @hoverSize: 120px;
    width: @size;
    height: @size;
    margin: 5px;
    padding-top: 10px;
    float: left;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    border-radius: 5px;
    &.selected,
    &:hover {
      background: rgba(13, 10, 49, 0.1);
    }

    .iconItem {
      transition: all ease 0.1s;
      font-size: 60px;
    }
    p.fileName {
      user-select: none !important;
    }
  }
}
.popoverContent {
  p:last-child {
    margin-bottom: 0;
  }
}
</style>
