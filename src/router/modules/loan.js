import LayoutMain from '@/layout/LayoutMain'

export default {
  path: '/loan',
  component: LayoutMain,
  children: [
    {
      path: 'apiLoanStatistics',
      component: () => import('@/views/loan/ApiLoanStatistics')
    },
    {
      path: 'buriedPointStatistics',
      component: () => import('@/views/loan/BuriedPointStatistics')
    },
    {
      path: 'loanBuriedPointStatistics',
      component: () => import('@/views/loan/BuriedPointStatistics1')
    },
    {
      path: 'userLoginList',
      component: () => import('@/views/loan/userLoginList')
    },
    {
      path: 'userUnLoginList',
      component: () => import('@/views/loan/userUnLoginList')
    },
    {
      path: 'channelLoanInfo',
      component: () => import('@/views/loan/ChannelLoanInfo')
    },
    {
      path: 'productLoanInfo',
      component: () => import('@/views/loan/ProductLoanInfo')
    },
    {
      path: 'loaningUser',
      component: () => import('@/views/loan/LoaningUser')
    }
  ]
}
