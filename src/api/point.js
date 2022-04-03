// 点位
import request from "@/utils/system/request";

/**
 * 获取所有点位
 * @param {*} params
 * @returns
 */
export const getPointFindAll = (params) => {
  return request({
    url: "/admin/point/findAll",
    method: "get",
    params,
  });
};

/**
 * 添加点位
 * @param {*} data
 * @returns
 */
export const addPoint = (data) => {
  return request({
    url: "/admin/point/add",
    method: "post",
    data,
  });
};

/**
 * 删除点位
 * @param {*} data
 * @returns
 */
export const deletePoint = (data) => {
  return request({
    url: "/admin/point/delete",
    method: "delete",
    data,
  });
};

/**
 * 修改点位信息
 * @param {*} data
 * @returns
 */
export const updatePoint = (data) => {
  return request({
    url: "/admin/point/update",
    method: "put",
    data,
  });
};

/**
 * 搜索点位
 * @param {}} params
 * @returns
 */
export const searchPoint = (params) => {
  return request({
    url: "/admin/point/search",
    method: "get",
    params,
  });
};

/**
 * 批量删除点位
 * @param {*} data 
 * @returns 
 */
export const batchDeletePoint = (data) => {
  return request({
    url: "/admin/point/batch/delete",
    method: "delete",
    data
  })
}