<template>
  <div class="order-list-page">
    <van-nav-bar title="我的订单" left-arrow @click-left="router.back()" fixed placeholder :border="false" style="background: #f7f8fa;" />
    
    <van-tabs v-model:active="activeTab" sticky offset-top="46" background="#f7f8fa" color="#1989fa" title-active-color="#1989fa">
      <van-tab title="全部" name="all"></van-tab>
      <van-tab title="待支付" name="pending"></van-tab>
      <van-tab title="待核销" name="paid"></van-tab>
      <van-tab title="已完成" name="used"></van-tab>
      <van-tab title="退款/取消" name="refunded"></van-tab>
    </van-tabs>

    <div class="order-list">
      <van-empty 
        v-if="paginatedOrders.length === 0" 
        description="暂无相关订单" 
        image="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=empty%20box%20illustration%2C%20minimalist%2C%20soft%20colors&image_size=square"
      />
      
      <div class="order-card" v-for="order in paginatedOrders" :key="order.id" @click="goDetail(order.id)">
        <div class="card-header">
          <div class="shop-info">
            <i class="ri-store-2-line icon"></i>
            <span class="shop-name">{{ order.venueName }}</span>
            <i class="ri-arrow-right-s-line arrow"></i>
          </div>
          <span class="status" :class="order.status">{{ formatStatus(order.status) }}</span>
        </div>
        
        <div class="card-body">
          <div class="product-info">
            <van-image 
              width="80" 
              height="80" 
              radius="8" 
              fit="cover" 
              :src="order.image || 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=sports%20icon%20minimalist&image_size=square'" 
            />
            <div class="info-right">
              <div class="title-row">
                <div class="name">{{ order.itemName }}</div>
                <div class="price">¥{{ order.realPay }}</div>
              </div>
              <div class="desc-row">
                <div class="time">下单时间：{{ order.createTime }}</div>
                <div class="qty">x1</div>
              </div>
              <div class="tags-row" v-if="order.status === 'paid'">
                <span class="tag">可核销</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card-footer">
          <div class="total-text">合计: <span class="price">¥{{ order.realPay }}</span></div>
          <div class="actions">
            <van-button size="small" round plain v-if="order.status === 'paid'">联系场馆</van-button>
            <van-button size="small" round color="#1989fa" v-if="order.status === 'paid'">查看核销码</van-button>
            
            <van-button size="small" round plain v-if="order.status === 'pending'">取消订单</van-button>
            <van-button size="small" round color="#ff5000" v-if="order.status === 'pending'">去支付</van-button>
            
            <van-button size="small" round plain v-if="order.status === 'used'">删除订单</van-button>
            <van-button size="small" round plain v-if="order.status === 'used'">评价</van-button>
          </div>
        </div>
      </div>
      
      <!-- 分页器 -->
      <div class="pagination-wrapper" v-if="totalPages > 1">
        <van-pagination 
          v-model="currentPage" 
          :total-items="filteredOrders.length"
          :items-per-page="pageSize"
          :page-count="totalPages"
          mode="simple"
          @change="onPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMockStore } from '../../stores/mock';

const router = useRouter();
const route = useRoute();
const store = useMockStore();
const activeTab = ref('all');

// 分页配置
const pageSize = ref(10);
const currentPage = ref(1);

onMounted(() => {
  if (route.query.status) {
    activeTab.value = route.query.status;
  }
});

// 监听Tab切换，重置分页
watch(activeTab, () => {
  currentPage.value = 1;
});

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') {
    return store.userAssets.orders;
  }
  return store.userAssets.orders.filter(o => o.status === activeTab.value);
});

// 分页后的订单
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredOrders.value.slice(start, end);
});

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / pageSize.value);
});

// 切换页码
const onPageChange = (page) => {
  currentPage.value = page;
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

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
  padding: 16px;
  padding-bottom: 80px;
}

.order-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f9f9f9;
    
    .shop-info {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 15px;
      font-weight: 600;
      color: #333;
      .icon { font-size: 18px; color: #666; }
      .arrow { font-size: 16px; color: #ccc; }
    }
    
    .status {
      font-size: 14px;
      &.pending { color: #ff5000; }
      &.paid { color: #1989fa; }
      &.used { color: #999; }
      &.refunded { color: #999; }
    }
  }
  
  .card-body {
    margin-bottom: 16px;
    .product-info {
      display: flex;
      gap: 12px;
      
      .info-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        
        .title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          .name { font-size: 15px; font-weight: bold; color: #333; line-height: 1.4; flex: 1; margin-right: 10px; }
          .price { font-size: 15px; font-weight: bold; color: #333; }
        }
        
        .desc-row {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #999;
          margin-top: 4px;
        }
        
        .tags-row {
          margin-top: 8px;
          .tag { font-size: 10px; color: #1989fa; background: #e6f7ff; padding: 2px 6px; border-radius: 4px; }
        }
      }
    }
  }
  
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .total-text { font-size: 13px; color: #666; .price { color: #333; font-weight: bold; font-size: 15px; } }
    
    .actions {
      display: flex;
      gap: 8px;
      .van-button { padding: 0 16px; height: 30px; line-height: 28px; font-size: 13px; }
    }
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 16px 0;
}
</style>
