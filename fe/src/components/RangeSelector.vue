<template>
  <div class="rangeSelector" :style="styles" v-if="isShowRect"></div>
</template>

<script>
import { throttle } from "@utils/decorator";
import { mapActions } from "vuex";
const bodyEventer = ["MouseDown", "MouseUp", "MouseMove"];

export default {
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
    ...mapActions(["setSelectFiles"]),
    @throttle(100)
    matching() {
      if (!this.isShowRect) return;
      this.$nextTick(() => {
        const style = this.styleRectPosition;
        const items = this.$parent.$refs.filteredFiles;
        const selectedIndexs = [];
        items.forEach((item, index) => {
          const rect = item.getBoundingClientRect();
          // 判断四个角是否在框内
          // 左上角在框内
          if (rect.left > style.left && rect.left < style.left + style.width) {
            if (rect.top > style.top && rect.top < style.top + style.height) {
              selectedIndexs.push(index);
            }
          }
          // // yb上角在框内
          // if (rect.left > style.left && rect.left < style.left + style.width) {
          //   if (rect.top > style.top && rect.top < style.top + style.height) {
          //     selectedIndexs.push(index);
          //   }
          // }
        });
        if (!selectedIndexs.length) { 
          // 
         } else {

          this.setSelectFiles([true, [...new Set(selectedIndexs)], true]);
        }
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


