<template>
  <div class="detail-page" v-if="venue">
    <van-nav-bar 
      :title="venue.name" 
      left-arrow 
      @click-left="router.back()" 
      fixed 
      :border="false" 
      style="--van-nav-bar-background: transparent; --van-nav-bar-title-text-color: transparent; --van-nav-bar-icon-color: #fff; z-index: 100;" 
    >
      <template #right>
        <van-icon 
          :name="isFavorited ? 'star' : 'star-o'" 
          :color="isFavorited ? '#ff5000' : '#fff'" 
          size="24" 
          @click="toggleFavorite"
        />
      </template>
    </van-nav-bar>
    
    <div class="hero-image">
      <van-image :src="venue.image" width="100%" height="240" fit="cover" />
      <div class="info-overlay">
        <div class="header-info">
          <div class="name">{{ venue.name }}</div>
          <div class="score-row">
            <van-rate v-model="venue.score" readonly size="12px" color="#ff9800" allow-half />
            <span class="score-num">{{ venue.score }}分</span>
          </div>
          <div class="tags">
            <van-tag type="primary" color="rgba(255,255,255,0.2)" text-color="#fff" v-for="tag in venue.tags" :key="tag">{{ tag }}</van-tag>
            <van-tag type="danger" color="#ff5000" v-if="venue.isHot">热门</van-tag>
            <van-tag type="success" color="#07c160" v-if="venue.isHuimin">惠民</van-tag>
          </div>
        </div>
      </div>
    </div>

    <div class="content-body">
      <div class="section info-section">
        <div class="info-row">
          <span class="label">场馆类型</span>
          <span class="value">{{ venue.venueType || '综合场馆' }}</span>
        </div>
        <div class="info-row">
          <span class="label">营业时间</span>
          <span class="value">{{ venue.businessHours || '09:00 - 22:00' }}</span>
        </div>
        <div class="info-row" v-if="venue.projectType">
          <span class="label">项目类型</span>
          <span class="value">{{ venue.projectType }}</span>
        </div>
        <div class="trust-badges">
           <div class="badge-item" v-if="venue.fundSupervision">
             <van-icon name="shield-o" color="#07c160" />
             <span>资金监管</span>
           </div>
           <div class="badge-item" v-if="venue.enterpriseNature === '国企'">
             <van-icon name="hotel-o" color="#1989fa" />
             <span>国企运营</span>
           </div>
           <div class="badge-item" v-if="venue.hasSystem">
             <van-icon name="cluster-o" color="#ff976a" />
             <span>智慧系统</span>
           </div>
        </div>
      </div>

      <div class="section location-section">
        <div class="location-row" @click="openMap">
          <div class="left">
            <div class="address">{{ venue.address || venue.district }}</div>
            <div class="distance">距您 {{ venue.distance }}</div>
          </div>
          <div class="right">
            <van-icon name="location" color="#1989fa" size="24" />
            <div class="action-text">导航</div>
          </div>
        </div>
        <div class="location-row" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;" @click="callPhone">
          <div class="left">
            <div class="address">联系电话：{{ venue.phone || '暂无' }}</div>
          </div>
          <div class="right">
            <van-icon name="phone" color="#07c160" size="24" />
            <div class="action-text">拨打</div>
          </div>
        </div>
      </div>

      <!-- 优惠券领券入口 (模拟) -->
      <div class="section coupon-section" v-if="venue.price > 0">
        <div class="coupon-row" @click="showToast('领取成功')">
          <div class="label">优惠</div>
          <div class="tags">
            <span class="coupon-tag">满100减50</span>
            <span class="coupon-tag">新人立减10</span>
          </div>
          <van-icon name="arrow" color="#999" />
        </div>
      </div>

      <div class="section items-section">
        <div class="section-title">预订项目</div>
        <div class="items-list">
          <div 
            class="item-card" 
            v-for="item in venue.items" 
            :key="item.id"
            :class="{ active: selectedItem?.id === item.id, disabled: item.stock === 0 }"
            @click="selectItem(item)"
          >
            <div class="item-main">
              <div class="name">{{ item.name }}</div>
              <div class="stock-tag" v-if="item.stock < 10">仅剩{{ item.stock }}位</div>
            </div>
            <div class="price-box">
              <span class="currency">¥</span>
              <span class="price">{{ item.price }}</span>
              <span class="original" v-if="item.originalPrice > item.price">¥{{ item.originalPrice }}</span>
            </div>
            <div class="check-icon" v-if="selectedItem?.id === item.id">
              <van-icon name="success" color="#fff" size="12" />
            </div>
          </div>
        </div>
      </div>
      
      <div class="section facilities-section">
        <div class="section-title">场馆设施</div>
        <div class="facilities-grid">
          <div class="fac-item"><van-icon name="shop-o" /><span>更衣室</span></div>
          <div class="fac-item"><van-icon name="logistics" /><span>储物柜</span></div>
          <div class="fac-item"><van-icon name="free-postage" /><span>停车场</span></div>
          <div class="fac-item"><van-icon name="gem-o" /><span>WIFI</span></div>
        </div>
      </div>
      
      <div class="section intro-section">
        <div class="section-title">场馆介绍</div>
        <div class="intro-text">
          {{ venue.intro || venue.name + ' 位于' + venue.district + '，是一座现代化的综合体育场馆。' }}
        </div>
      </div>
    </div>

    <!-- 底部预订栏 -->
    <van-action-bar>
      <div class="price-estimate" v-if="selectedItem">
        <div class="top-row">
          <span class="label">预估实付</span>
          <span class="value">¥{{ estimatePrice }}</span>
        </div>
        <div class="sub-row">已优惠 ¥{{ (selectedItem.price - estimatePrice).toFixed(2) }}</div>
      </div>
      <div class="price-estimate" v-else>
        <div class="label" style="font-size: 14px; color: #333; line-height: 50px;">请选择预订项目</div>
      </div>
      <van-action-bar-button 
        type="danger" 
        :text="selectedItem ? '立即预订' : '请选择'" 
        :disabled="!selectedItem"
        @click="goOrder" 
        color="linear-gradient(to right, #ff6034, #ee0a24)"
      />
    </van-action-bar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMockStore } from '../../stores/mock';
import { showToast } from 'vant';

const route = useRoute();
const router = useRouter();
const store = useMockStore();

const venue = ref(null);
const selectedItem = ref(null);

const isFavorited = computed(() => {
  return venue.value && store.userAssets.favorites.includes(venue.value.id);
});

const toggleFavorite = () => {
  if (!venue.value) return;
  const isAdded = store.toggleFavorite(venue.value.id);
  showToast(isAdded ? '收藏成功' : '已取消收藏');
};

onMounted(() => {
  const id = parseInt(route.params.id);
  venue.value = store.venues.find(v => v.id === id);
  if (!venue.value) {
    showToast('场馆不存在');
    router.back();
  } else {
    // 记录足迹
    store.addToHistory(venue.value.id);
  }
});

const selectItem = (item) => {
  if (item.stock === 0) return;
  selectedItem.value = item;
};

const openMap = () => {
  if (!venue.value) return;
  // 实际开发中可调用微信JSSDK或打开外部地图
  window.open(`https://uri.amap.com/marker?position=${venue.value.longitude},${venue.value.latitude}&name=${venue.value.name}`);
};

const callPhone = () => {
  if (!venue.value || !venue.value.phone) {
    showToast('暂无联系电话');
    return;
  }
  window.location.href = `tel:${venue.value.phone}`;
};

// 简单的预估逻辑：取最大面额可用券
const estimatePrice = computed(() => {
  if (!selectedItem.value) return 0;
  const price = selectedItem.value.price;
  
  // 查找可用优惠券
  const validCoupons = store.userAssets.coupons.filter(c => c.status === 0 && price >= c.minSpend);
  const maxCoupon = validCoupons.sort((a, b) => b.value - a.value)[0];
  const couponVal = maxCoupon ? maxCoupon.value : 0;
  
  // 扣除优惠券
  let final = price - couponVal;
  
  // 扣除余额 (假设全部可用)
  if (store.userAssets.balance > 0) {
    final = Math.max(0, final - store.userAssets.balance);
  }
  
  return final.toFixed(2);
});

const goOrder = () => {
  if (!selectedItem.value) return;
  
  // 传递预订信息到下单页
  // 实际项目中可能通过 Pinia 存储临时订单状态，这里简化通过 Query 参数或直接存 Store
  const orderDraft = {
    venueId: venue.value.id,
    venueName: venue.value.name,
    itemId: selectedItem.value.id,
    itemName: selectedItem.value.name,
    price: selectedItem.value.price
  };
  
  // 简单存到 sessionStorage 传递
  sessionStorage.setItem('orderDraft', JSON.stringify(orderDraft));
  router.push('/mobile/order-confirm');
};
</script>

<style lang="scss" scoped>
.detail-page {
  padding-bottom: 90px;
  background: #f7f8fa;
  min-height: 100vh;
}

.hero-image {
  position: relative;
  .info-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
    padding: 20px 16px;
    color: #fff;
    
    .name {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    
    .tags {
      display: flex;
      gap: 6px;
    }
  }
}

.section {
  background: #fff;
  margin-top: 10px;
  padding: 16px;
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    border-left: 3px solid #1989fa;
    padding-left: 8px;
  }
}



.info-section {
  .info-row {
    display: flex;
    margin-bottom: 8px;
    font-size: 14px;
    
    .label {
      color: #999;
      width: 70px;
    }
    .value {
      color: #333;
      flex: 1;
    }
  }
  
  .trust-badges {
    display: flex;
    gap: 12px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #f5f5f5;
    
    .badge-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #666;
    }
  }
}

.price-estimate {
  flex: 1;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  .label {
    font-size: 12px;
    color: #666;
  }
  
  .value {
    color: #ff5000;
    font-size: 18px;
    font-weight: bold;
  }
}

.location-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .left {
    flex: 1;
    .address { font-size: 14px; font-weight: bold; color: #333; margin-bottom: 4px; }
    .distance { font-size: 12px; color: #999; }
  }
  
  .right {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-left: 16px;
    border-left: 1px solid #eee;
    min-width: 60px;
    
    .action-text {
      font-size: 10px;
      color: #1989fa;
      margin-top: 2px;
    }
  }
}

.coupon-section {
  .coupon-row {
    display: flex;
    align-items: center;
    gap: 10px;
    
    .label {
      font-size: 14px;
      font-weight: bold;
      color: #333;
    }
    
    .tags {
      flex: 1;
      display: flex;
      gap: 6px;
      
      .coupon-tag {
        font-size: 10px;
        color: #ff5000;
        background: rgba(255, 80, 0, 0.1);
        padding: 2px 6px;
        border-radius: 4px;
        border: 1px solid rgba(255, 80, 0, 0.2);
      }
    }
  }
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  .item-card {
    border: 1px solid #f5f5f5;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
    
    &.active {
      border-color: #ff5000;
      background-color: #fffbf8;
      
      .check-icon {
        position: absolute;
        top: 0;
        right: 0;
        background: #ff5000;
        width: 20px;
        height: 18px;
        border-bottom-left-radius: 8px;
        border-top-right-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    
    &.disabled {
      opacity: 0.6;
      background: #f9f9f9;
      pointer-events: none;
    }
    
    .item-main {
      .name {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        margin-bottom: 4px;
      }
      .stock-tag {
        font-size: 10px;
        color: #ff5000;
        background: rgba(255, 80, 0, 0.08);
        display: inline-block;
        padding: 1px 4px;
        border-radius: 4px;
      }
    }
    
    .price-box {
      text-align: right;
      
      .currency { font-size: 12px; color: #ff5000; font-weight: bold; }
      .price { font-size: 20px; color: #ff5000; font-weight: bold; }
      .original { 
        font-size: 12px; 
        color: #999; 
        text-decoration: line-through;
        margin-left: 6px;
      }
    }
  }
}

.facilities-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  
  .fac-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #666;
    font-size: 12px;
    
    .van-icon {
      font-size: 20px;
      color: #333;
    }
  }
}

.intro-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  text-align: justify;
}

.price-estimate {
  flex: 1;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  .top-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
    
    .label {
      font-size: 12px;
      color: #333;
    }
    
    .value {
      color: #ff5000;
      font-size: 20px;
      font-weight: bold;
    }
  }
  
  .sub-row {
    font-size: 10px;
    color: #ff5000;
  }
}
</style>