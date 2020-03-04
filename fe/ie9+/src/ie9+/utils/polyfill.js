//简版 dataset polyfill

(() => {
  if (!HTMLElement.prototype.hasOwnProperty("dataset")) {
    const regex = /^data-(.*)$/;
    Object.defineProperty(HTMLElement.prototype, "dataset", {
      get() {
        const { attributes } = this;
        const dataset = {};
        [...attributes].forEach(attr => {
          const { name, value } = attr;
          const match = name.match(regex);
          if (match) {
            dataset[match[1]] = value;
          }
        });
        return dataset;
      }
    });
  }
})();
