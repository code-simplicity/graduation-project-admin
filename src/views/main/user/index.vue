<template>
  <div class="layout-container">
    <div class="layout-container-form flex space-between">
      <div class="ayout-container-form-handle">
        <el-button type="primary" icon="el-icon-plus">新增</el-button>
        <el-button type="success" icon="el-icon-folder-checked"
          >批量导入</el-button
        >
        <el-button icon="el-icon-download">模板下载</el-button>
      </div>
      <div class="layout-container-form-search">
        <el-input v-model="serach" placeholder="学号/用户名"></el-input>
        <el-button type="primary" icon="el-icon-search" class="search-btn"
          >搜索</el-button
        >
      </div>
    </div>
    <div></div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "user",
  setup() {},
});
</script>
<style scoped lang="scss"></style>
