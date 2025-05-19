import axios from 'axios'
import router from '@/router'
import { Notification } from 'element-ui'

const request = axios.create({
  baseURL:
    // process.env.NODE_ENV === 'development'?
      // ? 'https://portal.yske8.com/xlqbadmin'// 本地发开小龙正式环境
      // ? 'http://test.portal.youswl.top/admin' // 本地发开小龙钱包测试环境
      // ? 'http://test.admin.yske8.com/admin' // 本地发开互融测试环境
      // : '/xlqbadmin'
    // process.env.NODE_ENV === 'development'
    //   ? 'http://192.168.1.4:8092/xlqbadmin'
  // 'https://api.mfqb.cc/admin'
       'http://localhost:8092/admin'
})

request.interceptors.request.use((config) => {
  config.headers['Content-Type'] = 'application/json'
  // 统一添加 source
  if (config.url.startsWith('http')) {
    return config
  }
  config.headers.province = encodeURIComponent(
    localStorage.getItem('province') || ''
  )
  config.headers.city = encodeURIComponent(localStorage.getItem('city') || '')
  // 统一添加 token
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.token = token
  }
  return config
})

request.interceptors.response.use((res) => {
  if (res.request.responseType === 'arraybuffer') {
    // 用于下载
    return res
  }
  if (res.config.url.startsWith('http')) {
    return res.data
  }
  if (res.data.code !== 200) {
    Notification.error({
      title: res.data.message
    })
  }
  if (res.data.code === 10011) {
    router.push('/login')
  }
  return res.data
})

export default request
