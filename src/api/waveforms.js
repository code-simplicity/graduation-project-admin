// 波形图
import request from "@/utils/system/request";

/**
 * 显示所有波形图
 * @param {*} params
 * @returns
 */
export const getWaveFormsFindAll = (params) => {
  return request({
    url: "/admin/waveforms/findAll",
    method: "get",
    params,
  });
};

/**
 * 上传波形图
 * @param {*} data
 * @returns
 */
export const uploadWaveForms = (data) => {
  return request({
    url: "/admin/waveforms/upload",
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
    url: "/admin/waveforms/update",
    method: "put",
    data,
  });
};

/**
 * 删除波形图
 * @param {*} data
 * @returns
 */
export const deleteWaveForms = (data) => {
  return request({
    url: "/admin/waveforms/delete",
    method: "delete",
    data,
  });
};

/**
 * 查找港口地图下所有的波形图
 * @param {*} data 
 * @returns 
 */
export const findAllWaveFormsPointIds = (data) => {
  return request({
    url: "/admin/waveforms/pointIds/findAll",
    method: "post",
    data
  })
}

/**
 * 批量删除
 * @param {*} data
 * @returns
 */
export const batchDeleteWaveForms = (data) => {
  return request({
    url: "/admin/waveforms/batch/delete",
    method: "delete",
    data,
  });
};