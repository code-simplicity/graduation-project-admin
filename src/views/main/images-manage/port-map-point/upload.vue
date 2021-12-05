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
import { uploadPortMapPoint, updatePortMapPoint } from "@/api/portmappoint";
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
    httpRequest(file, data, id) {
      const formData = new FormData();
      file.forEach((item) => {
        formData.append("image", item.raw);
      });
      formData.append("water_level", data.water_level);
      formData.append("wave_direction", data.wave_direction);
      formData.append("embank_ment", data.embank_ment);
      if (id) {
        formData.append("id", id);
        updatePortMapPoint(formData)
          .then((res) => {
            ElMessage.success(res.msg);
          })
          .catch((err) => {
            ElMessage.error(err);
          });
      } else {
        uploadPortMapPoint(formData)
          .then((res) => {
            ElMessage.success(res.msg);
          })
          .catch((err) => {
            ElMessage.error(err);
          });
      }
      this.$emit("getTableData", true);
      this.layerDom && this.layerDom.close();
    },
  },
});
</script>
<style scoped lang="scss"></style>
