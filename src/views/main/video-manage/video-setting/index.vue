<template>
  <div class="layout-container">
    <div class="layout-container-form flex space-between">
      <div class="layout-container-form-handle">
        <el-button type="primary" icon="el-icon-plus" @click="handleAddVideo">
          添加视频</el-button
        >
      </div>
      <div class="layout-container-form-search"></div>
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
          show-overflow-tooltip
          align="center"
        />
        <el-table-column
          prop="url"
          label="视频路径"
          show-overflow-tooltip
          align="center"
        />
        <el-table-column
          prop="path"
          label="视频存储路径"
          show-overflow-tooltip
          align="center"
          width="200"
        />
        <el-table-column
          prop="type"
          label="视频类型"
          show-overflow-tooltip
          align="center"
        />
        <el-table-column
          prop="name"
          label="视频名称"
          show-overflow-tooltip
          align="center"
        />
        <el-table-column
          prop="state"
          label="视频状态"
          show-overflow-tooltip
          align="center"
        />
        <el-table-column
          prop="water_level"
          label="设计水位"
          show-overflow-tooltip
          align="center"
          width="120"
        />
        <el-table-column
          prop="wave_direction"
          label="波浪来向"
          show-overflow-tooltip
          align="center"
        />
        <el-table-column
          prop="embank_ment"
          label="外堤布置"
          show-overflow-tooltip
          align="center"
        />
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
      <Layer
        :layer="layer"
        v-if="layer.show"
        @getTableData="getTableData"
      ></Layer>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import Table from "@/components/table/index.vue";
import { getVideoFindAll } from "@/api/video";
import Layer from "./layer.vue";
export default defineComponent({
  name: "VideoSetting",
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
    });
    // 弹窗控制
    const layer = reactive({
      show: false,
      title: "添加视频",
      showButton: true,
      width: "600px",
    });
    // 获取视频
    const getTableData = (init) => {
      loading.value = true;
      if (init) {
        page.pageNum = 1;
      }
      const params = {
        pageNum: page.pageNum,
        pageSize: page.pageSize,
      };
      getVideoFindAll(params)
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

    // 添加视频
    const handleAddVideo = () => {
      layer.title = "添加视频";
      layer.show = true;
      layer.width = "600px";
    };
    // 初始化
    getTableData(true);
    return {
      loading,
      tableData,
      page,
      layer,
      handleAddVideo,
    };
  },
});
</script>
<style scoped lang="scss"></style>
