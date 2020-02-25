export default class Rect {
  top;
  left;
  width;
  height;
  get right() {
    return this.left + this.width;
  }
  get bottom() {
    return this.top + this.height;
  }
  get css() {
    const { top, left, width, height } = this;
    return {
      top: top + "px",
      left: left + "px",
      width: width + "px",
      height: height + "px"
    };
  }
  constructor(rect = { top: 0, left: 0, width: 0, height: 0 }) {
    Object.assign(this, rect);
  }
}
