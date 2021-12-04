<template>
  <div class="choose">
    <div class="header-box">
      <h2>选择列表</h2>
      <el-input v-model="search" placeholder="请输入内容"></el-input>
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
export default defineComponent({
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
    const getChooseAll = () => {
      const params = {
        pageNum: page.pageNum,
        pageSize: page.pageSize,
      };
      getChooseFindAll(params)
        .then((res) => {
          let data = res.data.list;
          list.value = data;
          active.value = res.data.list[0];
        })
        .catch((err) => {
          ElMessage.error(err);
          console.log(`err`, err);
          list.value = [];
        });
    };
    const changeActive = (row) => {
      active.value = row;
    };
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
