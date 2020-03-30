<template>
  <f7-list>
    <f7-list-item
      :checkbox="showCheckbox"
      swipeout
      v-for="(file) in filteredFiles"
      :key="file.basename"
      :title="file.basename"
      :data-path="file.basename"
      @click="$emit('onDirChange', file)"
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
import { mapGetters } from "vuex";
import FileIcon from "@common/components/FileIcon.vue";

export default {
  components: { FileIcon },
  data() {
    return {
      showCheckbox: false
    };
  },

  onClick() {},

  computed: {
    ...mapGetters(["filteredFiles"])
  },
  methods: {
    onContextMenu(e) {
      this.showCheckbox = true;
    },
    more() {}
  }
};
</script>

<style lang="less">
.listIcon {
  font-size: 28px;
}
</style>