<template>
	<div class="layout-container">
		<div class="layout-container-form flex space-between">
			<div class="layout-container-form-handle">
				<el-button type="primary" icon="el-icon-plus" @click="uploadWaveStats"
					>上传波形统计图</el-button
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
					label="图片路径"
					align="center"
					width="70"
					show-overflow-tooltip
				/>
				<el-table-column prop="path" label="图片存储路径" align="center">
					<template #default="scope">
						<el-image
							class="image-style"
							:src="baseURL + scope.row.id"
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
				<el-table-column
					prop="state"
					label="波形统计图状态"
					align="center"
					width="120"
				>
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
			<Upload
				:layer="layer"
				v-if="layer.show"
				@getTableData="getTableData"
			></Upload>
		</div>
	</div>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import Table from "@/components/table/index.vue";
import { dateFormat } from "@/utils/utils";
import {
	getWaveStatsFindAll,
	batchDeleteWaveStats,
	deleteWaveStats,
} from "@/api/wavestats";
const baseURL = import.meta.env.VITE_BASE_URL + "/wavestats/search?id=";
import Upload from "./upload.vue";
export default defineComponent({
	name: "WaveStats",
	components: {
		Table,
		Upload,
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
			title: "添加波形统计图",
			showButton: true,
			width: "600px",
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
		// 添加波形图
		const uploadWaveStats = () => {
			layer.title = "添加波形统计图";
			layer.show = true;
			layer.width = "600px";
		};
		// 批量删除
		const handleBatchDel = (chooseData) => {
			// 封装id，封装成数组
			let wavestatsIds = [];
			chooseData.map((row) => {
				wavestatsIds.push(row.id);
			});
			const params = {
				wavestatsIds,
			};
			batchDeleteWaveStats(params)
				.then((res) => {
					ElMessage.success(res.msg);
					getTableData(tableData.value.length === 1 ? true : false);
				})
				.catch((err) => {
					ElMessage.error(err);
				});
		};
		// 编辑
		const handleEdit = (row) => {
			layer.title = "编辑波形统计图";
			layer.show = true;
			layer.row = row;
			layer.width = "600px";
		};
		// 删除
		const handleDel = (row) => {
			if (row) {
				const params = {
					id: row.id,
				};
				deleteWaveStats(params)
					.then((res) => {
						ElMessage.success(res.msg);
						// 刷新请求
						getTableData(tableData.value.length === 1 ? true : false);
					})
					.catch((err) => {
						ElMessage.error(err);
					});
			}
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
			layer,
			getTableData,
			handleSelectionChange,
			uploadWaveStats,
			handleBatchDel,
			handleEdit,
			handleDel,
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
