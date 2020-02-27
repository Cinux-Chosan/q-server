import Point from "./Point";
import Line from './Line';

// 只处理水平垂直矩形
export default class Rect {
  static isEmpty(rect) {
    const { width, height } = rect
    return width < 0 || height < 0;
  }
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
  get leftTop() {
    return new Point(this.left, this.top);
  }
  get leftBottom() {
    return new Point(this.left, this.bottom);
  }
  get rightTop() {
    return new Point(this.right, this.top);
  }
  get rightBottom() {
    return new Point(this.right, this.bottom);
  }
  get leftLine() {
    return new Line(this.leftTop, this.leftBottom);
  }
  get rightLine() {
    return new Line(this.rightTop, this.rightBottom);
  }
  get topLine() {
    return new Line(this.leftTop, this.rightTop);
  }
  get bottomLine() {
    return new Line(this.leftBottom, this.rightBottom);
  }
  /**
   * 转换成 css 样式
   */
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
  /**
   * 移动矩形的位置
   * @param {Number} xDistance 需要移动的水平距离
   * @param {Number} yDistance 需要移动的垂直距离
   */
  move(xDistance = 0, yDistance = 0) {
    this.left += xDistance;
    this.top += yDistance;
    return this;
  }
  /**
   * 判断一个点是否在当前矩形内
   * @param {Point} point 一个点
   */
  isPointIn({ x, y }) {
    const { left, right, top, bottom } = this;
    return x >= left && x <= right && y >= top && y <= bottom;
  }
  /**
   * 判断另一个矩形是否在当前矩形内
   * @param {Rect} rect 另一个矩形
   */
  isRectIn(rect) {
    const { leftTop, rightBottom } = rect
    return this.isPointIn(leftTop) && this.isPointIn(rightBottom);
  }
  /**
   * 判断该线是否穿过了当前矩形
   * @param {Line} line 一条线
   */
  isLineCross(line) {
    if (line.isHorizontal) {
      // 水平情况：线在矩形上边顶点之下 && 在下边顶点之上即算穿过了该矩形
      return line.isBelowThan(this.leftTop) && line.isAboveThan(this.leftBottom);
    } else if (line.isVertical) {
      // 垂直的情况：线在矩形左边顶点右侧 && 线在右边顶点左侧即算穿过了该举行
      return line.isRightThan(this.leftTop) && line.isLeftThan(this.rightTop);
    }
  }
  /**
   * 获取当前矩形与另一个矩形的交集
   * @param {Rect} rect 另一个矩形
   */
  getIntersectionRect(rect) {
    const { left, right, top, bottom } = rect
    const maxLeft = Math.max(this.left, left)
    const maxTop = Math.max(this.top, top)
    const minRight = Math.min(this.right, right)
    const minBottom = Math.min(this.bottom, bottom)
    const width = minRight - maxLeft
    const height = minBottom - maxTop
    return new Rect({ left: maxLeft, top: maxTop, width, height })
  }
  /**
   * 判断当前矩形与另一个矩形是否有交集
   * @param {Rect}} rect 另一个矩形
   */
  hasIntersectionWith(rect) {
    const intersecction = this.getIntersectionRect(rect)
    return !Rect.isEmpty(intersecction);
  }
}
