<template>
	<Layer :layer="layer" ref="layerDom" @confirm="submit(formRef)">
		<el-form ref="formRef" :model="modeForm" :rules="rules" label-width="120px">
			<el-row :gutter="10">
				<el-col :span="24">
					<el-form-item label="港口点位地图" prop="port_point_map_id">
						<el-select
							v-model="modeForm.port_point_map_id"
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
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<el-row :gutter="10">
			<el-col :span="24">
				<el-upload
					ref="uploadRef"
					name="file"
					action=""
					accept=".xlsx, .xls"
					drag
					:auto-upload="false"
					:http-request="httpRequest"
				>
					<el-button type="primary">上传excel文件</el-button>
				</el-upload>
			</el-col>
		</el-row>
	</Layer>
</template>
<script setup="props">
import { ref, reactive, defineEmits, defineProps } from "vue";
import Layer from "@/components/layer/index.vue";
import { getPortMapPointFindAll } from "@/api/portmappoint";
import { uploadWaveDataExcel, updateWaveDataExcel } from "@/api/wavedataexcel";
import { ElMessage } from "element-plus";
import { status } from "@/utils/system/constant";
const emit = defineEmits(["getTableData"]);
const props = defineProps({
	layer: {
		type: Object,
		default: () => {
			return {
				show: false,
				title: "",
				showButton: true,
				width: "400px",
			};
		},
	},
});
const layerDom = ref(null);
const modeForm = ref({
	port_point_map_id: "",
});
const page = reactive({
	pageNum: 1,
	pageSize: 100,
});
const formRef = ref(null);
const uploadRef = ref(null);
const rules = {
	port_point_map_id: [
		{
			required: true,
			message: "请选择港口点位图对应的值",
			trigger: "blur",
		},
	],
};
const portMapPointData = ref([]);
// 获取港口点位图
const getPortMapPointData = async () => {
	const params = {
		pageNum: page.pageNum,
		pageSize: page.pageSize,
	};
	const result = await getPortMapPointFindAll(params);
	if (result.code === status.SUCCESS) {
		portMapPointData.value = result.data.list;
	} else {
		ElMessage.error(result.msg);
	}
};
// 初始化
init();
function init() {
	// 用于判断新增还是编辑功能
	if (props.layer.row) {
		modeForm.value = JSON.parse(JSON.stringify(props.layer.row));
	}
}
// 初始化
getPortMapPointData();

// 上传文件
const httpRequest = async (file, port_point_map_id, id) => {
	const formData = new FormData();
	file.forEach((item) => {
		formData.append("excel", item.raw);
	});
	formData.append("port_point_map_id", port_point_map_id);
	if (id !== undefined) {
		// 走更新流程
		formData.append("id", id);
		const result = await updateWaveDataExcel(formData);
		if (result.code === status.SUCCESS) {
			ElMessage.success(result.msg);
			emit("getTableData", true);
			layerDom && layerDom.value.close();
		} else {
			ElMessage.error(result.msg);
		}
	} else {
		const result = await uploadWaveDataExcel(formData);
		if (result.code === status.SUCCESS) {
			ElMessage.success(result.msg);
			emit("getTableData", true);
			layerDom && layerDom.value.close();
		} else {
			ElMessage.error(result.msg);
		}
	}
};

// 提交
const submit = async (formEl) => {
	if (!formEl) return;
	await formEl.validate(async (valid) => {
		if (valid) {
			let { port_point_map_id } = modeForm.value;
			// 修改流程
			if (props.layer.row) {
				httpRequest(
					uploadRef.value.uploadFiles,
					port_point_map_id,
					props.layer.row.id
				);
			} else {
				// 走添加流程
				httpRequest(uploadRef.value.uploadFiles, port_point_map_id);
			}
		}
	});
};
</script>
<style lang="scss" scope></style>
