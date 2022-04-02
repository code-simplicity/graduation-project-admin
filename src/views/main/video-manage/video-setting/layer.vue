<template>
	<Layer :layer="layer" ref="layerDom" @confirm="submit">
		<el-form ref="formRef" :model="modeForm" label-width="80px">
			<el-form-item label="视频" prop="video">
				<el-upload
					ref="uploadRef"
					action=""
					:file-list="fileList"
					name="video"
					accept=".mp4"
					limit="1"
					:auto-upload="false"
					:http-request="httpRequest"
				>
					<el-button size="small" icon="el-icon-video-camera" type="primary">
						上传视频</el-button
					>
					<template #tip>
						<div class="el-upload__tip">请选择视频，格式为mp4</div>
					</template>
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
			<el-form-item label="波浪来向" prop="wave_direction">
				<el-select
					v-model="modeForm.wave_direction"
					placeholder="请选择波浪来向"
					clearable
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
import { defineComponent, ref, computed } from "vue";
import Layer from "@/components/layer/index.vue";
import { getChooseFindAll } from "@/api/choose";
import { uploadVideo, updateVideo } from "@/api/video";
import { ElMessage } from "element-plus";
import { VideoCamera } from "@element-plus/icons";
import { status } from "@/utils/system/constant";
export default defineComponent({
	components: {
		Layer,
		VideoCamera,
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
			water_level: "",
			wave_direction: "",
			embank_ment: "",
		});
		// 上传视频的ref
		const uploadRef = ref(null);
		const chooseData = ref([]);
		const chooseWaterLevel = computed(() => chooseData.value.slice(0, 4));
		const chooseWaveDirection = computed(() => chooseData.value.slice(4, 7));
		const chooseeMbankMent = computed(() => chooseData.value.slice(7, 11));
		// 获取选择数据
		const chooseFindAll = async () => {
			const params = {
				pageNum: 1,
				pageSize: 20,
			};
			const result = await getChooseFindAll(params);
			if (result.code === status.SUCCESS) {
				let data = result.data.list;
				chooseData.value = data;
			} else {
				ElMessage.error(result.msg);
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
		// 初始化
		chooseFindAll();
		return {
			layerDom,
			formRef,
			modeForm,
			uploadRef,
			chooseData,
			chooseWaterLevel,
			chooseWaveDirection,
			chooseeMbankMent,
		};
	},
	methods: {
		// 表单提交
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
		// 上传视频
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
			formData.append("video", file);
			formData.append("water_level", form.water_level);
			formData.append("wave_direction", form.wave_direction);
			formData.append("embank_ment", form.embank_ment);
			if (id) {
				// 走更新
				formData.append("id", id);
				const result = await updateVideo(formData);
				if (result.code === status.SUCCESS) {
					ElMessage.success(res.msg);
					this.$emit("getTableData", true);
					this.layerDom && this.layerDom.close();
				} else {
					ElMessage.error(result.msg);
				}
			} else {
				// 走上传
				const result = await uploadVideo(formData);
				if (result.code === status.SUCCESS) {
					ElMessage.success(result.msg);
					this.$emit("getTableData", true);
					this.layerDom && this.layerDom.close();
				} else {
					ElMessage.error(result.msg);
				}
			}
			this.$emit("getTableData", true);
			this.layerDom && this.layerDom.close();
		},
	},
});
</script>
<style scoped lang="scss"></style>
