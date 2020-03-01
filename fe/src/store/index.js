import Vue from "vue";
import Vuex from "vuex";
import request from "@req";
import Rect from "@classes/Rect";
import debug from "@utils/debug";
import syncState, { loadStateFromLocalStorage } from "./plugins/syncState";
import watcher from "./plugins/watchers";
import { ENUM_SORT_TYPE, ENUM_SORT_ORDER, ENUM_DISPLAY_TYPE, ENUM_DISPLAY_SIZE } from "@utils/enums";
import { debounce } from "@utils/decorators";
import { setValue } from "../utils";
import store from "@store";

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
      displaySize: ENUM_DISPLAY_SIZE.SMALL
    }
  }),
  mutations: {
    updateFileList(state, files) {
      window.f = state.files = files;
      log("updateFileList", files);
    },
    updateSearchText(state, searchText) {
      state.searchText = searchText;
      log("updateSearchText", searchText);
    },
    updateConfig(state, config) {
      state.config = config;
      log("updateConfig", config);
    },
    updateCancelStatus(state, value) {
      state.cancelSetSelect = value;
      log("updateCancelStatus", value);
    },
    updateBoundingClientRects(state, boundingClientRects) {
      state.boundingClientRects = boundingClientRects;
      log("updateBoundingClientRects", boundingClientRects);
    },
    updateState(state, values) {
      for (const [key, val] of Object.entries(values)) {
        setValue(state, key, val);
      }
    },
    mergeRectToFile(state, rects) {
      const { files } = state;
      rects.forEach(domRect => {
        const { dom } = domRect;
        const file = files.find(file => file.basename === dom.dataset["path"]);
        file && Object.assign(file, { dom, domRect });
      });
    }
  },
  actions: {
    async fetchFiles({ commit, dispatch }, dir) {
      let files;
      try {
        files = (await request("/api/files", { dir })) || [];
        commit("updateCancelStatus", false);
        files.forEach(file => (file.selected = false));
      } catch (err) {
        files = [];
      }
      commit("updateFileList", files);
      dispatch("getBoundingClientRect");
    },
    // 设置 list 中元素的 selected 字段
    setSelectFiles({ getters: { filteredFiles: files }, state }, [selected, list = [], byIndex]) {
      files.forEach((file, index) => {
        if (!state.cancelSetSelect) {
          file.selected = list.includes(byIndex ? index : file) ? selected : !selected;
        }
      });
    },
    setSearchText({ commit, dispatch }, searchText = "") {
      commit("updateSearchText", searchText);
      dispatch("getBoundingClientRect");
    },
    @debounce(500)
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
        commit("updateBoundingClientRects", fileRects);
        commit("mergeRectToFile", fileRects);
      });
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
              if (prevIsDir && nextIsDir) result = prevBaseName > nextBaseName ? 1 : -1;
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
    selectedFiles: (state, { filteredFiles }) => filteredFiles.filter(file => file.selected)
  },
  modules: {}
});
