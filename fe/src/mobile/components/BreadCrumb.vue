<template>
  <f7-block class="breadCrumb">
    <a
      class="link breadCrumbItem"
      v-for="breadCrumb in breadcrumbs"
      @click="navigate(breadCrumb.path)"
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
    navigate(dir) {
      const route = this.$f7route;
      const { query } = route;
      this.$f7router.navigate({
        ...route,
        query: {
          ...query,
          dir
        }
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
