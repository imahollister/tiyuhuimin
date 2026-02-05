<template>
  <div class="order-detail-page" v-if="order">
    <van-nav-bar title="订单详情" left-arrow @click-left="router.back()" fixed placeholder />
    
    <div class="status-card">
      <div class="status-text">{{ formatStatus(order.status) }}</div>
      <div class="sub-text" v-if="order.status === 'pending'">
        请在 {{ countdown }} 内完成支付，超时将自动取消
      </div>
      <div class="sub-text" v-else-if="order.status === 'paid'">
        请凭下方核销码入场
      </div>
    </div>
    
    <!-- QR Code Section (Only for Paid) -->
    <div class="qr-section" v-if="order.status === 'paid'">
      <div class="qr-title">入场核销码</div>
      <div class="qr-code">
        <!-- Mock QR Code -->
        <van-icon name="qr" size="150" color="#333" />
      </div>
      <div class="qr-num">NO. {{ order.id.toUpperCase() }}</div>
      <div class="qr-tip">请出示给场馆工作人员核销</div>
    </div>
    
    <!-- Venue Info -->
    <div class="card venue-info">
      <div class="row" @click="goVenue">
        <span class="label">场馆名称</span>
        <span class="value link">{{ order.venueName }} <van-icon name="arrow" /></span>
      </div>
      <div class="row">
        <span class="label">预订项目</span>
        <span class="value">{{ order.itemName }}</span>
      </div>
      <div class="row">
        <span class="label">营业时间</span>
        <span class="value">09:00 - 22:00</span>
      </div>
      <div class="actions">
        <van-button icon="phone-o" size="small" round>联系场馆</van-button>
        <van-button icon="location-o" size="small" round>查看地图</van-button>
      </div>
    </div>
    
    <!-- Order Info -->
    <div class="card order-info">
      <div class="row">
        <span class="label">订单编号</span>
        <span class="value">{{ order.id }}</span>
      </div>
      <div class="row">
        <span class="label">下单时间</span>
        <span class="value">{{ order.createTime }}</span>
      </div>
      <div class="divider"></div>
      <div class="row">
        <span class="label">商品总价</span>
        <span class="value">¥{{ order.price }}</span>
      </div>
      <div class="row highlight">
        <span class="label">实付金额</span>
        <span class="value price">¥{{ order.realPay }}</span>
      </div>
    </div>
    
    <!-- Bottom Action Bar -->
    <div class="footer-bar" v-if="order.status === 'pending'">
      <van-button round block type="default" @click="onCancel">取消订单</van-button>
      <van-button round block type="danger" @click="onPay">立即支付</van-button>
    </div>
    <div class="footer-bar" v-else-if="order.status === 'paid'">
      <van-button round block type="default" @click="onRefund">申请退款</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMockStore } from '../../stores/mock';
import { showToast, showDialog } from 'vant';

const route = useRoute();
const router = useRouter();
const store = useMockStore();

const order = ref({});
const countdown = ref('14:59');

onMounted(() => {
  const id = route.params.id;
  const found = store.userAssets.orders.find(o => o.id == id);
  if (found) {
    order.value = found;
  } else {
    showToast('订单不存在');
    router.back();
  }
});

const formatStatus = (status) => {
  const map = {
    pending: '等待支付',
    paid: '待核销',
    used: '已完成',
    refunded: '已退款'
  };
  return map[status] || status;
};

const goVenue = () => {
  // Mock navigation
  showToast('跳转场馆详情');
};

const onCancel = () => {
  showDialog({
    title: '提示',
    message: '确定要取消当前订单吗？',
    showCancelButton: true,
  }).then(() => {
    // Mock cancel
    order.value.status = 'cancelled'; // Note: In real app, update store/backend
    showToast('订单已取消');
    router.back();
  });
};

const onPay = () => {
  showToast('跳转支付...');
};

const onRefund = () => {
  showDialog({
    title: '申请退款',
    message: '退款金额将原路返回，确定申请吗？',
    showCancelButton: true,
  }).then(() => {
    order.value.status = 'refunded';
    showToast('退款申请已提交');
  });
};
</script>

<style lang="scss" scoped>
.order-detail-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 80px;
}

.status-header {
  background: #ff5000;
  color: #fff;
  padding: 24px 20px;
  
  &.paid { background: #1989fa; }
  &.used { background: #07c160; }
  &.refunded { background: #999; }
  
  .status-text {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  .sub-text {
    font-size: 13px;
    opacity: 0.9;
  }
}

.qr-section {
  background: #fff;
  margin: 12px;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  
  .qr-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 16px;
    color: #333;
  }
  
  .qr-code {
    margin: 16px 0;
  }
  
  .qr-num {
    font-family: monospace;
    font-size: 16px;
    color: #666;
    letter-spacing: 1px;
    margin-bottom: 8px;
  }
  
  .qr-tip {
    font-size: 12px;
    color: #999;
  }
}

.card {
  background: #fff;
  margin: 12px;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  
  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .label {
      color: #666;
    }
    
    .value {
      color: #333;
      &.link {
        color: #333;
        display: flex;
        align-items: center;
      }
      &.price {
        color: #ff5000;
        font-weight: bold;
        font-size: 16px;
      }
    }
    
    &.highlight {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #f5f5f5;
    }
  }
  
  .divider {
    height: 1px;
    background: #f5f5f5;
    margin: 12px 0;
  }
  
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #f5f5f5;
  }
}

.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 10px 16px;
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>