import request from '@/utils/request'

export const add = (data) => {
  return request({
    method: 'POST',
    url: '/pushRule/createRule',
    data
  })
}

export const columns = () => {
  return request({
    method: 'GET',
    url: '/pushRule/columns'
  })
}

export const platforms = () => {
  return request({
    method: 'GET',
    url: '/pushRule/platforms'
  })
}

export const changeState = (data) => {
  return request({
    method: 'POST',
    url: '/pushRule/changeState',
    data
  })
}

export const deleteOne = (data) => {
  return request({
    method: 'POST',
    url: '/pushRule/delete',
    data
  })
}

export const detail = (params) => {
  return request({
    method: 'GET',
    url: '/pushRule/detail',
    params: params
  })
}

export const list = (params) => {
  return request({
    method: 'GET',
    url: '/pushRule/list',
    params: params
  })
}

export const update = (data) => {
  return request({
    method: 'POST',
    url: '/pushRule/updateRule',
    data
  })
}
