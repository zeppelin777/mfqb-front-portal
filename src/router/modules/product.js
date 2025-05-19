import LayoutMain from '@/layout/LayoutMain'

export default {
  path: '/product',
  component: LayoutMain,
  children: [
    {
      path: 'cate',
      component: () => import('@/views/product/CateView')
    },
    {
      path: 'list',
      component: () => import('@/views/product/ListView')
    },
    {
      path: 'channel',
      component: () => import('@/views/product/ChannelView')
    },
    {
      path: 'apichannel',
      component: () => import('@/views/product/apiProduct')
    }
  ]
}
