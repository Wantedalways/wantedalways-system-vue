import {get, post} from '@/api/index'
import type {LoginModel} from '@/stores/type'

enum Api {
  // 获取验证码
  getCaptcha = '/sys/login/getCaptcha',
  // 账号或手机号登录
  accountLogin = '/sys/login/accountLogin',
  // 退出登录
  logout = '/sys/login/logout',
  // 获取权限目录
  getMenu = '/sys/permission/getPermissionMenu',
}

/**
 * 获取验证码
 * @param checkKey 验证码key
 */
export function getCaptcha(checkKey: string) {
  return get(Api.getCaptcha, { key: checkKey })
}

/**
 * 账号或手机号登录
 * @param loginModel 用户登录信息
 */
export function accountLogin(loginModel: LoginModel) {
  return post(Api.accountLogin, loginModel)
}

/**
 * 退出登录
 */
export function logout() {
  return post(Api.logout)
}

/**
 * 获取权限目录
 * @param serviceId 服务id
 */
export function getMenu(serviceId: number) {
  return get(Api.getMenu, { serviceId: serviceId })
}
