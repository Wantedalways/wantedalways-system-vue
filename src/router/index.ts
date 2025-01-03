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
      component: BaseLayout
    },
    {
      name: 'Login',
      path: '/login',
      component: LoginView
    }
  ]
})

createRouterGuard(router)

export default router
