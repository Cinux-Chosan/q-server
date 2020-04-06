<template>
  <div class="unselectable display">
    <Spin :spinning="spinning" :delay="300">
      <FileInfo>
        <ContextMenu @open="onDirChange">
          <div :key="pageKey" class="homeDisplay">
            <transition name="homeDisplay">
              <GridStyle
                :showParentDir="showParentDir"
                :isEmpty="isEmpty"
                @setSelect="setSelect"
                @onDirChange="onDirChange"
                v-if="settings.displayType === ENUM_DISPLAY_TYPE.GRID"
              />
              <ListStyle
                :showParentDir="showParentDir"
                :isEmpty="isEmpty"
                @setSelect="setSelect"
                @onDirChange="onDirChange"
                v-else-if="settings.displayType === ENUM_DISPLAY_TYPE.LIST"
              />
            </transition>
          </div>
        </ContextMenu>
      </FileInfo>
    </Spin>
  </div>
</template>

<script>
import path from "path";
import debug from "@utils/debug";
import ContextMenu from "@9/components/ContextMenu";
import FileInfo from "@9/components/FileInfo";
import { isNull } from "@utils";
import { Spin } from "ant-design-vue";
import { ENUM_DISPLAY_TYPE } from "@9/utils/enums";
import { mapActions, mapGetters, mapState } from "vuex";
import GridStyle from "./GridStyle";
import ListStyle from "./ListStyle";

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
      ENUM_DISPLAY_TYPE,
      ...originData
    };
  },
  components: {
    Spin,
    FileInfo,
    ContextMenu,
    GridStyle,
    ListStyle
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
    ...mapState(["settings"]),
    ...mapGetters(["allFiles", "filteredFiles", "selectedFiles"]),
    currentPath() {
      return decodeURIComponent(this.$route.query.dir || "/");
    },
    isEmpty() {
      return !this.spinning && !this.filteredFiles.length;
    }
  },
  methods: {
    ...mapActions(["fetchFiles", "setSelectFiles", "getBoundingClientRectLimitted"]),
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
    }
  }
};
</script>

<style lang="less">
.display {
  padding: 10px;
}
.homeDisplay {
  &-enter {
    opacity: 0;
    transition: all ease 1s;
  }
  &-to {
    opacity: 1;
  }
}
</style>