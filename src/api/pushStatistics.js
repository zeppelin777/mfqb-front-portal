import request from '@/utils/request'

import fileDownload from 'js-file-download'

export const list = (params) => {
  return request({
    method: 'GET',
    // url: '/pushStatistics/listByRule',
    url: '/pushStatistics/pushList',
    params: params
  })
}

export const pushStatisticsByChannel = (params) => {
  return request({
    method: 'GET',
    url: '/pushStatistics/pushStatisticsByChannel',
    params: params
  })
}

export const pushStatisticsByQudao = (params) => {
  return request({
    method: 'GET',
    url: '/pushStatistics/getChannelPushDetail',
    params: params
  })
}

export const getCheckCount = (params) => {
  return request({
    method: 'POST',
    url: '/pushStatistics/getCheckCount',
    data: params
  })
}

export const chanpinSwitchInfo = (params) => {
  return request({
    method: 'GET',
    url: '/channel/getSwitchInfoByPlatformId',
    params: params
  })
}

export const changeChanpinSwitchInfo = (params) => {
  return request({
    method: 'GET',
    url: '/channel/updateSwitchById',
    params: params
  })
}

export const updateAllSwitchByPlatId = (params) => {
  return request({
    method: 'GET',
    url: '/channel/updateAllSwitchByPlatId',
    params: params
  })
}

export const download = (params) => {
  return request({
    url: '/pushStatistics/listByRuleDownload', // File URL Goes Here
    method: 'GET',
    responseType: 'arraybuffer',
    params: params
  }).then((res) => {
    const disposition = res.headers['content-disposition']
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
    const matches = filenameRegex.exec(disposition)
    if (matches != null && matches[1]) {
      let filename = matches[1].replace(/['"]/g, '')
      filename = decodeURIComponent(filename)
      fileDownload(res.data, filename)
    }
  })
}

export const fetchChannelCheckPercent = (params) => {
  return request({
    method:'get',
    url:'/pushStatistics/getChannelCheckPercent',
    params:params
  })
}
// RESTful风格：更新单个渠道的日推送最大量（路径参数）
export const updateSwitchChannelLimitById = (id, dayChannelLimit) => {
  return request({
    method: 'GET',
    url: `/channel/updateSwitchChannelLimitById/${id}/${dayChannelLimit}`
  })
}



