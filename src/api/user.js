import request from "@/utils/system/request";

/**
 * 登录
 * @param {*} data
 * @returns
 */
export const login = (data) => {
  return request({
    url: "/admin/user/login",
    method: "post",
    data,
  });
};

/**
 * 获取用户信息
 * @param {*} id
 * @returns
 */
export const getUserInfo = (params) => {
  return request({
    url: `/admin/user/info`,
    method: "get",
    params
  });
};

/**
 * 退出登录
 * @returns
 */
export const logout = () => {
  return request({
    url: "/admin/user/logout",
    method: "get",
  });
};

/**
 * 获取列表
 * @returns
 */
export const getUserList = (data) => {
  return request({
    url: "/admin/user/list",
    method: "post",
    data,
  });
};

/**
 * 搜索用户
 * @param {*} data
 * @returns
 */
export const getUserSerachList = (data) => {
  return request({
    url: "/admin/user/list/search",
    method: "post",
    data,
  });
};

/**
 * 添加用户
 * @param {*} data
 * @returns
 */
export const addUser = (data) => {
  return request({
    url: "/admin/user/add",
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
    url: "/admin/user/update",
    method: "put",
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
    url: "/admin/user/delete",
    method: "delete",
    data,
  });
};

/**
 * 批量删除
 * @param {*} data
 * @returns
 */
export const batchDeleteUser = (data) => {
  return request({
    url: "/admin/user/batch/delete",
    method: "delete",
    data,
  });
};

/**
 * 重置学号
 * @param {*} data 
 * @returns 
 */
export const resetUserId = (data) => {
  return request({
    url: "/admin/user/reset/user-id",
    method: "put",
    data,
  });
}