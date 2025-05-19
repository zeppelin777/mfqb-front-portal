import request from '@/utils/request'

export const add = (data) => {
  return request({
    method: 'POST',
    url: '/role/add',
    data
  })
}

export const deleteOne = (data) => {
  return request({
    method: 'POST',
    url: '/role/delete',
    data
  })
}

export const detail = (params) => {
  return request({
    method: 'GET',
    url: '/role/detail',
    params: params
  })
}

export const list = (params) => {
  return request({
    method: 'GET',
    url: '/role/list',
    params: params
  })
}

export const all = () => {
  return request({
    method: 'GET',
    url: '/role/all'
  })
}

export const update = (data) => {
  return request({
    method: 'POST',
    url: '/role/update',
    data
  })
}

export const updateMenu = (data) => {
  return request({
    method: 'POST',
    url: '/role/updateMenu',
    data
  })
}

export const updatePermission = (data) => {
  return request({
    method: 'POST',
    url: '/role/updatePermission',
    data
  })
}
