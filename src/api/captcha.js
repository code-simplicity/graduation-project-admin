// 验证码
import request from "@/utils/system/request";

/**
 * 获取验证码
 * @returns 
 */
export const sendCaptcha = () => {
    return request({
        url: "/captcha",
        method: "get",
    })
}