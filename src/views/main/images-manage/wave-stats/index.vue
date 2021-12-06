<template>
  <div class="layout-container">
    <div class="layout-container-form flex space-between">
      <div class="layout-container-form-handle"></div>
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          prop="id"
          label="id"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="point_id"
          label="点位"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="url"
          label="图片路径"
          align="center"
          width="70"
          show-overflow-tooltip
        />
        <el-table-column prop="path" label="图片存储路径" align="center">
          <template #default="scope">
            <el-image
              class="image-style"
              :src="baseURL + scope.row.path"
              :fit="cover"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="图片类型"
          align="center"
          width="80"
        />
        <el-table-column
          prop="name"
          label="图片名称"
          align="center"
          width="80"
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
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import Table from "@/components/table/index.vue";
import { dateFormat } from "@/utils/utils";
import { getWaveStatsFindAll } from "@/api/wavestats";
const baseURL = import.meta.env.VITE_BASE_URL;

export default defineComponent({
  name: "WaveStats",
  components: {
    Table,
  },
  setup() {
    const loading = ref(true);
    const tableData = ref([]);
    const page = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0,
    });
    // 选择的数据
    const chooseData = ref([]);
    const handleSelectionChange = (val) => {
      chooseData.value = val;
    };
    // 获取表格数据
    const getTableData = (init) => {
      loading.value = true;
      if (init) {
        page.pageNum = 1;
      }
      const params = {
        pageNum: page.pageNum,
        pageSize: page.pageSize,
      };
      getWaveStatsFindAll(params)
        .then((res) => {
          let data = res.data.list;
          tableData.value = data;
          page.total = Number(res.data.total);
        })
        .catch((err) => {
          ElMessage.error(err);
          tableData.value = [];
          page.pageNum = 1;
          page.total = 0;
        })
        .finally(() => {
          loading.value = false;
        });
    };
    // 初始化
    getTableData(true);
    return {
      loading,
      tableData,
      page,
      chooseData,
      baseURL,
      dateFormat,
      getTableData,
      handleSelectionChange,
    };
  },
});
</script>
<style scoped lang="scss">
.image-style {
  width: 100%;
  height: 100%;
}
</style>
