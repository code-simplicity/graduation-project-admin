/**
 * 获取token
 * @returns
 */
export function findUserInfo() {
  return localStorage.getItem("user_info");
}

/**
 *
 *设置token
 * @export
 * @param {*} user_info
 * @return {*}
 */
export function setUserInfo(user_info) {
  return localStorage.setItem("user_info", user_info);
}

/**
 *
 *移除token
 * @export
 * @return {*}
 */
export function removeUserInfo() {
  return localStorage.removeItem("user_info");
}
