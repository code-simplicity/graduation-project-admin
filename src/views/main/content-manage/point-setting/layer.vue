<template>
	<Layer :layer="layer" ref="layerDom" @confirm="submit">
		<el-form ref="formRef" :model="modeForm" :rules="rules" label-width="120px">
			<el-row :gutter="10">
				<el-col :span="24">
					<el-form-item label="港口点位地图" prop="port_point_map_id">
						<el-select
							v-model="modeForm.port_point_map_id"
							placeholder="请选择港口点位地图"
							clearable
						>
							<el-option
								v-for="item in portMapPointData"
								:key="item.id"
								:label="item.name"
								:value="item.id"
							></el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="10">
				<el-col :span="22">
					<el-form-item label="内容" prop="content">
						<el-input
							v-model="modeForm.content"
							placeholder="请输入内容"
							max="39"
							min="1"
							type="number"
						></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</Layer>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import Layer from "@/components/layer/index.vue";
import { getPortMapPointFindAll } from "@/api/portmappoint";
import { addPoint, updatePoint } from "@/api/point";
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
		const modeForm = ref({
			port_point_map_id: "",
		});
		const page = reactive({
			pageNum: 1,
			pageSize: 100,
		});
		const formRef = ref(null);
		const rules = {
			port_point_map_id: [
				{
					required: true,
					message: "请选择港口点位图对应的值",
					trigger: "blur",
				},
			],
			content: [
				{
					required: true,
					message: "请输入内容,输入值必须是在1到39之间",
					trigger: "blur",
				},
			],
		};
		const portMapPointData = ref([]);
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
		// 初始化
		init();
		function init() {
			// 用于判断新增还是编辑功能
			if (props.layer.row) {
				modeForm.value = JSON.parse(JSON.stringify(props.layer.row));
			}
		}
		// 初始化
		getPortMapPointData();
		return {
			layerDom,
			modeForm,
			page,
			formRef,
			rules,
			portMapPointData,
			getPortMapPointData,
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
							updatePoint(params).then((res) => {
								if (res.status === status.SUCCESS) {
									ElMessage.success(res.msg);
									this.$emit("getTableData", true);
									this.layerDom && this.layerDom.close();
								} else {
									ElMessage.error(res.msg);
								}
							});
						} else {
							// 走添加流程
							addPoint(params).then((res) => {
								if (res.status === status.SUCCESS) {
									ElMessage.success({
										message: res.msg,
									});
									this.$emit("getTableData", true);
									this.layerDom && this.layerDom.close();
								} else {
									ElMessage.error(res.msg);
								}
							});
						}
					}
				});
			}
		},

		// 修改点位
		updatePoint(params) {},
	},
});
</script>
<style scoped lang="scss"></style>
