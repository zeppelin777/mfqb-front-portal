import LayoutMain from '@/layout/LayoutMain'

export default {
  path: '/statistics',
  component: LayoutMain,
  children: [
    {
      path: 'channel',
      component: () => import('@/views/statistics/ChannelView')
    },
    {
      path: 'h5channelCount',
      component: () => import('@/views/statistics/ChannelViewNew')
    },
    {
      path: 'product',
      component: () => import('@/views/statistics/ProductView')
    },
    {
      path: 'crm',
      component: () => import('@/views/statistics/CrmView')
    },
    {
      path: 'crmSeat',
      component: () => import('@/views/statistics/CrmSeatView')
    },
    {
      path: 'cb',
      component: () => import('@/views/statistics/CbView')
    },
    {
      path: 'push',
      component: () => import('@/views/statistics/PushView')
    },
    {
      path: 'index',
      component: () => import('@/views/info/infoList')
    },
    {
      path: 'star',
      component: () => import('@/views/statistics/userStarStatistics')
    },
    {
      path: 'productStar',
      component: () => import('@/views/statistics/prodStarStatistics')
    },
    {
      path: 'channelColl',
      component: () => import('@/views/statistics/ChannelCollStatistics')
    },
    {
      path:'crmStar',
      component: () => import('@/views/statistics/crmStar')
    },
    {
      path:'step',
      component: () => import('@/views/statistics/Step')
    },
    {
      path:'checkSuccess',
      component: () => import('@/views/statistics/checkSuccess')
    },
    {
      path: 'strikeDetail',
      component: () => import('@/views/statistics/StrikeDetail')
    }
  ]
}
