<template>
  <Breadcrumb>
    <BreadcrumbItem v-for="(item) in breadcrumbs" :key="item.path">
      <router-link :to="{ query: { ...$route.query, dir: item.path  } }">{{item.name}}</router-link>
    </BreadcrumbItem>
  </Breadcrumb>
</template>

<script>
import { creatBreadCrumbs } from "@common/utils";
import { Breadcrumb } from "ant-design-vue";

const { Item: BreadcrumbItem } = Breadcrumb;
export default {
  components: {
    Breadcrumb,
    BreadcrumbItem
  },
  computed: {
    breadcrumbs() {
      const dir = this.$route.query.dir || "/";
      return creatBreadCrumbs(dir)
    }
  }
};
</script>

<style lang="less">
.inputSearch {
  width: 200px;
}
</style>