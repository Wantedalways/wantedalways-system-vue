// 统一接口返回形式
export interface Result {
  success: boolean,
  code: number,
  message: string,
  data: string,
  timestamp: number
}

// 角色查询参数接口
export interface RoleQueryParams {
  roleType: string,
  roleName: string,
  pageNo: number,
  pageSize: number,
  orderBy: string,
  order: string
}

// 角色添加和修改
export interface Role {
  roleType: string,
  roleName: string,
  roleCode: string,
  parentId: string,
  description: string
}

// 角色授权
export interface PermissionForRole {
  roleId: string,
  newPermissionIds: string[],
  oldPermissionIds: string[]
}

// 角色关联用户查询参数
export interface UserListForRoleParams {
  roleId: string,
  username: string,
  departIds: string,
  pageNo: number,
  pageSize: number,
  orderBy: string,
  order: string
}

// 用户角色关联（批量）
export interface UsersForRole {
  roleId: string,
  userIdList: string[]
}

// 用户角色关联
export interface SysUserRole {
  roleId: string,
  userId: string
}

// 权限添加和修改
export interface Permission {
  serviceId: string,
  type: string,
  parentId: string,
  name: string,
  code: string,
  url: string,
  component: string,
  icon: string,
  sort: number,
  route: boolean,
  cache: boolean,
  hidden: boolean,
  affix: boolean,
  status: string,
  leaf: boolean,
}

// 部门添加和修改
export interface Depart {
  parentId: string,
  departName: string,
  workWxId: string,
}
