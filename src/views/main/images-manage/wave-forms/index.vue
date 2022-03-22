<template>
	<div class="layout-container">
		<div class="layout-container-form flex space-between">
			<div class="layout-container-form-handle">
				<el-button type="primary" icon="el-icon-plus" @click="uploadWaveForms"
					>上传波形图</el-button
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
				<el-button
					type="primary"
					icon="el-icon-search"
					class="search-btn"
					@click="getSearchWaveForms(true)"
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
				<el-table-column prop="url" label="波形图" align="center">
					<template #default="scope">
						<el-image
							class="image-style"
							:src="scope.row.url"
							:fit="cover"
						></el-image>
					</template>
				</el-table-column>
				<el-table-column
					prop="path"
					label="图片路径"
					align="center"
					width="300"
					show-overflow-tooltip
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
					width="200"
				/>
				<el-table-column
					prop="state"
					label="波形图状态"
					align="center"
					width="100"
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
	getWaveFormsFindAll,
	batchDeleteWaveForms,
	deleteWaveForms,
	findAllWaveFormsPointIds,
} from "@/api/waveforms";
import { searchPoint } from "@/api/point";
import Upload from "./upload.vue";
import { Search } from "@element-plus/icons";
import { getPortMapPointFindAll } from "@/api/portmappoint";
import { ElMessage } from "element-plus";
import { status } from "@/utils/system/constant";
export default defineComponent({
	name: "WaveForms",
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
			port_point_map_id: "",
		});
		// 选择的数据
		const chooseData = ref([]);
		const handleSelectionChange = (val) => {
			chooseData.value = val;
		};
		// 弹窗控制
		const layer = reactive({
			show: false,
			title: "添加波形图",
			showButton: true,
			width: "600px",
		});
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
			getWaveFormsFindAll(params).then((res) => {
				if (res.status === status.SUCCESS) {
					let data = res.data.list;
					tableData.value = data;
					page.total = Number(res.data.total);
					loading.value = false;
				} else {
					ElMessage.error(res.msg);
					tableData.value = [];
					page.pageNum = 1;
					page.total = 0;
					loading.value = false;
				}
			});
		};
		// 添加波形图
		const uploadWaveForms = () => {
			layer.title = "添加波形图";
			layer.show = true;
			layer.width = "600px";
		};

		// 批量删除
		const handleBatchDel = (chooseData) => {
			// 封装id，封装成数组
			const waveformsIds = [];
			const paths = [];
			chooseData.map((row) => {
				waveformsIds.push(row.id);
				paths.push(row.path);
			});
			const params = {
				waveformsIds,
				paths,
			};
			batchDeleteWaveForms(params).then((res) => {
				if (res.status === status.SUCCESS) {
					ElMessage.success(res.msg);
					getTableData(tableData.value.length === 1 ? true : false);
				} else {
					ElMessage.error(res.msg);
				}
			});
		};

		// 编辑
		const handleEdit = (row) => {
			layer.title = "编辑波形图";
			layer.show = true;
			layer.row = row;
			layer.width = "600px";
		};
		// 删除
		const handleDel = (row) => {
			if (row) {
				const params = {
					id: row.id,
					name: row.name,
				};
				deleteWaveForms(params).then((res) => {
					if (res.status === status.SUCCESS) {
						ElMessage.success(res.msg);
						// 刷新请求
						getTableData(tableData.value.length === 1 ? true : false);
					} else {
						ElMessage.error(res.msg);
					}
				});
			}
		};
		// 搜索,准备数据
		const portMapPointData = ref([]);
		// 获取港口点位图
		const getPortMapPointData = () => {
			const params = {
				pageNum: 1,
				pageSize: 50,
			};
			getPortMapPointFindAll(params).then((res) => {
				if (res.status === status.SUCCESS) {
					portMapPointData.value = res.data.list;
				} else {
					ElMessage.error(res.msg);
				}
			});
		};

		const getSearchWaveForms = (init) => {
			loading.value = true;
			if (init) {
				page.pageNum = 1;
			}
			const params = {
				pageNum: 1,
				pageSize: 50,
				port_point_map_id: page.port_point_map_id,
			};
			// 首先获取港口点位图，之后再通过点位图id去波形图中查找对应的数据，通过分页的形式
			// 点位ids
			searchPoint(params).then((res) => {
				const pointIds = [];
				if (res.status === status.SUCCESS) {
					// 将这个id拿出来给波形图，波形图组成数组，然后就可以通过接口查询了。
					for (const item of res.data.list) {
						if (item.id) {
							pointIds.push(item.id);
						}
					}
				}
				const params = {
					pageNum: 1,
					pageSize: 50,
					pointIds: pointIds,
				};
				findAllWaveFormsPointIds(params).then((res) => {
					if (res.status === status.SUCCESS) {
						let data = res.data.list;
						tableData.value = data;
						page.total = Number(res.data.total);
						ElMessage.success(res.msg);
						loading.value = false;
					} else {
						ElMessage.error(res.msg);
						loading.value = false;
						tableData.value = [];
						page.pageNum = 1;
						page.total = 0;
					}
				});
			});
		};
		// 初始化
		getTableData(true);
		getPortMapPointData();

		return {
			loading,
			tableData,
			page,
			chooseData,
			dateFormat,
			layer,
			portMapPointData,
			getTableData,
			handleSelectionChange,
			uploadWaveForms,
			handleBatchDel,
			handleEdit,
			handleDel,
			getPortMapPointData,
			getSearchWaveForms,
		};
	},
});
</script>
<style scoped lang="scss">
.image-style {
	width: 100%;
	height: 100%;
}
.el-input__icon {
	line-height: 32px;
}
</style>
