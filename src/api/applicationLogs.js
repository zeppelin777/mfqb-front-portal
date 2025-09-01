import request from '@/utils/request'


export const queryLogsByCondition = (data) => {
  return request({
    method: 'POST',
    url: '/applicationLog/queryLogsByCondition',
    data
  })
}

// 上传excel并下载文件
export const uploadExcelAndDownFile = (formData) => {
  return request({
    url: '/applicationLog/uploadExcelAndDownFile',
    method: 'POST',
    data: formData,
    responseType: 'blob'
  });
}