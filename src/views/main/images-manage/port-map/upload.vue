<template>
  <Layer :layer="layer" ref="layerDom" @confirm="submit"
    ><el-upload
      ref="uploadRef"
      name="image"
      action=""
      drag
      list-type="picture"
      limit="1"
      accept=".jpg, .png"
      :auto-upload="false"
      :http-request="httpRequestPortMap"
    >
      <el-icon size="120" class="el-icon--upload"><upload-filled /></el-icon>
      <div slot="tip" class="el-upload__text">请上传港口地图</div>
    </el-upload></Layer
  >
</template>

<script>
import { defineComponent, ref } from "vue";
import Layer from "@/components/layer/index.vue";
import { UploadFilled } from "@element-plus/icons";
import { ElMessage } from "element-plus";
import { uploadPortMap } from "@/api/portmap";
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
  setup(props) {
    const uploadRef = ref(null);
    const layerDom = ref(null);
    return {
      uploadRef,
      layerDom,
    };
  },
  methods: {
    //   自定义提交图片
    httpRequestPortMap(file) {
      // 首先就是使用formdata，将文件转为formdata类型
      const formData = new FormData();
      // 遍历文件，
      file.forEach((item) => {
        formData.append("image", item.raw);
      });
      // 传递参数
      uploadPortMap(formData)
        .then((res) => {
          ElMessage.success({
            message: res.msg,
          });
        })
        .catch((err) => {
          ElMessage.error({
            message: res.msg,
          });
          console.log(`err`, err);
        });
    },
    // 提交确认
    submit() {
      if (this.uploadRef) {
        this.httpRequestPortMap(this.uploadRef.uploadFiles);
        this.layerDom && this.layerDom.close();
      }
    },
  },
});
</script>
<style scoped lang="scss"></style>
