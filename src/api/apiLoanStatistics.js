import request from '@/utils/request'

export const getLoanRecord = (data) => {
  return request({
    method: 'POST',
    url: '/apiLoanStatistics/getLoanRecord',
    data
  })
}

export const appStepList = (params) => {
  return request({
    method: 'GET',
    url: '/channelStatistics/appStepList',
    params
  })
}

export const appStepPercent = (params) => {
  return request({
    method: 'GET',
    url: '/channelStatistics/appStepPercent',
    params
  })
}

export const appFdStepList = (params) => {
  return request({
    method: 'GET',
    url: '/channelStatistics/appLoanStepList',
    params
  })
}

export const appFdStepPercent = (params) => {
  return request({
    method: 'GET',
    url: '/channelStatistics/appLoanStepPercent',
    params
  })
}

export const loggedList = (data) => {
  return request({
    method: 'POST',
    url: '/loanInfo/loggedList',
    data
  })
}

export const unloggedList = (data) => {
  return request({
    method: 'POST',
    url: '/loanInfo/unloggedList',
    data
  })
}

export const smsRecord = (data) => {
  return request({
    method: 'POST',
    url: '/loanInfo/smsRecord',
    data
  })
}

export const getChannelLoanInfo = (data) => {
  return request({
    method: 'POST',
    url: '/apiLoanStatistics/getChannelLoanInfo',
    data
  })
}

export const getProductLoanInfo = (data) => {
  return request({
    method: 'POST',
    url: '/apiLoanStatistics/getProductLoanInfo',
    data
  })
}

export const getHalfProductStatistics = (data) => {
  return request({
    method: 'POST',
    url: '/apiLoanStatistics/getHalfProductStatistics',
    data
  })
}

export const getLoaningUser = (data) => {
  return request({
    method: 'POST',
    url: '/apiLoanStatistics/getLoaningUser',
    data
  })
}

export const getPlans = (data) => {
  return request({
    method: 'POST',
    url: '/apiLoanStatistics/getPlans',
    params: data
  })
}
