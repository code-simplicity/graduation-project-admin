import request from "@/utils/system/request";

/**
 * 查询所有的内容
 * @param {*} data
 * @returns
 */
export const getContentFindAll = (data) => {
  return request({
    url: "/content/findAll",
    method: "post",
    data,
  });
};

/**
 * 添加内容,无外键的
 * @param {*} data
 * @returns
 */
export const addContent = (data) => {
  return request({
    url: "content/add",
    method: "post",
    data,
  });
};

/**
 * 添加内容,有外键的
 * @param {*} data
 * @returns
 */
export const addContentChoose = (data) => {
  return request({
    url: "content/add/choose_id",
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
    url: "/content/update",
    method: "post",
    data,
  });
};

/**
 * 删除内容
 * @param {*} params
 * @returns
 */
export const deleteContent = (params) => {
  return request({
    url: "/content/delete",
    method: "get",
    params,
  });
};

/**
 * 工具choose_id查找数据
 * @param {*} data
 * @returns
 */
export const searchContentChooseId = (data) => {
  return request({
    url: "/content/search/choose_id",
    method: "post",
    data,
  });
};
