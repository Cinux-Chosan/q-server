<template>
  <div>
    <f7-list class="listView">
      <f7-list-item
        swipeout
        v-for="(file) in filteredFiles"
        :checkbox="selecting"
        :checked="file.selected"
        :key="file.basename"
        :title="file.basename"
        :data-path="file.basename"
        @click.native="onDirChange(file, $event)"
        @taphold.native="onContextMenu"
        @change="evt => file.selected = evt.target.checked"
      >
        <FileIcon :file="file" slot="media" class="listIcon" />
        <f7-swipeout-actions right @click.native.stop>
          <f7-swipeout-button @click="detail(file, $event)" color="green">
            <f7-icon f7="doc_text_fill" xmd="material:description"></f7-icon>
          </f7-swipeout-button>
          <f7-swipeout-button @click="copy(file)" color="orange">
            <f7-icon f7="doc_on_clipboard_fill"></f7-icon>
          </f7-swipeout-button>
          <f7-swipeout-button @click="$emit('download', file)" color="blue">
            <f7-icon f7="arrow_down_doc_fill" xmd="material:cloud_download"></f7-icon>
          </f7-swipeout-button>
        </f7-swipeout-actions>
      </f7-list-item>
    </f7-list>
    <f7-popover class="fileDetail">
      <f7-list inset>
        <f7-list-item>
          <f7-label>
            文件名：
            {{currentFile.basename}}
          </f7-label>
        </f7-list-item>
        <f7-list-item v-if="!currentFile.isDir">
          <f7-label>
            文件大小：
            {{currentFile.stats.size | bytes}}
          </f7-label>
        </f7-list-item>
        <f7-list-item>
          <f7-label>
            创建时间：
            {{currentFile.stats.birthtime | formatTime}}
          </f7-label>
        </f7-list-item>

        <f7-list-item>
          <f7-label>
            最后修改于：
            {{currentFile.stats.mtime | formatTime}}
          </f7-label>
        </f7-list-item>

        <!-- <f7-list-input type="password" placeholder="Your password" clear-button></f7-list-input> -->
      </f7-list>
    </f7-popover>
  </div>
</template>

<script>
import bytes from "bytes";
import { mapGetters, mapActions } from "vuex";
import qs from "query-string";
import FileIcon from "@common/components/FileIcon.vue";
import { copyTextToClipBoard, formatTime } from "@utils";

export default {
  components: { FileIcon },
  props: {
    selecting: {
      type: Boolean
    }
  },
  data() {
    return {
      currentFile: {
        stats: {}
      }
    };
  },
  computed: {
    ...mapGetters(["filteredFiles"])
  },
  methods: {
    ...mapActions(["setSelectFiles"]),
    onContextMenu() {
      this.$emit("onContextMenu");
    },
    onDirChange(file) {
      if (this.selecting) return;
      this.$emit("onDirChange", file);
    },
    detail(file, evt) {
      this.currentFile = file;
      this.$f7.popover.open(".fileDetail", evt.target);
    },
    copy(file) {
      this.$f7.actions
        .create({
          buttons: [
            [
              { text: "拷贝名称", onClick: () => this.copyName(file) },
              { text: "拷贝链接", onClick: () => this.copyUrl(file) }
            ],
            [{ text: "取消", bold: true, color: "red" }]
          ]
        })
        .open();
    },
    copyName(file) {
      try {
        copyTextToClipBoard(file.basename);
        this.$f7.toast.show({ text: "文件名拷贝成功" });
      } catch (error) {
        this.$f7.toast.show({ text: "文件名拷贝失败" });
      }
    },
    copyUrl(file) {
      let fileUrl;
      if (file.fullPath) {
        if (file.isDir) {
          const url = window.location.href;
          const formattedUrl = url.split("#").length < 2 ? url + "#/" : url;
          const { query } = this.$f7route;
          const newQuery = { ...query, dir: file.fullPath };
          const [baseUrl] = formattedUrl.split("?");
          fileUrl = `${baseUrl}?${qs.stringify(newQuery)}`;
        } else {
          const { host, protocol } = window.location;
          fileUrl = `${protocol}//${host}/${file.fullPath}`;
        }
      }
      if (fileUrl) {
        try {
          copyTextToClipBoard(fileUrl);
          this.$f7.toast.show({ text: "文件链接拷贝成功" });
        } catch (error) {
          this.$f7.toast.show({ text: "文件链接拷贝失败" });
        }
      }
    }
  },
  filters: {
    bytes,
    formatTime
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