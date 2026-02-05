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
        component: () => import('./views/Dashboard.vue')
      },
      {
        path: 'venue',
        name: 'VenueMgr',
        component: () => import('./views/VenueMgr.vue')
      },
      {
        path: 'company',
        name: 'CompanyMgr',
        component: () => import('./views/CompanyMgr.vue')
      },
      {
        path: 'fund-pool',
        name: 'FundPoolMgr',
        component: () => import('./views/FundPoolMgr.vue')
      },
      {
        path: 'reconciliation',
        name: 'ReconciliationMgr',
        component: () => import('./views/ReconciliationMgr.vue')
      },
      {
        path: 'customer',
        name: 'CustomerMgr',
        component: () => import('./views/CustomerMgr.vue')
      },
      {
        path: 'warning',
        name: 'WarningMgr',
        component: () => import('./views/WarningMgr.vue')
      },
      {
        path: 'stats',
        name: 'StatsMgr',
        component: () => import('./views/StatsMgr.vue')
      },
      {
        path: 'user',
        name: 'UserMgr',
        component: () => import('./views/UserMgr.vue')
      },
      {
        path: 'dict',
        name: 'DictMgr',
        component: () => import('./views/DictMgr.vue')
      },
      {
        path: 'password',
        name: 'PasswordMgr',
        component: () => import('./views/PasswordMgr.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
