import {baseRoutes} from "@/router";

/**
 * 生成主页路由
 */
export function indexRoute(menuData: string) {
  return {
    path: '/',
    component: () => import('@/layout/BaseLayout.vue'),
    redirect: '/home',
    children: [
      ...baseRoutes,
      ...childRoute(menuData)
    ]
  }
}

export function childRoute(menuData: string) {
  const routes = []
  let component
  const views = import.meta.glob('../views/*/*.vue')
  for (const item of menuData) {
    if (item.component.indexOf('blank') !== -1) {
      component = () => import('@/layout/BlankLayout.vue')
    } else {
      component = views[`../views/${item.component}.vue`]
    }

    const route = {
      path: item.path,
      name: item.name,
      component: component,
      redirect: item.redirect,
      hidden: item.hidden,
      alwaysShow: item.alwaysShow,
      meta: {
        title: item.meta.title,
        icon: item.meta.icon,
        cache: item.meta.cache,
        affix: item.meta.affix
      }
    }
    if (item.children && item.children.length > 0) {
      route.children = [...childRoute(item.children)]
    }
    routes.push(route)
  }
  return routes;
}
