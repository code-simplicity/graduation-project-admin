<template>
	<Layer :layer="layer" ref="layerDom" @confirm="submit"
		><el-upload
			ref="uploadRef"
			name="file"
			action=""
			accept=".xlsx, .xls"
			drag
			:auto-upload="false"
			:http-request="httpRequest"
		>
			<el-icon size="120" class="el-icon--upload"><upload-filled /></el-icon>
			<div slot="tip" class="el-upload__text">请选择对应的excel模板</div>
		</el-upload>
	</Layer>
</template>

<script>
import { defineComponent, ref } from "vue";
import Layer from "@/components/layer/index.vue";
import { UploadFilled } from "@element-plus/icons";
import { ElMessage } from "element-plus";
import { uploadExcelUser } from "@/api/excel";
import { status } from "@/utils/system/constant";
export default defineComponent({
	name: "Upload",
	components: {
		Layer,
		UploadFilled,
	},
	props: {
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
	},
	setup() {
		const uploadRef = ref(null);
		const layerDom = ref(null);
		return {
			uploadRef,
			layerDom,
		};
	},
	methods: {
		// 上传文件
		httpRequest(file) {
			const formData = new FormData();
			file.forEach((item) => {
				formData.append("file", item.raw);
			});
			uploadExcelUser(formData).then((res) => {
				if (res.status === status.SUCCESS) {
					ElMessage.success({
						message: res.msg,
					});
					this.$emit("getTableData", true);
				} else {
					ElMessage.error({
						message: res.msg,
					});
				}
			});
		},
		// 提交
		submit() {
			if (this.uploadRef) {
				this.httpRequest(this.uploadRef.uploadFiles);
				this.layerDom && this.layerDom.close();
			}
		},
	},
});
</script>
<style scoped lang="scss"></style>
