<template>
  <div class="coupon-page">
    <van-nav-bar title="领券中心" left-arrow @click-left="router.back()" fixed placeholder :border="false" style="background: #f7f8fa;" />
    
    <van-tabs v-model:active="activeTab" sticky offset-top="46" background="#f7f8fa" color="#ff5000" title-active-color="#ff5000">
      <van-tab title="可使用" name="available"></van-tab>
      <van-tab title="已失效" name="disabled"></van-tab>
    </van-tabs>
    
    <div class="coupon-container">
      <div class="custom-coupon-list">
         <div v-if="activeTab === 'available'">
           <van-empty 
             v-if="availableCoupons.length === 0" 
             description="暂无可用优惠券" 
             image="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=empty%20coupon%20box%20minimalist&image_size=square"
           />
           <div class="coupon-item" v-for="coupon in availableCoupons" :key="coupon.id" @click="showDetail(coupon)">
              <div class="left">
                <div class="val">¥<span class="num">{{ coupon.valueDesc }}</span></div>
                <div class="cond">{{ coupon.condition }}</div>
              </div>
              <div class="right">
                <div class="name">{{ coupon.name }}</div>
                <div class="time">{{ formatDate(coupon.startAt) }} - {{ formatDate(coupon.endAt) }}</div>
                <div class="desc">{{ coupon.description }}</div>
                <van-button size="mini" round color="#ff5000" class="use-btn" @click.stop="goHome">去使用</van-button>
              </div>
           </div>
         </div>
         
         <div v-if="activeTab === 'disabled'">
           <van-empty v-if="disabledCoupons.length === 0" description="暂无失效优惠券" />
           <div class="coupon-item disabled" v-for="coupon in disabledCoupons" :key="coupon.id" @click="showDetail(coupon)">
              <div class="left">
                <div class="val">¥<span class="num">{{ coupon.valueDesc }}</span></div>
                <div class="cond">{{ coupon.condition }}</div>
              </div>
              <div class="right">
                <div class="name">{{ coupon.name }}</div>
                <div class="time">{{ formatDate(coupon.startAt) }} - {{ formatDate(coupon.endAt) }}</div>
                <div class="reason-tag">{{ coupon.reason }}</div>
              </div>
           </div>
         </div>
      </div>
    </div>
    
    <!-- Detail Popup -->
    <van-popup v-model:show="showPopup" round position="bottom" style="height: 40%">
      <div class="coupon-detail-popup" v-if="currentCoupon">
        <div class="popup-title">优惠券详情</div>
        <div class="detail-content">
          <div class="detail-row">
            <span class="label">优惠券名称</span>
            <span class="val">{{ currentCoupon.name }}</span>
          </div>
          <div class="detail-row">
            <span class="label">优惠金额</span>
            <span class="val price">¥{{ currentCoupon.valueDesc }}</span>
          </div>
          <div class="detail-row">
            <span class="label">使用门槛</span>
            <span class="val">{{ currentCoupon.condition }}</span>
          </div>
          <div class="detail-row">
            <span class="label">有效期至</span>
            <span class="val">{{ formatDate(currentCoupon.endAt) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">使用说明</span>
            <span class="val">{{ currentCoupon.description }}</span>
          </div>
        </div>
        <div class="btn-area">
          <van-button block round type="primary" color="linear-gradient(to right, #ff6034, #ee0a24)" @click="showPopup = false">我知道了</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMockStore } from '../../stores/mock';

const router = useRouter();
const store = useMockStore();
const activeTab = ref('available');
const showPopup = ref(false);
const currentCoupon = ref(null);

const showDetail = (coupon) => {
  currentCoupon.value = coupon;
  showPopup.value = true;
};

const goHome = () => {
  router.push('/mobile/home');
};

const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString();
};

const mapCoupon = (c) => {
  // 处理日期，默认一年后
  let start = Date.now() / 1000;
  let end = start + 365 * 24 * 3600;
  
  if (c.endDate) {
    end = new Date(c.endDate).getTime() / 1000;
    // 假设开始时间是结束时间前30天，或者就是现在（如果还没过期）
    // 这里简单处理，让它在有效期内
    start = Math.min(start, end - 1); 
  }

  // Calculate reason for status
  let reason = '';
  if (c.status === 0) {
    reason = '未使用';
  } else if (c.status === 1) {
    reason = '已使用';
  } else {
    reason = '已过期';
  }

  return {
    id: c.id,
    name: c.name,
    condition: `满${c.minSpend}元可用`,
    startAt: start,
    endAt: end,
    description: c.desc || (c.type === 'general' ? '全市通用' : '指定区域可用'),
    reason: reason,
    value: c.value * 100,
    valueDesc: c.value,
    unitDesc: '元',
    status: c.status
  };
};

const availableCoupons = computed(() => {
  return store.userAssets.coupons
    .filter(c => c.status === 0)
    .map(mapCoupon);
});

const disabledCoupons = computed(() => {
  return store.userAssets.coupons
    .filter(c => c.status !== 0)
    .map(mapCoupon);
});
</script>

<style lang="scss" scoped>
.coupon-page {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.coupon-container {
  padding: 16px;
  
  .custom-coupon-list {
    padding-bottom: 20px;
  }
}

.coupon-item {
  display: flex;
  background: #fff;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  overflow: hidden;
  position: relative;
  transition: transform 0.2s;
  
  &:active {
    transform: scale(0.98);
  }
  
  // Sawtooth effect using radial gradient
  &::before, &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: #f7f8fa; // Match page background
    border-radius: 50%;
    z-index: 1;
    left: 90px; // Adjust based on left width (100px) - radius (10px) = 90px
  }
  
  &::before { top: -10px; }
  &::after { bottom: -10px; }
  
  .left {
    width: 100px;
    background: linear-gradient(135deg, #ff6034, #ee0a24);
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    position: relative;
    border-right: 1px dashed rgba(255,255,255,0.3);
    
    .val { font-size: 14px; .num { font-size: 28px; font-weight: bold; font-family: 'DIN Alternate', sans-serif; } }
    .cond { font-size: 12px; opacity: 0.9; text-align: center; margin-top: 4px; }
  }
  
  .right {
    flex: 1;
    padding: 16px 12px 16px 24px; // Extra left padding for the notch
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    
    .name { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 8px; }
    .time { font-size: 12px; color: #999; margin-bottom: 4px; }
    .desc { font-size: 12px; color: #999; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 180px; }
    
    .use-btn {
      position: absolute;
      right: 12px;
      bottom: 16px;
      padding: 0 12px;
    }
    
    .reason-tag {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%) rotate(-15deg);
      border: 1px solid #999;
      color: #999;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      opacity: 0.5;
    }
  }
  
  &.disabled {
    .left { background: #d7d7d7; }
    .right { opacity: 0.6; }
    .name { color: #999; }
  }
}

.coupon-detail-popup {
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  .popup-title { text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 30px; color: #333; }
  
  .detail-content {
    flex: 1;
  }
  
  .detail-row {
    display: flex;
    margin-bottom: 20px;
    font-size: 14px;
    line-height: 1.5;
    
    .label { color: #999; width: 80px; flex-shrink: 0; }
    .val { color: #333; flex: 1; 
      &.price { color: #ff5000; font-weight: bold; font-size: 18px; font-family: 'DIN Alternate', sans-serif; }
    }
  }
  
  .btn-area { margin-top: auto; }
}
</style>
