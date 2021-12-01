// 港口地图
import request from "@/utils/system/request";

/**
 * 获取港口地图
 * @returns
 */
export const getPortMapFind = (data) => {
  return request({
    url: "/portmap/find",
    method: "post",
    data,
  });
};

/**
 * 上传港口地图
 * @returns
 */
export const uploadPortMap = (data) => {
  return request({
    url: "/portmap/upload",
    method: "post",
    data,
  });
};

/**
 * 删除港口地图
 * @param {*} params
 * @returns
 */
export const deletePortMap = (params) => {
  return request({
    url: "/portmap/delete",
    method: "get",
    params,
  });
};

/**
 *修改港口地图
 * @param {*} data
 * @returns
 */
export const updatePortMap = (data) => {
  return request({
    url: "/portmap/update",
    method: "post",
    data,
  });
};