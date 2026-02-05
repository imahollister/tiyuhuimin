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
        <i class="ri-settings-3-line setting-btn"></i>
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
        <div class="more">全部订单 <i class="ri-arrow-right-s-line"></i></div>
      </div>
      <div class="order-tabs">
        <div class="tab" @click="router.push('/mobile/order-list?status=pending')">
          <div class="icon-wrap"><i class="ri-wallet-3-line"></i></div>
          <span>待支付</span>
        </div>
        <div class="tab" @click="router.push('/mobile/order-list?status=paid')">
          <div class="icon-wrap"><i class="ri-qr-scan-2-line"></i></div>
          <span>待核销</span>
        </div>
        <div class="tab" @click="router.push('/mobile/order-list?status=used')">
          <div class="icon-wrap"><i class="ri-checkbox-circle-line"></i></div>
          <span>已完成</span>
        </div>
        <div class="tab" @click="router.push('/mobile/order-list?status=refunded')">
          <div class="icon-wrap"><i class="ri-refund-2-line"></i></div>
          <span>退款/售后</span>
        </div>
      </div>
    </div>
    
    <!-- 功能入口 -->
    <div class="menu-list">
      <div class="menu-item" @click="router.push('/mobile/collection-list?type=collection')">
        <div class="left">
          <i class="ri-star-line icon" style="color: #ff9800;"></i>
          <span>我的收藏</span>
        </div>
        <i class="ri-arrow-right-s-line arrow"></i>
      </div>
      <div class="menu-item" @click="router.push('/mobile/collection-list?type=history')">
        <div class="left">
          <i class="ri-history-line icon" style="color: #1989fa;"></i>
          <span>浏览足迹</span>
        </div>
        <i class="ri-arrow-right-s-line arrow"></i>
      </div>
      <div class="menu-item" @click="showToast('请拨打 12345')">
        <div class="left">
          <i class="ri-customer-service-2-line icon" style="color: #07c160;"></i>
          <span>联系客服</span>
        </div>
        <i class="ri-arrow-right-s-line arrow"></i>
      </div>
    </div>
    
    <Tabbar />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMockStore } from '../../stores/mock';
import { showToast } from 'vant';
import Tabbar from '../components/Tabbar.vue';

const router = useRouter();
const store = useMockStore();

const validCouponCount = computed(() => {
  return store.userAssets.coupons.filter(c => c.status === 0).length;
});
</script>

<style lang="scss" scoped>
.user-page {
  padding-bottom: 80px;
  background: #f7f8fa;
  min-height: 100vh;
}

.user-header {
  background: linear-gradient(135deg, #1989fa, #39b9f5);
  padding: 40px 20px 80px;
  color: #fff;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  
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
      font-size: 24px;
      color: #fff;
    }
  }
}

.assets-card {
  background: #fff;
  border-radius: 16px;
  margin: -60px 16px 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  position: relative;
  z-index: 1;
  
  .card-title {
    font-size: 15px;
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
        font-weight: 800;
        color: #333;
        margin-bottom: 4px;
        font-family: 'DIN Alternate', sans-serif;
        
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
      height: 24px;
      background: #eee;
    }
  }
}

.order-section {
  background: #fff;
  margin: 0 16px 16px;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
    .more {
      font-size: 12px;
      color: #999;
      display: flex;
      align-items: center;
    }
  }
  
  .order-tabs {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    
    .tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      
      .icon-wrap {
        font-size: 26px;
        color: #666;
        transition: transform 0.2s;
      }
      
      span {
        font-size: 12px;
        color: #666;
      }
      
      &:active .icon-wrap {
        transform: scale(0.9);
      }
    }
  }
}

.menu-list {
  background: #fff;
  margin: 0 16px 20px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  
  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #f9f9f9;
    
    &:last-child {
      border-bottom: none;
    }
    
    .left {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .icon {
        font-size: 20px;
      }
      span {
        font-size: 15px;
        color: #333;
        font-weight: 500;
      }
    }
    
    .arrow {
      color: #ccc;
      font-size: 16px;
    }
    
    &:active {
      background: #f9f9f9;
    }
  }
}
</style>
