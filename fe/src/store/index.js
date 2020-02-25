import Vue from "vue";
import Vuex from "vuex";
import request from '@req';
import { message } from 'ant-design-vue';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    config: {},
    files: [],
    searchText: ""
  },
  mutations: {
    updateFileList(state, files) {
      state.files = files;
    },
    updateSearchText(state, searchText) {
      state.searchText = searchText;
    },
    updateConfig(state, config) {
      state.config = config;
    },
  },
  actions: {
    async fetchFiles({ commit }, path) {
      let files = [];
      try {
        files = (await request("/api/files", { path })) || [];
        files.forEach(file => file.selected = false);
      } catch (err) {
        message.error(err.message);
      }
      commit('updateFileList', files);
    },
    // 设置 list 中元素的 selected 字段
    setSelectFiles({ state: { files } }, [selected, list = [], byIndex]) {
      files.forEach((file, index) => file.selected = list.includes(byIndex ? index : file) ? selected : !selected);
    },
  },
  getters: {
    filteredFiles: ({ files, searchText }) => files.filter(file => file.basename.includes(searchText)),
    selectedFiles: (state, { filteredFiles }) => filteredFiles.filter(file => file.selected)
  },
  modules: {}
});
