import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    config: {},
    fileList: [],
    searchText: ""
  },
  mutations: {
    updateFileList(state, fileList) {
      state.fileList = fileList;
    },
    updateSearchText(state, searchText) {
      state.searchText = searchText;
    },
    updateConfig(state, config) {
      state.config = config;
    }
  },
  actions: {},
  getters: {
    filterdFileList: state =>
      state.fileList.filter(file => file.basename.includes(state.searchText))
  },
  modules: {}
});
