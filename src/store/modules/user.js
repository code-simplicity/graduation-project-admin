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

import {
  status
} from "@/utils/system/constant"

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

  /**
   * 登录
   * @param {*} param
   * @param {*} params 
   */
  async login({
    commit
  }, params) {
    const result = await login(params)
    if (result.code === status.SUCCESS) {
      const {
        tokenKey,
        ...data
      } = result.data
      if (data.roles === "admin") {
        commit("tokenChange", tokenKey)
        commit("infoChange", data)
        return result
      } else {
        ElMessage.success("没有登录权限")
      }
    } else {
      ElMessage.error(result.msg)
    }
  },

  /**
   * 获取用户信息
   * @param {*} param0 
   * @param {*} id 
   */
  async getUserInfoById({
    commit
  }, id) {
    const result = await getUserInfo(id)
    if (result.code === status.SUCCESS) {
      commit("infoChange", result.data)
    }
  },

  /**
   * 退出登录
   */
  async loginOut() {
    const result = await logout()
    if (result.code === status.SUCCESS) {
      ElMessage.success({
        message: result.msg
      })
      localStorage.removeItem("tabs");
      localStorage.removeItem("vuex");
      location.reload();
      removeUserInfo();
      removeToken();
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};