import LayoutMain from '@/layout/LayoutMain'

export default {
  path: '/offline',
  component: LayoutMain,
  children: [
    {
      path: 'crm',
      component: () => import('@/views/offline/CrmView.vue')
    },
    {
      path: 'push',
      component: () => import('@/views/offline/PushView.vue')
    },
    {
      path: 'platform',
      component: () => import('@/views/offline/PlatformInfoView.vue')
    },
    {
      path: 'pushPlatform',
      component: () => import('@/views/offline/PushPlatformView.vue')
    },
    {
      path: 'channel',
      component: () => import('@/views/statistics/QudaoView')
    },
    {
      path: 'produce',
      component: () => import('@/views/statistics/Chanpin')
    },
    {
      path:'channelSimple',
      component: () => import('@/views/statistics/QudaoViewSimple')
    },
    {
      path: 'crmSwitch',
      component: () => import('@/views/offline/crmSwitchView.vue')
    },
  ]
}
