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
 * 分片合并
 * @returns
 */
export const uploadMergeChunksPortMap = (data) => {
  return request({
    url: "/portmap/upload/merge_chunks",
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

/**
 * 分片合并
 * @returns
 */
 export const updateMergeChunksPortMap = (data) => {
  return request({
    url: "/portmap/update/merge_chunks",
    method: "post",
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
