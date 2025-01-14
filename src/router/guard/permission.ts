import type {Router} from 'vue-router'
import NProgress from 'nprogress'
import {KEY_TOKEN} from "@/constant/cache";
import storage from "@/utils/storage";

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/']

export default function setupPermissionGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    NProgress.start()

    if (storage.get(KEY_TOKEN)) {
      // token存在
      if (to.path === '/login') {
        // 默认已登录，进入首页
        next('/')
      } else {
        // 查询权限列表，生成路由
        next()
      }
    } else {
      // token不存在，未登录
      if (whiteList.indexOf(to.path) !== -1) {
        // 白名单直接进入
        next()
      } else {
        // 跳转至登陆界面，登录成功后直接访问请求的界面
        next({path: '/login', query: { redirect: to.fullPath }})
      }
    }
  })

  router.afterEach((to) => {
    NProgress.done()
    if (to.meta.title) {
      document.title = to.meta.title + ' | 手术器械OA'
    }
  })
}
