import request from '@/utils/request'
import fileDownload from 'js-file-download'

export const list = (params) => {
  return request({
    method: 'GET',
    url: '/channelStatistics/list',
    params: params
  })
}

export const listByPush = (params) => {
  return request({
    method: 'GET',
    // url: '/channelStatistics/listByPush',
    url: '/pushStatistics/getPushDetail',
    params: params
  })
}

export const download = (params) => {
  return request({
    url: '/channelStatistics/download', // File URL Goes Here
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

export const userStarStatistics = (params) => {
  return request({
    method:'POST',
    url:'/pushStatistics/userStarStatistics',
    data:params
  })
}

export const downloadStar = (params) => {
  return request({
    url: '/pushStatistics/download', // File URL Goes Here
    method: 'POST',
    responseType: 'arraybuffer',
    data: params
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

export const getPlatStarDetail = (params) => {
  return request({
    method:'POST',
    url:'pushStatistics/getPlatStarDetail',
    data:params
  })
}


export const getPlatStarList = (params) => {
  return request({
    method:'POST',
    url:'/pushStatistics/getPlatStarList',
    data:params
  })
}

export const getChannelStarDetail = (params) => {
  return request({
    method:'POST',
    url:'pushStatistics/getChannelStarDetail',
    data:params
  })
}

export const selectStarStatistics = (params) => {
  return request({
    method:'GET',
    url:'/crmStatistics/selectStarStatistics',
    params:params
  })
}

export const stepList = (params) => {
  return request({
    method:'GET',
    url:'/channelStatistics/stepList',
    params:params
  })
}

export const stepPercent = (params) => {
  return request({
    method:'GET',
    url:'/channelStatistics/stepPercent',
    params:params,
  })
}

export const stepH5Product = (params) => {
  return request({
    method:'GET',
    url:'/productStatistics/getButtonStep',
    params:params,
  })
}

