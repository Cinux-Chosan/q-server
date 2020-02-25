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
import { mapActions } from "vuex";
import Point from "./Point";
import Rect from './Rect';

export default {
  data() {
    return {
      start: null,
      end: new Point(),
      isShowRect: false
    };
  },
  computed: {
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
  methods: {
    ...mapActions(["setSelectFiles"]),
    @throttle(100)
    matching() {
      if (!this.isShowRect) return;
    },
    onMouseDown(evt) {
      this.start = new Point(evt.clientX, evt.clientY);
    },
    onMouseUp() {
      this.start = null;
      this.isShowRect = false;
    },
    onMouseMove(evt) {
      const { start, end } = this;
      if (start) {
        end.setPosition(evt.clientX, evt.clientY);
        if (start.diffMin(end) > 2) {
          // 超过 2 像素 diff 才显示，防止元素影响如 router-link 之类组件的 click 事件
          this.isShowRect = true;
        }
      }
    }
  }
};
</script>

<style lang="less">
.rangeSelectorContainer {
  height: 100%;
}
.rangeSelectorBox {
  position: fixed;
  border: 1px dashed rgba(0, 0, 0, 0.4);
  background: transparent;
  height: auto;
  width: auto;
}
</style>


