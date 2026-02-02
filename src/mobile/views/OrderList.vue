<template>
  <div class="order-list-page">
    <van-nav-bar title="我的订单" left-arrow @click-left="router.back()" fixed placeholder />
    
    <van-tabs v-model:active="activeTab" sticky offset-top="46">
      <van-tab title="全部" name="all"></van-tab>
      <van-tab title="待支付" name="pending"></van-tab>
      <van-tab title="待核销" name="paid"></van-tab>
      <van-tab title="已完成" name="used"></van-tab>
      <van-tab title="退款/取消" name="refunded"></van-tab>
    </van-tabs>

    <div class="order-list">
      <van-empty 
        v-if="filteredOrders.length === 0" 
        description="暂无相关订单" 
        image="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=empty%20box%20illustration%2C%20minimalist%2C%20soft%20colors&image_size=square"
      />
      
      <div class="order-card" v-for="order in filteredOrders" :key="order.id" @click="goDetail(order.id)">
        <div class="header">
          <span class="shop-name">{{ order.venueName }}</span>
          <span class="status" :class="order.status">{{ formatStatus(order.status) }}</span>
        </div>
        <div class="content">
          <van-image 
            width="70" 
            height="70" 
            radius="4" 
            fit="cover" 
            src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=sports%20icon%20minimalist&image_size=square" 
          />
          <div class="info">
            <div class="name">{{ order.itemName }}</div>
            <div class="time">下单时间：{{ order.createTime }}</div>
            <div class="price-row">
              <span class="label">总价 ¥{{ order.price }}</span>
              <span class="real-pay">实付 ¥<span class="num">{{ order.realPay }}</span></span>
            </div>
          </div>
        </div>
        <div class="footer" v-if="order.status === 'paid'">
          <van-button size="small" round>联系场馆</van-button>
          <van-button size="small" round type="primary" class="action-btn">查看核销码</van-button>
        </div>
        <div class="footer" v-else-if="order.status === 'pending'">
          <van-button size="small" round>取消订单</van-button>
          <van-button size="small" round type="danger" class="action-btn">去支付</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMockStore } from '../../stores/mock';

const router = useRouter();
const route = useRoute();
const store = useMockStore();
const activeTab = ref('all');

onMounted(() => {
  if (route.query.status) {
    activeTab.value = route.query.status;
  }
});

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') {
    return store.userAssets.orders;
  }
  return store.userAssets.orders.filter(o => o.status === activeTab.value);
});

const formatStatus = (status) => {
  const map = {
    pending: '待支付',
    paid: '待核销',
    used: '已完成',
    refunded: '已退款'
  };
  return map[status] || status;
};

const goDetail = (id) => {
  router.push(`/mobile/order-detail/${id}`);
};
</script>

<style lang="scss" scoped>
.order-list-page {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.order-list {
  padding: 12px;
}

.order-card {
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;
    
    .shop-name {
      font-weight: 600;
      color: #333;
    }
    
    .status {
      color: #666;
      &.pending { color: #ff5000; }
      &.paid { color: #1989fa; }
      &.used { color: #999; }
    }
  }
  
  .content {
    display: flex;
    gap: 10px;
    margin-bottom: 12px;
    
    .info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      .name {
        font-size: 15px;
        font-weight: 500;
        color: #333;
      }
      
      .time {
        font-size: 12px;
        color: #999;
      }
      
      .price-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        
        .label {
          font-size: 12px;
          color: #999;
          text-decoration: line-through;
        }
        
        .real-pay {
          font-size: 12px;
          color: #333;
          .num {
            font-size: 16px;
            font-weight: 600;
          }
        }
      }
    }
  }
  
  .footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    border-top: 1px solid #f5f5f5;
    padding-top: 10px;
    
    .action-btn {
      padding: 0 20px;
    }
  }
}
</style>
