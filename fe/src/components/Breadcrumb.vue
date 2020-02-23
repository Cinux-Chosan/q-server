<template>
  <Breadcrumb>
    <BreadcrumbItem v-for="(item) in breadcrumbs" :key="item.path">
      <router-link :to="{ query: { ...$route.query, dir: item.path  } }">{{item.name}}</router-link>
    </BreadcrumbItem>
  </Breadcrumb>
</template>

<script>
import path from "path";
import { Breadcrumb } from "ant-design-vue";

const { Item: BreadcrumbItem } = Breadcrumb;
export default {
  components: {
    Breadcrumb,
    BreadcrumbItem
  },
  computed: {
    breadcrumbs() {
      const paths = this.$route.query.dir || "/";
      let parent = "/";
      const rootObj = {
        name: "~",
        path: "/"
      };
      const breadcrumbs = paths.split("/").filter(item => item);
      const breadcrumbObjs = breadcrumbs.map(item => {
        parent = path.join(parent, item);
        return {
          name: item,
          path: parent
        };
      });
      return [rootObj, ...breadcrumbObjs];
    }
  }
};
</script>

<style lang="less">
.inputSearch {
  width: 200px;
}
</style>