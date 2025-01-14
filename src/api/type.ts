// 统一接口返回形式
export interface Result {
  success: boolean,
  code: number,
  message: string,
  data: string,
  timestamp: number
}
