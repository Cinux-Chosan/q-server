<template>
  <f7-block class="breadCrumb">
    <span class="breadCrumbItem" v-for="breadCrumb in breadcrumbs" :key="breadCrumb.path">
      <a
        class="link breadCrumbLink"
        @click="navigate(breadCrumb.path)"
        :force="true"
        :back="true"
        :animate="false"
        :disabled="disabled"
      >{{breadCrumb.name}}</a>
      <span class="sep">/</span>
    </span>
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
      if (query.dir === dir) return;
      this.$f7router.navigate({
        ...route,
        query: { ...query, dir }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.breadCrumb {
  text-align: center;
  display: flex !important;
  overflow: hidden;
  margin: 0;
  .breadCrumbItem {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .breadCrumbLink {
    margin-left: 0 !important;
    min-width: auto !important;
    padding: 0 !important;
    max-height: 100%;
  }
  .sep {
    display: inline-block;
    margin: 0 6px;
    opacity: 0.6;
  }
}
</style>
