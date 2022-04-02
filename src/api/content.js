import request from "@/utils/system/request";

/**
 * 查询所有的内容
 * @param {*} params
 * @returns
 */
export const getContentFindAll = (params) => {
  return request({
    url: "/admin/content/findAll",
    method: "get",
    params,
  });
};

/**
 * 添加内容,
 * @param {*} data
 * @returns
 */
export const addContent = (data) => {
  return request({
    url: "/admin/content/add",
    method: "post",
    data,
  });
};

/**
 * 修改内容
 * @param {*} data
 * @returns
 */
export const updateContent = (data) => {
  return request({
    url: "/admin/content/update",
    method: "put",
    data,
  });
};

/**
 * 删除内容
 * @param {*} data
 * @returns
 */
export const deleteContent = (data) => {
  return request({
    url: "/admin/content/delete",
    method: "delete",
    data,
  });
};

/**
 * 根据choose_id查找数据
 * @param {*} params
 * @returns
 */
export const searchContentChooseId = (params) => {
  return request({
    url: "/admin/content/search/choose_id",
    method: "get",
    params,
  });
};

/**
 * 批量删除
 * @param {*} data
 * @returns
 */
export const batchDeleteContent = (data) => {
  return request({
    url: "/admin/content/batch/delete",
    method: "delete",
    data,
  });
};