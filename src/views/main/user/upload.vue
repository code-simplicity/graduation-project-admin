<template>
  <Layer :layer="layer" ref="layerDom" @confirm="submit"
    ><el-upload
      ref="uploadRef"
      name="file"
      :action="baseURL"
      drag
      :auto-upload="false"
      @on-error="uploadError"
    >
      <el-icon size="120" class="el-icon--upload"><upload-filled /></el-icon>
      <div slot="tip" class="el-upload__text">请选择对应的excel模板</div>
    </el-upload>
  </Layer>
</template>

<script>
import { defineComponent, ref } from "vue";
import Layer from "@/components/layer/index.vue";
import { UploadFilled } from "@element-plus/icons";
import { ElMessage } from "element-plus";
export default defineComponent({
  name: "Upload",
  components: {
    Layer,
    UploadFilled,
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
  setup() {
    const uploadRef = ref(null);
    const layerDom = ref(null);
    // 用户导入的接口
    const baseURL = import.meta.env.VITE_BASE_URL + "/excel/upload";
    return {
      uploadRef,
      layerDom,
      baseURL,
    };
  },
  methods: {
    submit() {
      if (this.uploadRef) {
        this.uploadRef.submit();
        ElMessage.success({
          message: "导入用户成功.",
        });
        this.layerDom && this.layerDom.close();
      }
    },
    uploadError(err) {
      ElMessage.error({
        message: "导入失败，请检查测试.",
      });
    },
  },
});
</script>
<style scoped lang="scss"></style>
