<template>
  <div class="full">
    <div class="left">
      <Choose />
    </div>
    <div class="content">
      <ContentTable />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, provide } from "vue";
import Choose from "./choose.vue";
import ContentTable from "./content-table.vue";
export default defineComponent({
  name: "ContentSetting",
  components: {
    Choose,
    ContentTable,
  },
  setup() {
    let active = ref({});
    provide("active", active);
  },
});
</script>
<style scoped lang="scss">
.full {
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  .left {
    width: 250px;
  }
  .content {
    flex: 1;
    width: calc(100% - 250px);
    height: 100%;
  }
}
</style>
