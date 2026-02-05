<template>
  <div class="order-page" v-if="orderDraft">
    <van-nav-bar title="确认订单" left-arrow @click-left="router.back()" fixed placeholder :border="false" style="background: #f7f8fa;" />
    
    <div class="card venue-info">
      <div class="card-header">
        <div class="name">{{ orderDraft.venueName }}</div>
      </div>
      <div class="card-body">
        <div class="date-row" v-if="orderDraft.date">
          <i class="ri-calendar-line icon"></i>
          <span>{{ orderDraft.date }}</span>
        </div>
        
        <!-- Slot List -->
        <div class="slots-detail" v-if="orderDraft.items && orderDraft.items.length">
          <div class="slot-item" v-for="(item, idx) in orderDraft.items" :key="idx">
            <div class="slot-left">
              <span class="field">{{ item.fieldName }}</span>
              <span class="time">{{ item.time }}</span>
            </div>
            <span class="price">¥{{ item.price }}</span>
          </div>
        </div>
        
        <!-- Single Item -->
        <div class="single-item" v-else>
          <div class="item-name">{{ orderDraft.itemName }}</div>
          <div class="price">¥{{ orderDraft.totalPrice || orderDraft.price }}</div>
        </div>
      </div>
    </div>
    
    <!-- 优惠券选择 -->
    <div class="card action-card" @click="showCouponPopup = true">
      <div class="label">优惠券</div>
      <div class="value" :class="{ 'has-coupon': selectedCoupon }">
        {{ selectedCoupon ? `-¥${selectedCoupon.value}` : '不使用优惠券' }}
        <i class="ri-arrow-right-s-line arrow"></i>
      </div>
    </div>
    
    <!-- 余额抵扣 -->
    <div class="card action-card">
      <div class="label-group">
        <div class="label">惠民余额抵扣</div>
        <div class="sub-label">可用余额 ¥{{ store.userAssets.balance.toFixed(2) }}</div>
      </div>
      <div class="right-action">
        <span class="deduct-val" v-if="useBalance">-¥{{ balanceDeduction }}</span>
        <van-switch v-model="useBalance" size="22px" active-color="#1989fa" />
      </div>
    </div>
    
    <!-- 费用明细 -->
    <div class="card price-detail">
      <div class="row">
        <span>商品总价</span>
        <span>¥{{ orderDraft.totalPrice || orderDraft.price }}</span>
      </div>
      <div class="row highlight" v-if="selectedCoupon">
        <span>优惠券减免</span>
        <span>-¥{{ selectedCoupon.value }}</span>
      </div>
      <div class="row highlight" v-if="useBalance && balanceDeduction > 0">
        <span>余额抵扣</span>
        <span>-¥{{ balanceDeduction }}</span>
      </div>
      <div class="divider"></div>
      <div class="row total">
        <span>实付金额</span>
        <span class="final-price">¥{{ finalPrice }}</span>
      </div>
    </div>
    
    <div class="bottom-bar-placeholder"></div>
    <div class="bottom-bar">
      <div class="price-info">
        <span class="label">合计:</span>
        <span class="symbol">¥</span>
        <span class="num">{{ finalPrice }}</span>
      </div>
      <van-button round block type="primary" color="linear-gradient(to right, #ff6034, #ee0a24)" @click="onSubmit" :loading="loading">
        提交订单
      </van-button>
    </div>
    
    <!-- 优惠券弹窗 -->
    <van-popup v-model:show="showCouponPopup" position="bottom" round style="height: 60%">
      <van-coupon-list
        :coupons="availableCoupons"
        :chosen-coupon="chosenCouponIndex"
        @change="onChangeCoupon"
        @exchange="onExchange"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMockStore } from '../../stores/mock';
import { showToast, showSuccessToast } from 'vant';

const router = useRouter();
const store = useMockStore();

const orderDraft = ref(null);
const showCouponPopup = ref(false);
const chosenCouponIndex = ref(-1);
const useBalance = ref(true);
const loading = ref(false);

onMounted(() => {
  const draft = sessionStorage.getItem('orderDraft');
  if (!draft) {
    router.replace('/mobile/home');
    return;
  }
  orderDraft.value = JSON.parse(draft);
  
  // 自动选择最优券
  const bestIndex = availableCoupons.value.findIndex(c => c.value > 0);
  if (bestIndex !== -1) {
    chosenCouponIndex.value = bestIndex;
  }
});

const availableCoupons = computed(() => {
  if (!orderDraft.value) return [];
  const totalPrice = orderDraft.value.totalPrice || orderDraft.value.price;
  // 转换成 van-coupon-list 格式
  return store.userAssets.coupons
    .filter(c => c.status === 0 && totalPrice >= c.minSpend)
    .sort((a, b) => b.value - a.value) // 价值降序
    .map(c => {
      // 处理日期
      let start = Date.now() / 1000;
      let end = start + 365 * 24 * 3600;
      if (c.endDate) {
        end = new Date(c.endDate).getTime() / 1000;
        start = Math.min(start, end - 1);
      }
      
      return {
        id: c.id,
        name: c.name,
        condition: `满${c.minSpend}元可用`,
        startAt: start,
        endAt: end,
        description: c.desc || (c.type === 'general' ? '全市通用' : '指定区域可用'),
        reason: '',
        value: c.value * 100,
        valueDesc: c.value,
        unitDesc: '元'
      };
    });
});

const selectedCoupon = computed(() => {
  if (chosenCouponIndex.value === -1) return null;
  return availableCoupons.value[chosenCouponIndex.value];
});

const balanceDeduction = computed(() => {
  if (!useBalance.value || !orderDraft.value) return 0;
  
  let remain = orderDraft.value.totalPrice || orderDraft.value.price;
  if (selectedCoupon.value) {
    remain -= (selectedCoupon.value.value / 100);
  }
  
  // 余额最多抵扣剩余金额，且不能超过拥有余额
  const deduction = Math.min(Math.max(0, remain), store.userAssets.balance);
  return parseFloat(deduction.toFixed(2));
});

const finalPrice = computed(() => {
  if (!orderDraft.value) return 0;
  
  let price = orderDraft.value.totalPrice || orderDraft.value.price;
  if (selectedCoupon.value) {
    price -= (selectedCoupon.value.value / 100);
  }
  if (useBalance.value) {
    price -= balanceDeduction.value;
  }
  return Math.max(0, parseFloat(price.toFixed(2)));
});

const onChangeCoupon = (index) => {
  showCouponPopup.value = false;
  chosenCouponIndex.value = index;
};

const onExchange = () => {
  showToast('兑换功能暂未开放');
};

// 表单验证
const validateForm = () => {
  if (!orderDraft.value) {
    showToast('订单信息异常，请重新选择');
    return false;
  }
  if (finalPrice.value < 0) {
    showToast('订单金额异常，请重新选择');
    return false;
  }
  return true;
};

const onSubmit = () => {
  // 验证表单
  if (!validateForm()) return;
  
  loading.value = true;
  showToast({
    type: 'loading',
    message: '支付中...',
    forbidClick: true,
    duration: 1000
  });
  
  setTimeout(() => {
    // 创建订单
    store.createOrder({
      venueName: orderDraft.value.venueName,
      itemName: orderDraft.value.itemName || '场地预订', // Default for slot booking
      price: orderDraft.value.totalPrice || orderDraft.value.price,
      couponId: selectedCoupon.value ? selectedCoupon.value.id : null,
      couponValue: selectedCoupon.value ? (selectedCoupon.value.value / 100) : 0,
      balanceUsed: balanceDeduction.value,
      realPay: finalPrice.value,
      // Store booking details if available
      bookingDetails: orderDraft.value.items || null,
      bookingDate: orderDraft.value.date || null
    });
    
    // 模拟支付成功
    store.payOrder(store.currentOrder.id);
    
    loading.value = false;
    showSuccessToast('支付成功');
    router.replace('/mobile/user');
  }, 1000);
};
</script>

<style lang="scss" scoped>
.order-page {
  padding: 16px;
  background: #f7f8fa;
  min-height: 100vh;
  box-sizing: border-box;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.03);
  
  &.venue-info {
    .card-header { border-bottom: 1px solid #f5f5f5; padding-bottom: 12px; margin-bottom: 12px;
      .name { font-size: 18px; font-weight: bold; color: #333; }
    }
    .date-row { display: flex; align-items: center; gap: 6px; font-size: 14px; color: #666; margin-bottom: 12px; .icon { color: #1989fa; } }
    
    .slot-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px dashed #eee; &:last-child { border-bottom: none; }
      .slot-left { display: flex; gap: 10px; .field { font-weight: bold; } .time { color: #666; } }
      .price { font-weight: bold; }
    }
    
    .single-item { display: flex; justify-content: space-between; align-items: center; .item-name { font-size: 16px; font-weight: 500; } .price { font-size: 18px; font-weight: bold; } }
  }
  
  &.action-card {
    display: flex; justify-content: space-between; align-items: center; padding: 16px 20px;
    .label { font-size: 15px; font-weight: 500; color: #333; }
    .value { font-size: 14px; color: #999; display: flex; align-items: center; gap: 4px; &.has-coupon { color: #ff5000; font-weight: bold; } }
    .label-group { .sub-label { font-size: 12px; color: #999; margin-top: 4px; } }
    .right-action { display: flex; align-items: center; gap: 10px; .deduct-val { color: #ff5000; font-weight: bold; } }
  }
}

.price-detail {
  .row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; color: #666;
    &.highlight { color: #ff5000; }
    &.total { margin-top: 12px; font-size: 16px; color: #333; font-weight: bold; .final-price { color: #ff5000; font-size: 24px; font-family: 'DIN Alternate', sans-serif; } }
  }
  .divider { height: 1px; background: #eee; margin: 12px 0; }
}

.bottom-bar-placeholder { height: 80px; }
.bottom-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: #fff;
  padding: 12px 20px 30px;
  box-shadow: 0 -4px 16px rgba(0,0,0,0.05);
  display: flex; justify-content: space-between; align-items: center; z-index: 99;
  
  .price-info { 
    color: #ff5000; 
    .label { font-size: 14px; color: #333; margin-right: 4px; font-weight: 500; }
    .symbol { font-size: 16px; font-weight: bold; }
    .num { font-size: 28px; font-weight: 800; font-family: 'DIN Alternate', sans-serif; }
  }
  .van-button { width: 140px; font-weight: 600; font-size: 16px; }
}
</style>
