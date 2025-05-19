import request from '@/utils/request'

export const login = data => {
  return request({
    method: 'POST',
    url: '/auth/login',
    data
  })
}

export const captcha = () => {
  return request({
    method: 'GET',
    url: '/auth/captcha'
  })
}

export const getIp = () => {
  return request({
    method: 'GET',
    url: 'http://47.97.185.88/ipJson.jsp?json=true'
  })
}
