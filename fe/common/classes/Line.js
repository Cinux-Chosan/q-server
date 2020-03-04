import Point from './Point'

export default class Line {
    startPoint;
    endPoint;
    constructor(startPoint = new Point(), endPoint = new Point()) {
        this.startPoint = startPoint;
        this.endPoint = endPoint;
    }
    /**
     * 水否水平
     */
    get isVertical() {
        return this.startPoint.x === this.endPoint.x
    }
    /**
     * 是否垂直
     */
    get isHorizontal() {
        return this.startPoint.y === this.endPoint.y
    }
    /**
     * 判断线的位置是否在点之上
     * @param {Point} point 用于判断位置的点
     */
    isAboveThan(point) {
        return this.isHorizontal && this.startPoint.y < point.y
    }
    /**
     * 判断线的位置是否在点之下
     * @param {Point} point 用于判断位置的点
     */
    isBelowThan(point) {
        return this.isHorizontal && this.startPoint.y > point.y
    }
    /**
     * 判断线的位置是否在点左边
     * @param {Point} point 用于判断位置的点
     */
    isLeftThan(point) {
        return this.isVertical && this.startPoint.x < point.x
    }
    /**
     * 判断线的位置是否在点右边
     * @param {Point} point 用于判断位置的点
     */
    isRightThan(point) {
        return this.isVertical && this.startPoint.x > point.x
    }
}