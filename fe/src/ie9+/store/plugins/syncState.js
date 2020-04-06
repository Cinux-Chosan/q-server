import debug from "@utils/debug";

/**
 * 从 localStorage 中加载 state 初始化数据
 */
export function loadStateFromLocalStorage(state = {}) {
  const settings = JSON.parse(localStorage.getItem("localSettings"));
  isDev && debug.log("loadStateFromLocalStorage", settings);
  return { ...state, settings: { ...state.settings, ...settings } };
}

/**
 * 将 state 数据同步到 localStorage 中
 */
export function setStateToLocalStorage(settings) {
  localStorage.setItem("localSettings", JSON.stringify(settings));
  isDev && debug.log("setStateToLocalStorage", settings);
}

export default store =>
  store.watch(
    ({ settings }) => settings,
    newVal => setStateToLocalStorage(newVal), // 每次 settings 发生改变同步到 localStorage
    { deep: true }
  );
