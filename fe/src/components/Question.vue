<template>
  <span>
    <Drawer
      title="设置"
      placement="right"
      :closable="true"
      @close="onClose"
      :visible="visible"
      width="300"
    >
      <Form>
        <FormItem label="排序方式">
          <RadioGroup
            @change="updateSortType($event.target.value)"
            :value="sortType"
            buttonStyle="solid"
          >
            <RadioButton :value="ENUM_SORT_TYPE.NAME">名称</RadioButton>
            <RadioButton :value="ENUM_SORT_TYPE.TYPE">类型</RadioButton>
            <RadioButton :value="ENUM_SORT_TYPE.CREAT_TIME">创建时间</RadioButton>
          </RadioGroup>
        </FormItem>
        <FormItem label="排序方式">
          <RadioGroup
            @change="updateSortOrder($event.target.value)"
            :value="sortOrder"
            buttonStyle="solid"
          >
            <RadioButton :value="ENUM_SORT_ORDER.ASC">升序</RadioButton>
            <RadioButton :value="ENUM_SORT_ORDER.DESC">降序</RadioButton>
          </RadioGroup>
        </FormItem>
        <FormItem label="呈现方式">
          <RadioGroup buttonStyle="solid">
            <RadioButton value="grid">网格</RadioButton>
            <RadioButton value="list">列表</RadioButton>
          </RadioGroup>
        </FormItem>
      </Form>
    </Drawer>
    <SvgIcon icon-class="gears" class="questionMark inlineBlock" @click="openHelp" />
  </span>
</template>
<script>
import SvgIcon from "@comps/SvgIcon";
import { Drawer, Form, Radio } from "ant-design-vue";
import { ENUM_SORT_TYPE, ENUM_SORT_ORDER } from "@utils/enums";
import { mapState, mapMutations } from "vuex";

const { Item: FormItem } = Form;
const { Group: RadioGroup, Button: RadioButton } = Radio;

export default {
  components: {
    SvgIcon,
    Drawer,
    Form,
    FormItem,
    RadioGroup,
    RadioButton
  },
  data() {
    return {
      visible: false,
      ENUM_SORT_TYPE,
      ENUM_SORT_ORDER
    };
  },
  computed: {
    ...mapState(["sortType", "sortOrder"])
  },
  methods: {
    ...mapMutations(["updateSortType", "updateSortOrder"]),
    openHelp() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    }
  }
};
</script>

<style lang="less" scoped>
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