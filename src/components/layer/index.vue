<!--
 * @Author: bugdr
 * @Date: 2021-09-13 22:41:08
 * @LastEditors: bugdr
 * @LastEditTime: 2022-06-13 09:59:44
 * @FilePath: \graduation-project-admin\src\components\layer\index.vue
 * @Description: 
-->
<template>
	<div v-drag>
		<el-dialog
			ref="dialog"
			v-model="layer.show"
			:title="layer.title"
			:width="layer.width"
			center
			destroy-on-close
		>
			<slot></slot>
			<template #footer v-if="layer.showButton">
				<div>
					<el-button type="primary" @click="confirm">确认</el-button>
					<el-button @click="close">取消</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import drag from "@/directive/drag/index";
export default defineComponent({
	props: {
		layer: {
			type: Object,
			default: () => {
				return {
					show: false,
					title: "",
					showButton: false,
				};
			},
			required: true,
		},
	},
	directives: {
		drag,
	},
	setup(props, ctx) {
		const dialog = ref(false);
		function confirm() {
			ctx.emit("confirm");
		}
		function close() {
			dialog.value.handleClose();
			// 清除弹窗编辑的数据
			props.layer = {};
		}
		return {
			dialog,
			confirm,
			close,
		};
	},
});
</script>

<style lang="scss" scoped></style>
