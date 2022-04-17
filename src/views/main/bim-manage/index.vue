<template>
	<div class="layout-container">
		<div class="layout-container-form flex space-between">
			<div class="layout-container-form-handle">
				<el-button
					type="primary"
					icon="el-icon-plus"
					@click="handleAddWaveDataExcel"
				>
					添加bim模型</el-button
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
					prop="url"
					label="bim"
					align="center"
					show-overflow-tooltip
				>
				</el-table-column>
				<el-table-column
					prop="path"
					label="bim存储路径"
					align="center"
					width="250"
					show-overflow-tooltip
				/>
				<el-table-column
					prop="type"
					label="bim类型"
					align="center"
					width="80"
					show-overflow-tooltip
				/>
				<el-table-column
					prop="name"
					label="bim名称"
					align="center"
					width="100"
					sortable
					show-overflow-tooltip
				/>
				<el-table-column prop="state" label="状态" align="center" width="80">
					<template #default="scope">
						<el-tag :type="scope.row.state === '1' ? 'primary' : 'danger'">
							{{ scope.row.state === "1" ? "存在" : "已删除" }}
						</el-tag>
					</template>
				</el-table-column>
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
				<el-table-column label="操作" align="center" fixed="right" width="250">
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
				@getTableData="getTableData"
				v-if="layer.show"
			></Layer>
		</div>
	</div>
</template>
<script setup>
import { ref, reactive } from "vue";
import { Plus } from "@element-plus/icons";
import { dateFormat } from "@/utils/utils";
import { bimFindAll, deleteBim, batchDeleteBim } from "@/api/bim";
import { ElMessage } from "element-plus";
import Table from "@/components/table/index.vue";
import Layer from "./layer.vue";
import { status } from "@/utils/system/constant";

const loading = ref(true);
const tableData = ref([]);
const page = reactive({
	pageNum: 1,
	pageSize: 10,
	total: 0,
	pages: 0,
	port_point_map_id: "",
	content: "",
});
// 弹窗控制
const layer = reactive({
	show: false,
	title: "上传bim",
	showButton: true,
	width: "400px",
});

// 选择数据
const chooseData = ref([]);
const handleSelectionChange = (val) => {
	chooseData.value = val;
};
const getTableData = async (init) => {
	loading.value = true;
	if (init) {
		page.pageNum = 1;
	}
	const params = {
		pageNum: page.pageNum,
		pageSize: page.pageSize,
	};
	const result = await bimFindAll(params);
	if (result.code === status.SUCCESS) {
		let data = result.data.list;
		tableData.value = data;
		page.total = Number(result.data.total);
		loading.value = false;
	} else {
		ElMessage.error(result.msg);
		loading.value = false;
		tableData.value = [];
		page.pageNum = 1;
		page.total = 0;
	}
};
// 添加bim
const handleAddWaveDataExcel = () => {
	layer.title = "上传bim";
	layer.show = true;
	layer.width = "400px";
};
// 编辑bim
const handleEdit = (row) => {
	layer.title = "编辑bim";
	layer.show = true;
	layer.width = "400px";
	layer.row = row;
};
// 删除bim
const handleDel = async (row) => {
	let params = {
		id: row.id,
		name: row.name,
	};
	const result = await deleteBim(params);
	if (result.code === status.SUCCESS) {
		ElMessage.success(result.msg);
		// 刷新请求
		getTableData(tableData.value.length === 1 ? true : false);
	} else {
		ElMessage.error(result.msg);
	}
};

// 批量删除
const handleBatchDel = async (chooseData) => {
	// 封装id，封装成数组
	let bimIds = [];
	let paths = [];
	chooseData.map((row) => {
		bimIds.push(row.id);
		paths.push(row.path);
	});
	const params = {
		bimIds,
		paths,
	};
	const result = await batchDeleteBim(params);
	if (result.code === status.SUCCESS) {
		ElMessage.success(result.msg);
		getTableData(tableData.value.length === 1 ? true : false);
	} else {
		ElMessage.error(result.msg);
	}
};

// 初始化表格数据
getTableData(true);
</script>
<style lang="scss" scope></style>
