<template>
	<div class="layout-container">
		<div class="layout-container-form flex space-between">
			<div class="layout-container-form-handle">
				<el-button type="primary" icon="el-icon-plus" @click="handleAddContent"
					>添加内容</el-button
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
			>
				<el-table-column
					prop="content"
					label="内容"
					show-overflow-tooltip
					align="center"
				/>
				<el-table-column prop="state" label="状态" align="center" width="60" />
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
		<Layer :layer="layer" @getTableData="getTableData" v-if="layer.show" />
	</div>
</template>

<script>
import { defineComponent, ref, reactive, inject, watch } from "vue";
import Table from "@/components/table/index.vue";
import { dateFormat } from "@/utils/utils";
import {
	getContentFindAll,
	deleteContent,
	searchContentChooseId,
} from "@/api/content";
import { ElMessage } from "element-plus";
import Layer from "./layer.vue";
import { status } from "@/utils/system/constant";
export default defineComponent({
	name: "ContentTable",
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
			choose_id: "",
		});
		// 激活choose
		const activeChoose = inject("active");
		// 弹窗控制
		const layer = reactive({
			show: false,
			title: "添加内容",
			showButton: true,
			width: "600px",
		});
		const getTableData = (init) => {
			loading.value = true;
			if (init) {
				page.pageNum = 1;
			}
			let params = {
				pageNum: page.pageNum,
				pageSize: page.pageSize,
				choose_id: activeChoose.value.id,
			};
			if (params.choose_id === "") {
				getContentFindAll(params).then((res) => {
					if (res.status === status.SUCCESS) {
						let data = res.data.list;
						tableData.value = data;
						page.total = Number(res.data.total);
						loading.value = false;
					} else {
						ElMessage.error(res.msg);
						loading.value = false;
						tableData.value = [];
						page.pageNum = 1;
						page.total = 0;
						loading.value = false;
					}
				});
			} else {
				searchContentChooseId(params).then((res) => {
					if (res.status === status.SUCCESS) {
						let data = res.data.list;
						tableData.value = data;
						page.total = Number(res.data.total);
						loading.value = false;
					} else {
						ElMessage.error(res.msg);
						loading.value = false;
						tableData.value = [];
						page.pageNum = 1;
						page.total = 0;
						loading.value = false;
					}
				});
			}
		};
		// 添加内容
		const handleAddContent = () => {
			layer.title = "添加内容";
			layer.show = true;
			layer.width = "600px";
		};

		// 修改
		const handleEdit = (row) => {
			layer.title = "修改内容";
			layer.show = true;
			layer.row = row;
			layer.width = "600px";
		};

		// 删除
		const handleDel = (row) => {
			const params = {
				id: row.id,
			};
			deleteContent(params).then((res) => {
				if (res.status === status.SUCCESS) {
					// 刷新请求
					ElMessage.success(res.msg);
					getTableData(tableData.value.length === 1 ? true : false);
				} else {
					ElMessage.success(res.msg);
				}
			});
		};
		watch(activeChoose, (newVal) => {
			getTableData(true);
		});
		return {
			dateFormat,
			loading,
			tableData,
			page,
			layer,
			handleAddContent,
			getTableData,
			handleEdit,
			handleDel,
		};
	},
});
</script>
<style scoped lang="scss">
.layout-container {
	width: calc(100% - 10px);
	height: 100%;
	margin: 0 0 0 10px;
}
</style>
