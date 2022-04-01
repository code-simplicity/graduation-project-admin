<template>
	<Layer :layer="reset" ref="layerDom" @confirm="submit">
		<el-form :rules="rules" ref="ruleForm" :model="user" label-width="80px">
			<el-form-item label="旧学号" prop="id">
				<el-input v-model="user.id" disabled></el-input>
			</el-form-item>
			<el-form-item label="新学号" prop="newId">
				<el-input v-model="user.newId"></el-input>
			</el-form-item>
		</el-form>
	</Layer>
</template>
<script>
import { defineComponent, ref } from "vue";
import Layer from "@/components/layer/index.vue";
import { ElMessage } from "element-plus";
import { resetUserId } from "@/api/user";
import { status } from "@/utils/system/constant";

export default defineComponent({
	components: {
		Layer,
	},
	props: {
		reset: {
			type: Object,
		},
	},
	setup(props, context) {
		const ruleForm = ref(null);
		const layerDom = ref(null);
		const rules = {
			id: [{ required: true, message: "请输入旧学号", trigger: "blur" }],
			newId: [
				{ required: true, message: "请输入需要更改的学号", trigger: "blur" },
			],
		};
		const user = ref({
			id: "",
			newId: "",
		});
		const init = async () => {
			if (props.reset) {
				user.value.id = JSON.parse(JSON.stringify(props.reset.row.id));
			}
		};
		init();
		// 提交
		const submit = async () => {
			if (!ruleForm.value) return;
			ruleForm.value.validate(async (valid) => {
				if (valid) {
					const params = {
						oldId: user.value.id,
						newId: user.value.newId,
					};
					const result = await resetUserId(params);
					if (result.code === status.SUCCESS) {
						ElMessage.success(result.msg);
						context.emit("getTableData", true);
						layerDom.value && layerDom.value.close();
					} else {
						ElMessage.error(result.msg);
						context.emit("getTableData", true);
						layerDom.value && layerDom.value.close();
					}
				}
			});
		};
		return {
			ruleForm,
			layerDom,
			rules,
			user,
			submit,
			init,
		};
	},
});
</script>
<style lang="scss" scope></style>
