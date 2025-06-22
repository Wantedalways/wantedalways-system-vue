import { defineStore } from 'pinia'
import { getMenu } from '@/api/user'
import { SERVICE_ID_SYSTEM } from '@/constant/api'
import { ElNotification } from 'element-plus'
import { constantRoutes } from '@/router'

const usePermissionStore = defineStore('permission', {
  state() {
    return {
      menuList: [],
      routes: constantRoutes,
    }
  },
  actions: {
    async getMenuList() {
      const result = await getMenu(SERVICE_ID_SYSTEM)
      const menu = result.data.menu
      if (menu && menu.length > 0) {
        this.menuList = menu
      } else {
        ElNotification.warning({
          title: '系统提示',
          message: '暂无权限，请联系管理员！',
        })
      }
      return menu
    },
    async setRoutes(routes) {
      this.routes = constantRoutes.concat(routes)
    },
  },
})

export default usePermissionStore
