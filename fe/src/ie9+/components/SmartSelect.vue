<template>
  <div>
    <Select @popupScroll="onPopupScroll" style="width: 200px" v-model="value" >
      <!-- 选中的元素，如果未出现在 showing 中，则为了能够还原值，设置 display: none -->
      <Option v-for="opt in showing" :key="opt.key" :value="opt.value">{{opt.key}}</Option>
    </Select>
  </div>
</template>
 
<script>
import { Select } from "ant-design-vue";
import { debounce } from "@utils/decorators";
const { Option } = Select;

let k = 0;

const source = [];
for (let index = 0; index < 10000; index++) {
  source.push({
    value: ++k,
    key: "key:" + k
  });
}
export default {
  components: {
    Select,
    Option
  },
  props: {
    limit: {
      type: Number,
      default: 200
    }
  },
  data() {
    window.xx = this;
    return {
      source,
      dropDownRef: null, // 滚动元素
      searchValue: "",
      itemHeight: 0,
      curScrollTop: 0,
      clientHeight: 0,
      showing: [], // 在页面中展示的数据
      value: 201,
      manualFlag: false
    };
  },
  mounted() {
    this.showing = this.source.slice(this.sliceFrom, this.sliceTo);
  },
  computed: {
    // 窗口起
    sliceFrom() {
      const { currentCenterIndex, limit } = this;
      const from = currentCenterIndex - Math.floor(limit / 2) || 0;
      return Math.max(from, 0);
    },
    // 窗口止
    sliceTo() {
      const { currentCenterIndex, limit } = this;
      const to = currentCenterIndex + Math.floor(limit / 2) || limit;
      return to;
    },
    // 窗口
    window() {
      const { source, sliceFrom, sliceTo } = this;
      return source.slice(sliceFrom, sliceTo);
    },
    // 展示列表中第一项位于数据源的下标位置
    firstShowingPos() {
      const { source, showing } = this;
      const [firstShowing] = showing;
      return source.findIndex(el => el && el === firstShowing);
    },
    // 处于下拉框可视区中间的数据在原数据中的下标
    currentCenterIndex() {
      const { clientHeight, curScrollTop, itemHeight, firstShowingPos } = this;
      const index = Math.floor((curScrollTop + clientHeight / 2) / itemHeight);
      return index + firstShowingPos;
    },
    filterd() {
      const { searchValue } = this;
      return this.source;
    }
  },
  methods: {
    onPopupScroll(evt) {
      // 修改 scrollTop 会触发 scroll 事件，手动修改之后不需要触发
      if (this.manualFlag) {
        this.manualFlag = false;
      } else {
        this.scrollEnd(evt);
      }
    },
    @debounce(80)
    scrollEnd(evt) {
      const { target: dropDownList } = evt;
      const { scrollTop, clientHeight } = dropDownList;
      this.dropDownRef = dropDownList;
      this.curScrollTop = scrollTop;
      this.clientHeight = clientHeight;
      this.itemHeight = dropDownList.firstChild.clientHeight;
      // 每次滚动完成之后根据最新窗口更新 showing
      this.$nextTick(this.refreshShowing);
    },
    refreshShowing() {
      const {
        itemHeight,
        dropDownRef,
        sliceFrom,
        sliceTo,
        source,
        firstShowingPos,
        currentCenterIndex
      } = this;
      const scrollTop = dropDownRef.scrollTop;
      const newShowing = source.slice(sliceFrom, sliceTo);
      let distance = sliceFrom - firstShowingPos;
      console.log(distance);
      this.manualFlag = true;
      this.showing = newShowing;
      const newScrollTop = scrollTop - distance * itemHeight;
      if (distance !== 0) {
        // 如果 distance < 0，，newScrollTop > scrollTop，不在该元素允许的滚动范围内，设置不在范围内的值将会导致无效，因此需要 nextTick
        this.$nextTick(() => (this.dropDownRef.scrollTop = newScrollTop));
      }
    }
  }
};
</script>