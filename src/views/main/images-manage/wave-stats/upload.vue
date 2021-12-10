<template>
  <Layer :layer="layer" ref="layerDom" @confirm="submit">
    <el-form ref="formRef" :model="modeForm" :rules="rules" label-width="120px">
      <el-form-item label="波形统计图" prop="image">
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
          <template #tip>
            <div class="el-upload__tip">请选择波形统计图，格式为jpg/png</div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="港口点位地图" prop="port_point_map_id">
        <el-select
          v-model="modeForm.port_point_map_id"
          placeholder="请选择港口点位地图"
          clearable
          @change="changePortPointMap"
        >
          <el-option
            v-for="item in portMapPointData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="点位表" prop="point_id">
        <el-select
          v-model="modeForm.point_id"
          placeholder="请选择点位表，根据点位表分类选择"
          clearable
        >
          <el-option
            v-for="item in pointList"
            :key="item.id"
            :label="item.content"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </Layer>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import Layer from "@/components/layer/index.vue";
import { Plus } from "@element-plus/icons";
import { getPortMapPointFindAll } from "@/api/portmappoint";
import { searchPoint } from "@/api/point";
import { uploadWaveStats, updateWaveStats } from "@/api/wavestats";
export default defineComponent({
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
    const layerDom = ref(null);
    const formRef = ref(null);
    const modeForm = ref({});
    // 规则
    const rules = {
      point_id: [
        {
          required: true,
          message: "请选择需要对应的点位",
          trigger: "blur",
        },
      ],
    };
    const page = reactive({
      pageNum: 1,
      pageSize: 40,
    });
    // 港口点位地图
    const portMapPointData = ref([]);
    // 点位表
    const pointList = ref([]);
    // 上传图片的ref
    const uploadRef = ref(null);
    // 获取港口点位图
    const getPortMapPointData = () => {
      getPortMapPointFindAll()
        .then((res) => {
          portMapPointData.value = res.data;
        })
        .catch((err) => {
          ElMessage.error(res.msg);
        });
    };
    // 港口地图选择
    const changePortPointMap = (port_point_map_id) => {
      if (port_point_map_id) {
        const params = {
          pageNum: page.pageNum,
          pageSize: page.pageSize,
          port_point_map_id: port_point_map_id,
        };
        // 通过选择港口地图的值，选择点位表
        searchPoint(params)
          .then((res) => {
            let data = res.data.list;
            pointList.value = data;
          })
          .catch((err) => {
            ElMessage.success(err);
            pointList.value = [];
            page.pageNum = 1;
            page.total = 0;
          });
      }
    };
    // 初始化
    getPortMapPointData();
    return {
      layerDom,
      formRef,
      modeForm,
      rules,
      pointList,
      portMapPointData,
      page,
      uploadRef,
      getPortMapPointData,
      changePortPointMap,
    };
  },
  methods: {
    // 提交表单
    submit() {
      if (this.formRef) {
        // 验证规则
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
      }
    },
    // 添加波形图
    httpRequest(file, data, id) {
      const formData = new FormData();
      file.forEach((item) => {
        formData.append("image", item.raw);
      });
      formData.append("point_id", data.point_id);
      if (id) {
        formData.append("id", id);
        updateWaveStats(formData)
          .then((res) => {
            ElMessage.success(res.msg);
          })
          .catch((err) => {
            ElMessage.error(res.msg);
            console.log(`err`, err);
          });
      } else {
        uploadWaveStats(formData)
          .then((res) => {
            ElMessage.success({
              message: res.msg,
            });
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
