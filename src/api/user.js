import request from "@/utils/system/request";

// 登录api
export const login = (data) => {
  return request({
    url: "/user/login",
    method: "post",
    data,
  });
};

// 获取用户信息Api
export const getUserInfo = (id) => {
  return request({
    url: `/user/info?id=${id}`,
    method: "get",
  });
};

// 退出登录Api
export const logout = () => {
  return request({
    url: "/user/logout",
    method: "get",
  });
};

// 获取用户信息Api
export function passwordChange(data) {
  return request({
    url: "/user/passwordChange",
    method: "post",
    data,
  });
}
