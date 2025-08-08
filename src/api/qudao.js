import request from '@/utils/request'

import fileDownload from 'js-file-download'

export const list = (params) => {
  return request({
    method: 'GET',
    // url: '/pushStatistics/listByRule',
    url: '/pushStatistics/channelList',
    params: params
  })
}

export const chanpinlist = (params) => {
  return request({
    method: 'GET',
    // url: '/pushStatistics/listByRule',
    url: '/pushStatistics/productList',
    params: params
  })
}

export const chanpinUpdatePlat = (params) => {
  return request({
    method: 'GET',
    // url: '/pushStatistics/listByRule',
    url: '/pushStatistics/updatePlat',
    params: params
  })
}

export const chargeBalance = (params) => {
  return request({
    method: 'GET',
    url: '/pushStatistics/chargeBalance',
    params: params
  })
}

export const updateFlag = (params) => {
  return request({
    method:'GET',
    url:'/pushStatistics/updateFlag',
    params:params
  })
}

export const deleteChanpin = (params) => {
  return request({
    method:'GET',
    url:'/pushStatistics/deleteProduct',
    params:params
  })
}

export const addChanpinTo = (params) => {
  return request({
    method:'GET',
    url:'/pushStatistics/addProduct',
    params:params
  })
}

export const updateChanpinTo = (params) => {
  return request({
    method:'GET',
    url:'/pushStatistics/updatePlatform',
    params:params
  })
}

export const apiDownload = (params) => {
  return request({
    url: 'pushStatistics/channelStatisticsDownload', // File URL Goes Here
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
