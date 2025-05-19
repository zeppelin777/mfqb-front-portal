import request from '@/utils/request'

export const add = (data) => {
  return request({
    method: 'POST',
    url: '/adminUser/add',
    data
  })
}

export const update = (data) => {
  return request({
    method: 'POST',
    url: '/adminUser/update',
    data
  })
}

export const deleteOne = (data) => {
  return request({
    method: 'POST',
    url: '/adminUser/delete',
    data
  })
}

export const list = (params) => {
  return request({
    method: 'GET',
    url: '/adminUser/list',
    params: params
  })
}

export const locked = (data) => {
  return request({
    method: 'POST',
    url: '/adminUser/locked',
    data
  })
}

export const updatePassword = (data) => {
  return request({
    method: 'POST',
    url: '/adminUser/updatePassword',
    data
  })
}

export const detail = (params) => {
  return request({
    method: 'GET',
    url: '/adminUser/detail',
    params: params
  })
}
