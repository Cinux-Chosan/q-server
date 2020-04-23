<template>
  <div>
    <Select
      @popupScroll="onPopupScroll"
      style="width: 200px"
      v-model="value"
      v-bind="$attrs"
      v-on="$listeners"
      :open="true"
    >
      <template #dropdownRender="menus">
        <ListVNodes
          :menus="menus"
          :showTopLoading="hasTopLoading"
          :showBottomLoading="hasBottomLoading"
        />
      </template>
      <slot v-bind:options="{ showing, selectedNotInShowing }">
        <Option v-for="opt in showing" :key="opt.key" :value="opt.value">{{opt.key}}</Option>
        <!-- 选中的元素，如果未出现在 showing 中，则为了能够回写值也需要填充到 option 中，设置 display: none -->
        <Option
          v-for="opt in selectedNotInShowing"
          :key="opt.key"
          :value="opt.value"
          style="display:none"
        >{{opt.key}}</Option>
      </slot>
    </Select>
  </div>
</template>
 
<script>
import { Select, Spin } from "ant-design-vue";
import { throttle, debounce } from "@utils/decorators";
const { Option, OptGroup } = Select;

let k = 0;

const source = [];
for (let index = 0; index < 100000; index++) {
  source.push({
    value: ++k,
    key: "key:" + k
  });
}
export default {
  inheritAttrs: false,
  components: {
    Select,
    Option,
    OptGroup,
    Spin,
    ListVNodes: {
      functional: true,
      render: (h, ctx) => {
        const { props } = ctx;
        const { menus, showTopLoading, showBottomLoading } = props;
        const menuItems = menus.data.props.menuItems;
        const [firstItem] = menuItems;
        const lastItem = menuItems[menuItems.length - 1];
        if (firstItem) {
          if (showTopLoading && firstItem.key !== "topLoading") {
            // 插入 topLoading
            menuItems.unshift(<Spin key="topLoading" class="block" />);
          }
          if (showBottomLoading && lastItem.key !== "bottomLoading") {
            // 插入 bottomLoading
            menuItems.push(<Spin key="bottomLoading" class="block" />);
          }
        }
        return ctx.props.menus;
      }
    }
  },
  props: {
    limit: {
      type: Number,
      default: 500,
      desc: "设置展示条数，即窗口大小，默认500"
    },
    proxyOptions: {
      type: Boolean,
      default: true,
      desc: "是否需要自定义 proxy"
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
      value: [300],
      manualFlag: false,
      updating: false
    };
  },
  mounted() {
    this.showing = this.source.slice(this.sliceFrom, this.sliceTo);
  },
  computed: {
    selectedNotInShowing() {
      return this.showing.filter(el => el === this.value);
    },
    // 是否展示顶部 Loading
    hasTopLoading() {
      const {
        source: [firstSource],
        showing: [firstShowing]
      } = this;
      return firstSource !== firstShowing;
    },
    // 是否展示底部 Loading
    hasBottomLoading() {
      const { source, showing } = this;
      return source[source.length - 1] !== showing[showing.length - 1];
    },
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
      this.$emit("onPopupScroll", ...arguments);
      // 修改 scrollTop 会触发 scroll 事件，手动修改之后不需要触发
      if (this.manualFlag) {
        this.manualFlag = false;
      } else {
        this.scrollEnd(evt);
      }
    },
    @debounce(80)
    scrollEnd(evt) {
      this.updateFromEvt(evt);
      // 每次滚动完成之后根据最新窗口更新 showing
      this.$nextTick(this.refreshShowing);
    },
    updateFromEvt(evt) {
      const { target: dropDownList } = evt;
      const { scrollTop, clientHeight } = dropDownList;
      this.dropDownRef = dropDownList;
      this.curScrollTop = scrollTop;
      this.clientHeight = clientHeight;
      this.itemHeight = dropDownList.children[1].clientHeight;
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
      this.$nextTick(() => (this.dropDownRef.scrollTop = newScrollTop));
    }
  }
};
</script>