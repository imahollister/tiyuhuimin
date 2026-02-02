<template>
  <div class="user-page">
    <div class="user-header">
      <div class="header-content">
        <div class="avatar">
          <van-image round width="64" height="64" src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cartoon%20avatar%20boy%203d%20render&image_size=square" />
        </div>
        <div class="info">
          <div class="name">张三 <van-tag type="primary" round size="mini">实名认证</van-tag></div>
          <div class="phone">138****8888</div>
        </div>
        <van-icon name="setting-o" color="#fff" size="24" class="setting-btn" />
      </div>
    </div>
    
    <!-- 资产看板 -->
    <div class="assets-card">
      <div class="card-title">我的资产</div>
      <div class="card-content">
        <div class="item" @click="router.push('/mobile/balance-history')">
          <div class="value">¥{{ store.userAssets.balance.toFixed(2) }}</div>
          <div class="label">惠民余额</div>
        </div>
        <div class="divider"></div>
        <div class="item" @click="router.push('/mobile/coupon-list')">
          <div class="value">{{ validCouponCount }}<span class="unit">张</span></div>
          <div class="label">优惠券</div>
        </div>
        <div class="divider"></div>
        <div class="item">
          <div class="value">500<span class="unit">分</span></div>
          <div class="label">积分</div>
        </div>
      </div>
    </div>
    
    <!-- 订单管理 -->
    <div class="order-section">
      <div class="header" @click="router.push('/mobile/order-list')">
        <div class="title">我的订单</div>
        <div class="more">全部订单 <van-icon name="arrow" /></div>
      </div>
      <div class="order-tabs">
        <div class="tab" @click="router.push('/mobile/order-list?status=pending')">
          <van-icon name="pending-payment" size="28" color="#ff976a" />
          <span>待支付</span>
        </div>
        <div class="tab" @click="router.push('/mobile/order-list?status=paid')">
          <van-icon name="qr" size="28" color="#1989fa" />
          <span>待核销</span>
        </div>
        <div class="tab" @click="router.push('/mobile/order-list?status=used')">
          <van-icon name="completed" size="28" color="#07c160" />
          <span>已完成</span>
        </div>
        <div class="tab" @click="router.push('/mobile/order-list?status=refunded')">
          <van-icon name="after-sale" size="28" color="#999" />
          <span>退款/售后</span>
        </div>
      </div>
    </div>
    
    <!-- 最近订单列表 -->
    <div class="order-list">
      <div class="list-title">最近订单</div>
      <div v-if="store.userAssets.orders.length === 0" class="empty">暂无订单</div>
      <div class="order-card" v-for="order in store.userAssets.orders.slice(0, 2)" :key="order.id" @click="goDetail(order.id)">
        <div class="top">
          <span class="venue">{{ order.venueName }}</span>
          <span class="status">{{ formatStatus(order.status) }}</span>
        </div>
        <div class="content">
          <div class="item">{{ order.itemName }}</div>
          <div class="time">{{ order.createTime }}</div>
        </div>
        <div class="bottom">
          <div class="price">实付: ¥{{ order.realPay }}</div>
          <van-button v-if="order.status === 'paid'" size="small" type="primary" plain @click.stop="showCode">查看核销码</van-button>
        </div>
      </div>
    </div>
    
    <van-cell-group inset style="margin: 0 16px 20px; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
      <van-cell title="我的收藏" is-link icon="star-o" @click="router.push('/mobile/collection-list?type=collection')" />
      <van-cell title="浏览足迹" is-link icon="clock-o" @click="router.push('/mobile/collection-list?type=history')" />
      <van-cell title="联系客服" is-link icon="service-o" @click="showToast('请拨打 12345')" />
    </van-cell-group>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMockStore } from '../../stores/mock';
import { showToast } from 'vant';

const router = useRouter();
const store = useMockStore();

const validCouponCount = computed(() => {
  return store.userAssets.coupons.filter(c => c.status === 0).length;
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

const showCode = () => {
  showToast('展示核销码二维码');
};
</script>

<style lang="scss" scoped>
.user-page {
  padding-bottom: 20px;
  background: #f7f8fa;
  min-height: 100vh;
}

.user-header {
  background: linear-gradient(135deg, #1989fa, #39b9f5);
  padding: 40px 20px 80px;
  color: #fff;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  
  .header-content {
    display: flex;
    align-items: center;
    position: relative;
    
    .info {
      margin-left: 16px;
      .name {
        font-size: 20px;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .phone {
        font-size: 14px;
        opacity: 0.9;
        margin-top: 6px;
      }
    }
    
    .setting-btn {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
}

.assets-card {
  background: #fff;
  border-radius: 12px;
  margin: -50px 16px 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  position: relative;
  z-index: 1;
  
  .card-title {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 16px;
  }
  
  .card-content {
    display: flex;
    align-items: center;
    
    .item {
      flex: 1;
      text-align: center;
      
      .value {
        font-size: 22px;
        font-weight: bold;
        color: #333;
        margin-bottom: 4px;
        
        .unit {
          font-size: 12px;
          font-weight: normal;
          margin-left: 2px;
        }
      }
      .label {
        font-size: 12px;
        color: #999;
      }
    }
    
    .divider {
      width: 1px;
      height: 30px;
      background: #eee;
    }
  }
}

.order-section {
  background: #fff;
  margin: 0 16px 16px;
  border-radius: 8px;
  padding: 16px;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .title {
      font-size: 16px;
      font-weight: bold;
    }
    .more {
      font-size: 12px;
      color: #999;
    }
  }
  
  .order-tabs {
    display: flex;
    justify-content: space-between;
    
    .tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #666;
    }
  }
}

.order-list {
  margin: 0 16px;
  
  .list-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .empty {
    text-align: center;
    color: #999;
    padding: 20px;
  }
  
  .order-card {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    
    .top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      .venue {
        font-weight: 600;
      }
      .status {
        color: #ff5000;
        font-size: 14px;
      }
    }
    
    .content {
      margin-bottom: 10px;
      .item {
        font-size: 14px;
        color: #333;
      }
      .time {
        font-size: 12px;
        color: #999;
        margin-top: 4px;
      }
    }
    
    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #f5f5f5;
      padding-top: 10px;
      
      .price {
        font-weight: bold;
      }
    }
  }
}
</style>
