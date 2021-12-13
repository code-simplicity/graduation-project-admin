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
import { defineComponent, reactive, ref } from "vue";
import Layer from "@/components/layer/index.vue";
import { UploadFilled } from "@element-plus/icons";
import { ElMessage } from "element-plus";
import {
  uploadPortMap,
  updatePortMap,
  uploadMergeChunksPortMap,
} from "@/api/portmap";
import SparkMD5 from "spark-md5";
import { hasFile } from "@/utils/utils";
import axios from "axios";
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
    return {
      uploadRef,
      layerDom,
      hasFile,
    };
  },
  methods: {
    //  自定义提交图片
    async httpRequestPortMap(data, id) {
      // 每个分片的大小,设置1m
      const chunkSize = 1 * 1024 * 1024;
      // 使用Blob.slice进行文件的切割
      const blobSlice =
        File.prototype.slice ||
        File.prototype.mozSlice ||
        File.prototype.webkitSlice;
      const file = data[0].raw;
      // 获取到的files为一个File对象数组，如果允许多选的时候，文件为多个
      if (!file) {
        ElMessage.error({
          message: "没有选择文件！",
        });
        return;
      }
      const blockCount = Math.ceil(file.size / chunkSize);
      const axiosPromiseArray = [];
      // 文件hash
      const hash = await this.hasFile(file);
      // 获取文件hash之后，如果需要做断点续传，可以根据hash值去后台进行校验。
      // 看看是否已经上传过该文件，并且是否已经传送完成以及已经上传的切片。
      console.log(`hash`, hash);
      for (let i = 0; i < blockCount; i++) {
        const start = i * chunkSize;
        const end = Math.min(file.size, start + chunkSize);
        // 构建表单
        const formData = new FormData();
        formData.append("image", blobSlice.call(file, start, end));
        formData.append("name", file.name);
        formData.append("total", blockCount);
        formData.append("index", i);
        formData.append("size", file.size);
        formData.append("hash", hash);
        const axiosOptions = {
          onUploadProgress: (e) => {
            // 处理上传的进度
            console.log(blockCount, i, e, file);
          },
        };
        // 加入到 Promise 数组中
        axiosPromiseArray.push(uploadPortMap(formData, axiosOptions));
      }

      await axios.all(axiosPromiseArray).then(() => {
        const params = {
          size: file.size,
          name: file.name,
          total: blockCount,
          hash,
          type: file.type,
        };
        uploadMergeChunksPortMap(params)
          .then((res) => {
            ElMessage.success(res.msg);
            console.log("上传成功");
            console.log(res.data, file);
          })
          .catch((err) => {
            ElMessage.error({
              message: err,
            });
          });
      });
    },
    // 提交确认
    submit() {
      if (this.uploadRef) {
        if (this.layer.row) {
          this.httpRequestPortMap(
            this.uploadRef.uploadFiles,
            this.layer.row.id
          );
        } else {
          // 提交图片
          this.httpRequestPortMap(this.uploadRef.uploadFiles);
        }
      } else {
        ElMessage.error({
          message: "请选择需要上传的港口地图.",
        });
      }
      this.$emit("getTableData", true);
      this.layerDom && this.layerDom.close();
    },
  },
});
</script>
<style scoped lang="scss"></style>
