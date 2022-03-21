<template>
	<div class="layout-container">
		<div class="layout-container-form flex space-between">
			<div class="layout-container-form-handle">
				<el-button type="primary" icon="el-icon-plus" @click="uploadPortMap"
					>上传港口地图</el-button
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
					width="280"
				/>
				<el-table-column
					prop="type"
					label="图片类型"
					align="center"
					width="160"
				/>
				<el-table-column
					prop="name"
					label="图片名称"
					align="center"
					width="220"
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
import { getPortMapFind, deletePortMap } from "@/api/portmap";
import { dateFormat } from "@/utils/utils";
import { ElMessage } from "element-plus";
import Upload from "./upload.vue";
import { status } from "@/utils/system/constant";
export default defineComponent({
	name: "PortMap",
	components: {
		Table,
		Upload,
	},
	setup() {
		const loading = ref(true);
		const tableData = ref([]);
		const upload = reactive({
			show: false,
			title: "上传港口地图",
			showButton: true,
			width: "400px",
		});
		// 页码参数封装
		const page = reactive({
			pageNum: 1,
			pageSize: 10,
			total: 0,
			pages: 0,
		});
		const getTableData = (init) => {
			loading.value = true;
			if (init) {
				page.pageNum = 1;
			}
			const params = {
				pageNum: page.pageNum,
				pageSize: page.pageSize,
			};
			getPortMapFind(params).then((res) => {
				if (res.status === status.SUCCESS) {
					let data = res.data.list;
					tableData.value = data;
					page.total = Number(res.data.total);
					loading.value = false;
				} else {
					loading.value = false;
					tableData.value = [];
					page.pageNum = 1;
					page.total = 0;
				}
			});
		};
		const uploadPortMap = () => {
			upload.title = "上传港口地图";
			upload.show = true;
			upload.width = "400px";
		};
		// 编辑用户
		const handleEdit = (row) => {
			upload.title = "修改港口地图";
			upload.row = row;
			upload.show = true;
			upload.width = "400px";
		};
		// 删除港口地图
		const handleDel = (row) => {
			const params = {
				id: row.id,
				name: row.name,
			};
			deletePortMap(params).then((res) => {
				if (res.status === status.SUCCESS) {
					ElMessage.success(res.msg);
					// 刷新请求
					getTableData(tableData.value.length === 1 ? true : false);
				} else {
					ElMessage.error(res.msg);
				}
			});
		};
		// 初始化表格数据
		getTableData(true);
		return {
			loading,
			tableData,
			dateFormat,
			upload,
			page,
			getTableData,
			uploadPortMap,
			handleDel,
			handleEdit,
		};
	},
});
</script>
<style scoped lang="scss">
.image-style {
	width: 100px;
	height: 100px;
}
</style>
