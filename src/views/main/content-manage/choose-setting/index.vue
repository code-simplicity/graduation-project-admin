<template>
  <div class="layout-container">
    <div class="layout-container-form flex space-between">
      <div class="layout-container-form-handle">
        <el-button type="primary" icon="el-icon-plus" @click="handleChoose">
          添加选择</el-button
        >
        <el-popconfirm title="批量删除" @confirm="handleBatchDel(chooseData)">
          <template #reference>
            <el-button
              type="danger"
              icon="el-icon-delete"
              :disabled="chooseData.length === 0"
              >批量删除</el-button
            >
          </template>
        </el-popconfirm>
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
        <el-table-column prop="content" label="选择内容" align="center" />
        <el-table-column prop="category" label="内容分类" align="center" />
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
import { dateFormat } from "@/utils/utils";
import { ElMessage } from "element-plus";
import {
  getChooseFindAll,
  deleteChoose,
  batchDeleteChoose,
} from "@/api/choose";
import Layer from "./layer.vue";
export default defineComponent({
  name: "ChooseSetting",
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
    // 选择数据
    const chooseData = ref([]);
    const handleSelectionChange = (val) => {
      chooseData.value = val;
    };
    // 弹窗控制
    const layer = reactive({
      show: false,
      title: "添加点位",
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
      getChooseFindAll(params)
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

    // 添加选择
    const handleChoose = () => {
      layer.title = "添加选择";
      layer.show = true;
      layer.width = "400px";
    };

    // 编辑点位
    const handleEdit = (row) => {
      layer.title = "编辑选择";
      layer.show = true;
      layer.width = "400px";
      layer.row = row;
    };

    // 删除
    const handleDel = (row) => {
      let params = {
        id: row.id,
      };
      deleteChoose(params)
        .then((res) => {
          if (res.status === 200) {
            ElMessage.success(res.msg);
          } else {
            ElMessage({
              message: res.msg,
              type: "error",
            });
          }
          // 刷新请求
          getTableData(tableData.value.length === 1 ? true : false);
        })
        .catch((err) => {
          ElMessage({
            message: res.msg,
            type: "error",
          });
        });
    };

    // 批量删除
    const handleBatchDel = (chooseData) => {
      // 封装id，封装成数组
      let chooseIds = [];
      chooseData.map((row) => {
        chooseIds.push(row.id);
      });
      const params = {
        chooseIds,
      };
      console.log(`params`, params);
      batchDeleteChoose(params)
        .then((res) => {
          ElMessage.success(res.msg);
          getTableData(tableData.value.length === 1 ? true : false);
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
      page,
      layer,
      dateFormat,
      chooseData,
      getTableData,
      handleChoose,
      handleEdit,
      handleDel,
      handleBatchDel,
      handleSelectionChange,
    };
  },
});
</script>
<style scoped lang="scss"></style>
