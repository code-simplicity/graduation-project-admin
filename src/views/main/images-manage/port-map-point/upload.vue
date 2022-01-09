<template>
  <Layer :layer="layer" ref="layerDom" @confirm="submit">
    <el-form
      ref="formRef"
      :model="modeForm"
      label-width="100px"
      class="demo-dynamic"
      :rules="rules"
    >
      <el-form-item label="港口点位图">
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
      <el-form-item label="波浪来向" prop="wave_direction" clearable>
        <el-select
          v-model="modeForm.wave_direction"
          placeholder="请选择波浪来向"
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
import { computed, defineComponent, reactive, ref } from "vue";
import Layer from "@/components/layer/index.vue";
import { Plus } from "@element-plus/icons";
import { getChooseFindAll } from "@/api/choose";
import {
  uploadPortMapPoint,
  updatePortMapPoint,
  uploadMergeChunksPortMapPoint,
  updateMergeChunksPortMapPoint,
} from "@/api/portmappoint";
import { hasFile } from "@/utils/utils";
import axios from "axios";
import { ElMessage } from "element-plus";
export default defineComponent({
  name: "Upload",
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
  setup(props) {
    // 表单数据
    const modeForm = ref({
      water_level: "",
    });
    // 验证规则
    const rules = {
      water_level: [
        {
          required: true,
          message: "请选择设计水位",
          trigger: "blur",
        },
      ],
      wave_direction: [
        {
          required: true,
          message: "请选择设计水位",
          trigger: "blur",
        },
      ],
      embank_ment: [
        {
          required: true,
          message: "请选择设计水位",
          trigger: "blur",
        },
      ],
    };
    const formRef = ref(null);
    // 上传图片的ref
    const uploadRef = ref(null);
    const layerDom = ref(null);
    const chooseData = ref([]);
    const chooseWaterLevel = computed(() => chooseData.value.slice(0, 4));
    const chooseWaveDirection = computed(() => chooseData.value.slice(4, 7));
    const chooseeMbankMent = computed(() => chooseData.value.slice(7, 11));
    const chooseFindAll = (init) => {
      if (init) {
        const params = {
          pageNum: 1,
          pageSize: 20,
        };
        getChooseFindAll(params)
          .then((res) => {
            let data = res.data.list;
            chooseData.value = data;
          })
          .catch((err) => {
            ElMessage.error(res.msg);
            console.log(`err`, err);
          });
      }
    };
    function init() {
      // 用于判断是上传港口地图还是更新港口地图
      if (props.layer.row) {
        // 更新，将表格数据的值赋值给表单
        modeForm.value = JSON.parse(JSON.stringify(props.layer.row));
      }
    }
    // 初始化
    init();
    chooseFindAll(true);
    return {
      modeForm,
      rules,
      formRef,
      uploadRef,
      layerDom,
      chooseData,
      chooseWaterLevel,
      chooseWaveDirection,
      chooseeMbankMent,
      hasFile,
    };
  },
  methods: {
    // 提交表单
    submit() {
      this.formRef.validate((valid) => {
        if (valid) {
          let data = this.modeForm;
          let file = this.uploadRef.uploadFiles;
          if (this.layer.row) {
            // 走更新流程
            let id = this.layer.row.id;
            this.httpRequest(file, data, id);
          } else {
            // 走上传流程
            this.httpRequest(file, data);
          }
        }
      });
    },

    // 接口调用
    async httpRequest(data, form, id) {
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
      const hash = await this.hasFile(file, chunkSize);
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
        if (id) {
          formData.append("id", id);
          axiosPromiseArray.push(updatePortMapPoint(formData));
        } else {
          // 加入到 Promise 数组中
          axiosPromiseArray.push(uploadPortMapPoint(formData));
        }
        // 加入到 Promise 数组中
      }

      await axios.all(axiosPromiseArray).then(() => {
        const params = {
          size: file.size,
          name: file.name,
          total: blockCount,
          hash,
          type: file.type,
          water_level: form.water_level,
          wave_direction: form.wave_direction,
          embank_ment: form.embank_ment,
        };
        if (id) {
          const data = {
            ...params,
            id: id,
          };
          updateMergeChunksPortMapPoint(data)
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
        } else {
          uploadMergeChunksPortMapPoint(params)
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
        }
      });
      this.$emit("getTableData", true);
      this.layerDom && this.layerDom.close();
    },
  },
});
</script>
<style scoped lang="scss"></style>
