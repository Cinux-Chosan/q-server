export default {
  install(Vue) {
    Vue.directive("autofocus", {
      componentUpdated(el /* {  value  }*/) {
        el.focus();
      }
    });
  }
};
