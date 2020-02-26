export default class Point {
  x;
  y;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
  setFromPoint(point) {
    Object.assign(this, point);
  }
  diff(point) {
    const { x, y } = point;
    return { x: Math.abs(this.x - x), y: Math.abs(this.y - y) };
  }
  diffMin(point) {
    const { x, y } = this.diff(point);
    return Math.min(x, y);
  }
}
