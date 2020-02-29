<template>
  <div class="home unselectable">
    <Spin :spinning="spinning" :delay="300">
      <ContextMenu @open="onDirChange">
        <ul class="fileList clearfix" :key="pageKey">
          <li
            @dblclick="onDirChange({ path: '..', isDir: true})"
            class="fileItem parentDir"
            key=".."
            v-if="showParentDir"
          >
            <SvgIcon icon-class="dir" class="iconItem" />
            <p class="fileName ellipsis">..</p>
          </li>
          <li
            v-for="(file, index) in filteredFiles"
            ref="filteredFiles"
            :key="file.fullPath"
            @click.stop="setSelect(file, index, $event)"
            @dblclick="onDirChange(file)"
            :class="['fileItem', file.selected ? 'selected' : '']"
            :data-path="file.basename"
          >
            <!-- <Popover title placement="topLeft" arrowPointAtCenter :mouseEnterDelay="1">
            <template #content>
              <div class="popoverContent">
                <p>文件名：{{file.basename}}</p>
                <p v-if="!file.isDir">文件大小：{{file.stats.size | bytes}}</p>
                <p>创建时间：{{file.stats.birthtime | formatTime}}</p>
                <p>最后修改于：{{file.stats.mtime | formatTime}}</p>
              </div>
            </template>-->

            <!-- 提供鼠标右键复制地址、新窗口打开等浏览器自带功能 -->
            <a class="block" ref="link" :href="getHref(file)" @click.prevent draggable="false">
              <SvgIcon :icon-class="file | fileType" class="iconItem" />
              <p class="fileName ellipsis">{{file.basename}}</p>
            </a>
            <!-- </Popover> -->
          </li>
        </ul>
        <Empty description="空空如也~" v-if="isEmpty" />
      </ContextMenu>
    </Spin>
  </div>
</template>

<script>
import path from "path";
import moment from "moment";
import bytes from "bytes";
import SvgIcon from "@comps/SvgIcon";
import ContextMenu from "@comps/ContextMenu";
import iconMap from "@icons/map";
import { Popover, Empty, Spin } from "ant-design-vue";
import { isNull } from "@utils";
import debug from "@utils/debug";
import { mapActions, mapMutations, mapGetters } from "vuex";

const originData = {
  rangeBegin: null
};

export default {
  name: "Home",
  data() {
    return {
      path: location.pathname,
      showParentDir: false,
      spinning: false,
      pageKey: this.$route.query.dir,
      ...originData
    };
  },
  components: {
    Popover,
    Empty,
    Spin,
    SvgIcon,
    ContextMenu
  },
  watch: {
    "$route.query.dir": ["loadFiles"],
    allFiles: [
      "resetSearchText",
      function() {
        // 请求到数据结束后刷新 pageKey，避免无用的 diff 比较
        this.pageKey = this.$route.query.dir;
      }
    ],
    filteredFiles() {
      const { dir } = this.$route.query;
      this.showParentDir = dir && dir !== "/";
    }
  },
  activated() {
    this.loadFiles();
  },
  computed: {
    ...mapGetters(["allFiles", "filteredFiles", "selectedFiles"]),
    currentPath() {
      return decodeURIComponent(this.$route.query.dir || "/");
    },
    isEmpty() {
      return !this.spinning && !this.filteredFiles.length;
    }
  },
  methods: {
    ...mapActions(["fetchFiles", "setSelectFiles", "getBoundingClientRect"]),
    ...mapActions({
      resetSearchText: dispatch => dispatch("setSearchText")
    }),
    async loadFiles() {
      this.spinning = true;
      try {
        await this.fetchFiles(this.currentPath);
      } catch (error) {
        isDev && debug.error(error);
      } finally {
        this.spinning = false;
      }
    },
    reset(o) {
      Object.assign(this, originData, o);
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

    // 设置选中，取消选中状态
    setSelect(file, index, evt) {
      /**
       * 如果没有起始点，则设置起始点
       * 如果有起始点，则：
       * * 如果没按住 shift，则重置起始点
       * * 如果按住 shift，则不重置起始点
       */
      let { filteredFiles, rangeBegin, selectedFiles } = this;
      if (isNull(rangeBegin) || !evt.shiftKey) {
        this.rangeBegin = rangeBegin = index;
      }

      // 本轮需要被选中的值
      let currentSelected = [...selectedFiles];

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
        filteredFiles.forEach((file, idx) => {
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
      this.setSelectFiles([true, currentSelected]);
    },
    getHref(file) {
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
    margin: 10px;
    padding: 20px;
    border-radius: 5px;
  }
  .fileItem {
    @size: 100px;
    @hoverSize: 120px;
    width: @size;
    height: @size;
    margin: 5px;
    padding: 10px 4px;
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
