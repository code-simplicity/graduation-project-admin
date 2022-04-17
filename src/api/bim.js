// 视频
import request from "@/utils/system/request";

/**
 * 获取全部三维模型
 * @param {*} params
 * @returns
 */
export const bimFindAll = (params) => {
    return request({
        url: "/admin/bim/findAll",
        method: "get",
        params,
    });
};

/**
 * 上传三维模型file
 * @param {*} data
 * @returns
 */
export const uploadBim = (data) => {
    return request({
        url: "/admin/bim/upload",
        method: "post",
        data,
    });
};

/**
 * 删除三维模型
 * @param {*} data
 * @returns
 */
export const deleteBim = (data) => {
    return request({
        url: "/admin/bim/delete",
        method: "delete",
        data,
    });
};

/**
 * 更新三维模型
 * @param {*} data
 * @returns
 */
export const updateBim = (data) => {
    return request({
        url: "/admin/bim/update",
        method: "put",
        data,
    });
};

/**
 * 批量删除三维模型
 * @param {*} data
 * @returns
 */
export const batchDeleteBim = (data) => {
    return request({
        url: "/admin/bim/batch/delete",
        method: "delete",
        data,
    });
};