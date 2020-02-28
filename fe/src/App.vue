<template>
  <div id="app">
    <RangeSelector>
      <div id="nav" class="clearfix">
        <div class="navBreadcrumb">
          <Breadcrumb />
        </div>
        <div class="navActions">
          <template v-if="uploadable">
            <router-link :to="{ path: '/', query: { ...$route.query }}">下载</router-link>
            <Divider type="vertical" />
            <router-link :to="{ path: '/upload', query: { ...$route.query } }">上传</router-link>
          </template>
        </div>
        <Search v-show="$route.path === '/'" class="navSearch" />
      </div>
      <keep-alive>
        <router-view />
      </keep-alive>
      <BackTop />
    </RangeSelector>
  </div>
</template>

<script>
import request from "@req";
import Search from "@comp/Search";
import Breadcrumb from "@comp/Breadcrumb";
import RangeSelector from "@comp/RangeSelector";
import { BackTop, Divider } from "ant-design-vue";

export default {
  components: {
    Search,
    Divider,
    BackTop,
    Breadcrumb,
    RangeSelector
  },
  created() {
    this.getConfig();
  },
  data() {
    return {};
  },
  computed: {
    uploadable() {
      return this.$store.state.config.uploadable;
    }
  },
  methods: {
    async getConfig() {
      const config = await request("/api/config");
      this.$store.commit("updateConfig", config);
    }
  }
};
</script>

<style lang="less" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  line-height: 32px;
  font-size: 16px;
  height: 100px;

  .navBreadcrumb {
    width: 40%;
    text-align: left;
    margin-bottom: 10px;
    float: left;
  }
  .navActions {
    width: 20%;
    float: left;
    margin-bottom: 10px;
    user-select: none;
  }

  .navSearch {
    width: 40%;
    text-align: right;
    float: left;
    margin-bottom: 10px;
    /deep/ .ant-input::placeholder {
      user-select: none;
    }
  }

  @media screen and(max-width: 600px) {
    .navBreadcrumb {
      width: 100%;
      text-align: center;
    }
    .navActions {
      width: 100%;
      text-align: center;
    }
    .navSearch {
      width: 100%;
      text-align: center;
    }
  }

  a {
    font-weight: bold;
    color: #2c3e50;
    cursor: pointer;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
