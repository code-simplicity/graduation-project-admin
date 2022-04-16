// 视频
import request from "@/utils/system/request";

/**
 * 获取全部港口点位统计结果excel
 * @param {*} params
 * @returns
 */
export const waveDataExcelFindAll = (params) => {
    return request({
        url: "/admin/wavedataexcel/findAll",
        method: "get",
        params,
    });
};

/**
 * 上传港口点位统计结果excel
 * @param {*} data
 * @returns
 */
export const uploadWaveDataExcel = (data) => {
    return request({
        url: "/admin/wavedataexcel/upload",
        method: "post",
        data,
    });
};

/**
 * 删除港口点位统计结果excel
 * @param {*} data
 * @returns
 */
export const deleteWaveDataExcel = (data) => {
    return request({
        url: "/admin/wavedataexcel/delete",
        method: "delete",
        data,
    });
};

/**
 * 更新港口点位统计结果excel
 * @param {*} data
 * @returns
 */
export const updateWaveDataExcel = (data) => {
    return request({
        url: "/admin/wavedataexcel/update",
        method: "put",
        data,
    });
};

/**
 * 批量删除港口点位统计结果excel
 * @param {*} data
 * @returns
 */
export const batchDeleteWaveDataExcel = (data) => {
    return request({
        url: "/admin/wavedataexcel/batch/delete",
        method: "delete",
        data,
    });
};

/**
 * 获取港口点位统计结果excel
 * @param {*} params
 * @returns
 */
export const searchWaveDataExcelByPortPointMapId = (params) => {
    return request({
        url: "/admin/wavedataexcel/search/by/portpointmapid",
        method: "get",
        params,
    });
};