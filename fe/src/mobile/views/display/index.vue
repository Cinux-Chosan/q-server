<template>
  <f7-page>
    <f7-navbar title="下载">
    </f7-navbar>
        <f7-block-title>aaaa</f7-block-title>
      <ListView />
  </f7-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ListView from "./list.vue";
export default {
  components: {
    ListView
  },
  created() {
    this.fetchFiles("/");
  },
  methods: {
    ...mapActions(["fetchFiles"])
  }
};
</script>