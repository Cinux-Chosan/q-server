<template>
  <f7-list>
    <f7-list-item
      v-for="(file) in filteredFiles"
      :key="file.basename"
      :title="file.basename"
      :data-path="file.basename"
      @contextmenu="onContextMenu"
      @click="$emit('onDirChange', file)"
    >
      <FileIcon :file="file" slot="media" class="listIcon" />
    </f7-list-item>
  </f7-list>
</template>

<script>
import { mapGetters } from "vuex";
import FileIcon from "@common/components/FileIcon.vue";

export default {
  components: { FileIcon },
  data() {
    return {};
  },

  onClick() {

  },

  computed: {
    ...mapGetters(["filteredFiles"])
  },
  methods: {
    onContextMenu() {
      alert(111);
    }
  }
};
</script>

<style lang="less">
.listIcon {
  font-size: 28px;
}
</style>