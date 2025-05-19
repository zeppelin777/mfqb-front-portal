import LayoutMain from '@/layout/LayoutMain'

export default {
  path: '/system',
  component: LayoutMain,
  children: [
    // {
    //   path: 'menu',
    //   component: () => import('@/views/system/MenuView')
    // },
    // {
    //   path: 'role',
    //   component: () => import('@/views/system/RoleView')
    // },
    {
      path: 'permission',
      component: () => import('@/views/system/PermissionView')
    },
    {
      path: 'dept',
      component: () => import('@/views/system/DeptView')
    },
    {
      path: 'menu',
      component: () => import('@/views/system/MenuView')
    },
    {
      path: 'role',
      component: () => import('@/views/system/RoleView')
    }
  ]
}
