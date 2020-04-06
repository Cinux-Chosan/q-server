<template >
  <div>
    <transition-group
      appear
      tag="ul"
      name="fileList"
      class="fileList clearfix"
      @after-enter="getBoundingClientRectLimitted"
    >
      <li
        @dblclick="$emit('onDirChange',{ path: '..', isDir: true})"
        class="fileItem parentDir"
        key=".."
        v-if="showParentDir"
      >
        <FileIcon :file="{isDir: true}" class="iconItem" />
        <p class="fileName ellipsis">..</p>
      </li>
      <li
        v-for="(file, index) in filteredFiles"
        :key="file.fullPath"
        :class="['fileItem', file.selected ? 'selected' : '']"
        :data-path="file.basename"
        @click.stop="$emit('setSelect', file, index, $event)"
        @dblclick="$emit('onDirChange', file)"
      >
        <!-- 提供鼠标右键复制地址、新窗口打开等浏览器自带功能 -->
        <a
          :href="getHref(file, $router)"
          @click.prevent
          draggable="false"
          class="block noTransition fileLink"
        >
          <FileIcon :file="file" class="iconItem" />
          <p class="fileName ellipsis">{{file.basename}}</p>
        </a>
      </li>
    </transition-group>
    <Empty description="空空如也~" v-if="isEmpty" />
  </div>
</template>


<script>
import bytes from "bytes";
import FileIcon from "@common/components/FileIcon";
import { formatTime, fileType, getHref } from "@utils";
import { mapActions, mapGetters } from "vuex";
import { Empty } from "ant-design-vue";

export default {
  props: {
    showParentDir: {
      type: Boolean
    },
    isEmpty: {
      type: Boolean
    }
  },
  components: {
    FileIcon,
    Empty
  },
  computed: mapGetters(["filteredFiles"]),
  methods: {
    getHref,
    ...mapActions(["getBoundingClientRectLimitted"]),
    getPopupContainer() {
      return document.getElementById("popContainer");
    }
  },
  filters: {
    formatTime,
    fileType,
    bytes
  }
};
</script>

<style lang="less">
.fileList {
  padding: 0;
  margin: 10px;
  padding: 20px;
  border-radius: 5px;
  .fileItem {
    @size: 100px;
    @hoverSize: 120px;
    width: @size;
    height: @size;
    margin: 5px;
    padding: 10px 4px;
    float: left;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    border-radius: 5px;
    &.selected,
    &:hover {
      background: rgba(13, 10, 49, 0.1);
    }

    .iconItem {
      font-size: 60px;
    }
    p.fileName {
      user-select: none !important;
    }
  }
}

.popoverContent {
  p:last-child {
    margin-bottom: 0;
  }
}

// animation
.fileList-move {
  transition: all 0.3s;
}

.fileList-enter {
  &-active {
    opacity: 0;
    width: 0px;
    transition: all ease 0.3s;
  }
  &-to {
    opacity: 1;
    width: 100px;
    transition: all ease 0.3s;
  }
}
.fileList-leave {
  &-active {
    opacity: 1;
    width: 100px;
    transition: all ease 0.3s;
  }

  &-to {
    opacity: 0;
    width: 0px !important;
    transition: all ease 0.3s;
  }
}
</style>