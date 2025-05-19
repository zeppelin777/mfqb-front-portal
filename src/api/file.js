import request from '@/utils/request'

export const upload = (file) => {
  const data = new FormData()
  data.append('file', file)
  return request({
    url: '/file/upload',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}
