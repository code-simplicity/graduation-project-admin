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

/**
 * 搜索用户
 * @param {*} params
 * @returns
 */
export const getUserSerachList = (params) => {
  return request({
    url: "/user/list/search",
    method: "get",
    params,
  });
};

/**
 * 添加用户
 * @param {*} data
 * @returns
 */
export const addUser = (data) => {
  return request({
    url: "user/add",
    method: "post",
    data,
  });
};

/**
 * 修改用户数据
 * @param {*} data
 * @returns
 */
export const updateUser = (data) => {
  return request({
    url: "user/update",
    method: "post",
    data,
  });
};

/**
 * 删除用户
 * @param {*} data
 * @returns
 */
export const deleteUser = (data) => {
  return request({
    url: "/user/delete",
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
