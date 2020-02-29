<template>
  <div @keydown.stop.65>
    <InputSearch placeholder="搜索" class="inputSearch" :value="searchText" @change="setSearchText" />
    <Question />
  </div>
</template>
<script>
import Question from '@comps/Question'
import { Input } from "ant-design-vue";
import { mapActions, mapState } from "vuex";
const { Search: InputSearch } = Input;

export default {
  components: {
    Question,
    InputSearch
  },
  computed: {
    ...mapState(["searchText"])
  },
  methods: {
    ...mapActions({
      setSearchText(dispatch, evt) {
        dispatch("setSearchText", evt.target.value);
      }
    })
  }
};
</script>

<style lang="less" scoped>
.inputSearch {
  width: 200px;
}
</style>