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
import { computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMockStore } from '../stores/mock';
import { showToast } from 'vant';

const route = useRoute();
const router = useRouter();
const store = useMockStore();

// 监听来自父窗口的消息（预览模式导航）
const handleMessage = (event) => {
  if (event.data && event.data.type === 'NAVIGATE') {
    router.push(event.data.path);
  }
};

onMounted(() => {
  window.addEventListener('message', handleMessage);
  // 通知父窗口应用已准备就绪
  if (window.parent) {
    window.parent.postMessage({ type: 'READY' }, '*');
  }
});

onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
});

// 检测是否在 iframe 中（预览模式）
const isInIframe = computed(() => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
});

const showTabbar = computed(() => {
  // 在 iframe 预览模式下不显示底部导航栏
  if (isInIframe.value) return false;
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
