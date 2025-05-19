import request from '@/utils/request'

export const add = (data) => {
  return request({
    method: 'POST',
    url: '/pushPlatform/add',
    data
  })
}

export const deleteOne = (data) => {
  return request({
    method: 'POST',
    url: '/pushPlatform/delete',
    data
  })
}

export const detail = (params) => {
  return request({
    method: 'GET',
    url: '/pushPlatform/detail',
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
    url: '/pushPlatform/list',
    params: params
  })
}

export const update = (data) => {
  return request({
    method: 'POST',
    url: '/pushPlatform/update',
    data
  })
}
