import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '@/views/login/LoginView'
import LayoutMain from '@/layout/LayoutMain'
import View404 from '@/views/view404'
import userRouter from './modules/user'
import offlineRouter from './modules/offline'
import productRouter from './modules/product'
import statisticsRouter from './modules/statistics'
import loanRouter from './modules/loan'
import logRouter from './modules/log'
import systemRouter from './modules/system'

// 避免重复导航
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}
Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: LayoutMain,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/IndexView')
      }
    ]
  },
  userRouter,
  offlineRouter,
  productRouter,
  statisticsRouter,
  loanRouter,
  logRouter,
  systemRouter,
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/404',
    name: '404',
    component: View404
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 打印当前路径和目标路径
  const token = localStorage.getItem('token')
  // 如果目标路径是登录页且用户已登录，则跳转到首页
  if (to.path === '/' && token) {
    next({ path: '/index' });
  } else if (to.matched.length === 0) {
    next({ path: '/404', replace: true })
  } else {
    if (to.name !== 'login' && !token) {
      router.push('/login')
    } else {
      next()
    }
  }
})

export default router
