<template>
  <Layer :layer="layer" ref="layerDom" @confirm="submit">
    <el-form ref="formRef" :model="modeForm" :rules="rules" label-width="120px">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="分类选择" prop="choose_id">
            <el-select
              v-model="modeForm.choose_id"
              placeholder="请选择对应的分类"
              clearable
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="22">
          <el-form-item label="内容" prop="content">
            <el-input
              v-model="modeForm.content"
              placeholder="请输入选择内容"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </Layer>
</template>

<script>
import { defineComponent, ref } from "vue";
import Layer from "@/components/layer/index.vue";
import { getChooseFindAll } from "@/api/choose";
import { ElMessage } from "element-plus";
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
          width: "400px",
        };
      },
    },
  },
  setup(props) {
    const layerDom = ref(null);
    const formRef = ref(null);
    const modeForm = ref({
      category: "",
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
      modeForm,
      rules,
    };
  },
  methods: {
    // 提交
    submit() {
      if (this.formRef) {
        // 验证规则
        this.formRef.validate((valid) => {
          if (valid) {
            let params = this.modeForm;
            // 修改流程
            if (this.layer.row) {
              updateChoose(params);
            } else {
              // 走添加流程
              addChoose(params);
            }
            this.$emit("getTableData", true);
            this.layerDom && this.layerDom.close();
          }
        });
      }
    },

    // 添加点位
    addChoose(params) {
      addChoose(params)
        .then((res) => {
          ElMessage.success({
            message: res.msg,
          });
        })
        .catch((err) => {
          ElMessage.error(res.msg);
        });
    },

    // 修改点位
    updateChoose(params) {
      updateChoose()
        .then((res) => {
          ElMessage.success(res.msg);
        })
        .catch((err) => {
          ElMessage.error(res.msg);
        });
    },
  },
});
</script>
<style scoped lang="scss"></style>
