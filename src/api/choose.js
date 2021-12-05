// 选择
import request from "@/utils/system/request";

/**
 * 查询所有的选择数据
 * @param {*} data
 * @returns
 */
export const getChooseFindAll = (data) => {
  return request({
    url: "/choose/findAll",
    method: "post",
    data,
  });
};

/**
 * 添加选择
 * @param {*} data
 * @returns
 */
export const addChoose = (data) => {
  return request({
    url: "/choose/add",
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
    url: "/choose/update",
    method: "post",
    data,
  });
};

/**
 * 删除选择
 * @param {*} params
 * @returns
 */
export const deleteChoose = (params) => {
  return request({
    url: "/choose/delete",
    method: "get",
    params,
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

/**
 * 批量删除
 * @param {*} data
 * @returns
 */
export const batchDeleteChoose = (data) => {
  return request({
    url: "/choose/batch/delete",
    method: "post",
    data,
  });
};
