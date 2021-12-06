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
