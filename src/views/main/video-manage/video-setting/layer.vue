<template>
  <Layer :layer="layer" ref="layerDom" @confirm="submit">
    <el-form ref="formRef" :model="modeForm" :rules="rules" label-width="80px">
      <el-form-item label="视频">
        <el-upload
          ref="uploadRef"
          action=""
          list-type="picture-card"
          name="video"
          accept=".mp4"
          limit="1"
          :auto-upload="false"
          :http-request="httpRequest"
        >
          <el-icon><plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
  </Layer>
</template>

<script>
import { defineComponent, ref } from "vue";
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
    });
    const rules = {
      category: [
        {
          required: true,
          message: "请输入选择分类",
          trigger: "blur",
        },
      ],
      content: [
        {
          required: true,
          message: "请输入内容",
          trigger: "blur",
        },
      ],
    };
    // 初始化
    init();
    function init() {
      // 用于判断新增还是编辑功能
      if (props.layer.row) {
        modeForm.value = JSON.parse(JSON.stringify(props.layer.row));
      }
    }
    return {
      layerDom,
      formRef,
      rules,
      modeForm,
    };
  },
});
</script>
<style scoped lang="scss"></style>
