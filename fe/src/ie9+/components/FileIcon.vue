<template>
  <SvgIcon :icon-class="file | fileType" />
</template>

<script>
import { fileType } from "@utils";
import SvgIcon from "@9/components/SvgIcon";
export default {
  props: {
    file: {
      type: Object,
      required: true
    }
  },
  components: {
    SvgIcon
  },
  filters: {
    fileType
  }
};
</script>