import request from '@/utils/request'

export function get(url: string, params?: unknown) {
  return request({
    url,
    method: 'get',
    params,
  })
}

export function post(url: string, data?: unknown) {
  return request({
    url,
    method: 'post',
    data,
  })
}
