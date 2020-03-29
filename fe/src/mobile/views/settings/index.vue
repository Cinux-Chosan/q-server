<template>
  <!-- <Upload /> -->
  <f7-popup>
    <f7-view>
      <f7-page>
        <f7-navbar title="设置">
          <f7-nav-right>
            <f7-link popup-close>关闭</f7-link>
          </f7-nav-right>
        </f7-navbar>
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

export default {
  data() {
    return {
      ENUM_SORT_TYPE,
      ENUM_SORT_ORDER
    };
  },
  computed: mapState(["settings"]),
  methods: {
    ...mapMutations(["updateState"])
  }
};
</script>