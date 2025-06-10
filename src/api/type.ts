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

