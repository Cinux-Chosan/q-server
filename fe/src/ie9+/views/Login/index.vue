<template>
  <div>
    <canvas id="loginBg"></canvas>
    <Row>
      <ACol :span="4" :offset="18">
        <Form :form="form" class="loginForm" @keydown.enter="onLogin">
          <FormItem label="用户名">
            <Input
              v-decorator="[
                'username',
                {
                  rules:[ { required: true, message: '用户名不能为空' } ]
                }
              ]"
            />
          </FormItem>
          <FormItem label="密码">
            <Input
              v-decorator="[
                'password',
                {
                  rules:[ { required: true, message: '密码不能为空' } ]
                }
              ]"
            />
          </FormItem>
          <FormItem>
            <Button type="primary" html-type="submit" @click="onLogin">登录</Button>
          </FormItem>
        </Form>
      </ACol>
    </Row>
  </div>
</template>

<script>
import draw from "@utils/canvas.ball";
import request from "@req";
import { Form, Input, Row, Button, Col as ACol } from "ant-design-vue";

const { Item: FormItem } = Form;

export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: "login" })
    };
  },
  components: {
    Form,
    FormItem,
    Input,
    Row,
    ACol,
    Button
  },
  mounted() {
    draw(document.getElementById("loginBg"));
  },
  methods: {
    onLogin() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          try {
            let result = await request("/api/login", values);
            if (result) {
              if (history.length > 2) {
                this.$router.back();
              } else {
                this.$router.replace({ name: "Display" });
              }
            }
          } catch (error) {
            this.$message.error(error.message);
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
#loginBg {
  position: fixed;
  z-index: -1;
  width: 100%;
  height: 100%;
}

.loginForm {
  max-width: 400px;
  margin-top: 150px;
}
</style>