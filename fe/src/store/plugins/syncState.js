import debug from "@utils/debug";

/**
 * 从 localStorage 中加载 state 初始化数据
 */
export function loadStateFromLocalStorage(state = {}) {
  return { ...state, ...JSON.parse(localStorage.getItem("state")) };
}

/**
 * 将 state 数据同步到 localStorage 中
 */
export function setStateToLocalStorage(state) {
  localStorage.setItem("state", JSON.stringify(state));
}

export default store => {
  store.watch(
    state => {
      const { sortType, sortOrder } = state;
      return { sortType, sortOrder };
    },
    newVal => {
      setStateToLocalStorage(newVal);
      isDev && debug.log("setStateToLocalStorage", newVal);
    }
  );
};
