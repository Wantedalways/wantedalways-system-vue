import type {
  Depart,
  Permission,
  PermissionForRole,
  Role,
  RoleQueryParams,
  SysUserRole,
  UserListForRoleParams,
  UsersForRole
} from "@/api/type";
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
  addUsersForRole = '/sys/userRole/addUsersForRole',
  removeUsersFromRole = '/sys/userRole/deleteUsersFromRole',
  removeUserFromRole = '/sys/userRole/deleteUserFromRole',
  getUserListWithDepart = '/sys/user/listWithDepart',
  getPermissionListAsTree = '/sys/permission/listAsTree',
  validatePermission = '/sys/permission/validate',
  addPermission = '/sys/permission/add',
  editPermission = '/sys/permission/edit',
  deletePermission = '/sys/permission/delete',
  validateDepart = '/sys/depart/validate',
  addDepart = '/sys/depart/add',
  editDepart = '/sys/depart/edit',
  validateDeleteDepart = '/sys/depart/validateDeleteDepart',
  deleteDepart = '/sys/depart/delete',
  dragDepart = '/sys/depart/drag',
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

/**
 * 删除角色关联的用户（批量）
 */
export function removeUsersFromRole(roleUsersModel: UsersForRole) {
  return post(Api.removeUsersFromRole, roleUsersModel)
}

/**
 * 删除角色关联的用户
 */
export function removeUserFromRole(sysUserRole: SysUserRole) {
  return post(Api.removeUserFromRole, sysUserRole)
}

/**
 * 获取附带部门的用户列表
 */
export function getUserListWithDepart(realName: string) {
  return get(Api.getUserListWithDepart, {'realName': realName})
}

/**
 * 获取权限列表（树状）
 */
export function getPermissionListAsTree(serviceId: string, name: string) {
  return get(Api.getPermissionListAsTree, {'serviceId': serviceId, 'name': name})
}

/**
 * 校验权限
 */
export function validatePermission(param: string, paramType: string) {
  return get(Api.validatePermission, {'validateParam': param, 'paramType': paramType})
}

/**
 * 添加权限
 */
export function addPermission(sysPermission: Permission) {
  return post(Api.addPermission, sysPermission)
}

/**
 * 修改权限
 */
export function editPermission(sysPermission: Permission) {
  return post(Api.editPermission, sysPermission)
}

/**
 * 删除权限
 */
export function deletePermission(id: string) {
  return post(Api.deletePermission + '?id=' + id)
}

/**
 * 校验部门
 */
export function validateDepart(param: string, paramType: string) {
  return get(Api.validateDepart, {'validateParam': param, 'paramType': paramType})
}

/**
 * 新增部门
 */
export function addDepart(depart: Depart) {
  return post(Api.addDepart, depart)
}

/**
 * 修改部门
 */
export function editDepart(depart: Depart) {
  return post(Api.editDepart, depart)
}

/**
 * 删除部门前验证，是否存在子部门和成员
 */
export function validateDeleteDepart(id: string) {
  return get(Api.validateDeleteDepart, {'id': id})
}

/**
 * 删除部门
 */
export function deleteDepart(id: string) {
  return post(Api.deleteDepart+ '?id=' + id)
}

/**
 * 拖拽部门
 */
export function dragDepart(data: any) {
  return post(Api.dragDepart, data)
}



