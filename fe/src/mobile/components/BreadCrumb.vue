<template>
  <f7-block class="breadCrumb">
      <a class="link" v-for="breadCrumb in breadcrumbs" :href="breadCrumb.path" :key="breadCrumb.path">
          {{breadCrumb.name}}
      </a>
  </f7-block>
</template>

<script>
import { creatBreadCrumbs } from "@common/utils";

export default {
  computed: {
    breadcrumbs() {
      const dir = this.$f7route.query.dir || "/";
      return creatBreadCrumbs(dir);
    }
  }
};
</script>

<style lang="less" scoped>
.breadCrumb {
  text-align: center;
}
</style>
