import axios from "axios";
import store from "@/store";
import router from "@/router/index"
import {
  ElMessage
} from "element-plus";
const baseURL =
  import.meta.env.VITE_BASE_URL;

import {
  getToken
} from "./token";

const service = axios.create({
  baseURL: baseURL,
  timeout: 120 * 10000,
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

// 响应的数据格式
service.defaults.responseType = "json";

service.defaults.withCredentials = true;

service.defaults.validateStatus = function () {
  return true;
};

// 请求前的统一处理
service.interceptors.request.use(
  (config) => {
    const tokenKey = getToken()
    if (tokenKey !== "" && tokenKey !== undefined && tokenKey !== null) {
      config.headers.common['authorization'] = tokenKey
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    const {
      data,
      status
    } = response
    if (status === 200 || status === 422) {
      return Promise.resolve(data);
    }
    // token过期之后
    if (status === 401) {
      router.replace({
        path: "/login"
      })
      ElMessage.error(data.msg)
    }
    showError(data);
    return Promise.reject(data);
  },
  (error) => {
    console.log(error); // for debug
    const badMessage = error.message || error;
    const code = parseInt(
      badMessage
      .toString()
      .replace("Error: Request failed with status code ", "")
    );
    showError({
      code,
      message: badMessage
    });
    return Promise.reject(error);
  }
);

function showError(error) {
  if (error.code === 401) {
    // to re-login
    store.dispatch("user/loginOut");
  } else {
    ElMessage({
      message: error.msg || error.message || "服务异常",
      type: "error",
      duration: 3 * 1000,
    });
  }
}

export default service;