<script>
import FileIcon from "@common/components/FileIcon";
import { Table, Empty } from "ant-design-vue";
import { mapGetters, mapState, mapActions } from "vuex";
import { ENUM_DISPLAY_SIZE } from "@9/utils/enums";
import { formatTime, getHref, noop } from "@utils/";
import { debounce } from "@utils/decorators";
import bytes from "bytes";

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
    Table
  },
  data() {
    const { $createElement } = this;
    return {
      columns: createColumn.call(this, $createElement)
    };
  },
  computed: {
    ...mapGetters(["filteredFiles"]),
    ...mapState(["settings"]),
    listData() {
      const { filteredFiles, showParentDir } = this;
      const parentDir = {
        path: "..",
        basename: "..",
        isDir: true
      };
      return showParentDir ? [parentDir, ...filteredFiles] : filteredFiles;
    }
  },
  methods: {
    ...mapActions(["getBoundingClientRect"]),
    @debounce(150)
    refreshClientRect() {
      this.getBoundingClientRect();
    },
    customRow(file, index) {
      const { $style, settings, showParentDir } = this;
      const { fileItem, selected, big, small } = $style;
      const { displaySize } = settings;
      const size = displaySize === ENUM_DISPLAY_SIZE.BIG ? big : small;
      const realIndex = index - (showParentDir ? 1 : 0);
      return {
        attrs: {
          "data-path": file.basename
        },
        class: [file.selected && selected, fileItem, size],
        on: {
          click: event => this.$emit("setSelect", file, realIndex, event),
          dblclick: () => this.$emit("onDirChange", file)
        }
      };
    }
  },
  render() {
    const { listData, customRow, columns, settings, refreshClientRect } = this;
    const paginationOpt = settings.isPagination && { pageSize: settings.listPageSize };
    return (
      // <div vOn:animationend_stop={noop} vOn:transitionend_stop={noop}>
      <Table
        columns={columns}
        dataSource={listData}
        rowKey="basename"
        pagination={paginationOpt}
        customRow={customRow}
        vOn:change={refreshClientRect}
        locale={{ emptyText: <Empty description="空空如也~" /> }}
      ></Table>
      // </div>
    );
  }
};

/* eslint-disable-next-line */
function createColumn(h) {
  const { $style, $router } = this;
  const columns = [
    {
      title: "文件名",
      dataIndex: "basename",
      customRender: (text, file) => {
        const href = getHref(file, $router);
        return (
          <a
            href={href}
            class="block noTransition fileLink"
            draggable="false"
            vOn:click_prevent={noop}
          >
            <FileIcon file={file} class={$style.icon} />
            {file.basename}
          </a>
        );
      }
    },

    {
      title: "文件类型",
      dataIndex: "fileExt",
      customRender: (txt, file) => {
        return file.isDir ? "目录" : `${txt.slice(1)}文件`;
      }
    },
    {
      title: "创建时间",
      dataIndex: "stats.birthtimeMs",
      customRender: txt => {
        return txt && formatTime(txt);
      }
    },
    {
      title: "大小",
      dataIndex: "stats.size",
      customRender: (txt, record) => {
        return record.isDir ? null : bytes(txt);
      }
    }
  ];
  return columns;
}
</script>

<style lang="less" module>
.selected {
  background-color: rgb(230, 247, 255);
}

.fileItem {
  font-size: 1em;
  .icon {
    font-size: 1.3em !important;
    margin-right: 0.5em;
  }
}

.big {
  font-size: 1.5em;
}
.small {
  font-size: 1em;
}
</style>

