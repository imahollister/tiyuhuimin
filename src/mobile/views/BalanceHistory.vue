<template>
  <div class="balance-page">
    <van-nav-bar title="惠民余额" left-arrow @click-left="router.back()" fixed placeholder />
    
    <div class="balance-card">
      <div class="label">当前可用余额(元)</div>
      <div class="amount">{{ store.userAssets.balance.toFixed(2) }}</div>
      <div class="tips">每年1月1日自动清零，请及时使用</div>
    </div>
    
    <div class="history-list">
      <div class="title">收支明细</div>
      <van-cell-group inset>
        <van-cell title="系统发放" value="+200.00" label="2026-01-01 10:00:00" />
        <van-cell 
          v-for="order in paidOrders" 
          :key="order.id" 
          :title="`消费-${order.itemName}`" 
          :value="`-${order.balanceUsed}`" 
          :label="order.createTime" 
        />
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMockStore } from '../../stores/mock';

const router = useRouter();
const store = useMockStore();

const paidOrders = computed(() => {
  return store.userAssets.orders.filter(o => (o.status === 'paid' || o.status === 'used') && o.balanceUsed > 0);
});
</script>

<style lang="scss" scoped>
.balance-page {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.balance-card {
  background: linear-gradient(135deg, #ff5000, #ff8400);
  color: #fff;
  padding: 30px 20px;
  margin: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(255, 80, 0, 0.3);
  
  .label {
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 10px;
  }
  
  .amount {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .tips {
    font-size: 12px;
    opacity: 0.8;
  }
}

.history-list {
  .title {
    padding: 16px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
}
</style>
