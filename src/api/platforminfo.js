import request from '@/utils/request'

export const add = (data) => {
  return request({
    method: 'POST',
    url: '/platformInfo/add',
    data
  })
}

export const deleteOne = (data) => {
  return request({
    method: 'POST',
    url: '/platformInfo/delete',
    data
  })
}

export const detail = (params) => {
  return request({
    method: 'GET',
    url: '/platformInfo/detail',
    params: params
  })
}

export const all = () => {
  return request({
    method: 'GET',
    url: '/platformInfo/all'
  })
}

export const list = (params) => {
  return request({
    method: 'GET',
    url: '/platformInfo/list',
    params: params
  })
}

export const update = (data) => {
  return request({
    method: 'POST',
    url: '/platformInfo/update',
    data
  })
}

export const charge = (data) => {
  return request({
    method: 'POST',
    url: '/platformInfo/charge',
    data
  })
}
