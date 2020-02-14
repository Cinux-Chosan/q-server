<template>
  <div class="home">
    <ul>
      <li v-for="file in fileList" :key="file">
        <a :href="'/api/' + file" target="_blank">{{file}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src
import request from "@req";

export default {
  name: "Home",
  data() {
    return {
      path: document.location.pathname,
      fileList: []
    };
  },
  created() {
    this.getFileList();
  },
  methods: {
    async getFileList(path) {
      const fileList = await request("/api/files", { path });
      this.fileList = fileList;
    }
  }
};
</script>
