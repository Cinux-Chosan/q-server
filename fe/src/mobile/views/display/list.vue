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
      <a :href="getHref(file)"></a>
      <FileIcon :file="file" slot="media" class="listIcon" />
      <f7-swipeout-actions right>
        <f7-swipeout-button @click="more">详情</f7-swipeout-button>
        <f7-swipeout-button @click="copyName(file)">拷贝名称</f7-swipeout-button>
        <f7-swipeout-button @click="copyUrl(file)">拷贝链接</f7-swipeout-button>
      </f7-swipeout-actions>
    </f7-list-item>
  </f7-list>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import FileIcon from "@common/components/FileIcon.vue";
import { copyTextToClipBoard } from "@utils";

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
    more() {},
    copyName(file) {
      copyTextToClipBoard(file.basename);
      this.$f7.toast.show({
        text: "文件名拷贝成功",
        position: "top",
        closeTimeout: 2000
      });
    },
    copyUrl(file) {
      // 
    },
    getHref(file) {
      if (file.isDir) {
        return this.$f7route.path
      } else {
        // 
      }
    }
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