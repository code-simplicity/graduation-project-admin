<template>
	<div class="container">
		<div class="box">
			<h1>{{ systemTitle }}</h1>
			<el-form class="form">
				<el-input
					size="large"
					v-model="form.id"
					placeholder="用户名"
					type="text"
					maxlength="50"
					autofocus
				>
					<template #prepend>
						<i class="sfont system-xingmingyonghumingnicheng"></i>
					</template>
				</el-input>
				<el-input
					size="large"
					ref="password"
					v-model="form.password"
					:type="passwordType"
					placeholder="密码"
					name="password"
					maxlength="50"
				>
					<template #prepend>
						<i class="sfont system-mima"></i>
					</template>
					<template #append>
						<i
							class="sfont password-icon"
							:class="passwordType ? 'system-yanjing-guan' : 'system-yanjing'"
							@click="passwordTypeChange"
						></i>
					</template>
				</el-input>
				<el-row :gutter="10">
					<el-col :span="18"
						><el-input
							v-model="form.captcha"
							size="large"
							type="text"
							placeholder="请输入验证码"
							@keyup.enter="submit"
						>
							<template #prepend>
								<i class="sfont system-mima"></i>
							</template> </el-input
					></el-col>
					<el-col :span="6"
						><div v-html="captchaValue" @click="getCaptcha"></div
					></el-col>
				</el-row>

				<el-button
					type="primary"
					@click="submit"
					style="width: 100%"
					size="medium"
					>登录</el-button
				>
			</el-form>
		</div>
	</div>
</template>

<script>
import { systemTitle } from "@/config";
import { defineComponent, ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { ElNotification, ElMessage } from "element-plus";
import SparkMD5 from "spark-md5";
import { sendCaptcha } from "@/api/captcha";
import { status } from "../../utils/system/constant";
export default defineComponent({
	setup() {
		const store = useStore();
		const router = useRouter();
		const route = useRoute();
		const form = reactive({
			id: "",
			password: "",
			captcha: "",
		});
		const passwordType = ref("password");
		const passwordTypeChange = () => {
			passwordType.value === ""
				? (passwordType.value = "password")
				: (passwordType.value = "");
		};
		const checkForm = () => {
			return new Promise((resolve) => {
				if (form.id === "") {
					ElMessage.warning({
						message: "用户名不能为空",
						type: "warning",
					});
					return;
				}
				if (form.password === "") {
					ElMessage.warning({
						message: "密码不能为空",
						type: "warning",
					});
					return;
				}
				if (form.captcha === "") {
					ElMessage.warning({
						message: "图灵验证码不能为空",
						type: "warning",
					});
					return;
				}
				resolve(true);
			});
		};
		// 验证码
		const captchaValue = ref("");
		// 获取验证码
		const getCaptcha = async () => {
			const result = await sendCaptcha();
			captchaValue.value = result;
		};
		getCaptcha();
		const submit = async () => {
			await checkForm().then(() => {
				let params = {
					id: form.id,
					password: SparkMD5.hash(form.password),
					captcha: form.captcha,
				};
				store.dispatch("user/login", params).then((res) => {
					if (res.code === status.SUCCESS) {
						const hour = new Date().getHours();
						const thisTime =
							hour < 8
								? "早上好，管理员"
								: hour <= 11
								? "上午好，管理员"
								: hour <= 13
								? "下午好，管理员"
								: hour < 18
								? "下午好，管理员"
								: "晚上好，管理员";
						ElNotification.success({
							message: `欢迎登陆${systemTitle}`,
							description: `${thisTime}！`,
							duration: 3000,
							offset: 100,
						});
						router.push(route.query.redirect || "/");
					} else {
						// 刷新验证码
						getCaptcha();
					}
				});
			});
		};
		return {
			systemTitle,
			form,
			passwordType,
			captchaValue,
			passwordTypeChange,
			submit,
			getCaptcha,
		};
	},
});
</script>

<style lang="scss" scoped>
.container {
	position: relative;
	width: 100vw;
	height: 100vh;
	background-size: 100% 100%;
	background-repeat: no-repeat;
	background-image: url("../../assets/images/bg.jpg");
	.box {
		width: 500px;
		position: absolute;
		left: 50%;
		top: 50%;
		background: white;
		border-radius: 8px;
		transform: translate(-50%, -50%);
		height: 440px;
		overflow: hidden;
		box-shadow: 0 6px 20px 5px rgba(152, 152, 152, 0.1),
			0 16px 24px 2px rgba(117, 117, 117, 0.14);
		h1 {
			margin-top: 80px;
			text-align: center;
		}
		.form {
			width: 80%;
			margin: 50px auto 15px;
			.el-input {
				margin-bottom: 20px;
			}
			.password-icon {
				cursor: pointer;
				color: #409eff;
			}
		}
		.fixed-top-right {
			position: absolute;
			top: 10px;
			right: 10px;
		}
	}
}
@media screen and (max-width: 750px) {
	.container .box {
		width: 100vw;
		height: 100vh;
		box-shadow: none;
		left: 0;
		top: 0;
		transform: none;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		h1 {
			margin-top: 0;
		}
		.form {
		}
	}
}
</style>
