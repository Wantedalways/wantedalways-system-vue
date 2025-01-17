import {type Router} from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {KEY_TOKEN} from "@/constant/cache";
import storage from "@/utils/storage";
import usePermissionStore from "@/stores/modules/permission";
import {indexRoute} from "@/utils/router";
import useUserStore from "@/stores/modules/user";
import {ElNotification} from "element-plus";

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to) => {
    NProgress.start()

    if (storage.get(KEY_TOKEN)) {
      // token存在
      if (to.path === '/login') {
        // 默认已登录，进入首页
        return {path: '/'}
      } else {
        // 查询权限列表，生成路由
        const permissionStore = usePermissionStore()
        if (permissionStore.menuList.length === 0) {
          try {
            const menu = await permissionStore.getMenuList()
            if (menu === null || menu === undefined || menu === '') {
              return
            }
            const routes = indexRoute(menu)
            await permissionStore.setRoutes(routes)
            router.addRoute(routes)

            if (to.path === "/404" && to.redirectedFrom) {
              return { path: to.redirectedFrom.fullPath, replace: true }
            } else {
              return { ...to, replace: true }
            }

          } catch (error) {
            ElNotification.error({
              title: '系统提示',
              message: (error as Error).message
            })
            const userStore = useUserStore()
            await userStore.logout()
            return {path: '/login', query: {redirect: to.fullPath}}
          }
        } else {
          return true
        }
      }
    } else {
      // token不存在，未登录
      if (whiteList.indexOf(to.path) !== -1) {
        // 白名单直接进入
        return true
      } else {
        // 跳转至登陆界面，登录成功后直接访问请求的界面
        return {path: '/login', query: {redirect: to.fullPath}}
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
