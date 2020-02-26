import Point from "./Point";

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
  move({ left, top }) {
    this.left += left;
    this.top += top;
    return this;
  }
  isPointIn({ x, y }) {
    const { left, right, top, bottom } = this;
    return x >= left && x <= right && y >= top && y <= bottom;
  }
  isRectIn({ left, top, right, bottom }) {
    const leftTop = new Point(left, top);
    const rightBottom = new Point(right, bottom);
    return this.isPointIn(leftTop) && this.isPointIn(rightBottom);
  }
  hasIntersectionWith({ left, top, right, bottom }) {
    const leftTop = new Point(left, top);
    const rightTop = new Point(right, top);
    const leftBottom = new Point(left, bottom);
    const rightBottom = new Point(right, bottom);
    return (
      this.isPointIn(leftTop) ||
      this.isPointIn(rightTop) ||
      this.isPointIn(leftBottom) ||
      this.isPointIn(rightBottom)
    );
  }
}
