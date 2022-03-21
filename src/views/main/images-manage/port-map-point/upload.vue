<template>
	<Layer :layer="layer" ref="layerDom" @confirm="submit">
		<el-form
			ref="formRef"
			:model="modeForm"
			label-width="100px"
			class="demo-dynamic"
			:rules="rules"
		>
			<el-form-item label="港口点位图">
				<el-upload
					ref="uploadRef"
					action=""
					list-type="picture-card"
					name="image"
					accept=".jpg, .png"
					limit="1"
					:auto-upload="false"
					:http-request="httpRequest"
				>
					<el-icon><plus /></el-icon>
				</el-upload>
			</el-form-item>
			<el-form-item label="设计水位" prop="water_level">
				<el-select
					v-model="modeForm.water_level"
					placeholder="请选择设计水位"
					clearable
				>
					<el-option
						v-for="item in chooseWaterLevel"
						:key="item.id"
						:label="item.content"
						:value="item.content"
					>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="波浪来向" prop="wave_direction" clearable>
				<el-select
					v-model="modeForm.wave_direction"
					placeholder="请选择波浪来向"
				>
					<el-option
						v-for="item in chooseWaveDirection"
						:key="item.id"
						:label="item.content"
						:value="item.content"
					>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="外堤布置" prop="embank_ment">
				<el-select
					v-model="modeForm.embank_ment"
					placeholder="请选择外堤布置"
					clearable
				>
					<el-option
						v-for="item in chooseeMbankMent"
						:key="item.id"
						:label="item.content"
						:value="item.content"
					>
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>
	</Layer>
</template>

<script>
import { computed, defineComponent, reactive, ref } from "vue";
import Layer from "@/components/layer/index.vue";
import { Plus } from "@element-plus/icons";
import { getChooseFindAll } from "@/api/choose";
import { uploadPortMapPoint, updatePortMapPoint } from "@/api/portmappoint";
import { hasFile } from "@/utils/utils";
import axios from "axios";
import { ElMessage } from "element-plus";
import { status } from "@/utils/system/constant";
export default defineComponent({
	name: "Upload",
	components: {
		Layer,
		Plus,
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
		// 表单数据
		const modeForm = ref({
			water_level: "",
		});
		// 验证规则
		const rules = {
			water_level: [
				{
					required: true,
					message: "请选择设计水位",
					trigger: "blur",
				},
			],
			wave_direction: [
				{
					required: true,
					message: "请选择设计水位",
					trigger: "blur",
				},
			],
			embank_ment: [
				{
					required: true,
					message: "请选择设计水位",
					trigger: "blur",
				},
			],
		};
		const formRef = ref(null);
		// 上传图片的ref
		const uploadRef = ref(null);
		const layerDom = ref(null);
		const chooseData = ref([]);
		const chooseWaterLevel = computed(() => chooseData.value.slice(0, 4));
		const chooseWaveDirection = computed(() => chooseData.value.slice(4, 7));
		const chooseeMbankMent = computed(() => chooseData.value.slice(7, 11));
		const chooseFindAll = () => {
			const params = {
				pageNum: 1,
				pageSize: 20,
			};
			getChooseFindAll(params).then((res) => {
				if (res.status === status.SUCCESS) {
					let data = res.data.list;
					chooseData.value = data;
				} else {
					ElMessage.error(res.msg);
				}
			});
		};
		function init() {
			// 用于判断是上传港口地图还是更新港口地图
			if (props.layer.row) {
				// 更新，将表格数据的值赋值给表单
				modeForm.value = JSON.parse(JSON.stringify(props.layer.row));
			}
		}
		// 初始化
		init();
		chooseFindAll();
		return {
			modeForm,
			rules,
			formRef,
			uploadRef,
			layerDom,
			chooseData,
			chooseWaterLevel,
			chooseWaveDirection,
			chooseeMbankMent,
			hasFile,
		};
	},
	methods: {
		// 提交表单
		submit() {
			this.formRef.validate((valid) => {
				if (valid) {
					let data = this.modeForm;
					let file = this.uploadRef.uploadFiles;
					if (this.layer.row) {
						// 走更新流程
						this.httpRequest(file, data, this.layer.row.id);
					} else {
						// 走上传流程
						this.httpRequest(file, data);
					}
				}
			});
		},

		// 接口调用
		async httpRequest(data, form, id) {
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
			formData.append("water_level", form.water_level);
			formData.append("wave_direction", form.wave_direction);
			formData.append("embank_ment", form.embank_ment);
			if (id) {
				// 走更新流程
				formData.append("id", id);
				await updatePortMapPoint(formData).then((res) => {
					if (res.status === status.SUCCESS) {
						ElMessage.success(res.msg);
						this.$emit("getTableData", true);
						this.layerDom && this.layerDom.close();
					} else {
						ElMessage.error({
							message: res.msg,
						});
					}
				});
			} else {
				// 走上传流程
				await uploadPortMapPoint(formData).then((res) => {
					if (res.status === status.SUCCESS) {
						ElMessage.success(res.msg);
						this.$emit("getTableData", true);
						this.layerDom && this.layerDom.close();
					} else {
						ElMessage.error({
							message: res.msg,
						});
					}
				});
			}
		},
	},
});
</script>
<style scoped lang="scss"></style>
