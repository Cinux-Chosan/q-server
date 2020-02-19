export const debounce = time => {
  return (obj, name, desc) => {
    let timer = null;
    const { value: fn } = desc;
    return {
      ...desc,
      value: function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), time);
      }
    };
  };
};
