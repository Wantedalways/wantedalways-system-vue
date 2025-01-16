import {defineStore} from "pinia";
import {accountLogin, logout} from "@/api/user";
import storage from "@/utils/storage";
import {DATA_DICT, EXPIRE, KEY_TOKEN, USER_INFO} from "@/constant/cache";
import type {LoginModel} from "@/stores/type";
import {ElNotification} from "element-plus";

const useUserStore = defineStore('user', {
  state() {
    return {
      token: '',
      userInfo: '',
    }
  },
  actions: {
    /**
     * 账号或手机号登录
     * @param loginModel
     */
    async accountLogin(loginModel: LoginModel) {
      const result = await accountLogin(loginModel)
      if (result.code === 200) {
        const data = result.data
        const userInfo = data.sysUser
        const sysDictMap = data.sysDataDict

        storage.set(KEY_TOKEN, data.token, EXPIRE)
        storage.set(USER_INFO, userInfo, EXPIRE)
        storage.set(DATA_DICT, sysDictMap, EXPIRE)

        this.token = data.token
        this.userInfo = userInfo
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    /**
     * 退出登录
     */
    async logout() {
      try {
        await logout()

        storage.remove(KEY_TOKEN)
        storage.remove(USER_INFO)
        storage.remove(DATA_DICT)

        this.token = ''
        this.userInfo = ''
      } catch (error) {
        ElNotification.error({
          title: '系统提示',
          message: error.message,
        })
      }
    }
  }
})

export default useUserStore;
