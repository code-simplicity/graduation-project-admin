// 港口点位地图设置
import request from "@/utils/system/request";

/**
 * 获取港口点位地图
 * @param {*} data
 * @returns
 */
export const getPortMapPointFindAll = (data) => {
  return request({
    url: "/portpointmap/findAll",
    method: "post",
    data,
  });
};

/**
 * 分片合并
 * @param {*} data
 * @returns
 */
export const uploadMergeChunksPortMapPoint = (data) => {
  return request({
    url: "/portpointmap/upload/merge_chunks",
    method: "post",
    data,
  });
};

/**
 * 上传港口点位图
 * @param {*} data
 * @returns
 */
export const uploadPortMapPoint = (data) => {
  return request({
    url: "/portpointmap/upload",
    method: "post",
    data,
  });
};

/**
 * 修改港口地图信息
 * @param {*} data
 * @returns
 */
export const updatePortMapPoint = (data) => {
  return request({
    url: "/portpointmap/update",
    method: "post",
    data,
  });
};

/**
 * 分片合并
 * @returns
 */
 export const updateMergeChunksPortMapPoint = (data) => {
  return request({
    url: "/portmap/update/merge_chunks",
    method: "post",
    data,
  });
};

/**
 * 删除港口点位图
 * @param {*} params
 * @returns
 */
export const deletePortMapPoint = (params) => {
  return request({
    url: "/portpointmap/delete",
    method: "get",
    params,
  });
};

/**
 * 搜索港口点位图
 * @param {*} data
 * @returns
 */
export const searchPortMapPoint = (data) => {
  return request({
    url: "/portpointmap/search",
    method: "post",
    data,
  });
};
