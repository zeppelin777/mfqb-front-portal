import request from '@/utils/request'

export const add = (data) => {
  return request({
    method: 'POST',
    url: '/channel/add',
    data
  })
}

export const deleteOne = (params) => {
  return request({
    method: 'GET',
    url: '/pushStatistics/deleteChannel',
    params
  })
}

export const detail = (params) => {
  return request({
    method: 'GET',
    url: '/channel/detail',
    params: params
  })
}

export const list = (params) => {
  return request({
    method: 'GET',
    url: '/channel/list',
    params: params
  })
}

export const update = (data) => {
  return request({
    method: 'POST',
    url: '/channel/update',
    data
  })
}

export const changeState = (data) => {
  return request({
    method: 'POST',
    url: '/channel/changeState',
    data
  })
}

export const changeCollectFlag = (data) => {
  return request({
    method: 'POST',
    url: '/channel/changeCollectFlag',
    data
  })
}

export const apiChannelAdd = (params) => {
  return request({
    method:'GET',
    url:'/channel/addApiChannel',
    params:params
  })
}

export const apiChannelList = (params) => {
  return request({
    method:'GET',
    url:'/channel/getApiChannelList',
    params: params
  })
}

export const switchInfoByChannelId = (params) => {
  return request({
    method:'GET',
    url:'/channel/getSwitchInfoByChannelId',
    params: params
  })
}

export const updateSwitchById = (params) => {
  return request({
    method:'GET',
    url:'/channel/updateSwitchById',
    params:params
  })
}

export const updateAllSwitchById = (params) => {
  return request({
    method:'GET',
    url:'/channel/updateAllSwitchById',
    params:params
  })
}