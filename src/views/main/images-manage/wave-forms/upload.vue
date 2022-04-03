<template>
	<Layer :layer="layer" ref="layerDom" @confirm="submit">
		<el-form ref="formRef" :model="modeForm" :rules="rules" label-width="120px">
			<el-form-item label="波形图" prop="image">
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
					<template #tip>
						<div class="el-upload__tip">请选择波形图，格式为jpg/png</div>
					</template>
				</el-upload>
			</el-form-item>
			<el-form-item label="港口点位地图" prop="port_point_map_id">
				<el-select
					v-model="modeForm.port_point_map_id"
					placeholder="请选择港口点位地图"
					clearable
					@change="changePortPointMap"
				>
					<el-option
						v-for="item in portMapPointData"
						:key="item.id"
						:label="item.name"
						:value="item.id"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="点位表" prop="point_id">
				<el-select
					v-model="modeForm.point_id"
					placeholder="请选择点位表，根据点位表分类选择"
					clearable
				>
					<el-option
						v-for="item in pointList"
						:key="item.id"
						:label="item.content"
						:value="item.id"
					>
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>
	</Layer>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import Layer from "@/components/layer/index.vue";
import { Plus } from "@element-plus/icons";
import { getPortMapPointFindAll } from "@/api/portmappoint";
import { searchPoint } from "@/api/point";
import { uploadWaveForms, updateWaveForms } from "@/api/waveforms";
import { ElMessage } from "element-plus";
import { status } from "@/utils/system/constant";
import { pointCompare } from "@/utils/utils";
export default defineComponent({
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
	setup() {
		const layerDom = ref(null);
		const formRef = ref(null);
		const modeForm = ref({});
		// 规则
		const rules = {
			point_id: [
				{
					required: true,
					message: "请选择需要对应的点位",
					trigger: "blur",
				},
			],
		};
		const page = reactive({
			pageNum: 1,
			pageSize: 50,
		});
		// 港口点位地图
		const portMapPointData = ref([]);
		// 点位表
		const pointList = ref([]);
		// 上传图片的ref
		const uploadRef = ref(null);
		// 获取港口点位图
		const getPortMapPointData = async () => {
			const params = {
				pageNum: page.pageNum,
				pageSize: page.pageSize,
			};
			const result = await getPortMapPointFindAll(params);
			if (result.code === status.SUCCESS) {
				portMapPointData.value = result.data.list;
			} else {
				ElMessage.error(result.msg);
			}
		};
		// 港口地图选择
		const changePortPointMap = async (port_point_map_id) => {
			if (port_point_map_id) {
				const params = {
					pageNum: page.pageNum,
					pageSize: page.pageSize,
					port_point_map_id: port_point_map_id,
				};
				// 通过选择港口地图的值，选择点位表
				const result = await searchPoint(params);
				if (result.code === status.SUCCESS) {
					let data = result.data.list;
					pointList.value = data.sort(pointCompare("content"));
				} else {
					ElMessage.success(result.msg);
					pointList.value = [];
					page.pageNum = 1;
					page.total = 0;
				}
			}
		};
		// 初始化
		getPortMapPointData();
		return {
			layerDom,
			formRef,
			modeForm,
			rules,
			pointList,
			portMapPointData,
			page,
			uploadRef,
			getPortMapPointData,
			changePortPointMap,
		};
	},
	methods: {
		// 提交表单
		submit() {
			if (this.formRef) {
				// 验证规则
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
			}
		},
		// 添加波形图
		async httpRequest(file, data, id) {
			const formData = new FormData();
			file.forEach((item) => {
				formData.append("image", item.raw);
			});
			formData.append("point_id", data.point_id);
			if (id) {
				formData.append("id", id);
				const result = await updateWaveForms(formData);
				if (result.code === status.SUCCESS) {
					ElMessage.success(result.msg);
					this.$emit("getTableData", true);
					this.layerDom && this.layerDom.close();
				} else {
					ElMessage.error(result.msg);
				}
			} else {
				const result = await uploadWaveForms(formData);
				if (result.code === status.SUCCESS) {
					ElMessage.success(result.msg);
					this.$emit("getTableData", true);
					this.layerDom && this.layerDom.close();
				} else {
					ElMessage.error(result.msg);
				}
			}
		},
	},
});
</script>
<style scoped lang="scss"></style>
