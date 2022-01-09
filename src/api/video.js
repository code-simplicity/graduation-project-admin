// 视频
import request from "@/utils/system/request";

/**
 * 获取所有视频
 * @param {*} data
 * @returns
 */
export const getVideoFindAll = (data) => {
  return request({
    url: "/video/findAll",
    method: "post",
    data,
  });
};

/**
 * 上传视频
 * @param {*} data
 * @returns
 */
export const uploadVideo = (data) => {
  return request({
    url: "/video/upload",
    method: "post",
    data,
  });
};

/**
 * 分片合并
 * @param {*} data
 * @returns
 */
export const uploadMergeChunksVideo = (data) => {
  return request({
    url: "/video/upload/merge_chunks",
    method: "post",
    data,
  });
};

/**
 * 删除视频
 * @param {*} params
 * @returns
 */
export const deleteVideo = (params) => {
  return request({
    url: "/video/delete",
    method: "get",
    params,
  });
};

/**
 * 修改视频
 * @param {*} data
 * @returns
 */
export const updateVideo = (data) => {
  return request({
    url: "/video/update",
    method: "post",
    data,
  });
};

/**
 * 批量删除
 * @param {*} data
 * @returns
 */
export const batchDeleteVideo = (data) => {
  return request({
    url: "/video/batch/delete",
    method: "post",
    data,
  });
};
