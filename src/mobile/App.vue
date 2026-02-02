<template>
  <div class="mobile-app">
    <router-view />
    
    <van-tabbar route v-if="showTabbar">
      <van-tabbar-item replace to="/mobile/home" icon="shop-o">场馆</van-tabbar-item>
      <van-tabbar-item icon="qr" @click="onVerifyClick">核销</van-tabbar-item>
      <van-tabbar-item replace to="/mobile/user" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMockStore } from '../stores/mock';
import { showToast } from 'vant';

const route = useRoute();
const router = useRouter();
const store = useMockStore();

const showTabbar = computed(() => {
  return ['/mobile/home', '/mobile/user'].includes(route.path);
});

const onVerifyClick = () => {
  const paidOrders = store.userAssets.orders.filter(o => o.status === 'paid');
  
  if (paidOrders.length === 1) {
    // 只有一个待核销订单，直接跳转详情页展示二维码
    router.push(`/mobile/order-detail/${paidOrders[0].id}`);
  } else {
    // 多个或没有，跳转列表页
    router.push({
      path: '/mobile/order-list',
      query: { status: 'paid' }
    });
    
    if (paidOrders.length === 0) {
      showToast('暂无待核销订单');
    }
  }
};
</script>

<style lang="scss">
.mobile-app {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 50px;
}
</style>
