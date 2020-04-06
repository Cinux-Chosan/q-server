<template>
  <span>
    <Drawer
      title="设置"
      placement="right"
      :closable="true"
      @close="onClose"
      :visible="visible"
      width="340"
    >
      <Form>
        <FormItem label="排序类型">
          <RadioGroup
            @change="updateState({ 'settings.sortType': $event.target.value})"
            :value="settings.sortType"
            buttonStyle="solid"
          >
            <RadioButton :value="ENUM_SORT_TYPE.NAME">名称</RadioButton>
            <RadioButton :value="ENUM_SORT_TYPE.SIZE">大小</RadioButton>
            <RadioButton :value="ENUM_SORT_TYPE.TYPE">类型</RadioButton>
            <RadioButton :value="ENUM_SORT_TYPE.CREAT_TIME">创建时间</RadioButton>
          </RadioGroup>
        </FormItem>
        <FormItem label="排序方式">
          <RadioGroup
            @change="updateState({ 'settings.sortOrder': $event.target.value})"
            :value="settings.sortOrder"
            buttonStyle="solid"
          >
            <RadioButton :value="ENUM_SORT_ORDER.ASC">升序</RadioButton>
            <RadioButton :value="ENUM_SORT_ORDER.DESC">降序</RadioButton>
          </RadioGroup>
        </FormItem>
        <FormItem label="呈现方式">
          <RadioGroup
            @change="updateState({ 'settings.displayType': $event.target.value})"
            :value="settings.displayType"
            buttonStyle="solid"
          >
            <RadioButton :value="ENUM_DISPLAY_TYPE.GRID">网格</RadioButton>
            <RadioButton :value="ENUM_DISPLAY_TYPE.LIST">列表</RadioButton>
          </RadioGroup>
        </FormItem>
        <template v-if="settings.displayType === ENUM_DISPLAY_TYPE.LIST">
          <FormItem label="是否分页">
            <ASwitch
              :checked="settings.isPagination"
              @change="updateState({ 'settings.isPagination': $event})"
            />
          </FormItem>
          <FormItem label="每页大小">
            <InputNumber
              :min="5"
              :value="settings.listPageSize"
              @change="n => updateState({'settings.listPageSize': Math.max(n, 5)})"
            />
          </FormItem>
          <FormItem label="文字大小">
            <RadioGroup
              @change="updateState({ 'settings.displaySize': $event.target.value})"
              :value="settings.displaySize"
              buttonStyle="solid"
            >
              <RadioButton :value="ENUM_DISPLAY_SIZE.SMALL">小</RadioButton>
              <RadioButton :value="ENUM_DISPLAY_SIZE.BIG">大</RadioButton>
            </RadioGroup>
          </FormItem>
        </template>
      </Form>
      <div class="footer" v-if="config.login">
        <Button @click="onLogout" type="primary">退出登录</Button>
      </div>
    </Drawer>
    <SvgIcon icon-class="gears" class="questionMark inlineBlock" @click="openSettings" />
  </span>
</template>
<script>
import SvgIcon from "@common/components/SvgIcon";
import {
  Drawer,
  Form,
  Radio,
  Switch as ASwitch,
  InputNumber,
  Button
} from "ant-design-vue";
import {
  ENUM_SORT_TYPE,
  ENUM_SORT_ORDER,
  ENUM_DISPLAY_TYPE,
  ENUM_DISPLAY_SIZE,
  ENUM_DISPLAY_TYPE_LIST_IS_PAGINATION
} from "@9/utils/enums";
import { mapState, mapMutations, mapActions } from "vuex";
import request from "@req";

const { Item: FormItem } = Form;
const { Group: RadioGroup, Button: RadioButton } = Radio;

export default {
  components: {
    SvgIcon,
    Drawer,
    Form,
    ASwitch,
    FormItem,
    RadioGroup,
    RadioButton,
    InputNumber,
    Button
  },
  data() {
    return {
      visible: false,
      ENUM_SORT_TYPE,
      ENUM_SORT_ORDER,
      ENUM_DISPLAY_TYPE,
      ENUM_DISPLAY_SIZE,
      ENUM_DISPLAY_TYPE_LIST_IS_PAGINATION
    };
  },
  computed: mapState(["settings", "config"]),
  methods: {
    ...mapMutations(["updateState"]),
    ...mapActions(["getBoundingClientRectLimitted"]),
    openSettings() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
      this.getBoundingClientRectLimitted();
    },
    async onLogout() {
      const result = await request("/api/logout");
      if (result) {
        this.$message.success("退出登录成功");
        this.$router.replace({ name: "Login" });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.footer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: center;
  z-index: 1;
}
.questionMark {
  width: 30px;
  font-size: 20px;
  margin-left: 10px;
  vertical-align: middle;
  transition: all ease 0.2s;
  cursor: pointer;
  &:hover {
    font-size: 26px;
  }
}
</style>