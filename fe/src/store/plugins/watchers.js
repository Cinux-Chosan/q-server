export default store => {
  store.watch(
    (state, { filteredFiles }) => {
      return { filteredFiles };
    },
    () => {
      store.dispatch("getBoundingClientRect");
    }
  );
};
