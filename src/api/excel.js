import request from "@/utils/system/request";

/**
 * excel 模板导出
 * @returns
 */
export const exportExcel = () => {
  return request({
    url: "/admin/user/excel/export",
    method: "get",
    responseType: "arraybuffer",
  });
};

/**
 * 上传用户表，存入数据库
 * @param {*} data
 * @returns
 */
export const uploadExcelUser = (data) => {
  return request({
    url: "/admin/user/excel/upload",
    method: "post",
    data,
  });
};

/**
 * 批量导出excel数据
 * @param {*} data
 * @returns
 */
export const exportExceltUser = (data) => {
  return request({
    url: "/admin/user/excel/download",
    method: "post",
    responseType: "blob",
    data,
  });
};