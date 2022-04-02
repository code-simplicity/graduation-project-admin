// 选择
import request from "@/utils/system/request";

/**
 * 查询所有的选择数据
 * @param {*} params
 * @returns
 */
export const getChooseFindAll = (params) => {
  return request({
    url: "/admin/choose/findAll",
    method: "get",
    params,
  });
};

/**
 * 添加选择
 * @param {*} data
 * @returns
 */
export const addChoose = (data) => {
  return request({
    url: "/admin/choose/add",
    method: "post",
    data,
  });
};

/**
 * 修改选择
 * @param {*} data
 * @returns
 */
export const updateChoose = (data) => {
  return request({
    url: "/admin/choose/update",
    method: "put",
    data,
  });
};

/**
 * 删除选择
 * @param {*} data
 * @returns
 */
export const deleteChoose = (data) => {
  return request({
    url: "/admin/choose/delete",
    method: "delete",
    data,
  });
};

/**
 * 批量删除
 * @param {*} data
 * @returns
 */
export const batchDeleteChoose = (data) => {
  return request({
    url: "/admin/choose/batch/delete",
    method: "delete",
    data,
  });
};

/**
 * 查询选择列表
 * @param {*} params
 * @returns
 */
export const searchChoose = (params) => {
  return request({
    url: "/choose/search",
    method: "get",
    params,
  });
};