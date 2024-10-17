import axios from "axios";
import storage from "@/utils/storage";
import {KEY_TOKEN} from "@/constant/catch";
import {ElNotification, ElMessageBox} from 'element-plus'
import useUserStore from "@/stores/modules/user";

// axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})

// 请求拦截器
request.interceptors.request.use(config => {
  const token = storage.get(KEY_TOKEN)
  if (token) {
    config.headers['Access-Token'] = token
  }
  return config;
}, (error) => {
  return Promise.reject(error);
})

// 响应拦截器
request.interceptors.response.use(response => {
  return response.data;
}, error => {

  const token = storage.get(KEY_TOKEN);

  if (error.response) {
    switch (error.response.status) {
      case 401:
        ElNotification.error({
          title: '系统提示',
          message: '登录已过期，请重新登录',
        })

        if (token) {
          const userStore = useUserStore()
          userStore.logout().then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          })
        }
        break
      case 403:
        ElNotification.error({
          title: '系统提示',
          message: '拒绝访问',
        })
        break
      case 404:
        ElNotification.error({
          title: '系统提示',
          message: '很抱歉，访问的资源未找到',
        })
        break
      case 500:
        if (token && error.response.data.message.includes('token失效')) {
          ElMessageBox.confirm('登录已过期，请重新登录', '提示', {
            confirmButtonText: '重新登录',
            type: error
          }).then(() => {
            const userStore = useUserStore()
            userStore.logout().then(() => {
              setTimeout(() => {
                window.location.reload()
              }, 1500)
            })
          })
        }
        break
      default:
        ElNotification.error({
          title: '系统提示',
          message: error.response.data.message,
        })
    }
  } else if (error.message) {
    if (error.message.includes('timeout')) {
      ElNotification.error({
        title: '系统提示',
        message: '网络超时'
      })
    } else {
      ElNotification.error({
        title: '系统提示',
        message: error.message,
      })
    }
  }

  return Promise.reject(error);
})
export default request;
