// 统一接口返回形式
export interface Result {
  success: boolean,
  code: number,
  message: string,
  data: string,
  timestamp: number
}

// 角色查询参数
export interface RoleQueryParams {
  roleType: string,
  roleName: string,
  pageNo: number,
  pageSize: number,
}

