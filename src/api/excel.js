import request from "@/utils/system/request";

/**
 * excel 模板导出
 * @returns
 */
export const exportExcel = () => {
  return request({
    url: "/excel/export",
    method: "get",
    responseType: "blob",
  });
};

/**
 * 上传用户表，存入数据库
 * @param {*} data
 * @returns
 */
export const uploadExcelUser = (data) => {
  return request({
    url: "/excel/upload",
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
    url: "/excel/export/user",
    method: "post",
    responseType: "blob",
    data,
  });
};
