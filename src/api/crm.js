import request from '@/utils/request'

export const add = (data) => {
  return request({
    method: 'POST',
    url: '/crm/add',
    data
  })
}

export const changeLoginState = (data) => {
  return request({
    method: 'POST',
    url: '/crm/changeLoginState',
    data
  })
}

export const changePushState = (data) => {
  return request({
    method: 'POST',
    url: '/crm/changePushState',
    data
  })
}

export const changeShareFlag = (data) => {
  return request({
    method: 'POST',
    url: '/crm/changeShareFlag',
    data
  })
}

export const changeDelayFlag = (data) => {
  return request({
    method: 'POST',
    url: '/crm/changeDelayFlag',
    data
  })
}

export const charge = (data) => {
  return request({
    method: 'POST',
    url: '/crm/charge',
    data
  })
}

export const deleteOne = (data) => {
  return request({
    method: 'POST',
    url: '/crm/delete',
    data
  })
}

export const detail = (params) => {
  return request({
    method: 'GET',
    url: '/crm/detail',
    params: params
  })
}

export const list = (params) => {
  return request({
    method: 'GET',
    url: '/crm/list',
    params: params
  })
}

export const update = (data) => {
  return request({
    method: 'POST',
    url: '/crm/update',
    data
  })
}

export const charget = (data) => {
  return request({
    method: 'POST',
    url: '/crm/charge',
    data
  })
}

export const crmPlatformSwitchList = (params) => {
  return request({
    method: 'GET',
    url: '/crm/crmPlatformSwitchList',
    params
  })
}

export const changeCrmSwitchInfo = (params) => {
  return request({
    method: 'GET',
    url: '/crm/updateSwitchById',
    params: params
  })
}

export const updateSwitchByPlatId = (params) => {
  return request({
    method: 'GET',
    url: '/crm/updateSwitchByPlatId',
    params: params
  })
}
