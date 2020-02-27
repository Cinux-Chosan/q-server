export default class Point {
  x;
  y;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  /**
   * 重置点的位置
   * @param {Number} x 新的水平位置
   * @param {Number} y 新的垂直位置
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  /**
   * 移动点的位置
   * @param {Number} xDistance 移动的水平距离
   * @param {Number} yDistance 移动的垂直距离
   */
  move(xDistance = 0, yDistance = 0) {
    this.x += xDistance;
    this.y += yDistance;
    return this;
  }
  /**
   * 计算两个点水平和垂直方向的距离
   * @param {Point} point 另一个点
   */
  diff(point) {
    const { x, y } = point;
    return { x: Math.abs(this.x - x), y: Math.abs(this.y - y) };
  }
  /**
   * 同 diff, 但只返回水平或垂直方向上较小的距离
   * @param {Point} point 另一个点
   */
  diffMin(point) {
    const { x, y } = this.diff(point);
    return Math.min(x, y);
  }
}
