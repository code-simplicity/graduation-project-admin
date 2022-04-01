<template>
	<Layer :layer="layer" ref="layerDom" @confirm="submit">
		<el-form :rules="rules" ref="ruleForm" :model="form" label-width="60px">
			<el-form-item label="学号" prop="id">
				<el-input v-model="form.id"></el-input>
			</el-form-item>
			<el-form-item label="姓名" prop="user_name">
				<el-input v-model="form.user_name"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model="form.password" type="password"></el-input>
			</el-form-item>
			<el-form-item label="邮箱" prop="email">
				<el-input v-model="form.email"></el-input>
			</el-form-item>
			<el-form-item label="得分" prop="score">
				<el-input v-model="form.score"></el-input>
			</el-form-item>
			<el-form-item label="性别" prop="sex">
				<el-select v-model="form.sex" placeholder="请选择性别">
					<el-option label="男" value="男"></el-option>
					<el-option label="女" value="女"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="角色" prop="roles">
				<el-select v-model="form.roles" placeholder="请选择">
					<el-option label="管理员" value="admin"></el-option>
					<el-option label="普通用户" value="user"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="状态" prop="state">
				<el-select v-model="form.state" placeholder="请选择状态">
					<el-option label="存在" value="1"></el-option>
					<el-option label="已删除" value="0"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
	</Layer>
</template>

<script>
import { defineComponent, ref } from "vue";
import Layer from "@/components/layer/index.vue";
import { addUser, updateUser } from "@/api/user";
import { ElMessage } from "element-plus";
import SparkMD5 from "spark-md5";
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
		const ruleForm = ref(null);
		const layerDom = ref(null);
		const rules = {
			id: [{ required: true, message: "请输入学号", trigger: "blur" }],
			user_name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
			password: [{ required: true, message: "请输入密码", trigger: "blur" }],
			roles: [{ required: true, message: "请选择角色", trigger: "blur" }],
			state: [
				{ required: true, message: "请选择状态,默认为在线", trigger: "blur" },
			],
			score: [
				{ required: true, message: "请输入该学生的得分", trigger: "blur" },
			],
			sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
		};
		const form = ref({
			id: "",
		});
		// 初始化
		init();
		function init() {
			// 用于判断新增还是编辑功能
			if (props.layer.row) {
				form.value = JSON.parse(JSON.stringify(props.layer.row));
			}
		}
		return {
			rules,
			form,
			ruleForm,
			layerDom,
		};
	},
	methods: {
		async submit() {
			if (this.ruleForm) {
				this.ruleForm.validate(async (valid) => {
					if (valid) {
						const params = {
							id: this.form.id,
							user_name: this.form.user_name,
							password: SparkMD5.hash(this.form.password),
							sex: this.form.sex,
							email: this.form.email,
							roles: this.form.roles,
							score: this.form.score,
							state: this.form.state,
						};
						if (this.layer.row) {
							// 更新用户信息
							const result = await updateUser(params);
							if (result.code === status.SUCCESS) {
								ElMessage.success(result.msg);
								this.$emit("getTableData", true);
								this.layerDom && this.layerDom.close();
							} else {
								ElMessage.error(result.msg);
								this.$emit("getTableData", true);
								this.layerDom && this.layerDom.close();
							}
						} else {
							// 添加用户
							const result = await addUser(params);
							if (result.code === status.SUCCESS) {
								this.$emit("getTableData", true);
								ElMessage.success(result.msg);
								this.layerDom && this.layerDom.close();
							} else {
								ElMessage.error(result.msg);
								this.$emit("getTableData", true);
								this.layerDom && this.layerDom.close();
							}
						}
					}
				});
			}
		},
	},
});
</script>
<style scoped lang="scss"></style>
