<template>
	<Layer :layer="layer" ref="layerDom" @confirm="submit"
		><el-upload
			ref="uploadRef"
			name="image"
			action=""
			drag
			list-type="picture"
			limit="1"
			accept=".jpg, .png"
			:auto-upload="false"
			:http-request="httpRequestPortMap"
		>
			<el-icon size="120" class="el-icon--upload"><upload-filled /></el-icon>
			<div slot="tip" class="el-upload__text">请上传港口地图</div>
		</el-upload></Layer
	>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import Layer from "@/components/layer/index.vue";
import { UploadFilled } from "@element-plus/icons";
import { ElMessage } from "element-plus";
import { uploadPortMap, updatePortMap } from "@/api/portmap";
import { hasFile } from "@/utils/utils";
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
			hasFile,
		};
	},
	methods: {
		//  自定义提交图片
		async httpRequestPortMap(data, id) {
			const file = data[0].raw;
			// 获取到的files为一个File对象数组，如果允许多选的时候，文件为多个
			if (!file) {
				return ElMessage.error({
					message: "没有选择文件！",
				});
			}
			// 构建表单
			const formData = new FormData();
			formData.append("image", file);
			if (id) {
				// 走更新流程
				formData.append("id", id);
				updatePortMap(formData).then((res) => {
					if (res.status === status.SUCCESS) {
						ElMessage.success(res.msg);
					} else {
						ElMessage.error({
							message: res.msg,
						});
					}
				});
			} else {
				// 走上传流程
				uploadPortMap(formData).then((res) => {
					if (res.status === status.SUCCESS) {
						ElMessage.success(res.msg);
					} else {
						ElMessage.error({
							message: res.msg,
						});
					}
				});
			}
			this.$emit("getTableData", true);
			this.layerDom && this.layerDom.close();
		},
		// 提交确认
		submit() {
			if (this.layer.row) {
				// 修改图片
				this.httpRequestPortMap(this.uploadRef.uploadFiles, this.layer.row.id);
			} else {
				// 提交图片
				this.httpRequestPortMap(this.uploadRef.uploadFiles);
			}
		},
	},
});
</script>
<style scoped lang="scss"></style>
