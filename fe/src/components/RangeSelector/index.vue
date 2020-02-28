<template>
  <div
    tabindex="0"
    class="rangeSelectorContainer"
    @mousedown.left="onMouseDown"
    @mouseup.left="onMouseUp"
    @mousemove="onMouseMove"
    @touchstart="onMouseDown"
    @touchmove="onMouseMove"
    @touchend="onMouseUp"
    @keydown.prevent.65="onKeyDown"
  >
    <slot />
    <div class="rangeSelectorBox" :style="rect.css" v-if="isShowRect"></div>
    <p class="selectorTip" v-if="selectedCounts">{{selectedCounts}} / {{filteredFiles.length}}</p>
  </div>
</template>

<script>
import { throttle } from "@utils/decorator";
import { mapActions, mapGetters } from "vuex";
import debug from "@utils/debug";
import { isDev } from "@utils";
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
    // fix：当用户鼠标处于按下状态时，通过滚轮滚动页面不会触发 mousemove 事件
    // 因此需要通过 onscroll 来弥补滚动时的实时选中
    const { onScroll } = this;
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
    },
    /**
     * 校验是否是鼠标拖动状态：当按住鼠标左键移动距离超过 2 像素才认为用户是希望进行拖动多选
     * 从而避免 click 事件同时触发 mousedown 和 mouseup 事件，从而提升性能
     */
    isValidMoving() {
      const { start, end } = this;
      return start && start.diffMin(end) > 2;
    }
  },
  watch: {
    // 在数据初始化后获取每个文件 DOM 元素相对于页面的绝对位置信息
    // 从而不需要每次调用 getBoundingClientRect 降低性能
    filteredFiles() {
      this.selectedIndex = [];
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
    @throttle(300, false)
    onMouseDown(evt) {
      // 重置选中状态
      this.selectedIndex = [];
      this.setSelectFiles([true]);
      // 设置选中起点
      this.start = new Point(evt.pageX, evt.pageY);
      this.end = new Point(evt.pageX, evt.pageY);
      isDev && debug.event("onMouseDown", evt);
    },
    onMouseUp() {
      this.isShowRect = false;
      if (this.isValidMoving) {
        this.setSelectFilesThrottled([true, this.selectedIndex, true]);
      }
      this.start = this.end = null;
    },
    onMouseMove(evt) {
      const { start, end, isValidMoving } = this;
      if (start) {
        end.setPosition(evt.pageX, evt.pageY);
        if (isValidMoving) {
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
    },
    onKeyDown(evt) {
      if (evt.metaKey || evt.ctrlKey) {
        this.setSelectFiles([false]);
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
    user-select: none;
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


