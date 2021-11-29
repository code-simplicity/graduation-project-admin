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
        <el-table-column prop="id" label="学号" align="center" />
        <el-table-column prop="user_name" label="姓名" align="center" />
        <el-table-column prop="roles" label="角色" align="center" />
        <el-table-column prop="state" label="状态" align="center" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.state === '1' ? 'primary' : 'danger'">
              {{ scope.row.state === "1" ? "存在" : "已删除" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="得分" align="center" width="80" />
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
        <el-table-column label="操作" align="center" fixed="right" width="200">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm title="删除" @confirm="handleDel([scope.row])">
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
import moment from "moment";
import Table from "@/components/table/index.vue";
import { ElMessage } from "element-plus";
import { getUserList } from "@/api/user";

export default defineComponent({
  name: "user",
  components: {
    Table,
  },
  setup() {
    // 页码参数封装
    const page = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0,
      pages: 0,
    });
    const loading = ref(true);
    const tableData = ref([]);
    const chooseData = ref([]);
    const handleSelectionChange = (val) => {
      chooseData.value = val;
    };
    // 获取用户数据
    const getTableData = (init) => {
      loading.value = true;
      if (init) {
        page.pageNum = 1;
      }
      let params = {
        pageNum: page.pageNum,
        pageSize: page.pageSize,
      };
      getUserList(params)
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
    getTableData(true);
    // 日期格式化
    const dateFormat = (row, column) => {
      const date = row[column.property];
      if (date === undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    };
    return {
      page,
      loading,
      tableData,
      chooseData,
      handleSelectionChange,
      getTableData,
      dateFormat,
    };
  },
});
</script>
<style scoped lang="scss"></style>
