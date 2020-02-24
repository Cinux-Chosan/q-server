<template>
  <div class="rangeSelector" :style="styles" v-if="isShowRect"></div>
</template>

<script>
import { debounce } from "@utils/decorator";
const bodyEventer = ["MouseDown", "MouseUp", "MouseMove"];

export default {
  props: {
    list: {
      type: Array
    }
  },
  data() {
    return {
      begin: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      isShowRect: false
    };
  },
  computed: {
    styles() {
      const { left, top, height, width } = this.styleRectPosition;
      return {
        left: left + "px",
        top: top + "px",
        height: height + "px",
        width: width + "px"
      };
    },
    styleRectPosition() {
      const {
        begin: { x: startX, y: startY },
        end: { x: endX, y: endY }
      } = this;

      const left = startX - endX > 0 ? endX : startX;
      const top = startY - endY > 0 ? endY : startY;

      const height = Math.abs(startY - endY);
      const width = Math.abs(startX - endX);

      return {
        left,
        top,
        height,
        width
      };
    }
  },

  mounted() {
    const { body } = document;
    bodyEventer.forEach(evtName => {
      body.addEventListener(evtName.toLowerCase(), this[`on${evtName}`]);
    });
    this.$once("hook:beforeDestroy", () => {
      bodyEventer.forEach(evtName => {
        body.removeEventListener(evtName.toLowerCase(), this[`on${evtName}`]);
      });
    });
  },
  methods: {
    matching() {
      // const items = document.querySelectorAll(".fileItem:not(.parentFIle)");
      if (!this.isShowRect) return;
      this.$nextTick(() => {
        const style = this.styleRectPosition;
        const items = [
          ...document.querySelectorAll(".fileItem:not(.parentFIle)")
        ];
        items.forEach(item => {
          // if (!index) {
          const rect = item.getBoundingClientRect();
          console.log(rect, style);
          if (rect.left > style.left && rect.left < style.left + style.width) {
            if (rect.top > style.top && rect.top < style.top + style.height) {
              console.log(true);
              item.className = item.className + " selected";
            }
          }
          // }
        });
      });
    },
    onMouseDown(evt) {
      const { begin } = this;
      ({ clientX: begin.x, clientY: begin.y } = evt);
      this.isShowRect = true;
    },
    onMouseUp() {
      this.isShowRect = false;
    },
    @debounce(8)
    onMouseMove(evt) {
      const { end } = this;
      ({ clientX: end.x, clientY: end.y } = evt);
      this.matching();
    }
  }
};
</script>

<style lang="less">
.rangeSelector {
  position: fixed;
  border: 1px dashed rgba(0, 0, 0, 0.4);
  background: transparent;
  height: auto;
  width: auto;
}
</style>


