import type {Role, RoleQueryParams} from "@/api/type";
import {get, post} from "@/api/index";

enum Api {
  getRoleList = '/sys/role/list',
  getRoleSelectList = '/sys/role/selectList',
  addRole = '/sys/role/add',
  validateRole = '/sys/role/validate',
  editRole = '/sys/role/edit',
  deleteRole = '/sys/role/delete',
}

// 查询角色列表
export function getRoleList(params: RoleQueryParams) {
  return get(Api.getRoleList, params)
}

// 获取角色下拉框列表
export function getRoleSelectList(roleType: string) {
  return get(Api.getRoleSelectList, {'roleType': roleType})
}

// 添加角色
export function addRole(role: Role) {
  return post(Api.addRole, role)
}

// 校验角色
export function validateRole(param: string, paramType: string) {
  return get(Api.validateRole, {'validateParam': param, 'paramType': paramType})
}

// 修改角色
export function editRole(role: Role) {
  return post(Api.editRole, role)
}

// 删除角色
export function deleteRole(id: string) {
  return post(Api.deleteRole, {'id': id})
}
