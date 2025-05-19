import request from '@/utils/request'

export const add = (data) => {
  return request({
    method: 'POST',
    url: '/permission/add',
    data
  })
}

export const deleteOne = (data) => {
  return request({
    method: 'POST',
    url: '/permission/delete',
    data
  })
}

export const detail = (params) => {
  return request({
    method: 'GET',
    url: '/permission/detail',
    params: params
  })
}

export const tree = (params) => {
  return request({
    method: 'GET',
    url: '/permission/tree',
    params: params
  })
}

export const list = (params) => {
  return request({
    method: 'GET',
    url: '/permission/list',
    params: params
  })
}

export const update = (data) => {
  return request({
    method: 'POST',
    url: '/permission/update',
    data
  })
}
