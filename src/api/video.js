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
