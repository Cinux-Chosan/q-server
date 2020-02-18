<template>
  <div class="uploadDraggerContainer">
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
        请上传大小不超过
        <b>{{fileSizeLimit.toUpperCase()}}</b> 的文件
      </p>
    </UploadDragger>
  </div>
</template>
<script>
import { Upload, Icon } from "ant-design-vue";

const { Dragger: UploadDragger } = Upload;

export default {
  components: {
    UploadDragger,
    Icon
  },
  data() {
    return {};
  },
  computed: {
    uploadUrl() {
      return `/api/upload`;
    },
    fileSizeLimit() {
      return this.$store.state.config.limit;
    }
  },
  methods: {
    handleChange(info) {
      const { file, fileList } = info;
      const status = file.status;
      if (status !== "uploading") {
        console.log(file, fileList);
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

<style lang="less">
.uploadDraggerContainer {
  margin-top: 40px;
  height: 250px;
}
</style>