<template>
	<div class="layout-container">
		<div class="layout-container-form flex space-between">
			<div class="layout-container-form-handle">
				<el-button type="primary" icon="el-icon-plus" @click="handleAddPoint">
					添加点位</el-button
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
			<div class="layout-container-form-search">
				<el-row :gutter="10">
					<el-col :span="12">
						<el-select
							v-model="page.port_point_map_id"
							placeholder="请选择港口点位地图"
							clearable
						>
							<el-option
								v-for="item in portMapPointData"
								:key="item.id"
								:label="item.name"
								:value="item.id"
							></el-option>
						</el-select>
					</el-col>
					<el-col :span="12">
						<el-input
							v-model="page.content"
							placeholder="请输入点位内容"
							clearable
						></el-input>
					</el-col>
				</el-row>
				<el-button
					type="primary"
					icon="el-icon-search"
					class="search-btn"
					@click="getSearchPoint(true)"
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
				<el-table-column
					prop="content"
					label="点位内容"
					align="center"
					show-overflow-tooltip
					sortable
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
				@getTableData="getTableData"
				v-if="layer.show"
			></Layer>
		</div>
	</div>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import { Plus } from "@element-plus/icons";
import Table from "@/components/table/index.vue";
import { dateFormat } from "@/utils/utils";
import {
	getPointFindAll,
	deletePoint,
	searchPoint,
	batchDeletePoint,
} from "@/api/point";
import { getPortMapPointFindAll } from "@/api/portmappoint";
import { ElMessage } from "element-plus";
import Layer from "./layer.vue";
import { status } from "@/utils/system/constant";
import { pointCompare } from "@/utils/utils";
export default defineComponent({
	name: "PointSetting",
	components: {
		Plus,
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
			pages: 0,
			port_point_map_id: "",
			content: "",
		});
		// 弹窗控制
		const layer = reactive({
			show: false,
			title: "添加点位",
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
			// 走通过港口点位图id查看点位
			if (page.port_point_map_id) {
				getSearchPoint();
			} else {
				const params = {
					pageNum: page.pageNum,
					pageSize: page.pageSize,
				};
				const result = await getPointFindAll(params);
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
			}
		};
		// 添加点位
		const handleAddPoint = () => {
			layer.title = "添加点位";
			layer.show = true;
			layer.width = "400px";
		};
		// 编辑点位
		const handleEdit = (row) => {
			layer.title = "编辑点位";
			layer.show = true;
			layer.width = "400px";
			layer.row = row;
		};
		// 删除点位
		const handleDel = async (row) => {
			let params = {
				id: row.id,
			};
			const result = await deletePoint(params);
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
			let pointIds = [];
			chooseData.map((row) => {
				pointIds.push(row.id);
			});
			const params = {
				pointIds,
			};
			const result = await batchDeletePoint(params);
			if (result.code === status.SUCCESS) {
				ElMessage.success(result.msg);
				getTableData(tableData.value.length === 1 ? true : false);
			} else {
				ElMessage.error(result.msg);
			}
		};

		// 搜索,准备数据
		const portMapPointData = ref([]);
		// 获取港口点位图
		const getPortMapPointData = async () => {
			const params = {
				pageNum: 1,
				pageSize: 50,
			};
			const result = await getPortMapPointFindAll(params);
			if (result.code === status.SUCCESS) {
				portMapPointData.value = result.data.list;
			} else {
				ElMessage.error(result.msg);
			}
		};
		// 搜索
		const getSearchPoint = async (init) => {
			loading.value = true;
			if (init) {
				page.pageNum = 1;
			}
			let params = {
				pageNum: page.pageNum,
				pageSize: page.pageSize,
				port_point_map_id: page.port_point_map_id,
				content: page.content,
			};
			const result = await searchPoint(params);
			if (result.code === status.SUCCESS) {
				let data = result.data.list;
				tableData.value = data;
				ElMessage.success(result.msg);
				loading.value = false;
				page.total = Number(result.data.total);
			} else {
				ElMessage.error(result.msg);
				tableData.value = [];
				page.pageNum = 1;
				page.total = 0;
			}
		};
		// 初始化表格数据
		getTableData(true);
		getPortMapPointData();
		return {
			tableData,
			page,
			dateFormat,
			layer,
			portMapPointData,
			chooseData,
			getTableData,
			handleAddPoint,
			handleDel,
			handleEdit,
			getPortMapPointData,
			getSearchPoint,
			handleSelectionChange,
			handleBatchDel,
		};
	},
});
</script>
<style scoped lang="scss"></style>
