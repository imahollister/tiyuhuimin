import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/admin/dashboard'
  },
  {
    path: '/admin/index.html',
    redirect: '/admin/dashboard'
  },
  {
    path: '/admin',
    component: () => import('./views/Layout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('./views/Dashboard.vue')
      },
      {
        path: 'venue',
        name: 'VenueMgr',
        component: () => import('./views/VenueMgr.vue')
      },
      {
        path: 'coupon',
        name: 'CouponMgr',
        component: () => import('./views/CouponMgr.vue')
      },
      {
        path: 'coupon/records/:id',
        name: 'CouponRecords',
        component: () => import('./views/CouponRecords.vue'),
        meta: { title: '领取记录' }
      },
      {
        path: 'order',
        name: 'OrderMgr',
        component: () => import('./views/OrderMgr.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('./views/Settings.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
