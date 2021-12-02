// 选择
import request from "@/utils/system/request";

/**
 * 查询所有的选择数据
 * @returns
 */
export const getChooseFindAll = () => {
  return request({
    url: "/choose/findAll",
    method: "get",
  });
};
