<template>
	<Layer :layer="layer" @confirm="submit" ref="layerDom">
		<el-form
			:model="form"
			:rules="rules"
			ref="ruleForm"
			label-width="120px"
			label-suffix=":"
		>
			<el-form-item label="账户" prop="id">
				<el-input v-model="form.id" placeholder="请输入账户"></el-input>
			</el-form-item>
			<el-form-item label="用户名" prop="user_name">
				<el-input
					v-model="form.user_name"
					placeholder="请输入用户名"
				></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input
					v-model="form.password"
					placeholder="请输入密码"
					type="password"
					show-password
				></el-input>
			</el-form-item>
		</el-form>
	</Layer>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { updateUser } from "@/api/user";
import Layer from "@/components/layer/index.vue";
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
	setup(props, ctx) {
		const ruleForm = ref(null);
		const layerDom = ref(null);
		const store = useStore();
		let form = ref({
			id: "",
			user_name: "",
			password: "",
		});
		const rules = {
			user_name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
			password: [{ required: true, message: "请输入密码", trigger: "blur" }],
		};
		function submit() {
			if (ruleForm.value) {
				ruleForm.value.validate((valid) => {
					if (valid) {
						let params = {
							id: form.value.id,
							user_name: form.value.user_name,
							password: form.value.password,
						};
						updateUser(params).then((res) => {
							ElMessage({
								type: "success",
								message: "密码修改成功，即将跳转到登录页面",
							});
							layerDom.value && layerDom.value.close();
							setTimeout(() => {
								store.dispatch("user/loginOut");
							}, 2000);
						});
					} else {
						return false;
					}
				});
			}
		}
		// 用户用户名
		const userInfo = computed(() => store.getters["user/userInfo"]);
		// 初始化
		init();
		function init() {
			// 用于判断新增还是编辑功能
			form.value = JSON.parse(JSON.stringify(userInfo.value));
		}
		return {
			form,
			userInfo,
			rules,
			layerDom,
			ruleForm,
			submit,
		};
	},
});
</script>

<style lang="scss" scoped></style>
