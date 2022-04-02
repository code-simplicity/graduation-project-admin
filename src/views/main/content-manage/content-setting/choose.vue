<template>
	<div class="choose">
		<div class="header-box">
			<h2>选择列表</h2>
		</div>
		<ul
			class="list system-scrollbar"
			style="overflow: auto"
			:infinite-scroll-immediate="false"
			ref="listDom"
			v-infinite-scroll="getChooseAll"
		>
			<li
				v-for="item in list"
				:key="item.id"
				:class="{ active: item.id === active.id }"
				@click="changeActive(item)"
			>
				<span>{{ item.content }}</span>
			</li>
		</ul>
	</div>
</template>

<script>
import { defineComponent, reactive, ref, inject } from "vue";
import { getChooseFindAll } from "@/api/choose";
import { ElMessage } from "element-plus";
import { Search } from "@element-plus/icons";
import { status } from "@/utils/system/constant";
export default defineComponent({
	components: {
		Search,
	},
	setup() {
		const listDom = ref(null);
		const page = reactive({
			pageNum: 1,
			pageSize: 20,
			total: 0,
		});
		let list = ref([]);
		let search = ref("");
		let active = inject("active");
		const getChooseAll = async () => {
			const params = {
				pageNum: page.pageNum,
				pageSize: page.pageSize,
			};
			const result = await getChooseFindAll(params);
			if (result.code === status.SUCCESS) {
				let data = result.data.list;
				// 这里加一个全部
				const all = {
					content: "全部",
					pageNum: "1",
					pageSize: "20",
				};
				data.unshift(all);
				list.value = data;
				active.value = list.value[0];
			} else {
				ElMessage.error(result.msg);
				list.value = [];
			}
		};
		const changeActive = (row) => {
			active.value = row;
		};
		// 初始化
		getChooseAll();
		return {
			listDom,
			page,
			list,
			search,
			active,
			getChooseAll,
			changeActive,
		};
	},
});
</script>
<style scoped lang="scss">
.choose {
	background: #fff;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	.header-box {
		padding: 10px;
		display: flex;
		align-items: center;
		h2 {
			padding: 0;
			margin: 0;
			margin-right: 20px;
			font-size: 14px;
			display: -webkit-box;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;
			overflow: hidden;
			height: 30px;
			line-height: 30px;
		}
		.el-input__icon {
			line-height: 34px;
		}
		.el-input {
			flex: 1;
		}
	}
	.list {
		flex: 1;
		height: auto;
		margin: 0;
		padding: 0;
		display: block;
		li {
			height: 38px;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding-left: 20px;
			width: 100%;
			box-sizing: border-box;
			cursor: pointer;
			transition: 0.2s;
			& + li {
				border-top: 1px solid #eee;
			}
			&:hover {
				background: #eee;
			}
			&.active {
				background: rgba(186, 220, 255, 0.4);
			}
			span {
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
				overflow: hidden;
				font-size: 14px;
			}
		}
		.load-tip {
			font-size: 14px;
			color: #616161;
		}
	}
}
</style>
