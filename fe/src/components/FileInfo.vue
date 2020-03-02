<template>
  <Popover
    title
    arrowPointAtCenter
    :mouseEnterDelay="3"
    :visible="visible"
    :align="align"
  >
    <div
      @mouseover="onHover"
      @mouseleave.self="onMouseLeave"
      @mousemove="onMouseMove"
      id="popOverContainer"
    >
      <slot />
    </div>
    <template #content>
      <div class="popoverContent">
        <p>文件名：{{file.basename}}</p>
        <p v-if="!file.isDir">文件大小：{{file.stats.size | bytes}}</p>
        <p>创建时间：{{file.stats.birthtime | formatTime}}</p>
        <p>最后修改于：{{file.stats.mtime | formatTime}}</p>
      </div>
    </template>
  </Popover>
</template>


<script>
import bytes from "bytes";
import { Popover } from "ant-design-vue";
import { mapGetters } from "vuex";
import debug from "@utils/debug";
import Point from "@classes/Point";
import Rect from "@classes/Rect";
import { getPointerOn, formatTime } from "@utils";
export default {
  components: {
    Popover
  },
  data() {
    window.x = this;
    return {
      pointerOn: null,
      isShow: false,
      popOverClientRect: null,
      pointer: null
    };
  },
  computed: {
    ...mapGetters(["selectedFiles", "filteredFiles", "isBatch"]),
    visible() {
      const { pointerOn, isShow } = this;
      return !!pointerOn && isShow;
    },
    file() {
      return this.pointerOn || { stats: {} };
    },
    align() {
      const { popOverClientRect: rect, pointer } = this;
      const overflow = { adjustX: false, adjustY: false };
      // debug.event("mouseover", rect, pointer);
      if (!rect || !pointer) return { offset: [0, 0], overflow };
      const rectTop = rect.top;
      const rectXCenter = rect.left + rect.width / 2;
      const offset = [pointer.x - rectXCenter, -rectTop + pointer.y -20];
      isDev &&
        debug.event("mouseover", rectTop, pointer.y, -rectTop + pointer.y);
      return { offset, overflow };
    }
  },
  methods: {
    onMouseLeave() {
      this.isShow = this.pointerOn = null;
    },
    onMouseMove(evt) {
      const { filteredFiles } = this;
      const pointer = new Point(evt.pageX, evt.pageY);
      const pointerOn = getPointerOn(pointer, filteredFiles);
      this.pointerOn = pointerOn;
      this.pointer = pointer;
    },
    onHover(evt) {
      const popOverContainer = document.getElementById("popOverContainer");
      const {
        left,
        top,
        width,
        height
      } = popOverContainer.getBoundingClientRect();
      const rect = new Rect({ left, top, width, height });
      rect.move(window.pageXOffset, window.pageYOffset);
      this.popOverClientRect = rect;
      setTimeout(() => {
        this.isShow = true;
      }, 1000);
    },
    visibleChange() {
      debugger;
    }
  },
  filters: {
    bytes,
    formatTime
  }
};
</script>