import LayoutMain from '@/layout/LayoutMain'

export default {
  path: '/user',
  component: LayoutMain,
  children: [
    {
      path: 'manager',
      component: () => import('@/views/user/ManagerView')
    },
    {
      path: 'list',
      component: () => import('@/views/user/UserView')
    },
    {
      path: 'loaninfo',
      component: () => import('@/views/user/LoanInfoView')
    },
    {
      path: 'loaninfo-wxapp',
      component: () => import('@/views/user/LoanInfoWxappView')
    },
    {
      path: 'loaninfo-api',
      component: () => import('@/views/user/LoanInfoApiView')
    }
  ]
}
