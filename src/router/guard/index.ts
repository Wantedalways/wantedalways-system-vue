import setupPermissionGuard from "@/router/guard/permission";
import type {Router} from "vue-router";

export default function createRouterGuard(router: Router) {
  setupPermissionGuard(router)
}
