<template>
  <div class="layout-container">
    <div class="layout-container-form flex space-between">
      <div class="layout-container-form-handle">
        <el-button type="primary" icon="el-icon-plus" @click="uploadPortMap"
          >上传港口地图</el-button
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          prop="id"
          label="id"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="url"
          label="图片路径"
          align="center"
          width="70"
        />
        <el-table-column prop="path" label="图片存储路径" align="center">
          <template #default="scope">
            <el-image :src="baseURL + scope.row.path" :fit="cover"></el-image>
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
          width="70"
        />
        <el-table-column prop="state" label="状态" align="center" width="60" />
        <el-table-column
          prop="create_time"
          label="创建时间"
          :formatter="dateFormat"
          align="center"
        />
        <el-table-column
          prop="update_time"
          label="更新时间"
          :formatter="dateFormat"
          align="center"
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
    <Upload
      :layer="upload"
      :v-if="upload.show"
      @getTableData="getTableData"
    ></Upload>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import Table from "@/components/table/index.vue";
import { getPortMapFind } from "@/api/portmap";
import { dateFormat } from "@/utils/utils";
const baseURL = import.meta.env.VITE_BASE_URL;
import Upload from "./upload.vue";
export default defineComponent({
  name: "PortMap",
  components: {
    Table,
    Upload,
  },
  setup() {
    const loading = ref(true);
    const tableData = ref([]);
    const upload = reactive({
      show: false,
      title: "上传港口地图",
      showButton: true,
      width: "400px",
    });
    const getTableData = (init) => {
      if (init) {
        loading.value = true;
        getPortMapFind()
          .then((res) => {
            let data = res.data;
            tableData.value = data;
          })
          .catch((err) => {
            loading.value = false;
          })
          .finally(() => {
            loading.value = false;
          });
      }
    };
    const uploadPortMap = () => {
      upload.title = "上传港口地图";
      upload.show = true;
      upload.width = "400px";
    };
    // 初始化表格数据
    getTableData(true);
    return {
      loading,
      tableData,
      dateFormat,
      baseURL,
      upload,
      getTableData,
      uploadPortMap,
    };
  },
});
</script>
<style scoped lang="scss"></style>
