// 港口地图
import request from "@/utils/system/request";

/**
 * 获取港口地图
 * @returns
 */
export const getPortMapFind = () => {
  return request({
    url: "/portmap/find",
    method: "get",
  });
};

/**
 * 上传港口地图
 * @returns
 */
export const uploadPortMap = (data) => {
  return request({
    url: "/portmap/upload",
    method: "post",
    data,
  });
};
