import request from '@/utils/request'
import fileDownload from 'js-file-download'

export const list = (params) => {
  return request({
    method: 'GET',
    url: '/crmStatistics/list',
    params: params
  })
}

export const crmSeatList = (params) => {
  return request({
    method: 'GET',
    url: '/crmStatistics/statisticsGroupBySeat',
    params: params
  })
}

export const download = (params) => {
  return request({
    url: '/crmStatistics/download', // File URL Goes Here
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
