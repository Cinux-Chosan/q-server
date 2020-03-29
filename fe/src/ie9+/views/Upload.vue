<template>
  <div class="uploadDraggerContainer unselectable">
    <p>
      当前会上传到
      <Breadcrumb class="breadcrumb" />目录
    </p>
    <UploadDragger
      name="file"
      :multiple="true"
      :action="uploadUrl"
      @change="handleChange"
      :data="$route.query"
      :showUploadList="{ showRemoveIcon: false }"
    >
      <p class="ant-upload-drag-icon">
        <Icon type="inbox" />
      </p>
      <p class="ant-upload-text">点击或将文件拖动到此处进行上传</p>
      <p class="ant-upload-hint">
        请不要上传大小超过
        <b>{{fileSizeLimit.toUpperCase()}}</b> 的文件
      </p>
    </UploadDragger>
  </div>
</template>
<script>
import debug from "@utils/debug";
import Breadcrumb from "@9/components/Breadcrumb";
import { mapState } from 'vuex';
import { Upload, Icon } from "ant-design-vue";

const { Dragger: UploadDragger } = Upload;

export default {
  components: {
    UploadDragger,
    Breadcrumb,
    Icon
  },
  data() {
    return {
      uploadUrl: `/api/upload`
    };
  },
  computed: {
    ...mapState(['config']),
    fileSizeLimit() {
      return this.config.limit;
    }
  },
  methods: {
    handleChange(info) {
      const { file, fileList } = info;
      const status = file.status;
      if (status !== "uploading") {
        isDev && debug.log('upload status change', file, fileList);
      }
      if (status === "done") {
        this.$message.success(`${file.name} 上传成功！`);
      } else if (status === "error") {
        this.$message.error(`${file.name} 上传失败: ${file.response}`);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.uploadDraggerContainer {
  height: 250px;
  .breadcrumb {
    display: inline-block;
    margin: 0 0.5em;
  }
}
</style>