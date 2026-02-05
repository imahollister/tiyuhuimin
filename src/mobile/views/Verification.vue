<template>
  <div class="verification-page">
    <van-nav-bar title="核销中心" fixed placeholder :border="false" />
    
    <div class="header-section">
      <div class="title">待核销订单</div>
      <div class="subtitle">请出示二维码或核销码给工作人员</div>
    </div>

    <div class="order-list">
      <van-empty 
        v-if="pendingOrders.length === 0" 
        description="暂无待核销订单" 
        image="search"
      />
      
      <van-checkbox-group v-model="selectedOrders">
        <div class="verify-card" v-for="order in pendingOrders" :key="order.id">
          <div class="card-header">
            <div class="header-left">
              <van-checkbox :name="order.id" @click.stop />
              <span class="venue-name">{{ order.venueName }}</span>
            </div>
            <span class="time">{{ order.createTime }}</span>
          </div>
          
          <div class="card-body">
            <div class="item-name">{{ order.itemName }}</div>
            <div class="booking-info" v-if="order.bookingDetails">
              <div v-for="(item, idx) in order.bookingDetails" :key="idx" class="slot-tag">
                {{ item.fieldName }} {{ item.time }}
              </div>
            </div>
            <div class="price">¥{{ order.realPay }}</div>
          </div>
          
          <div class="qr-section">
            <div class="qr-placeholder">
               <van-icon name="qr" size="60" color="#333" />
            </div>
            <div class="code-text">核销码：<span class="code">{{ order.id.slice(-6).toUpperCase() }}</span></div>
          </div>
        </div>
      </van-checkbox-group>
    </div>
    
    <van-submit-bar
      v-if="pendingOrders.length > 0"
      :price="0"
      button-text="确认核销"
      @submit="handleBatchVerify"
      :disabled="selectedOrders.length === 0"
      :loading="isVerifying"
      button-type="primary"
      class="verify-bar"
    >
      <van-checkbox v-model="isAllSelected" @click="toggleSelectAll">全选</van-checkbox>
      <template #tip>
        已选择 <span style="color: #ff5000; font-weight: bold;">{{ selectedOrders.length }}</span> 个订单
      </template>
    </van-submit-bar>

    <Tabbar />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useMockStore } from '../../stores/mock';
import { showToast, showSuccessToast } from 'vant';
import Tabbar from '../components/Tabbar.vue';

const store = useMockStore();
const selectedOrders = ref([]);
const isVerifying = ref(false);
const isAllSelected = ref(false);

const pendingOrders = computed(() => {
  return store.userAssets.orders.filter(o => o.status === 'paid');
});

// Watch pendingOrders to clear selection if empty or update select all status
watch(pendingOrders, (newVal) => {
  if (newVal.length === 0) {
    selectedOrders.value = [];
    isAllSelected.value = false;
  } else {
    // If some orders verified, remove them from selection
    selectedOrders.value = selectedOrders.value.filter(id => newVal.some(o => o.id === id));
  }
});

// Watch selection to update select all checkbox state
watch(selectedOrders, (newVal) => {
  isAllSelected.value = newVal.length > 0 && newVal.length === pendingOrders.value.length;
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedOrders.value = pendingOrders.value.map(o => o.id);
  } else {
    selectedOrders.value = [];
  }
};

const handleBatchVerify = () => {
  if (selectedOrders.value.length === 0) return;
  
  isVerifying.value = true;
  showToast({
    type: 'loading',
    message: '核销中...',
    forbidClick: true
  });
  
  setTimeout(() => {
    // Verify selected orders
    selectedOrders.value.forEach(id => {
      store.useOrder(id);
    });
    
    showSuccessToast(`成功核销 ${selectedOrders.value.length} 个订单`);
    selectedOrders.value = [];
    isVerifying.value = false;
  }, 1500);
};
</script>

<style lang="scss" scoped>
.verification-page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 100px; // Extra padding for submit bar
}

.header-section {
  background: #fff;
  padding: 20px 16px;
  margin-bottom: 12px;
  .title { font-size: 20px; font-weight: bold; color: #333; margin-bottom: 4px; }
  .subtitle { font-size: 14px; color: #999; }
}

.verify-card {
  background: #fff;
  margin: 0 16px 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f5f5f5;
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .venue-name { font-weight: 600; font-size: 15px; }
    .time { font-size: 12px; color: #999; }
  }
  
  .card-body {
    padding: 16px;
    text-align: center;
    .item-name { font-size: 18px; font-weight: bold; margin-bottom: 8px; }
    .price { font-size: 16px; color: #ff5000; font-weight: bold; margin-top: 8px; }
    .booking-info {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 6px;
      .slot-tag { background: #f0f9eb; color: #67c23a; font-size: 12px; padding: 2px 6px; border-radius: 4px; }
    }
  }
  
  .qr-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 16px 16px;
    border-bottom: 1px dashed #eee;
    
    .qr-placeholder {
      width: 120px;
      height: 120px;
      background: #f8f8f8;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      border-radius: 8px;
    }
    
    .code-text { font-size: 14px; color: #666; .code { font-weight: bold; color: #333; font-size: 16px; letter-spacing: 1px; } }
  }
}

.verify-bar {
  bottom: 50px; // Above tabbar
  ::v-deep(.van-submit-bar__price) {
    display: none; // Hide price
  }
}
</style>