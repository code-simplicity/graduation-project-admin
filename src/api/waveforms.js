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

/**
 * 修改波形图
 * @param {*} data
 * @returns
 */
export const updateWaveForms = (data) => {
  return request({
    url: "/waveforms/update",
    method: "post",
    data,
  });
};

/**
 * 删除波形图
 * @param {*} params
 * @returns
 */
export const deleteWaveForms = (params) => {
  return request({
    url: "/waveforms/delete",
    method: "get",
    params,
  });
};

/**
 * 查询波形图，值查询一个
 * @param {} data 
 * @returns 
 */
export const searchWaveFormsPointId = (data) => {
  return request({
    url: "/waveforms/search/point_id"
  })
}

/**
 * 查找港口地图下所有的波形图
 * @param {*} data 
 * @returns 
 */
export const findAllWaveFormsPointIds = (data) => {
  return request({
    url: "/waveforms/pointIds/findAll",
    method: "post",
    data
  })
}