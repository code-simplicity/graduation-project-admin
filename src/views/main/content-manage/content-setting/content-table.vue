<template>
  <div class="layout-container">
    <div class="layout-container-form flex space-between">
      <div class="layout-container-form-handle">
        <el-button type="primary" icon="el-icon-plus" @click="handleAddContent"
          >添加内容</el-button
        >
      </div>
    </div>
    <div class="layout-container-table">
      <Table
        ref="table"
        v-model:page="page"
        v-loading="loading"
        :showIndex="true"
        :showSelection="true"
        :data="tableData"
        @getTableData="getTableData"
      >
        <el-table-column
          prop="id"
          label="id"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="choose_id"
          label="选择id"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="content"
          label="内容"
          show-overflow-tooltip
          align="center"
        />
        <el-table-column prop="state" label="状态" align="center" width="60" />
        <el-table-column
          prop="create_time"
          label="创建时间"
          :formatter="dateFormat"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="update_time"
          label="更新时间"
          :formatter="dateFormat"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column label="操作" align="center" fixed="right" width="180">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm title="删除" @confirm="handleDel(scope.row)">
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </Table>
    </div>
    <Layer :layer="layer" @getTableData="getTableData" v-if="layer.show" />
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import Table from "@/components/table/index.vue";
import { dateFormat } from "@/utils/utils";
import { getContentFindAll } from "@/api/content";
import { ElMessage } from "element-plus";
import Layer from "./layer.vue";
export default defineComponent({
  name: "ContentTable",
  components: {
    Table,
    Layer,
  },
  setup() {
    const loading = ref(true);
    const tableData = ref([]);
    const page = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0,
      content: "",
    });
    // 弹窗控制
    const layer = reactive({
      show: false,
      title: "添加内容",
      showButton: true,
      width: "400px",
    });
    const getTableData = (init) => {
      loading.value = true;
      if (init) {
        page.pageNum = 1;
      }
      let params = {
        pageNum: page.pageNum,
        pageSize: page.pageSize,
      };
      getContentFindAll(params)
        .then((res) => {
          let data = res.data.list;
          tableData.value = data;
          page.total = Number(res.data.total);
          loading.value = false;
        })
        .catch((err) => {
          ElMessage.error(res.msg);
          loading.value = false;
          tableData.value = [];
          page.pageNum = 1;
          page.total = 0;
          loading.value = false;
        });
    };
    // 添加内容
    const handleAddContent = () => {
      layer.title = "添加内容";
      layer.show = true;
      layer.width = "400px";
    };
    // 初始化
    getTableData(true);
    return {
      dateFormat,
      loading,
      tableData,
      page,
      layer,
      handleAddContent,
    };
  },
});
</script>
<style scoped lang="scss">
.layout-container {
  width: calc(100% - 10px);
  height: 100%;
  margin: 0 0 0 10px;
}
</style>
