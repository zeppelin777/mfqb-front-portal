import request from '@/utils/request'

export const getChannelCheckCount = (params) => {
  return request({
    method:'POST',
    url:'/pushStatistics/getChannelCheckCount',
    data:params
  })
}
