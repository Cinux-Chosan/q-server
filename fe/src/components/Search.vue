<template>
  <div>
    <InputSearch
      placeholder="input search text"
      class="inputSearch"
      :value="$store.state.searchText"
      @change="onSearch"
    />
  </div>
</template>
<script>
import { Input } from "ant-design-vue";
const { Search: InputSearch } = Input;

export default {
  components: {
    InputSearch
  },
  methods: {
    onSearch(evt) {
      this.$store.commit("updateSearchText", evt.target.value);
    }
  }
};
</script>

<style lang="less">
.inputSearch {
  width: 200px;
}
</style>