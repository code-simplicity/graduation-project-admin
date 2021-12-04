import request from "@/utils/system/request";

/**
 * 查询所有的内容
 * @param {*} data
 * @returns
 */
export const getContentFindAll = (data) => {
  return request({
    url: "/content/findAll",
    method: "post",
    data,
  });
};
