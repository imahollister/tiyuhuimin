<template>
  <div class="coupon-list-page">
    <van-nav-bar title="我的优惠券" left-arrow @click-left="router.back()" fixed placeholder />
    
    <div class="coupon-container">
      <van-coupon-list
        :coupons="availableCoupons"
        :disabled-coupons="disabledCoupons"
        :show-exchange-bar="false"
        :show-close-button="false"
        enabled-title="可使用优惠券"
        disabled-title="已使用/失效"
        @exchange="onExchange"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMockStore } from '../../stores/mock';
import { showToast } from 'vant';

const router = useRouter();
const store = useMockStore();

const onExchange = () => {
  showToast('兑换功能暂未开放');
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

  return {
    id: c.id,
    name: c.name,
    condition: `满${c.minSpend}元可用`,
    startAt: start,
    endAt: end,
    description: c.desc || (c.type === 'general' ? '全市通用' : '指定区域可用'),
    reason: c.status === 1 ? '已使用' : '已过期',
    value: c.value * 100,
    valueDesc: c.value,
    unitDesc: '元'
  };
};

const availableCoupons = computed(() => {
  return store.userAssets.coupons.filter(c => c.status === 0).map(mapCoupon);
});

const disabledCoupons = computed(() => {
  return store.userAssets.coupons.filter(c => c.status !== 0).map(mapCoupon);
});
</script>

<style lang="scss" scoped>
.coupon-list-page {
  min-height: 100vh;
  background-color: #f7f8fa;
}
.coupon-container {
  // van-coupon-list 自带全屏样式，这里可能需要调整高度
  height: calc(100vh - 46px);
  
  ::v-deep(.van-coupon-list__list) {
    height: auto;
    max-height: none;
    padding-bottom: 50px;
  }
}
</style>
