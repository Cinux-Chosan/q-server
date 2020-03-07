<template>
  <SvgIcon :icon-class="file | fileType" />
</template>

<script>
import { fileType } from "@utils";
import SvgIcon from "@common/components/SvgIcon";
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