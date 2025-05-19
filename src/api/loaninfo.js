import request from '@/utils/request'

export const list = (data) => {
  return request({
    method: 'POST',
    url: '/loanInfo/list',
    data: data
  })
}


export const apiList = (data) => {
  return request({
    method: 'POST',
    url: '/loanInfo/apiList',
    data: data
  })
}

export const transLogList = (params) => {
  return request({
    method: 'GET',
    url: '/loanInfo/transLogList',
    params: params
  })
}

export const push = (data) => {
  return request({
    method: 'POST',
    url: '/loanInfo/push',
    data
  })
}
