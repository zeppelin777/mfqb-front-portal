import request from '@/utils/request'

export const add = (data) => {
  return request({
    method: 'POST',
    url: '/menu/add',
    data
  })
}

export const deleteOne = (data) => {
  return request({
    method: 'POST',
    url: '/menu/delete',
    data
  })
}

export const detail = (params) => {
  return request({
    method: 'GET',
    url: '/menu/detail',
    params: params
  })
}

export const tree = (params) => {
  return request({
    method: 'GET',
    url: '/menu/tree',
    params: params
  })
}

export const build = () => {
  return request({
    method: 'GET',
    url: '/menu/build'
  })
}

export const update = (data) => {
  return request({
    method: 'POST',
    url: '/menu/update',
    data
  })
}
