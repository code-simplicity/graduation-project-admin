<template>
  <div class="layout-container">
    <div class="layout-container-form flex space-between">
      <div class="layout-container-form-handle">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="uploadPortMapPoint"
          >上传港口点位图</el-button
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
          width="70"
        />
        <el-table-column prop="state" label="状态" align="center" width="60" />
        <el-table-column
          prop="water_level"
          label="设计水位"
          align="center"
          width="60"
        />
        <el-table-column
          prop="wave_direction"
          label="波浪来向"
          align="center"
          width="60"
        />
        <el-table-column
          prop="embank_ment"
          label="外堤布置"
          align="center"
          width="60"
        />
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
import { getPortMapPointFindAll, deletePortMapPoint } from "@/api/portmappoint";
import { dateFormat } from "@/utils/utils";
import { ElMessage } from "element-plus";
import Upload from "./upload.vue";
const baseURL = import.meta.env.VITE_BASE_URL;
export default defineComponent({
  name: "PortMapPoint",
  components: {
    Table,
    Upload,
  },
  setup() {
    const loading = ref(true);
    const tableData = ref([]);
    const chooseData = ref([]);
    const page = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0,
      pages: 0,
    });
    const upload = reactive({
      show: false,
      title: "上传港口点位图",
      showButton: true,
      width: "600px",
    });
    const getTableData = (init) => {
      loading.value = true;
      if (init) {
        page.pageNum = 1;
      }
      const params = {
        pageNum: page.pageNum,
        pageSize: page.pageSize,
      };
      getPortMapPointFindAll(params)
        .then((res) => {
          let data = res.data.list;
          tableData.value = data;
          page.total = Number(res.data.total);
        })
        .catch((err) => {
          loading.value = false;
          tableData.value = [];
          page.pageNum = 1;
          page.total = 0;
        })
        .finally(() => {
          loading.value = false;
        });
    };
    // 上传港口点位图
    const uploadPortMapPoint = () => {
      upload.title = "上传港口点位图";
      upload.show = true;
      upload.width = "600px";
    };
    // 编辑港口点位图
    const handleEdit = (row) => {
      upload.title = "修改港口点位图";
      upload.row = row;
      upload.show = true;
      upload.width = "600px";
    };
    // 删除港口点位图
    const handleDel = (row) => {
      const params = {
        id: row.id,
      };
      deletePortMapPoint(params)
        .then((res) => {
          ElMessage.error(res.msg);
        })
        .catch((err) => {
          ElMessage.error(err);
        });
    };
    // 初始化表格数据
    getTableData(true);
    return {
      loading,
      tableData,
      chooseData,
      page,
      baseURL,
      upload,
      getTableData,
      dateFormat,
      uploadPortMapPoint,
      handleEdit,
      handleDel,
    };
  },
});
</script>
<style scoped lang="scss"></style>
