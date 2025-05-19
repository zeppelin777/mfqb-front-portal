import request from '@/utils/request'

export const barChart = () => {
  return request({
    method: 'GET',
    url: '/index/barChat'
  })
}

export const pieChart = () => {
  return request({
    method: 'GET',
    url: '/index/pieChart'
  })
}

export const fetchApiTotal = (params) => {
  return request({
    method: 'GET',
    url: '/pushStatistics/apiTotal',
    params:params,
  })
}

export const fetchH5ChannelTotal = (params) => {
  return request({
    method: 'GET',
    url: '/channelStatistics/H5ChannelTotal',
    params:params
  })
}

export const apiTotalAnalysis = (params) => {
  return request({
    method: 'GET',
    url: '/pushStatistics/apiTotalAnalysis',
    params:params
  })
}

export const h5ChannelAnalysis = (params) => {
  return request({
    method: 'GET',
    url: '/channelStatistics/H5ChannelAnalysis',
    params:params
  })
}
