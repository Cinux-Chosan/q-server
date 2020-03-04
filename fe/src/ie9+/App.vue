<template>
  <div id="app" @animationend="onReflow" @transitionend="onReflow">
    <RangeSelector>
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
        <Search v-show="$route.path === '/'" class="navSearch" />
      </div>
      <keep-alive>
        <router-view />
      </keep-alive>
      <BackTop @mousedown.stop />
    </RangeSelector>
  </div>
</template>

<script>
import request from "@req";
import debug from "@utils/debug";
import Search from "@9/components/Search";
import Breadcrumb from "@9/components/Breadcrumb";
import RangeSelector from "@9/components/RangeSelector";
import { BackTop, Divider } from "ant-design-vue";
import { mapActions, mapMutations } from "vuex";

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
    ...mapActions(["getBoundingClientRect"]),
    ...mapMutations(["updateState"]),
    async getConfig() {
      const config = await request("/api/config");
      this.updateState({ config });
    },
    onReflow(evt) {
      const {
        animationName /** animationend */,
        propertyName /** transitionend */
      } = evt;
      const cssTriggerProperty = animationName || propertyName;
      isDev && debug.event("repaint", cssTriggerProperty);
      // 这些 animation 不需要重新计算 BoundingClientRect
      const excludeAnimaiton = ["color", "opacity"];
      if (!excludeAnimaiton.find(exc => cssTriggerProperty.includes(exc))) {
        this.getBoundingClientRect();
      }
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
