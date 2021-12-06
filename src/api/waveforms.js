// 波形图
import request from "@/utils/system/request";

/**
 * 显示所有波形图
 * @param {*} data
 * @returns
 */
export const getWaveFormsFindAll = (data) => {
  return request({
    url: "/waveforms/findAll",
    method: "post",
    data,
  });
};

/**
 * 上传波形图
 * @param {*} data
 * @returns
 */
export const uploadWaveForms = (data) => {
  return request({
    url: "/waveforms/upload",
    method: "post",
    data,
  });
};

/**
 * 批量删除
 * @param {*} data
 * @returns
 */
export const batchDeleteWaveForms = (data) => {
  return request({
    url: "/waveforms/batch/delete",
    method: "post",
    data,
  });
};
