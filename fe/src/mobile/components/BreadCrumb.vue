<template>
  <f7-block class="breadCrumb">
    <a
      class="link breadCrumbItem"
      v-for="breadCrumb in breadcrumbs"
      :href="createHref(breadCrumb.path)"
      @click="forceUpdate"
      :key="breadCrumb.path"
      :force="true"
      :back="true"
      :animate="false"
      :disabled="disabled"
    >{{breadCrumb.name}}</a>
  </f7-block>
</template>

<script>
import { creatBreadCrumbs } from "@common/utils";

export default {
  props: {
    disabled: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    breadcrumbs() {
      const dir = this.$f7route.query.dir || "/";
      return creatBreadCrumbs(dir);
    }
  },
  methods: {
    createHref(dir) {
      return `${this.$f7route.path}?dir=${dir}`;
    },
    forceUpdate() {
      this.$nextTick(() => {
        // this.forceUpdate();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.breadCrumb {
  text-align: center;
  display: flex;
  .breadCrumbItem {
    &::after {
      content: "/";
      display: inline-block;
      margin: 0 6px;
    }
  }
}
</style>
