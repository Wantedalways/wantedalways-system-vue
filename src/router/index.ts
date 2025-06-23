import {createRouter, createWebHistory} from 'vue-router'
import LoginView from '@/views/login/LoginView.vue'
import setupPermissionGuard from '@/router/guard/permission'

export const constantRoutes = [
  {
    name: 'Login',
    path: '/login',
    component: LoginView,
    hidden: true,
    meta: {
      title: '登录',
    },
  },
  {
    path: '/404',
    component: () => import('@/views/exception/Page404View.vue'),
    meta: {
      title: '404',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    hidden: true,
  },
]

export const baseRoutes = []

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
})

setupPermissionGuard(router)

export default router
