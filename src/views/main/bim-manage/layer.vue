<!--
 * @Author: bugdr
 * @Date: 2022-04-17 21:35:54
 * @LastEditors: bugdr
 * @LastEditTime: 2022-04-19 18:42:15
 * @FilePath: \graduation-project-admin\src\views\main\bim-manage\layer.vue
 * @Description: 
-->
<template>
	<Layer :layer="layer" ref="layerDom" @confirm="submit(uploadRef)">
		<el-upload
			ref="uploadRef"
			name="file"
			action=""
			accept=".ifc"
			drag
			:auto-upload="false"
			:http-request="httpRequest"
		>
			<template #tip>
				<div class="el-upload__tip">目前模型只支持ifc格式</div>
			</template>
			<el-button type="primary">上传bim文件</el-button>
		</el-upload>
	</Layer>
</template>
<script setup="props">
import { ref, defineEmits, defineProps } from "vue";
import Layer from "@/components/layer/index.vue";
import { uploadBim, updateBim } from "@/api/bim";
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

const uploadRef = ref(null);

// 初始化
init();
function init() {
	// 用于判断新增还是编辑功能
	if (props.layer.row) {
		uploadRef.value = JSON.parse(JSON.stringify(props.layer.row));
	}
}

// 上传文件
const httpRequest = async (file, id) => {
	const formData = new FormData();
	file.forEach((item) => {
		formData.append("file", item.raw);
	});
	if (id !== undefined) {
		// 走更新流程
		formData.append("id", id);
		const result = await updateBim(formData);
		if (result.code === status.SUCCESS) {
			ElMessage.success(result.msg);
			emit("getTableData", true);
			layerDom && layerDom.value.close();
		} else {
			ElMessage.error(result.msg);
		}
	} else {
		const result = await uploadBim(formData);
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
	// 修改流程
	if (props.layer.row) {
		httpRequest(uploadRef.value.uploadFiles, props.layer.row.id);
	} else {
		// 走添加流程
		httpRequest(uploadRef.value.uploadFiles);
	}
};
</script>
<style lang="scss" scope></style>
