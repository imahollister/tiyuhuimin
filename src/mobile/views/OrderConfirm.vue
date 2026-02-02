<template>
  <div class="order-page" v-if="orderDraft">
    <van-nav-bar title="确认订单" left-arrow @click-left="router.back()" />
    
    <div class="card venue-info">
      <div class="name">{{ orderDraft.venueName }}</div>
      <div class="item">{{ orderDraft.itemName }}</div>
      <div class="price">¥{{ orderDraft.price }}</div>
    </div>
    
    <!-- 优惠券选择 -->
    <van-cell-group inset class="card">
      <van-cell title="优惠券" is-link :value="selectedCoupon ? `-¥${selectedCoupon.value}` : '不使用优惠券'" @click="showCouponPopup = true" />
    </van-cell-group>
    
    <!-- 余额抵扣 -->
    <van-cell-group inset class="card">
      <van-cell title="惠民余额抵扣" :label="`可用余额 ¥${store.userAssets.balance.toFixed(2)}`">
        <template #right-icon>
          <van-switch v-model="useBalance" size="20px" />
        </template>
      </van-cell>
      <van-cell v-if="useBalance" title="抵扣金额" :value="`-¥${balanceDeduction}`" />
    </van-cell-group>
    
    <!-- 费用明细 -->
    <div class="card price-detail">
      <div class="row">
        <span>商品总价</span>
        <span>¥{{ orderDraft.price }}</span>
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
    
    <van-submit-bar :price="finalPrice * 100" button-text="提交订单" @submit="onSubmit" />
    
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
  // 转换成 van-coupon-list 格式
  return store.userAssets.coupons
    .filter(c => c.status === 0 && orderDraft.value.price >= c.minSpend)
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
  
  let remain = orderDraft.value.price;
  if (selectedCoupon.value) {
    remain -= (selectedCoupon.value.value / 100);
  }
  
  // 余额最多抵扣剩余金额，且不能超过拥有余额
  const deduction = Math.min(Math.max(0, remain), store.userAssets.balance);
  return parseFloat(deduction.toFixed(2));
});

const finalPrice = computed(() => {
  if (!orderDraft.value) return 0;
  
  let price = orderDraft.value.price;
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

const onSubmit = () => {
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
      itemName: orderDraft.value.itemName,
      price: orderDraft.value.price,
      couponId: selectedCoupon.value ? selectedCoupon.value.id : null,
      couponValue: selectedCoupon.value ? (selectedCoupon.value.value / 100) : 0,
      balanceUsed: balanceDeduction.value,
      realPay: finalPrice.value
    });
    
    // 模拟支付成功
    store.payOrder(store.currentOrder.id);
    
    showSuccessToast('支付成功');
    router.replace('/mobile/user');
  }, 1000);
};
</script>

<style lang="scss" scoped>
.order-page {
  padding-top: 10px;
  padding-bottom: 60px;
  background: #f7f8fa;
  min-height: 100vh;
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin: 10px 16px;
  
  &.venue-info {
    .name {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 4px;
    }
    .item {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }
    .price {
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }
  }
}

.price-detail {
  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
    color: #666;
    
    &.highlight {
      color: #ff5000;
    }
    
    &.total {
      margin-top: 10px;
      font-size: 16px;
      color: #333;
      font-weight: bold;
      
      .final-price {
        color: #ff5000;
        font-size: 20px;
      }
    }
  }
  
  .divider {
    height: 1px;
    background: #eee;
    margin: 10px 0;
  }
}
</style>
