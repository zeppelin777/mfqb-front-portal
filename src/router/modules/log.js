import LayoutMain from '@/layout/LayoutMain'

export default {
  path: '/log',
  component: LayoutMain,
  children: [
    {
      path: 'channel',
      component: () => import('@/views/log/ChannelView')
    },
    {
      path: 'product',
      component: () => import('@/views/log/ProductView')
    },
    {
      path: 'push',
      component: () => import('@/views/log/PushView')
    },
    {
      path: 'cb',
      component: () => import('@/views/log/CbView')
    },
    {
      path: 'crm',
      component: () => import('@/views/log/CrmView')
    },
    {
      path: 'productPush',
      component: () => import('@/views/log/ProductPushView')
    }

  ]
}
