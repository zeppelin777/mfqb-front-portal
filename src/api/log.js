import request from '@/utils/request'
import fileDownload from 'js-file-download'

export const channelLogList = (params) => {
  return request({
    method: 'GET',
    url: '/log/channelLogList',
    params: params
  })
}

export const callbackLogList = (params) => {
  return request({
    method: 'GET',
    url: '/log/callbackLogList',
    params: params
  })
}

export const productClickLogList = (params) => {
  return request({
    method: 'GET',
    url: '/log/productClickLogList',
    params: params
  })
}

export const pushTransLogList = (params) => {
  return request({
    method: 'GET',
    url: '/log/pushTransLogList',
    params: params
  })
}

export const crmPushLogList = (params) => {
  return request({
    method: 'GET',
    url: '/log/crmPushLogList',
    params: params
  })
}

export const h5pushResultLog = (params) => {
  return request({
    method: 'GET',
    url: '/log/h5pushResultLog',
    params: params
  })
}

export const download = (params) => {
  return request({
    url: '/log/h5pushResultLogDownload', // File URL Goes Here
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
