import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/mobile/home'
  },
  {
    path: '/mobile/index.html',
    redirect: '/mobile/home'
  },
  {
    path: '/mobile/home',
    name: 'Home',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/mobile/detail/:id',
    name: 'Detail',
    component: () => import('./views/Detail.vue')
  },
  {
    path: '/mobile/order-confirm',
    name: 'OrderConfirm',
    component: () => import('./views/OrderConfirm.vue')
  },
  {
    path: '/mobile/user',
    name: 'User',
    component: () => import('./views/User.vue')
  },
  {
    path: '/mobile/coupon-list',
    name: 'CouponList',
    component: () => import('./views/CouponList.vue')
  },
  {
    path: '/mobile/order-list',
    name: 'OrderList',
    component: () => import('./views/OrderList.vue')
  },
  {
    path: '/mobile/order-detail/:id',
    name: 'OrderDetail',
    component: () => import('./views/OrderDetail.vue')
  },
  {
    path: '/mobile/balance-history',
    name: 'BalanceHistory',
    component: () => import('./views/BalanceHistory.vue')
  },
  {
    path: '/mobile/collection-list',
    name: 'CollectionList',
    component: () => import('./views/CollectionList.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
