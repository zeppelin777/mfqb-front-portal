import request from '@/utils/request'

export const add = (data) => {
  return request({
    method: 'POST',
    url: '/category/add',
    data
  })
}

export const deleteOne = (data) => {
  return request({
    method: 'POST',
    url: '/category/delete',
    data
  })
}

export const detail = (params) => {
  return request({
    method: 'GET',
    url: '/category/detail',
    params: params
  })
}

export const list = (params) => {
  return request({
    method: 'GET',
    url: '/category/list',
    params: params
  })
}

export const update = (data) => {
  return request({
    method: 'POST',
    url: '/category/update',
    data
  })
}


