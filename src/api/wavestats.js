// 波形统计图
import request from "@/utils/system/request";

/**
 * 显示所有波形统计图
 * @param {*} params
 * @returns
 */
export const getWaveStatsFindAll = (params) => {
  return request({
    url: "/admin/wavestats/findAll",
    method: "get",
    params,
  });
};

/**
 * 上传波形统计统计图
 * @param {*} data
 * @returns
 */
export const uploadWaveStats = (data) => {
  return request({
    url: "/admin/wavestats/upload",
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
    url: "/admin/wavestats/batch/delete",
    method: "delete",
    data,
  });
};

/**
 * 修改波形统计图
 * @param {*} data
 * @returns
 */
export const updateWaveStats = (data) => {
  return request({
    url: "/admin/wavestats/update",
    method: "put",
    data,
  });
};

/**
 * 删除波形统计图
 * @param {*} data
 * @returns
 */
export const deleteWaveStats = (data) => {
  return request({
    url: "/admin/wavestats/delete",
    method: "delete",
    data,
  });
};

/**
 * 查找港口地图下所有的波形图
 * @param {*} data 
 * @returns 
 */
export const findAllWaveStatsPointIds = (data) => {
  return request({
    url: "/admin/wavestats/pointIds/findAll",
    method: "post",
    data
  })
}