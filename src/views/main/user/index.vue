<template>
  <div></div>
</template>

<script>
import { reactive, toRefs, defineComponent } from "vue";
export default defineComponent({
  name: "User",
  setup() {
    const data = reactive({});
    return {
      ...toRefs(data),
    };
  },
});
</script>
<style scoped lang="scss"></style>
