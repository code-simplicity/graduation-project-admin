// 视频
import request from "@/utils/system/request";

/**
 * 获取所有视频
 * @param {*} params
 * @returns
 */
export const getVideoFindAll = (params) => {
  return request({
    url: "/admin/video/findAll",
    method: "get",
    params,
  });
};

/**
 * 上传视频
 * @param {*} data
 * @returns
 */
export const uploadVideo = (data) => {
  return request({
    url: "/admin/video/upload",
    method: "post",
    data,
  });
};

/**
 * 删除视频
 * @param {*} data
 * @returns
 */
export const deleteVideo = (data) => {
  return request({
    url: "/admin/video/delete",
    method: "delete",
    data,
  });
};

/**
 * 修改视频
 * @param {*} data
 * @returns
 */
export const updateVideo = (data) => {
  return request({
    url: "/admin/video/update",
    method: "put",
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
    url: "/admin/video/batch/delete",
    method: "delete",
    data,
  });
};

/**
 * 视频的模糊搜索
 * @param {} params 
 * @returns 
 */
export const searchVideo = (params) => {
  return request({
    url: "/admin/video/search",
    method: "get",
    params
  })
}