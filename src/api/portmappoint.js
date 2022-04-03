// 港口点位地图设置
import request from "@/utils/system/request";

/**
 * 获取港口点位地图
 * @param {*} params
 * @returns
 */
export const getPortMapPointFindAll = (params) => {
  return request({
    url: "/admin/portpointmap/findAll",
    method: "get",
    params,
  });
};

/**
 * 上传港口点位图
 * @param {*} data
 * @returns
 */
export const uploadPortMapPoint = (data) => {
  return request({
    url: "/admin/portpointmap/upload",
    method: "post",
    data,
  });
};

/**
 * 修改港口地图信息
 * @param {*} data
 * @returns
 */
export const updatePortMapPoint = (data) => {
  return request({
    url: "/admin/portpointmap/update",
    method: "put",
    data,
  });
};

/**
 * 删除港口点位图
 * @param {*} data
 * @returns
 */
export const deletePortMapPoint = (data) => {
  return request({
    url: "/admin/portpointmap/delete",
    method: "delete",
    data,
  });
};

/**
 * 搜索港口点位图
 * @param {*} params
 * @returns
 */
export const searchPortMapPoint = (params) => {
  return request({
    url: "/admin/portpointmap/search",
    method: "get",
    params,
  });
};

/**
 * 批量删除
 * @param {*} data 
 * @returns 
 */
export const batchDeletePortpointMap = (data) => {
  return request({
    url: "/admin/portpointmap/batch/delete",
    method: "delete",
    data,
  })
}