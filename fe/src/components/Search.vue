<template>
  <div>
    <InputSearch
      placeholder="搜索"
      class="inputSearch"
      :value="$store.state.searchText"
      @change="onSearch"
    />
  </div>
</template>
<script>
import { Input } from "ant-design-vue";
// import { debounce } from "@utils/decorator";
const { Search: InputSearch } = Input;

export default {
  components: {
    InputSearch
  },
  methods: {
    // @debounce(200)
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