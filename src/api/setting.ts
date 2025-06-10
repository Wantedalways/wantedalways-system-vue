import type {PermissionForRole, Role, RoleQueryParams, UserListForRoleParams, UsersForRole} from "@/api/type";
import {get, post} from "@/api/index";

enum Api {
  getRoleList = '/sys/role/list',
  getRoleSelectList = '/sys/role/selectList',
  addRole = '/sys/role/add',
  validateRole = '/sys/role/validate',
  editRole = '/sys/role/edit',
  deleteRole = '/sys/role/delete',
  getPermissionIdsByRole = '/sys/rolePermission/getPermissionIdsByRole',
  getAllPermissionAsTree = '/sys/permission/getAllAsTree',
  setPermissionForRole = '/sys/rolePermission/setForRole',
  getUserListByRole = '/sys/userRole/getUserListByRole',
  getDepartTreeList = '/sys/depart/getDepartTreeList',
  getUserTreeList = '/sys/userDepart/getUserTreeList',
  addUsersForRole = '/sys/userRole/addUsersForRole'
}

/**
 * 查询角色列表
 */
export function getRoleList(params: RoleQueryParams) {
  return get(Api.getRoleList, params)
}

/**
 * 获取角色下拉框列表
 */
export function getRoleSelectList(roleType: string) {
  return get(Api.getRoleSelectList, {'roleType': roleType})
}

/**
 * 添加角色
 */
export function addRole(role: Role) {
  return post(Api.addRole, role)
}

/**
 * 校验角色
 */
export function validateRole(param: string, paramType: string) {
  return get(Api.validateRole, {'validateParam': param, 'paramType': paramType})
}

/**
 * 修改角色
 */
export function editRole(role: Role) {
  return post(Api.editRole, role)
}

/**
 * 删除角色
 */
export function deleteRole(id: string) {
  return post(Api.deleteRole, {'id': id})
}

/**
 * 获取角色关联的权限id列表
 */
export function getPermissionIdsByRole(id: string) {
  return get(Api.getPermissionIdsByRole, {'roleId': id})
}

/**
 * 获取所有权限的树状数据
 */
export function getAllPermissionAsTree() {
  return get(Api.getAllPermissionAsTree)
}

/**
 * 为单个角色授权
 */
export function setPermissionForRole(data: PermissionForRole) {
  return post(Api.setPermissionForRole, data)
}

/**
 * 获取角色关联的用户列表
 */
export function getUserListByRole(params: UserListForRoleParams) {
  return get(Api.getUserListByRole, params)
}

/**
 * 获取部门树
 */
export function getDepartTreeList() {
  return get(Api.getDepartTreeList)
}

/**
 * 获取用户树
 */
export function getUserTreeList(parentId: string) {
  return get(Api.getUserTreeList, {'parentId': parentId})
}

/**
 * 为角色添加关联用户
 */
export function addUsersForRole(roleUsersModel: UsersForRole) {
  return post(Api.addUsersForRole, roleUsersModel)
}
