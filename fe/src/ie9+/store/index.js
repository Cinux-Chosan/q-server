import Vue from "vue";
import Vuex from "vuex";
import request from "@req";
import Rect from "@classes/Rect";
import debug from "@utils/debug";
import syncState, { loadStateFromLocalStorage } from "./plugins/syncState";
import watcher from "./plugins/watchers";
import {
  ENUM_SORT_TYPE,
  ENUM_SORT_ORDER,
  ENUM_DISPLAY_TYPE,
  ENUM_DISPLAY_SIZE
} from "@9/utils/enums";
import { debounce } from "@utils/decorators";
import { setValue } from "@utils";

const log = (...args) => isDev && debug.log(...args);

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [syncState, watcher],
  state: loadStateFromLocalStorage({
    config: {},
    files: [],
    searchText: "",
    boundingClientRects: [],
    cancelSetSelect: false,
    settings: {
      // 排序方式
      sortType: ENUM_SORT_TYPE.NAME,
      // 升序降序
      sortOrder: ENUM_SORT_ORDER.ASC,
      // 排序方式
      displayType: ENUM_DISPLAY_TYPE.GRID,
      // 列表方式是否分页
      isPagination: false,
      // 列表方式图标大小
      displaySize: ENUM_DISPLAY_SIZE.SMALL,
      // 列表方式默认每页展示多少行
      listPageSize: 10
    }
  }),
  mutations: {
    updateState(state, values) {
      for (const [key, val] of Object.entries(values)) {
        log(key, val);
        setValue(state, key, val);
      }
    },
    mergeRectToFile(state, rects) {
      const { files } = state;
      files.forEach(file => {
        const domRect = rects.find(
          ({ dom }) => file.basename === dom.dataset["path"]
        );
        if (domRect) {
          const { dom } = domRect;
          Object.assign(file, { dom, domRect });
        } else {
          // 如果 domRect 不存在，则说明可能处于搜索或者分页中
          // 需要清除对应的 domRect，避免未出现在页面中却被 ReangeSelector 选中
          Object.assign(file, { dom: null, domRect: null });
        }
      });
    }
  },
  actions: {
    /**
     * 获取指定路径下的文件列表
     * @param {Store} param0 Vuex store
     * @param {String} dir 获取当前路径下的文件列表
     */
    async fetchFiles({ commit }, dir) {
      let files;
      try {
        files = (await request("/api/files", { dir })) || [];
        commit("updateState", { cancelSetSelect: false });
        files.forEach(file => (file.selected = false));
      } catch (err) {
        files = [];
      }
      commit("updateState", { files });
    },
    // 批量设置 list 中元素的 selected 字段
    /**
     *
     * @param {Store} param0 Vuex store
     * @param {Array} param1 [是否选中, 需要被选中的列表(不在列表中的将会设置相反状态), 是否通过 index 来设置（默认为 false）]
     */
    setSelectFiles(
      { getters: { filteredFiles: files }, state },
      [selected, list = [], byIndex]
    ) {
      files.forEach((file, index) => {
        if (!state.cancelSetSelect) {
          file.selected = list.includes(byIndex ? index : file)
            ? selected
            : !selected;
        }
      });
    },
    /**
     * 设置搜索字符串，并重新获取 BoundingClientRect
     * @param {Store} param0 Vuex store
     * @param {String} searchText 搜索字符串
     */
    setSearchText({ commit, dispatch }, searchText = "") {
      commit("updateState", { searchText });
      dispatch("getBoundingClientRectLimitted");
    },
    /**
     * 重新计算 BoundingClientRect
     * @param {Store} param0 Vuex store
     */
    getBoundingClientRect({ commit }) {
      Vue.nextTick(() => {
        const domList = [...document.querySelectorAll("[data-path]")];
        const fileRects = domList.map(dom => {
          const { left, top, width, height } = dom.getBoundingClientRect();
          const rect = new Rect({ left, top, width, height });
          rect.move(window.pageXOffset, window.pageYOffset);
          rect.dom = dom;
          return rect;
        });
        commit("updateState", { boundingClientRects: fileRects });
        commit("mergeRectToFile", fileRects);
      });
    },
    @debounce(400)
    getBoundingClientRectLimitted({ dispatch }) {
      dispatch("getBoundingClientRect");
    }
  },
  getters: {
    allFiles: ({ files }) => files,
    filteredFiles: ({ files, searchText, settings }) => {
      const { sortType, sortOrder } = settings;
      let filterd = files.filter(file => file.basename.includes(searchText));
      filterd.sort((prev, next) => {
        let result;
        let {
          isDir: prevIsDir,
          basename: prevBaseName,
          fileExt: prevExt,
          stats: { birthtimeMs: prevBirthTime, size: prevSize }
        } = prev;
        let {
          isDir: nextIsDir,
          basename: nextBaseName,
          fileExt: nextExt,
          stats: { birthtimeMs: nextBirthTime, size: nextSize }
        } = next;

        prevBaseName = prevBaseName.trim().toLowerCase();
        nextBaseName = nextBaseName.trim().toLowerCase();

        switch (sortType) {
          // 根据名称排序
          case ENUM_SORT_TYPE.NAME:
            result = prevBaseName > nextBaseName ? 1 : -1;
            break;
          case ENUM_SORT_TYPE.SIZE:
            {
              if (prevIsDir && nextIsDir)
                result = prevBaseName > nextBaseName ? 1 : -1;
              else if (!prevIsDir && !nextIsDir) result = prevSize - nextSize;
              else result = prevIsDir ? -1 : 1;
            }
            break;
          // 根据类型排序
          case ENUM_SORT_TYPE.TYPE:
            {
              if (prevIsDir && nextIsDir) {
                // 目录没有扩展名，则根据名称排序
                result = prevBaseName > nextBaseName ? 1 : -1;
              } else if (!prevIsDir && !nextIsDir) {
                result = prevExt > nextExt ? 1 : -1;
              } else {
                result = prevIsDir ? 1 : -1;
              }
            }
            break;
          case ENUM_SORT_TYPE.CREAT_TIME:
            result = prevBirthTime - nextBirthTime;
            break;
          default:
            break;
        }
        return result * sortOrder;
      });
      return filterd;
    },
    selectedFiles: (state, { filteredFiles }) =>
      filteredFiles.filter(file => file.selected),
    isBatch: (state, { selectedFiles }) => selectedFiles.length > 1
  }
});
