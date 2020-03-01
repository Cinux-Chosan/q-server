// 每次 filteredFiles 发生改变需要重新计算 boundingClientRect
export default store => {
  store.watch(
    ({ settings: { displayType, displaySize } }, { filteredFiles }) => ({ filteredFiles, displayType, displaySize }),
    () => store.dispatch("getBoundingClientRect")
  );
};
