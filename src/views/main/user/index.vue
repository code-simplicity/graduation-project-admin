<template>
	<div class="layout-container">
		<div class="layout-container-form flex space-between">
			<div class="layout-container-form-handle">
				<el-button type="primary" icon="el-icon-plus" @click="handleAddUser"
					>新增</el-button
				>
				<el-button
					type="success"
					icon="el-icon-folder-checked"
					@click="handleUploadExcel"
					>批量导入</el-button
				>
				<el-button
					type="info"
					icon="el-icon-takeaway-box"
					@click="handleExportUser"
					>批量导出</el-button
				>
				<el-button icon="el-icon-download" @click="handleDownloadExcel"
					>模板下载</el-button
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
				<el-input v-model="page.user" placeholder="学号/用户名" clearable>
					<template #prefix>
						<el-icon class="el-input__icon"><search /></el-icon>
					</template>
				</el-input>
				<el-button
					type="primary"
					icon="el-icon-search"
					class="search-btn"
					@click="getSearchUserData(true)"
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
				<el-table-column prop="id" label="学号" align="center" sortable />
				<el-table-column prop="user_name" label="姓名" align="center" />
				<el-table-column
					prop="email"
					label="邮箱"
					align="center"
					show-overflow-tooltip
				/>
				<el-table-column prop="sex" label="性别" align="center" />
				<el-table-column prop="roles" label="角色" align="center" />
				<el-table-column
					prop="state"
					label="用户状态"
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
					prop="score"
					label="得分"
					align="center"
					width="80"
					sortable
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
				<el-table-column label="操作" align="center" fixed="right" width="300">
					<template #default="scope">
						<el-button @click="handleEdit(scope.row)">编辑</el-button>
						<el-popconfirm title="删除" @confirm="handleDel(scope.row)">
							<template #reference>
								<el-button type="danger">删除</el-button>
							</template>
						</el-popconfirm>
						<el-button type="warning" @click="handleResetUserId(scope.row)"
							>重置学号</el-button
						>
					</template>
				</el-table-column>
			</Table>
			<Layer
				:layer="layer"
				@getTableData="getTableData"
				v-if="layer.show"
			></Layer>
			<Upload
				:layer="upload"
				v-if="upload.show"
				@getTableData="getTableData"
			></Upload>
			<Reset
				:reset="reset"
				v-if="reset.show"
				@getTableData="getTableData"
			></Reset>
		</div>
	</div>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import { dateFormat } from "@/utils/utils";
import Table from "@/components/table/index.vue";
import { ElMessage } from "element-plus";
import {
	getUserList,
	getUserSerachList,
	deleteUser,
	batchDeleteUser,
} from "@/api/user";
import { exportExcel, exportExceltUser } from "@/api/excel";
import { Search } from "@element-plus/icons";
import Layer from "./layer.vue";
import Upload from "./upload.vue";
import Reset from "./reset.vue";
import { status } from "@/utils/system/constant";
export default defineComponent({
	name: "user",
	components: {
		Table,
		Search,
		Layer,
		Upload,
		Reset,
	},
	setup() {
		// 页码参数封装
		const page = reactive({
			pageNum: 1,
			pageSize: 10,
			total: 0,
			pages: 0,
			user: "",
		});
		// 弹窗控制
		const layer = reactive({
			show: false,
			title: "添加用户",
			showButton: true,
			width: "400px",
		});
		const upload = reactive({
			show: false,
			title: "导入用户",
			showButton: true,
			width: "400px",
		});
		const reset = reactive({
			show: false,
			title: "重置学号",
			showButton: true,
			width: "400px",
		});
		const loading = ref(true);
		const tableData = ref([]);
		const chooseData = ref([]);
		// 选择数据
		const handleSelectionChange = (val) => {
			chooseData.value = val;
		};
		// 获取用户数据
		const getTableData = async (init) => {
			loading.value = true;
			if (init) {
				page.pageNum = 1;
			}
			let params = {
				pageNum: page.pageNum,
				pageSize: page.pageSize,
			};
			const result = await getUserList(params);
			if (result.code === status.SUCCESS) {
				let data = result.data.list;
				tableData.value = data;
				page.total = Number(result.data.total);
				loading.value = false;
			} else {
				ElMessage.error(result.msg);
				tableData.value = [];
				page.pageNum = 1;
				page.total = 0;
				loading.value = false;
			}
		};
		// 搜索用户
		const getSearchUserData = async (init) => {
			loading.value = true;
			if (init) {
				page.pageNum = 1;
			}
			let params = {
				pageNum: page.pageNum,
				pageSize: page.pageSize,
				user: page.user,
			};

			const result = await getUserSerachList(params);
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
				loading.value = false;
			}
		};
		// 添加用户弹窗
		const handleAddUser = () => {
			layer.title = "添加用户";
			layer.show = true;
			delete layer.row;
			layer.width = "400px";
		};
		// 导入用户
		const handleUploadExcel = () => {
			upload.title = "导入用户";
			upload.show = true;
			upload.width = "400px";
		};
		// 编辑用户
		const handleEdit = (row) => {
			layer.title = "编辑数据";
			layer.row = row;
			layer.show = true;
			layer.width = "400px";
		};
		// 删除用户
		const handleDel = async (data) => {
			const params = {
				id: data.id,
			};
			const result = await deleteUser(params);
			if (result.code === status.SUCCESS) {
				ElMessage.success(result.msg);
				// 刷新请求
				getTableData(tableData.value.length === 1 ? true : false);
			} else {
				ElMessage.error(result.msg);
			}
		};
		// 重置学号
		const handleResetUserId = async (row) => {
			reset.title = "重置学号";
			reset.show = true;
			reset.row = row;
			reset.width = "400px";
		};
		// 批量删除
		const handleBatchDel = async (chooseData) => {
			// 封装id，封装成数组
			let ids = [];
			chooseData.map((row) => {
				ids.push(row.id);
			});
			const params = {
				ids,
			};
			const result = await batchDeleteUser(params);
			if (result.code === status.SUCCESS) {
				ElMessage.success(result.msg);
				// 刷新请求
				getTableData(tableData.value.length === 1 ? true : false);
			} else {
				ElMessage.error(result.msg);
			}
		};
		// 初始化表格数据
		getTableData(true);
		return {
			page,
			loading,
			tableData,
			chooseData,
			layer,
			upload,
			reset,
			dateFormat,
			handleSelectionChange,
			getTableData,
			getSearchUserData,
			handleAddUser,
			handleEdit,
			handleDel,
			handleUploadExcel,
			handleBatchDel,
			handleResetUserId,
		};
	},
	methods: {
		// 批量导出用户
		handleExportUser() {
			if (!this.chooseData.length) {
				ElMessage.warning({
					message: "请勾选要导出的数据！",
				});
				return false;
			}
			// 封装id，封装成数组
			let exportIds = [];
			this.chooseData.map((row) => {
				exportIds.push(row.id);
			});
			const data = {
				exportIds,
			};
			exportExceltUser(data).then((res) => {
				if (res) {
					this.downloadExcel(res);
					ElMessage.success({
						message: "导出数据成功,请保存.",
					});
				} else {
					ElMessage.error({
						message: "导出数据失败.",
					});
				}
			});
		},
		// excel模板下载
		handleDownloadExcel() {
			exportExcel().then((res) => {
				this.downloadExcel(res);
				ElMessage.success({
					message: "用户模板下载成功.",
					duration: 2000,
				});
			});
		},

		// 从浏览器下载文件
		downloadExcel(data) {
			if (!data) {
				return "";
			}
			// 创建一个文件流的对象
			let url = window.URL.createObjectURL(new Blob([data]));
			// 创建a标签
			let link = document.createElement("a");
			link.style.display = "none";
			// 跳转连接赋值
			link.href = url;
			// 设置属性以及信息
			link.setAttribute("download", "用户模板.xls");
			// 本地窗口链接
			document.body.appendChild(link);
			link.click();
		},
	},
});
</script>
<style scoped lang="scss">
.el-input__icon {
	line-height: 32px;
}
</style>
