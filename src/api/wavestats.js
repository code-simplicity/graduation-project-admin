// 波形统计图
import request from "@/utils/system/request";

/**
 * 显示所有波形图
 * @param {*} data
 * @returns
 */
export const getWaveStatsFindAll = (data) => {
  return request({
    url: "/wavestats/findAll",
    method: "post",
    data,
  });
};

/**
 * 上传波形统计图
 * @param {*} data
 * @returns
 */
export const uploadWaveStats = (data) => {
  return request({
    url: "/wavestats/upload",
    method: "post",
    data,
  });
};

/**
 * 批量删除
 * @param {*} data
 * @returns
 */
export const batchDeleteWaveStats = (data) => {
  return request({
    url: "/wavestats/batch/delete",
    method: "post",
    data,
  });
};
