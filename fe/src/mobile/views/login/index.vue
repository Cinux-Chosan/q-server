<template>
  <f7-popup>
    <f7-page login-screen>
      <f7-login-screen-title>{{config.title}}</f7-login-screen-title>
      <f7-list form>
        <f7-list-input
          label="用户名"
          type="text"
          placeholder="请输入您的用户名"
          :value="username"
          @input="username = $event.target.value"
        ></f7-list-input>
        <f7-list-input
          label="密码"
          type="password"
          placeholder="请输入您的密码"
          :value="password"
          @input="password = $event.target.value"
        ></f7-list-input>
      </f7-list>
      <f7-list>
        <f7-list-button @click="signIn">登录</f7-list-button>
        <f7-block-footer>如忘记密码请联系管理员</f7-block-footer>
      </f7-list>
    </f7-page>
  </f7-popup>
</template>

<script>
import req from "@req";
import { mapState } from "vuex";

export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  computed: {
    ...mapState(["config"])
  },
  methods: {
    async signIn() {
      const { username, password } = this;
      const app = this.$f7;
      const router = this.$f7router;
      if (!username) return app.toast.show({ text: "请输入用户名" });
      if (!password) return app.toast.show({ text: "请输入密码" });
      try {
        const result = await req("/api/login", { username, password });
        if (result) {
          app.popup.close();
          router.navigate({ name: "Display" });
        } else {
          //
        }
      } catch (error) {
        app.toast.show({ text: error.message });
      }
    }
  }
};
</script>