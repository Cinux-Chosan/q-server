import Vue from "vue";
import Vuex from "vuex";
import request from "@req";
import Rect from "@classes/Rect";
import debug from "@utils/debug";
import syncState, { loadStateFromLocalStorage } from "./plugins/syncState";
import watcher from "./plugins/watchers";
import { ENUM_SORT_TYPE, ENUM_SORT_ORDER } from "@utils/enums";
import { debounce } from "@utils/decorators";

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
    // 排序方式
    sortType: ENUM_SORT_TYPE.NAME,
    // 升序降序
    sortOrder: ENUM_SORT_ORDER.ASC
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
    updateSortType(state, type) {
      state.sortType = type;
    },
    updateSortOrder(state, order) {
      state.sortOrder = order;
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
    @debounce(100)
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
    filteredFiles: ({ files, searchText, sortType, sortOrder }) => {
      let filterd = files.filter(file => file.basename.includes(searchText));
      filterd.sort((prev, next) => {
        let result;
        switch (sortType) {
          // 根据名称排序
          case ENUM_SORT_TYPE.NAME:
            result = prev.basename.toLowerCase() > next.basename.toLowerCase() ? 1 : -1;
            break;
          // 根据类型排序
          case ENUM_SORT_TYPE.TYPE:
            {
              if (prev.isDir && next.isDir) {
                // 目录没有扩展名，则根据名称排序
                result = prev.basename.toLowerCase() > next.basename.toLowerCase() ? 1 : -1;
              } else if (!prev.isDir && !next.isDir) {
                result = prev.fileExt.toLowerCase() > next.fileExt.toLowerCase() ? 1 : -1;
              } else {
                result = prev.isDir ? 1 : -1;
              }
            }
            break;
          case ENUM_SORT_TYPE.CREAT_TIME:
            result = prev.stats.birthtimeMs - next.stats.birthtimeMs;
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
