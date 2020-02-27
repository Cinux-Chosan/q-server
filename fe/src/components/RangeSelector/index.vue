<template>
  <div
    class="rangeSelectorContainer"
    @mousedown.left="onMouseDown"
    @mouseup.left="onMouseUp"
    @mousemove="onMouseMove"
  >
    <slot />
    <div class="rangeSelectorBox" :style="rect.css" v-if="isShowRect"></div>
  </div>
</template>

<script>
import { throttle } from "@utils/decorator";
import { mapActions, mapGetters } from "vuex";
import Point from "./Point";
import Rect from "./Rect";

export default {
  data() {
    return {
      start: null,
      end: new Point(),
      fileRects: [],
      isShowRect: false
    };
  },
  computed: {
    ...mapGetters(["filteredFiles"]),
    rect() {
      const {
        start: { x: startX, y: startY },
        end: { x: endX, y: endY }
      } = this;
      const left = Math.min(startX, endX);
      const top = Math.min(startY, endY);
      const height = Math.abs(startY - endY);
      const width = Math.abs(startX - endX);
      return new Rect({ left, top, height, width });
    }
  },
  watch: {
    // 在数据初始化后获取每个文件 DOM 元素相对于页面的绝对位置信息
    // 从而不需要每次调用 getBoundingClientRect 降低性能
    filteredFiles() {
      this.$nextTick(() => {
        const fileDomList = [
          ...document.querySelectorAll(".fileItem:not(.parentDir)")
        ];
        this.fileRects = fileDomList.map(fileDom => {
          const { left, top, width, height } = fileDom.getBoundingClientRect();
          const rect = new Rect({ left, top, width, height });
          rect.move(window.pageXOffset, window.pageYOffset);
          return rect;
        });
      });
    }
  },
  methods: {
    ...mapActions(["setSelectFiles"]),
    @throttle(100)
    setSelectFilesThrottled() {
      this.setSelectFiles(...arguments);
    },
    @throttle(100)
    matching() {
      const { rect: rangeRect } = this;
      const adjustedRangeRect = new Rect(rangeRect).move(
        window.pageXOffset,
        window.pageYOffset
      );
      const selectedIndex = [];
      this.fileRects.forEach((rect, index) => {
        adjustedRangeRect.hasIntersectionWith(rect) &&
          selectedIndex.push(index);
      });
      this.setSelectFilesThrottled([true, selectedIndex, true]);
    },
    onMouseDown(evt) {
      // 重置选中状态
      this.setSelectFiles([true]);
      // 设置选中起点

      this.start = new Point(evt.pageX, evt.pageY);
    },
    onMouseUp() {
      this.start = null;
      this.isShowRect = false;
    },
    onMouseMove(evt) {
      const { start, end } = this;
      if (start) {
        end.setPosition(evt.pageX, evt.pageY);
        if (start.diffMin(end) > 2) {
          // 超过 2 像素 diff 才显示，防止元素影响如 router-link 之类组件的 click 事件
          this.isShowRect = true;
          this.matching();
        }
      }
    }
  }
};
</script>

<style lang="less">
.rangeSelectorContainer {
  height: 100%;
  position: relative;
}
.rangeSelectorBox {
  position: absolute;
  border: 1px dashed rgba(0, 0, 0, 0.4);
  background: transparent;
  height: auto;
  width: auto;
}
</style>


