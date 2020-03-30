<template>
  <f7-list class="listView">
    <f7-list-item
      :checkbox="selecting"
      swipeout
      v-for="(file) in filteredFiles"
      :key="file.basename"
      :title="file.basename"
      :data-path="file.basename"
      @click="onDirChange(file)"
      @taphold.native="onContextMenu"
    >
      <FileIcon :file="file" slot="media" class="listIcon" />
      <f7-swipeout-actions right>
        <f7-swipeout-button @click="more">详情</f7-swipeout-button>
        <f7-swipeout-button>拷贝</f7-swipeout-button>
        <f7-swipeout-button>拷贝</f7-swipeout-button>
      </f7-swipeout-actions>
    </f7-list-item>
  </f7-list>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import FileIcon from "@common/components/FileIcon.vue";

export default {
  components: { FileIcon },
  props: {
    selecting: {
      type: Boolean
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["filteredFiles"])
  },
  methods: {
    ...mapActions(["setSelectFiles"]),
    onContextMenu(e) {
      this.$emit("onContextMenu");
    },
    onDirChange(file) {
      this.$emit("onDirChange", file);
    },
    more() {}
  }
};
</script>

<style lang="less" scoped>
.listView {
  margin-top: 0;
}
.listIcon {
  font-size: 28px;
}
</style>