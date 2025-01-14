import {defineStore} from "pinia";
import {accountLogin, logout} from "@/api/user";
import storage from "@/utils/storage";
import {DATA_DICT, EXPIRE, KEY_TOKEN, USER_INFO} from "@/constant/cache";
import type {LoginModel} from "@/stores/modules/user/type";
import {ElNotification} from "element-plus";

const useUserStore = defineStore('user', {
  state: () => ({}),
  actions: {
    logout() {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          if (res.code === 500) {
            reject(res)
          } else {
            storage.remove(KEY_TOKEN)
            resolve(res)
          }
        }).catch(err => {
          reject(err)
        });
      })
    },
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

        return true
      } else {
        return Promise.reject(new Error(result.message))
      }
    }
  }
})

export default useUserStore;
