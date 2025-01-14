import {get, post} from "@/api/index";
import type {LoginModel} from "@/stores/modules/user/type";
enum Api {
  // 获取验证码
  getCaptcha = '/sys/login/getCaptcha',
  // 账号或手机号登录
  accountLogin = '/sys/login/accountLogin'
}

/**
 * 获取验证码
 */
export function getCaptcha(checkKey: string) {
  return get(Api.getCaptcha, {'key': checkKey})
}

/**
 * 账号或手机号登录
 */
export function accountLogin(loginModel: LoginModel) {
  return post(Api.accountLogin, loginModel)
}

export function logout() {
    return post('/sys/login/logout')
}
