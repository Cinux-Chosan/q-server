<template>
  <f7-app :params="f7params">
    <!-- Views/Tabs container -->
    <f7-views tabs class="safe-areas">
      <!-- Your main view/tab, should have "view-main" class. It also has "tab-active" class -->
      <f7-view id="view-home" main tab tab-active url="/"></f7-view>
    </f7-views>
  </f7-app>
</template>
<script>
import request from "@req";
import routes from "@m/routes";
import { mapMutations } from "vuex";

export default {
  data() {
    window.xx = this;
    return {
      // Framework7 Parameters
      f7params: {
        name: "@chosan/server", // App name
        theme: "auto", // Automatic theme detection
        touch: {
          // disableContextMenu: false, // 是否开启上下文联动
          tapHold: true
        },
        toast: {
          position: "top",
          closeTimeout: 2000
        },
        view: {
          pushState: true,
          pushStateOnLoad: false,
          pushStateSeparator: "#"
        },
        // App root data
        data: function() {
          return {
            // Demo products for upload section
          };
        },

        // App routes
        routes
      }
    };
  },
  created() {
    this.getConfig();
  },
  methods: {
    ...mapMutations(["updateState"]),
    async getConfig() {
      const config = await request("/api/sysConf");
      this.updateState({ config });
    }
  },
  mounted() {
    this.$f7ready(f7 => {
      console.log(f7);
      // Call F7 APIs here
    });
  }
};
</script>