import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import Landing from './views/Landing.vue';

// 创建路由
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing
    },
    {
      path: '/mobile',
      redirect: '/mobile/home'
    },
    {
      path: '/mobile/home',
      component: () => import('./mobile/views/Home.vue')
    },
    {
      path: '/mobile/detail/:id',
      component: () => import('./mobile/views/Detail.vue')
    },
    {
      path: '/mobile/user',
      component: () => import('./mobile/views/User.vue')
    },
    {
      path: '/admin',
      redirect: '/admin/index'
    },
    {
      path: '/admin/index',
      component: () => import('./admin/views/Dashboard.vue')
    },
    {
      path: '/admin/venue',
      component: () => import('./admin/views/VenueMgr.vue')
    },
    {
      path: '/admin/order',
      component: () => import('./admin/views/OrderMgr.vue')
    },
    {
      path: '/admin/coupon',
      component: () => import('./admin/views/CouponMgr.vue')
    },
    {
      path: '/admin/settings',
      component: () => import('./admin/views/Settings.vue')
    }
  ]
});

// 创建并挂载应用
const app = createApp({
  // 根组件
  template: '<router-view />'
});

app.use(router);
app.mount('#app');

console.log('体育惠民系统已启动');
