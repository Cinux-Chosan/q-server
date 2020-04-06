<template>
  <f7-popup>
    <f7-view>
      <!-- <f7-popup id="pop-upload" :opened="opened" @popup:closed="$emit('onClose')"> -->
      <f7-page>
        <f7-navbar title="上传">
          <f7-nav-right>
            <!-- <f7-link @click="close">关闭</f7-link> -->
            <f7-link popup-close>关闭</f7-link>
          </f7-nav-right>
        </f7-navbar>
        <input type="file" class="uploadInput" ref="upload" @change="onUploadChange" multiple />
        <f7-block inset>
          <div class="BreadCrumbTip">
            <BreadCrumb />
          </div>
          <f7-card class="uploadArea" @click.native="onOpenUpload">
            <f7-card-content :padding="false">
              <p>
                <f7-icon f7="cloud_upload_fill" />
              </p>
              <p>点击此区域进行上传</p>
              <small>请不要上传大小超过 {{fileSizeLimit.toUpperCase()}} 的文件</small>
            </f7-card-content>
          </f7-card>
        </f7-block>
        <f7-list class="uploadedList">
          <f7-list-item v-for="item in uploadedList" :key="item.file.name" :header="item.file.name">
            <f7-icon slot="media" f7="paperclip"></f7-icon>
            <f7-progressbar slot="title" color="blue" :progress="item.progress"></f7-progressbar>
          </f7-list-item>
        </f7-list>
      </f7-page>
    </f7-view>
  </f7-popup>
</template>

<script>
import { mapState } from "vuex";
import { uploadFile } from "@utils";
import BreadCrumb from "@m/components/BreadCrumb.vue";

export default {
  components: {
    BreadCrumb
  },
  data() {
    window.x = this;
    return {
      uploadedList: []
    };
  },
  methods: {
    close() {
      this.$f7.popup.close();
      const { query } = this.$f7route;
      this.$f7router.navigate({ name: "Display", query });
    },
    onOpenUpload() {
      this.$refs.upload.click();
    },
    onUploadChange(evt) {
      // eslint-disable-next-line
      for (const [k, file] of Object.entries(evt.target.files)) {
        const uploadInfo = { file, progress: 0 };
        this.uploadedList.push(uploadInfo);
        uploadFile(file, this.$f7route.query.dir)
          .then(() => {
            uploadInfo.progress = 100;
            this.$f7.toast.show({ text: `文件${file.name}上传成功` });
          })
          .catch(error => {
            // 上传失败
            this.$f7.toast.show({
              text: `文件${file.name}上传失败：${error.message}`,
              closeButton: true,
              closeButtonText: "关闭",
              closeButtonColor: "red"
            });
          });
      }
    }
  },
  computed: {
    ...mapState(["config"]),
    fileSizeLimit() {
      return this.config.limit;
    }
  }
};
</script>

<style lang="less" scoped>
.uploadInput {
  display: none;
}
.uploadedList {
  /deep/ .item-title {
    width: 100%;
  }
}
.BreadCrumbTip {
  display: flex;
  justify-content: center;
}
.uploadArea {
  min-height: 200px;
  text-align: center;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.inputBtn {
  text-align: center;
}
</style>