import request from '@/utils/request'

export const add = (data) => {
  return request({
    method: 'POST',
    url: '/product/add',
    data
  })
}

export const categories = () => {
  return request({
    method: 'GET',
    url: '/product/categories'
  })
}

export const changeState = (data) => {
  return request({
    method: 'POST',
    url: '/product/changeState',
    data
  })
}

export const deleteOne = (data) => {
  return request({
    method: 'POST',
    url: '/product/delete',
    data
  })
}

export const detail = (params) => {
  return request({
    method: 'GET',
    url: '/product/detail',
    params: params
  })
}

export const list = (params) => {
  return request({
    method: 'GET',
    url: '/product/list',
    params: params
  })
}
export const recommendFlag = (data) => {
  return request({
    method: 'POST',
    url: '/product/recommendFlag',
    data
  })
}
export const update = (data) => {
  return request({
    method: 'POST',
    url: '/product/update',
    data
  })
}


export const fetchGetBusinessInfo = (params) => {
  return request({
    method:'GET',
    url:'/channel/getBusinessInfo',
    params:params
  })
}
