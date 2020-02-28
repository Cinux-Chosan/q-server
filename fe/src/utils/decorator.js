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

/**
 * 
 * @param {Number} interval 时间间隔，单位 ms
 * @param {Boolean} execLast 最后是否还需要执行一次
 */
export const throttle = (interval, execLast = true) => {
  return (obj, name, desc) => {
    let timer = null;
    let startTime = Date.now();
    const { value: fn } = desc;
    return {
      ...desc,
      value: function (...args) {
        const now = Date.now()
        if (execLast) {
          clearTimeout(timer);
          timer = setTimeout(() => fn.apply(this, args), interval)
        }
        if (now - startTime >= interval) {
          fn.apply(this, args)
          startTime = now
        }
      }
    };
  };
};
