<template>
  <!-- <Upload /> -->
  <f7-popup :opened="opened">
    <f7-view>
      <f7-page>
        <f7-navbar title="设置">
          <f7-nav-right>
            <f7-link @click="$emit('onClose')">关闭</f7-link>
          </f7-nav-right>
        </f7-navbar>
        <f7-toolbar tabbar bottom-md v-if="config.login">
          <f7-link @click="logOut">退出登录</f7-link>
        </f7-toolbar>
        <f7-list inline-labels no-hairlines-md>
          <f7-list-input
            label="排序类型"
            type="select"
            @change="updateState({ 'settings.sortType': $event.target.value})"
            :value="settings.sortType"
            placeholder="请选择类型"
          >
            <option :value="ENUM_SORT_TYPE.NAME">名称</option>
            <option :value="ENUM_SORT_TYPE.SIZE">大小</option>
            <option :value="ENUM_SORT_TYPE.TYPE">类型</option>
            <option :value="ENUM_SORT_TYPE.CREAT_TIME">创建时间</option>
          </f7-list-input>
          <f7-list-input
            label="排序方式"
            type="select"
            @change="updateState({ 'settings.sortOrder': $event.target.value})"
            :value="settings.sortOrder"
            placeholder="请选择类型"
          >
            <option :value="ENUM_SORT_ORDER.ASC">升序</option>
            <option :value="ENUM_SORT_ORDER.DESC">降序</option>
          </f7-list-input>
        </f7-list>
      </f7-page>
    </f7-view>
  </f7-popup>
</template>

<script>
import { ENUM_SORT_TYPE, ENUM_SORT_ORDER } from "@9/utils/enums";
import { mapState, mapMutations } from "vuex";
import req from "@req";

export default {
  props: {
    opened: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ENUM_SORT_TYPE,
      ENUM_SORT_ORDER
    };
  },
  computed: mapState(["settings", "config"]),
  methods: {
    ...mapMutations(["updateState"]),
    async logOut() {
      const result = await req("/api/logout");
      if (result) {
        this.$f7.toast.show({ text: "登出成功!" });
        this.$f7router.navigate({ name: "login" });
      }
    }
  }
};
</script>