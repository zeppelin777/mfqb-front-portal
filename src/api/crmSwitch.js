import request from '@/utils/request'

export const switchList = (params) => {
  return request({
    method: 'GET',
    url: 'crm/switchList',
    params: params
  })
}

export const updateSwitchById = (params) => {
  return request({
    method: 'GET',
    url: 'crm/updateSwitchById',
    params: params
  })
}
