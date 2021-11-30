<template>
  <Layer :layer="layer" ref="layerDom" @confirm="submit">
    <el-form :rules="rules" ref="ruleForm" :model="form" label-width="60px">
      <el-form-item label="学号" prop="id">
        <el-input v-model="form.id"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="user_name">
        <el-input v-model="form.user_name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="得分" prop="score">
        <el-input v-model="form.score"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roles">
        <el-select v-model="form.roles" placeholder="请选择">
          <el-option label="管理员" value="admin"></el-option>
          <el-option label="普通用户" value="user"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="form.state" placeholder="请选择状态">
          <el-option label="存在" value="1"></el-option>
          <el-option label="已删除" value="0"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </Layer>
</template>

<script>
import { defineComponent, ref } from "vue";
import Layer from "@/components/layer/index.vue";
import { addUser, updateUser } from "@/api/user";
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
    const ruleForm = ref(null);
    const layerDom = ref(null);
    const rules = {
      id: [{ required: true, message: "请输入学号", trigger: "blur" }],
      user_name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      roles: [{ required: true, message: "请选择角色", trigger: "blur" }],
      state: [
        { required: true, message: "请选择状态,默认为在线", trigger: "blur" },
      ],
      score: [
        { required: true, message: "请输入该学生的得分", trigger: "blur" },
      ],
    };
    let form = ref({
      id: "",
    });
    // 初始化
    init();
    function init() {
      // 用于判断新增还是编辑功能
      if (props.layer.row) {
        form.value = JSON.parse(JSON.stringify(props.layer.row));
      }
    }
    return {
      rules,
      form,
      ruleForm,
      layerDom,
    };
  },
  methods: {
    submit() {
      if (this.ruleForm) {
        this.ruleForm.validate((valid) => {
          if (valid) {
            let params = this.form;
            if (this.layer.row) {
              // 更新用户信息
              this.updateUser(params);
            } else {
              // 添加用户
              this.addUser(params);
            }
          }
        });
      }
    },
    // 添加用户
    addUser(params) {
      addUser(params)
        .then((res) => {
          ElMessage.success({
            message: res.msg,
          });
          this.$emit("getTableData", true);
          this.layerDom && this.layerDom.close();
        })
        .catch((err) => {
          ElMessage.error({
            message: res.msg,
          });
        });
    },

    // 修改用户数据
    updateUser(params) {
      updateUser(params)
        .then((res) => {
          ElMessage.success(res.msg);
          this.$emit("getTableData", true);
          this.layerDom && this.layerDom.close();
        })
        .catch((err) => {
          ElMessage.error({
            message: res.msg,
          });
        });
    },
  },
});
</script>
<style scoped lang="scss"></style>
