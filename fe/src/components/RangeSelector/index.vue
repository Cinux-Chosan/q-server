<template>
  <div
    class="rangeSelectorContainer"
    @mousedown.left="onMouseDown"
    @mouseup.left="onMouseUp"
    @mousemove="onMouseMove"
  >
    <slot />
    <div class="rangeSelectorBox" :style="rect.css" v-if="isShowRect"></div>
    <p class="selectorTip" v-if="selectedCounts">{{selectedCounts}} / {{filteredFiles.length}}</p>
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
      currentScrollTop: 0,
      fileRects: [],
      selectedIndex: [],
      isShowRect: false
    };
  },
  mounted() {
    const { onScroll } = this;
    // fix：当用户鼠标处于按下状态时，通过滚轮滚动页面不会触发 mouseMove 事件
    // 因此需要通过 onscroll 来弥补滚动时的实时选中
    window.addEventListener("scroll", onScroll);
    this.$once("hook:beforeDestroy", () =>
      window.removeEventListener("scroll", onScroll)
    );
  },
  computed: {
    ...mapGetters(["filteredFiles", "selectedFiles"]),
    selectedCounts() {
      const { selectedIndex, selectedFiles } = this;
      return selectedIndex.length || selectedFiles.length;
    },
    rect() {
      if (!this.start) return;
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
          rect.fileDom = fileDom;
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
      if (!this.start) return;
      const { rect: rangeRect } = this;
      const selectedIndex = [];
      this.fileRects.forEach((rect, index) => {
        if (rangeRect.hasIntersectionWith(rect)) {
          selectedIndex.push(index);
          // 通过先操作 class，最后批量设置 file.selected 的方式，在文件数量巨大时，可以获得明显性能提升
          rect.fileDom.classList.add("selected");
        } else {
          rect.fileDom.classList.remove("selected");
        }
      });
      this.selectedIndex = selectedIndex;
    },
    onMouseDown(evt) {
      // 重置选中状态
      this.setSelectFiles([true]);
      // 设置选中起点
      this.start = new Point(evt.pageX, evt.pageY);
      this.selectedIndex = [];
      this.setSelectFiles([true]);
    },
    onMouseUp() {
      this.isShowRect = false;
      this.start = null;
      this.setSelectFiles([true, this.selectedIndex, true]);
    },
    onMouseMove(evt) {
      const { start, end } = this;
      if (start) {
        end.setPosition(evt.pageX, evt.pageY);
        if (start.diffMin(end) > 2) {
          // 超过 2 像素 diff 才显示，防止元素影响如 router-link 之类组件的 click 事件
          this.isShowRect = true;
          this.currentScrollTop = document.documentElement.scrollTop;
          this.matching();
        }
      }
    },
    onScroll() {
      const { start, end, currentScrollTop } = this;
      if (start) {
        end.move(0, document.documentElement.scrollTop - currentScrollTop);
        this.currentScrollTop = document.documentElement.scrollTop;
        this.matching();
      }
    }
  }
};
</script>

<style lang="less">
.rangeSelectorContainer {
  height: 100%;
  position: relative;
  .selectorTip {
    position: fixed;
    right: 10px;
    bottom: 30px;
  }
}
.rangeSelectorBox {
  position: absolute;
  border: 1px dashed rgba(0, 0, 0, 0.4);
  background: transparent;
  height: auto;
  width: auto;
}
</style>


