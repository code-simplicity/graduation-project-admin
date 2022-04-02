<template>
	<Layer :layer="layer" ref="layerDom" @confirm="submit">
		<el-form ref="formRef" :model="modeForm" :rules="rules" label-width="80px">
			<el-form-item label="分类选择" prop="choose_id">
				<el-select
					v-model="modeForm.choose_id"
					placeholder="请选择对应的分类"
					clearable
				>
					<el-option
						v-for="item in list"
						:key="item.id"
						:label="item.content"
						:value="item.id"
					>
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="内容" prop="content">
				<el-input
					v-model="modeForm.content"
					placeholder="请输入选择内容"
					autosize
					type="textarea"
					clearable
				></el-input>
			</el-form-item>
		</el-form>
	</Layer>
</template>

<script>
import { defineComponent, ref } from "vue";
import Layer from "@/components/layer/index.vue";
import { getChooseFindAll } from "@/api/choose";
import { addContent, updateContent } from "@/api/content";
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
					width: "600px",
				};
			},
		},
	},
	setup(props) {
		const layerDom = ref(null);
		const formRef = ref(null);
		const modeForm = ref({
			content: "",
		});
		// 分类
		const list = ref([]);
		const rules = {
			content: [
				{
					required: true,
					message: "请输入内容",
					trigger: "blur",
				},
			],
		};
		// 获取所有的分类
		const getChooseAll = async (init) => {
			if (init) {
				const params = {
					pageNum: 1,
					pageSize: 20,
				};
				const result = await getChooseFindAll(params);
				if (result.code === status.SUCCESS) {
					let data = result.data.list;
					list.value = data;
				} else {
					ElMessage.error(result.msg);
				}
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
		getChooseAll(true);
		return {
			layerDom,
			formRef,
			modeForm,
			rules,
			list,
			getChooseAll,
		};
	},
	methods: {
		// 提交
		submit() {
			if (this.formRef) {
				// 验证规则
				this.formRef.validate(async (valid) => {
					if (valid) {
						let params = this.modeForm;
						// 修改流程
						if (this.layer.row) {
							const result = await updateContent(params);
							if (result.code === status.SUCCESS) {
								ElMessage.success(result.msg);
								this.$emit("getTableData", true);
								this.layerDom && this.layerDom.close();
							} else {
								ElMessage.error(result.msg);
							}
						} else {
							// 走添加流程
							// 添加内容,有外键
							const result = await addContent(params);
							if (result.code === status.SUCCESS) {
								ElMessage.success(result.msg);
								this.$emit("getTableData", true);
								this.layerDom && this.layerDom.close();
							} else {
								ElMessage.error(result.msg);
							}
							this.$emit("getTableData", true);
							this.layerDom && this.layerDom.close();
						}
					}
				});
			}
		},
	},
});
</script>
<style scoped lang="scss"></style>
