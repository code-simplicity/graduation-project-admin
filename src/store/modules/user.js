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
        if (res.status === 200) {
          commit("tokenChange", res.token);
          dispatch("getUserInfo", res.data.id).then((infoRes) => {
            resolve(res.data.id);
          });
        } else if (res.status === 400) {
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
  loginOut({
    commit
  }) {
    logout()
      .then((res) => {})
      .catch((error) => {})
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