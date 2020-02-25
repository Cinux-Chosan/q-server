export const debounce = time => {
  return (obj, name, desc) => {
    let timer = null;
    const { value: fn } = desc;
    return {
      ...desc,
      value: function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), time);
      }
    };
  };
};


export const throttle = interval => {
  return (obj, name, desc) => {
    let startTime = Date.now();
    const { value: fn } = desc;
    return {
      ...desc,
      value: function (...args) {
        const now = Date.now()
        if (now - startTime >= interval) {
          fn.apply(this, args)
          startTime = now
        }
      }
    };
  };
};
