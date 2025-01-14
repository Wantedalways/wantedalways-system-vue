import { createRouter, createWebHistory } from 'vue-router'
import LoginView from "@/views/login/LoginView.vue";
import createRouterGuard from "@/router/guard";
import BaseLayout from "@/layout/BaseLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'Home',
      path: '/',
      component: BaseLayout,
      meta: {
        title: '首页',
      }
    },
    {
      name: 'Login',
      path: '/login',
      component: LoginView,
      meta: {
        title: '登录'
      }
    }
  ]
})

createRouterGuard(router)

export default router
