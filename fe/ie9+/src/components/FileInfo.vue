<template>
  <div @mousemove="onMouseMove">
    <slot />
    <div v-if="visible" ref="fileInfoContainer" class="fileInfoContainer">
      <Card>
        <p>文件名：{{file.basename}}</p>
        <p v-if="!file.isDir">文件大小：{{file.stats.size | bytes}}</p>
        <p>创建时间：{{file.stats.birthtime | formatTime}}</p>
        <p>最后修改于：{{file.stats.mtime | formatTime}}</p>
      </Card>
    </div>
  </div>
</template>


<script>
import bytes from "bytes";
import { alignPoint } from "dom-align";
import { Card } from "ant-design-vue";
import { mapGetters } from "vuex";
import debug from "@utils/debug";
import Point from "@classes/Point";
import { getPointerOn, formatTime } from "@utils";

const alignConfig = {
  points: [`tl`],
  overflow: {
    adjustX: true,
    adjustY: true
  },
  offset: [10, 20],
  useCssLeft: true
};

export default {
  components: {
    Card
  },
  props: {
    delay: { type: Number, default: 2000 }
  },
  data() {
    return {
      movingEvt: null,
      isShow: false,
      popOverClientRect: null,
      pointer: null,
      timeoutId: null
    };
  },
  computed: {
    ...mapGetters(["selectedFiles", "filteredFiles", "isBatch"]),
    visible() {
      const { movingEvt: evt, pointerOn, isBatch, isShow } = this;
      return isShow && !isBatch && evt && pointerOn;
    },
    file() {
      return this.pointerOn || { stats: {} };
    },
    pointerOn() {
      const { movingEvt: evt, filteredFiles } = this;
      if (!evt) return;
      const pointer = new Point(evt.pageX, evt.pageY);
      return getPointerOn(pointer, filteredFiles);
    }
  },
  watch: {
    visible(val) {
      const { $refs, $nextTick, movingEvt: evt } = this;
      if (val) {
        $nextTick(() => {
          const { fileInfoContainer } = $refs;
          fileInfoContainer && alignPoint(fileInfoContainer, evt, alignConfig);
        });
      }
    },
    pointerOn(newVal, oldVal) {
      const { timeoutId, delay } = this;
      if (newVal !== oldVal) {
        clearTimeout(timeoutId);
        this.isShow = false;
        this.timeoutId = null;
        isDev && debug.log("pointerOn changed, newVal !== oldVal");
      }
      if (newVal && !timeoutId) {
        this.timeoutId = setTimeout(() => {
          this.isShow = true;
          isDev && debug.log("set isShow = true");
        }, delay);
        isDev && debug.log("pointerOn changed, setTimeout");
      }
    }
  },
  methods: {
    onMouseMove(evt) {
      this.movingEvt = evt;
    }
  },
  filters: {
    bytes,
    formatTime
  }
};
</script>

<style scoped>
.fileInfoContainer {
  min-width: 100px;
  min-height: 100px;
  background: #fff;
  display: inline-block;
  text-align: left;
  position: absolute;
}
</style>