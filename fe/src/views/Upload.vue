<template>
  <UploadDragger
    name="file"
    :multiple="true"
    action="/api/upload"
    @change="handleChange"
  >
    <p class="ant-upload-drag-icon">
      <Icon type="inbox" />
    </p>
    <p class="ant-upload-text">点击或将文件拖动到此处进行上传</p>
    <p class="ant-upload-hint">
      支持单文件或批量文件上传
    </p>
  </UploadDragger>
</template>
<script>
import { Upload, Icon } from "ant-design-vue";

const { Dragger: UploadDragger } = Upload

export default {
  components: {
    UploadDragger,
    Icon
  },
  data() {
    return {};
  },
  methods: {
    handleChange(info) {
      const status = info.file.status;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        this.$message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    }
  }
};
</script>