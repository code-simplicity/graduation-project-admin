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
					<el-col :span="8">
						<el-input
							v-model="input.water_level"
							placeholder="设计水位"
							clearable
							><template #prefix>
								<el-icon class="el-input__icon"><search /></el-icon> </template
						></el-input>
					</el-col>
					<el-col :span="8">
						<el-input
							v-model="input.wave_direction"
							placeholder="波浪来向"
							clearable
							><template #prefix>
								<el-icon class="el-input__icon"><search /></el-icon> </template
						></el-input>
					</el-col>
					<el-col :span="8">
						<el-input
							v-model="input.embank_ment"
							placeholder="外堤布置"
							clearable
							><template #prefix>
								<el-icon class="el-input__icon"><search /></el-icon> </template
						></el-input>
					</el-col>
				</el-row>
				<el-button
					type="primary"
					icon="el-icon-search"
					class="search-btn"
					@click="getSearchPortMapPoint(true)"
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
				<el-table-column prop="url" label="图片" align="center">
					<template #default="scope">
						<el-image
							class="image-style"
							:src="scope.row.url"
							fit="cover"
							lazy
						></el-image
					></template>
				</el-table-column>
				<el-table-column
					prop="path"
					label="图片存储路径"
					align="center"
					width="250"
				/>
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
					prop="water_level"
					label="设计水位"
					align="center"
					width="100"
				/>
				<el-table-column
					prop="wave_direction"
					label="波浪来向"
					align="center"
					width="80"
				/>
				<el-table-column
					prop="embank_ment"
					label="外堤布置"
					align="center"
					width="80"
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
		</div>
		<Upload
			:layer="upload"
			v-if="upload.show"
			@getTableData="getTableData"
		></Upload>
	</div>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import Table from "@/components/table/index.vue";
import {
	getPortMapPointFindAll,
	deletePortMapPoint,
	searchPortMapPoint,
	batchDeletePortpointMap,
} from "@/api/portmappoint";
import { dateFormat } from "@/utils/utils";
import { ElMessage } from "element-plus";
import Upload from "./upload.vue";
import { Search } from "@element-plus/icons";
import { status } from "@/utils/system/constant";
export default defineComponent({
	name: "PortMapPoint",
	components: {
		Table,
		Upload,
		Search,
	},
	setup() {
		const loading = ref(true);
		const tableData = ref([]);
		const page = reactive({
			pageNum: 1,
			pageSize: 10,
			total: 0,
			pages: 0,
		});
		// 输入框的值
		const input = reactive({
			water_level: "",
			wave_direction: "",
			embank_ment: "",
		});
		const upload = reactive({
			show: false,
			title: "上传港口点位图",
			showButton: true,
			width: "600px",
		});
		// 选择的数据
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
			const result = await getPortMapPointFindAll(params);
			if (result.code === status.SUCCESS) {
				let data = result.data.list;
				tableData.value = data;
				page.total = Number(result.data.total);
				loading.value = false;
			} else {
				loading.value = false;
				tableData.value = [];
				page.pageNum = 1;
				page.total = 0;
			}
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
		const handleDel = async (row) => {
			const params = {
				id: row.id,
				name: row.name,
			};
			const result = await deletePortMapPoint(params);
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
			const portpointmapIds = [];
			const paths = [];
			chooseData.map((row) => {
				portpointmapIds.push(row.id);
				paths.push(row.path);
			});
			const params = {
				portpointmapIds,
				paths,
			};
			const result = await batchDeletePortpointMap(params);
			if (result.code === status.SUCCESS) {
				ElMessage.success(result.msg);
				getTableData(tableData.value.length === 1 ? true : false);
			} else {
				ElMessage.error(result.msg);
			}
		};
		const getSearchPortMapPoint = async (init) => {
			loading.value = true;
			if (init) {
				page.pageNum = 1;
			}
			const params = {
				pageNum: page.pageNum,
				pageSize: page.pageSize,
				...input,
			};
			const result = await searchPortMapPoint(params);
			if (result.code === status.SUCCESS) {
				let data = result.data.list;
				tableData.value = data;
				page.total = Number(result.data.total);
				ElMessage.success(result.msg);
				loading.value = false;
			} else {
				ElMessage.error(result.msg);
				loading.value = false;
				tableData.value = [];
				page.pageNum = 1;
				page.total = 0;
			}
		};
		// 初始化表格数据
		getTableData(true);
		return {
			loading,
			tableData,
			chooseData,
			page,
			upload,
			input,
			getTableData,
			dateFormat,
			uploadPortMapPoint,
			handleEdit,
			handleDel,
			getSearchPortMapPoint,
			handleBatchDel,
			handleSelectionChange,
		};
	},
});
</script>
<style scoped lang="scss">
.el-input__icon {
	line-height: 32px;
}
.image-style {
	width: 120px;
	height: 120px;
}
</style>
