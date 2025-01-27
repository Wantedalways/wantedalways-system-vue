import type {RoleQueryParams} from "@/api/type";
import {get} from "@/api/index";

enum Api {
  getRoleList = '/sys/role/list',
}

// 查询角色列表
export function getRoleList(params: RoleQueryParams) {
  return get(Api.getRoleList, params)
}
