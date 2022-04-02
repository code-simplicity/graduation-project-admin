// 港口地图
import request from "@/utils/system/request";

/**
 * 获取港口地图
 * @returns params
 */
export const getPortMapFind = (params) => {
  return request({
    url: "/admin/portmap/findAll",
    method: "get",
    params,
  });
};

/**
 * 上传港口地图
 * @returns
 */
export const uploadPortMap = (data) => {
  return request({
    url: "/admin/portmap/upload",
    method: "post",
    data,
  });
};

/**
 * 删除港口地图
 * @param {*} data
 * @returns
 */
export const deletePortMap = (data) => {
  return request({
    url: "/admin/portmap/delete",
    method: "delete",
    data,
  });
};

/**
 *修改港口地图
 * @param {*} data
 * @returns
 */
export const updatePortMap = (data) => {
  return request({
    url: "/admin/portmap/update",
    method: "put",
    data,
  });
};

/**
 * 通过图片id获取图片
 * @param {*} params
 * @returns
 */
export const searchPortMap = (params) => {
  return request({
    url: "/portmap/search",
    method: "get",
    params,
  });
};