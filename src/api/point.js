// 点位
import request from "@/utils/system/request";

/**
 * 获取所有点位
 * @param {*} data
 * @returns
 */
export const getPointFindAll = (data) => {
  return request({
    url: "/point/findAll",
    method: "post",
    data,
  });
};

/**
 * 添加点位
 * @param {*} data
 * @returns
 */
export const addPoint = (data) => {
  return request({
    url: "/point/add",
    method: "post",
    data,
  });
};

/**
 * 删除点位
 * @param {*} params
 * @returns
 */
export const deletePoint = (params) => {
  return request({
    url: "/point/delete",
    method: "get",
    params,
  });
};

/**
 * 修改点位信息
 * @param {*} data
 * @returns
 */
export const updatePoint = (data) => {
  return request({
    url: "/point/update",
    method: "post",
    data,
  });
};

/**
 * 搜索点位
 * @param {}} data
 * @returns
 */
export const searchPoint = (data) => {
  return request({
    url: "/point/search",
    method: "post",
    data,
  });
};

/**
 * 批量删除点位
 * @param {*} data 
 * @returns 
 */
export const batchDeletePoint = (data) => {
  return request({
    url: "/point/batch/delete",
    method: "post",
    data
  })
}