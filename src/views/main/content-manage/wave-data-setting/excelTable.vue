<template>
	<el-dialog
		ref="excelRef"
		v-model="excelLayer.excelVisible"
		:title="excelLayer.excelTitle"
		:width="excelLayer.width"
		center
		destroy-on-close
	>
		<el-table
			v-loading="tableLoading"
			border
			:data="excelData"
			max-height="300"
			style="width: 100%"
		>
			<el-table-column
				v-for="(value, key, index) in excelData[0]"
				:key="index"
				:prop="key"
				:label="key"
				show-overflow-tooltip
			></el-table-column>
		</el-table>

		<template #footer v-if="excelLayer.showButton">
			<div>
				<el-button type="primary" @click="downloadExcel">下载</el-button>
				<el-button @click="close">取消</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
// excel预览
import { ref, defineProps } from "vue";
import { read, utils } from "xlsx";
import axios from "axios";
const props = defineProps({
	excelLayer: {
		type: Object,
		default: () => {
			return {
				excelVisible: false,
				excelTitle: "",
				showButton: false,
				excelUrl: "",
				width: "600px",
				isTableShow: false,
			};
		},
	},
});
// excel数据
let excelData = ref([]);
let tableLoading = ref(true);
// ref实例
const excelRef = ref(false);
// 在线读取excel
const readWorkbookFromRemoteFile = (url) => {
	axios({
		url,
		method: "GET",
		responseType: "arraybuffer",
	}).then((res) => {
		const data = new Uint8Array(res.data);
		const workbook = read(data, { type: "array" });
		tableLoading.value = true;
		// 初始化表格
		getTableExcel(workbook);
	});
};
readWorkbookFromRemoteFile(props.excelLayer.excelUrl);
// 初始化表格
const getTableExcel = (workbook) => {
	const sheetNames = workbook.SheetNames; // 工作表名称集合
	const worksheet = workbook.Sheets[sheetNames[0]]; // 这里我们只读取第一张sheet
	const csv = utils.sheet_to_json(worksheet);
	tableLoading.value = false;
	excelData.value = csv;
};

// 下载
const downloadExcel = async () => {
	// 直接工具传递过来的值进行下载
	window.open(`${props.excelLayer.excelUrl}`);
};
// 关闭
const close = async () => {
	excelRef.value.handleClose();
};
</script>
<style lang="scss" scope>
.excel-table-box {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	height: 100%;
}
.excel-base-style {
	height: 300px;
	overflow: auto;
}
</style>
