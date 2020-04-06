<template>
  <!-- v-autofocus="searchText" -->
  <div
    tabindex="0"
    class="rangeSelectorContainer"
    ref="rangeSelectorContainer"
    @mousedown.left="onMouseDown"
    @mouseup.left="onMouseUp"
    @mousemove="onMouseMove"
    @touchstart="onMouseDown"
    @touchmove="onMouseMove"
    @touchend="onMouseUp"
    @keydown.capture.65="selectAll"
  >
    <slot />
    <div class="rangeSelectorBox" :style="rect.css" v-if="isShowRect"></div>
    <p class="selectorTip">{{selectedFiles.length}} / {{filteredFiles.length}}</p>
  </div>
</template>

<script>
import Point from "@classes/Point";
import Rect from "@classes/Rect";
import debug from "@utils/debug";
import { throttle /* , debounce */ } from "@utils/decorators";
import { mapActions, mapGetters, mapState } from "vuex";
import { isOpkeyPressed } from "@utils";

export default {
  data() {
    return {
      start: null,
      end: new Point(),
      currentScrollTop: 0,
      isShowRect: false
    };
  },
  mounted() {
    // fix：当用户鼠标处于按下状态时，通过滚轮滚动页面不会触发 mousemove 事件
    // 因此需要通过 onscroll 来弥补滚动时的实时选中
    const { onScroll, getBoundingClientRectLimitted } = this;
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", getBoundingClientRectLimitted);
    this.$once("hook:beforeDestroy", () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", getBoundingClientRectLimitted);
    });
  },
  watch: {
    files() {
      try {
        setTimeout(() => {
          this.$refs.rangeSelectorContainer.focus();
        });
      } catch (error) {
        //
      }
    }
  },
  computed: {
    ...mapState(["files"]),
    ...mapGetters(["filteredFiles", "selectedFiles"]),
    rect() {
      if (!this.start) return;
      const {
        start: { x: startX, y: startY },
        end: { x: endX, y: endY }
      } = this;
      const left = Math.min(startX, endX);
      const top = Math.min(startY, endY);
      const width = Math.abs(startX - endX);
      const height = Math.abs(startY - endY);
      return new Rect({ left, top, width, height });
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
  methods: {
    ...mapActions(["setSelectFiles", "getBoundingClientRectLimitted"]),
    @throttle(100)
    setSelectFilesThrottled() {
      this.setSelectFiles(...arguments);
    },
    @throttle(100)
    matching() {
      if (!this.start) return;
      const { filteredFiles, rect: rangeRect } = this;
      const selectedList = [];
      filteredFiles.forEach(
        file =>
          file.domRect &&
          rangeRect.hasIntersectionWith(file.domRect) &&
          selectedList.push(file)
      );
      this.setSelectFilesThrottled([true, selectedList]);
    },
    @throttle(300, false)
    onMouseDown(evt) {
      if (isOpkeyPressed(evt)) return;
      // 重置选中状态
      this.setSelectFiles([true]);
      // 设置选中起点
      this.start = new Point(evt.pageX, evt.pageY);
      this.end = new Point(evt.pageX, evt.pageY);
      isDev && debug.event("onMouseDown", evt);
    },
    onMouseUp() {
      this.isShowRect = false;
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
    selectAll(evt) {
      if (evt.metaKey || evt.ctrlKey) {
        const { filteredFiles } = this;
        const filesInDom = filteredFiles.filter(file => file.dom);
        this.setSelectFiles([true, filesInDom]);
      }
    }
  }
};
</script>

<style lang="less">
.rangeSelectorContainer {
  height: 100%;
  position: relative;
  outline: none;
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
