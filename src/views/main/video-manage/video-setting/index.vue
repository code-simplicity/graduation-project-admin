<template>
	<div class="layout-container">
		<div class="layout-container-form flex space-between">
			<div class="layout-container-form-handle">
				<el-button type="primary" icon="el-icon-plus" @click="handleAddVideo">
					添加视频</el-button
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
						></el-input>
					</el-col>
					<el-col :span="8">
						<el-input
							v-model="input.wave_direction"
							placeholder="波浪来向"
							clearable
						></el-input>
					</el-col>
					<el-col :span="8">
						<el-input
							v-model="input.embank_ment"
							placeholder="外堤布置"
							clearable
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
				<el-table-column
					prop="url"
					label="视频"
					show-overflow-tooltip
					align="center"
					width="200"
				>
					<template #default="scope">
						<video
							class="video-style"
							:src="scope.row.url"
							controls
						></video> </template
				></el-table-column>
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
					align="center"
					width="80"
				>
					<template #default="scope">
						<el-tag :type="scope.row.state === '1' ? 'primary' : 'danger'">
							{{ scope.row.state === "1" ? "存在" : "已删除" }}
						</el-tag>
					</template>
				</el-table-column>
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
import { getVideoFindAll, deleteVideo, batchDeleteVideo } from "@/api/video";
import Layer from "./layer.vue";
import { ElMessage } from "element-plus";
import { dateFormat } from "@/utils/utils";
import { status } from "@/utils/system/constant";
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
		// 选择的数据
		const chooseData = ref([]);
		const handleSelectionChange = (val) => {
			chooseData.value = val;
		};
		// 输入框的值
		const input = reactive({
			water_level: "",
			wave_direction: "",
			embank_ment: "",
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
			getVideoFindAll(params).then((res) => {
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

		// 添加视频
		const handleAddVideo = () => {
			layer.title = "添加视频";
			layer.show = true;
			layer.width = "600px";
		};

		// 编辑视频
		const handleEdit = (row) => {
			layer.title = "编辑视频";
			layer.show = true;
			layer.row = row;
			layer.width = "600px";
		};

		// 删除视频
		const handleDel = (row) => {
			const params = {
				id: row.id,
				name: row.name,
			};
			deleteVideo(params).then((res) => {
				if (res.status === status.SUCCESS) {
					ElMessage.success(res.msg);
					// 刷新请求
					getTableData(tableData.value.length === 1 ? true : false);
				} else {
					ElMessage.error(res.msg);
				}
			});
		};
		// 批量删除
		const handleBatchDel = (chooseData) => {
			// 封装id，封装成数组
			const videoIds = [];
			const paths = [];
			chooseData.map((row) => {
				videoIds.push(row.id);
				paths.push(row.path);
			});
			const params = {
				videoIds,
				paths,
			};
			batchDeleteVideo(params).then((res) => {
				if (res.status === status.SUCCESS) {
					ElMessage.success(res.msg);
					getTableData(tableData.value.length === 1 ? true : false);
				} else {
					ElMessage.error(res.msg);
				}
			});
		};
		// 初始化
		getTableData(true);
		return {
			loading,
			tableData,
			page,
			layer,
			input,
			chooseData,
			dateFormat,
			handleAddVideo,
			handleDel,
			handleEdit,
			getTableData,
			handleSelectionChange,
			handleBatchDel,
		};
	},
});
</script>
<style scoped lang="scss">
.video-style {
	width: 100%;
	height: 100%;
}
</style>
