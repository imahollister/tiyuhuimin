import { createRouter, createWebHashHistory } from 'vue-router';
import Layout from './views/Layout.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('./views/Dashboard.vue'),
        meta: { title: '工作台' }
      },
      {
        path: 'product',
        name: 'ProductMgr',
        component: () => import('./views/ProductMgr.vue'),
        meta: { title: '商品管理' }
      },
      {
        path: 'order',
        name: 'OrderMgr',
        component: () => import('./views/OrderMgr.vue'),
        meta: { title: '订单管理' }
      },
      {
        path: 'verification',
        name: 'Verification',
        component: () => import('./views/Verification.vue'),
        meta: { title: '核销中心' }
      },
      {
        path: 'finance',
        name: 'Finance',
        component: () => import('./views/Finance.vue'),
        meta: { title: '财务结算' }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('./views/Settings.vue'),
        meta: { title: '店铺设置' }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
