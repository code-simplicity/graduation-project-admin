<template>
  <Layer :layer="layer" ref="layerDom" @confirm="submit">
    <el-form ref="formRef" :model="modeForm" :rules="rules" label-width="80px">
      <el-form-item label="视频" prop="video">
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
          <el-icon><video-camera /></el-icon>
          <template #tip>
            <div class="el-upload__tip">请选择视频，格式为mp4</div>
          </template>
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
      <el-form-item label="波浪来向" prop="wave_direction">
        <el-select
          v-model="modeForm.wave_direction"
          placeholder="请选择波浪来向"
          clearable
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
import { defineComponent, ref, computed } from "vue";
import Layer from "@/components/layer/index.vue";
import { getChooseFindAll } from "@/api/choose";
import { uploadVideo, updateVideo } from "@/api/video";
import { ElMessage } from "element-plus";
import { VideoCamera } from "@element-plus/icons";
export default defineComponent({
  components: {
    Layer,
    VideoCamera,
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
      wave_direction: "",
      embank_ment: "",
    });
    const rules = {
      video: [
        {
          required: true,
          message: "请务必上传视频",
          trigger: "blur",
        },
      ],
    };
    // 上传视频的ref
    const uploadRef = ref(null);
    const chooseData = ref([]);
    const chooseWaterLevel = computed(() => chooseData.value.slice(0, 4));
    const chooseWaveDirection = computed(() => chooseData.value.slice(4, 7));
    const chooseeMbankMent = computed(() => chooseData.value.slice(7, 11));
    // 获取选择数据
    const chooseFindAll = () => {
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
    chooseFindAll();
    return {
      layerDom,
      formRef,
      modeForm,
      uploadRef,
      rules,
      chooseData,
      chooseWaterLevel,
      chooseWaveDirection,
      chooseeMbankMent,
    };
  },
  methods: {
    // 表单提交
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
    // 上传视频
    httpRequest(file, data, id) {
      const formData = new FormData();
      file.forEach((item) => {
        formData.append("video", item.raw);
      });
      formData.append("water_level", data.water_level);
      formData.append("wave_direction", data.wave_direction);
      formData.append("embank_ment", data.embank_ment);
      // id存在走更新流程
      if (id) {
        formData.append("id", id);
        updateVideo(formData)
          .then((res) => {
            ElMessage.success(res.msg);
          })
          .catch((err) => {
            ElMessage.error(res.msg);
          });
      } else {
        uploadVideo(formData)
          .then((res) => {
            ElMessage.success(res.msg);
          })
          .catch((err) => {
            ElMessage.error(res.msg);
          });
      }
      this.$emit("getTableData", true);
      this.layerDom && this.layerDom.close();
    },
  },
});
</script>
<style scoped lang="scss"></style>
