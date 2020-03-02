

<script>
import FileIcon from "@comps/FileIcon";
import { Table, Empty } from "ant-design-vue";
import { mapGetters, mapState } from "vuex";
import { ENUM_DISPLAY_SIZE } from "@utils/enums";
import { formatTime, noop } from "@utils/";
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
    return {
      columns: createColumn.apply(this)
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
        class: [file.selected && $style.selected, fileItem, size],
        on: {
          click: event => this.$emit("setSelect", file, realIndex, event),
          dblclick: event => this.$emit("onDirChange", file)
        }
      };
    }
  },
  render(h) {
    const { listData, customRow, columns, settings } = this;
    const paginationOpt = settings.isPagination && {
      pageSize: settings.listPageSize
    };
    return (
      // <div vOn:animationend_stop={noop} vOn:transitionend_stop={noop}>
      <Table
        columns={columns}
        dataSource={listData}
        rowKey="basename"
        pagination={paginationOpt}
        customRow={customRow}
        locale={{ emptyText: <Empty description="空空如也~" /> }}
      ></Table>
      // </div>
    );
  }
};

function createColumn() {
  const { $createElement: h, $style } = this;
  const columns = [
    {
      title: "文件名",
      dataIndex: "basename",
      customRender: (text, file) => {
        const { isDir, fileExt } = file;
        const { big, small } = $style;
        const { settings } = this;
        return (
          <span>
            <FileIcon file={file} class={$style.icon} />
            {file.basename}
          </span>
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
      customRender: (txt, record) => {
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

