import request from '@/utils/request'


export const queryLogsByCondition = (data) => {
  return request({
    method: 'POST',
    url: '/applicationLog/queryLogsByCondition',
    data
  })
}