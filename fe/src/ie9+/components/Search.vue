<template>
  <div @keydown.stop.65>
    <InputSearch placeholder="搜索" class="inputSearch" :value="searchText" @change="setSearchText" />
    <Settings />
  </div>
</template>
<script>
import Settings from '@9/components/Settings'
import { Input } from "ant-design-vue";
import { mapActions, mapState } from "vuex";
const { Search: InputSearch } = Input;

export default {
  components: {
    Settings,
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