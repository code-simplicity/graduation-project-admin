import {
  login,
  getUserInfo,
  logout
} from "@/api/user";

import {
  findUserInfo,
  setUserInfo,
  removeUserInfo,
} from "@/utils/system/userInfo";
import {
  getToken,
  setToken,
  removeToken
} from "@/utils/system/token";

import {
  status
} from "@/utils/system/constant"

import {
  ElMessage
} from "element-plus";


const state = () => ({
  token: getToken(),
  userInfo: findUserInfo(),
});

// getters
const getters = {
  token(state) {
    return state.token;
  },
  userInfo(state) {
    return state.userInfo;
  },
};

// mutations
const mutations = {
  tokenChange(state, token) {
    state.token = token;
    setToken(token);
  },
  infoChange(state, userInfo) {
    state.userInfo = userInfo;
    setUserInfo(userInfo);
  },
};

// actions
const actions = {
  // login by login.vue
  login({
    commit,
    dispatch
  }, params) {
    return new Promise((resolve, reject) => {
      login(params).then((res) => {
        if (res.status === status.SUCCESS) {
          if (res.data.roles === "admin") {
            commit("tokenChange", res.data.token);
            dispatch("getUserInfo", res.data.id).then(() => {
              resolve(res.data.id);
            });
          } else {
            ElMessage.error({
              message: "没有登录权限"
            })
          }
        } else if (res.status === status.FAILED) {
          ElMessage.error({
            message: res.msg
          })
        }
      })
    });
  },
  // get user info after user logined
  getUserInfo({
    commit
  }, params) {
    return new Promise((resolve, reject) => {
      getUserInfo(params).then((res) => {
        commit("infoChange", res.data);
        resolve(res.data);
      });
    });
  },

  // login out the system after user click the loginOut button
  loginOut() {
    logout()
      .then((res) => {
        if (res.status === status.SUCCESS) {
          ElMessage.success({
            message: res.msg
          })
        }
      })
      .finally(() => {
        localStorage.removeItem("tabs");
        localStorage.removeItem("vuex");
        location.reload();
        removeUserInfo();
        removeToken();
      });
  },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};