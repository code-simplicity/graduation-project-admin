import request from "@/utils/system/request";

/**
 * 登录
 * @param {*} data
 * @returns
 */
export const login = (data) => {
  return request({
    url: "/user/login",
    method: "post",
    data,
  });
};

/**
 * 获取用户信息
 * @param {*} id
 * @returns
 */
export const getUserInfo = (id) => {
  return request({
    url: `/user/info?id=${id}`,
    method: "get",
  });
};

/**
 * 退出登录
 * @returns
 */
export const logout = () => {
  return request({
    url: "/user/logout",
    method: "get",
  });
};

/**
 * 获取列表
 * @returns
 */
export const getUserList = (data) => {
  return request({
    url: "/user/list",
    method: "post",
    data,
  });
};

// 获取用户信息Api
export function passwordChange(data) {
  return request({
    url: "/user/passwordChange",
    method: "post",
    data,
  });
}
