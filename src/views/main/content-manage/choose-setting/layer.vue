<template>
	<Layer :layer="layer" ref="layerDom" @confirm="submit">
		<el-form ref="formRef" :model="modeForm" :rules="rules" label-width="80px">
			<el-form-item label="内容分类" prop="category">
				<el-input
					v-model="modeForm.category"
					placeholder="请输入选择分类"
					clearable
				></el-input>
			</el-form-item>
			<el-form-item label="内容" prop="content">
				<el-input
					v-model="modeForm.content"
					placeholder="请输入选择内容"
					clearable
				></el-input>
			</el-form-item>
		</el-form>
	</Layer>
</template>

<script>
import { defineComponent, ref } from "vue";
import Layer from "@/components/layer/index.vue";
import { addChoose, updateChoose } from "@/api/choose";
import { ElMessage } from "element-plus";
import { status } from "@/utils/system/constant";
export default defineComponent({
	components: {
		Layer,
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
	setup(props) {
		const layerDom = ref(null);
		const formRef = ref(null);
		const modeForm = ref({
			category: "",
		});
		const rules = {
			category: [
				{
					required: true,
					message: "请输入选择分类",
					trigger: "blur",
				},
			],
			content: [
				{
					required: true,
					message: "请输入内容",
					trigger: "blur",
				},
			],
		};
		// 初始化
		init();
		function init() {
			// 用于判断新增还是编辑功能
			if (props.layer.row) {
				modeForm.value = JSON.parse(JSON.stringify(props.layer.row));
			}
		}
		return {
			layerDom,
			formRef,
			modeForm,
			rules,
		};
	},
	methods: {
		// 提交
		submit() {
			if (this.formRef) {
				// 验证规则
				this.formRef.validate((valid) => {
					if (valid) {
						let params = this.modeForm;
						// 修改流程
						if (this.layer.row) {
							updateChoose(params).then((res) => {
								if (res.status === status.SUCCESS) {
									ElMessage.success(res.msg);
								} else {
									ElMessage.error(res.msg);
								}
							});
						} else {
							// 走添加流程
							addChoose(params).then((res) => {
								if (res.status === status.SUCCESS) {
									ElMessage.success({
										message: res.msg,
									});
								} else {
									ElMessage.error(res.msg);
								}
							});
						}
					}
					this.layerDom && this.layerDom.close();
					this.$emit("getTableData", true);
				});
			}
		},
	},
});
</script>
<style scoped lang="scss"></style>
