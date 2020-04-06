<template>
  <div id="app">
    <!-- <RangeSelector>
      <div id="nav" class="clearfix">
        <div class="navBreadcrumb">
          <Breadcrumb class="unselectable" />
        </div>
        <div class="navActions">
          <template v-if="uploadable">
            <router-link :to="{ path: '/', query: { ...$route.query }}">下载</router-link>
            <Divider type="vertical" />
            <router-link :to="{ path: '/upload', query: { ...$route.query } }">上传</router-link>
          </template>
        </div>
        <Search v-if="$route.path === '/'" class="navSearch" />
    </div>-->
    <keep-alive>
      <router-view />
    </keep-alive>
    <!-- <BackTop @mousedown.stop />
    </RangeSelector>-->
  </div>
</template>

<script>
import request from "@req";
import { mapMutations } from "vuex";

export default {
  created() {
    this.getConfig();
  },
  data() {
    return {};
  },
  methods: {
    ...mapMutations(["updateState"]),
    async getConfig() {
      const config = await request("/api/sysConf");
      this.updateState({ config });
    }
  }
};
</script>

<style lang="less" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}
</style>
