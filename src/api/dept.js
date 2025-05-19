import request from '@/utils/request'

export const add = (data) => {
  return request({
    method: 'POST',
    url: '/dept/add',
    data
  })
}

export const deleteOne = (data) => {
  return request({
    method: 'POST',
    url: '/dept/delete',
    data
  })
}

export const detail = (params) => {
  return request({
    method: 'GET',
    url: '/dept/detail',
    params: params
  })
}

export const list = (params) => {
  return request({
    method: 'GET',
    url: '/dept/list',
    params: params
  })
}

export const tree = (params) => {
  return request({
    method: 'GET',
    url: '/dept/tree',
    params: params
  })
}

export const update = (data) => {
  return request({
    method: 'POST',
    url: '/dept/update',
    data
  })
}
