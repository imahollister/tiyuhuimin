<template>
  <div class="detail-page" v-if="venue">
    <!-- Immersive Header -->
    <div class="nav-header" :class="{ 'scrolled': scrollY > 50 }">
      <van-icon name="arrow-left" size="24" :color="headerIconColor" @click="router.back()" />
      <div class="nav-title" :style="{ opacity: scrollY > 50 ? 1 : 0 }">{{ venue.name }}</div>
      <van-icon :name="isFavorited ? 'star' : 'star-o'" :color="isFavorited ? '#ff5000' : headerIconColor" size="24" @click="toggleFavorite" />
    </div>
    
    <!-- Hero Section -->
    <div class="hero-section">
      <van-image :src="venue.image" width="100%" height="280" fit="cover" />
      <div class="hero-mask"></div>
      <div class="hero-content">
        <h1 class="venue-title">{{ venue.name }}</h1>
        <div class="venue-tags">
          <van-tag type="primary" size="medium" v-if="venue.venueType">{{ venue.venueType }}</van-tag>
          <div class="rating">
            <van-icon name="star" color="#ff9800" />
            <span>{{ venue.score }}分</span>
          </div>
        </div>
      </div>
    </div>

    <div class="main-container">
      <!-- Info Card -->
      <div class="info-card">
        <div class="info-item" @click="openMap">
          <div class="left">
            <div class="address">{{ venue.address || venue.district }}</div>
            <div class="distance">距您 2.5km</div>
          </div>
          <van-icon name="guide-o" size="24" color="#1989fa" />
        </div>
        <div class="divider"></div>
        <div class="info-item">
          <div class="left">
            <div class="time-label">营业时间</div>
            <div class="time-value">{{ venue.businessHours || '09:00 - 22:00' }}</div>
          </div>
          <van-icon name="phone-o" size="24" color="#333" @click="callPhone" />
        </div>
      </div>

      <!-- Main Tabs -->
      <van-tabs v-model:active="activeMainTab" sticky offset-top="50" class="content-tabs" background="#f7f8fa" color="#1989fa" title-active-color="#1989fa">
        <van-tab title="在线预订" name="booking">
          <div class="tab-pane">
            
            <!-- Case 1: Main Venue (Sub-venues List) -->
            <div v-if="venue.venueLevel === 'main'" class="sub-venue-list">
              <div class="sub-venue-item" v-for="sub in subVenues" :key="sub.id" @click="goToSubVenue(sub)">
                <van-image :src="sub.image" width="100" height="75" radius="8" fit="cover" />
                <div class="sub-info">
                  <div class="name">{{ sub.name }}</div>
                  <div class="tags">
                    <span v-for="tag in sub.tags" :key="tag" class="mini-tag">{{ tag }}</span>
                  </div>
                  <div class="price-row">
                    <span class="price">¥{{ sub.price }}<span class="unit">起</span></span>
                    <van-button size="mini" round type="primary">预订</van-button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Case 2: Sub/Standalone Venue -->
            <div v-else>
              <!-- Booking Calendar/Grid -->
              <div class="booking-module" v-if="displayFields && displayFields.length">
                <div class="module-title">场地选择</div>
                
                <!-- Date Scroll -->
                <div class="date-scroll-wrapper">
                  <div class="date-item" 
                       v-for="(date, idx) in dateList" 
                       :key="idx"
                       :class="{ active: activeDateIndex === idx }"
                       @click="activeDateIndex = idx">
                    <div class="week">{{ date.weekLabel }}</div>
                    <div class="day">{{ date.dateLabel }}</div>
                  </div>
                </div>

                <!-- Grid -->
                <div class="grid-container">
                  <div class="grid-header">
                    <div class="corner">场地\时间</div>
                    <div class="time-row">
                      <div class="time-col" v-for="slot in displaySlots" :key="slot.time">{{ slot.time }}</div>
                    </div>
                  </div>
                  <div class="grid-body">
                    <div class="field-row" v-for="field in displayFields" :key="field.id">
                      <div class="field-name">{{ field.name }}</div>
                      <div class="slots-row">
                        <div class="slot-item" 
                             v-for="(slot, sIdx) in displaySlots" 
                             :key="sIdx"
                             :class="getSlotClass(field, slot)"
                             @click="handleSlotClick(field, slot)">
                          <div class="price">¥{{ slot.price }}</div>
                          <div class="status" v-if="getSlotClass(field, slot).selected">已选</div>
                          <div class="status" v-else>可订</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Other Items List -->
              <div class="items-module" v-if="ticketItems.length || serviceItems.length">
                <!-- Tickets -->
                <div v-if="ticketItems.length" class="group-section">
                  <div class="module-title">门票产品</div>
                  <div class="product-card" v-for="item in ticketItems" :key="item.id">
                     <div class="prod-left">
                       <div class="prod-name">{{ item.name }}</div>
                       <div class="prod-desc">{{ item.description || '暂无描述' }}</div>
                       <div class="prod-tags"><span class="tag green">门票</span></div>
                     </div>
                     <div class="prod-right">
                       <div class="price">¥{{ item.price }}</div>
                       <van-button size="small" round color="#ff9800" @click="buyTicket(item)">预订</van-button>
                     </div>
                  </div>
                </div>

                <!-- Services -->
                <div v-if="serviceItems.length" class="group-section">
                  <div class="module-title">培训课程</div>
                  <div class="product-card" v-for="item in serviceItems" :key="item.id">
                     <div class="prod-left">
                       <div class="prod-name">{{ item.name }}</div>
                       <div class="prod-desc">{{ item.description || '线下约课' }}</div>
                       <div class="prod-tags">
                         <span class="tag blue">培训</span>
                         <span class="tag gray" v-if="item.duration">{{ item.duration }}</span>
                       </div>
                     </div>
                     <div class="prod-right">
                       <div class="price">¥{{ item.price }}</div>
                       <van-button size="small" round color="#1989fa" @click="buyTicket(item)">购买</van-button>
                     </div>
                  </div>
                </div>
              </div>
              
              <div v-if="(!displayFields || !displayFields.length) && !ticketItems.length && !serviceItems.length" class="empty-state">
                <van-empty description="暂无预订信息" />
              </div>

            </div>
          </div>
        </van-tab>

        <van-tab title="场馆详情" name="intro">
          <div class="tab-pane">
            <div class="intro-card">
              <div class="intro-title">场馆介绍</div>
              <div class="intro-text">{{ venue.intro || '暂无介绍' }}</div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <!-- Floating Action Bar -->
    <div class="action-bar-placeholder" v-if="venue.venueLevel !== 'main' && selectedSlots.length"></div>
    <div class="floating-bar" v-if="venue.venueLevel !== 'main' && selectedSlots.length">
      <div class="bar-content">
        <div class="left-info">
          <div class="total">¥<span class="num">{{ totalPrice }}</span></div>
          <div class="detail">已选 {{ selectedSlots.length }} 个时段</div>
        </div>
        <div class="right-btn" @click="submitOrder">立即预订</div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMockStore } from '../../stores/mock';
import { showToast } from 'vant';

const route = useRoute();
const router = useRouter();
const store = useMockStore();

const venue = ref(null);
const subVenues = ref([]);
const activeMainTab = ref('booking');
const activeDateIndex = ref(0);
const selectedSlots = ref([]);
const scrollY = ref(0);

// Scroll Listener for Header
const handleScroll = () => {
  scrollY.value = window.scrollY;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  const id = parseInt(route.params.id);
  venue.value = store.venues.find(v => v.id === id);
  if (!venue.value) {
    showToast('场馆不存在');
    router.back();
    return;
  }
  store.addToHistory(venue.value.id);
  if (venue.value.venueLevel === 'main') {
    subVenues.value = store.venues.filter(v => v.pid === venue.value.id);
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const headerIconColor = computed(() => scrollY.value > 50 ? '#333' : '#fff');
const isFavorited = computed(() => venue.value && store.userAssets.favorites.includes(venue.value.id));

const toggleFavorite = () => {
  if (!venue.value) return;
  const isAdded = store.toggleFavorite(venue.value.id);
  showToast(isAdded ? '收藏成功' : '已取消收藏');
};

const ticketItems = computed(() => venue.value?.items?.filter(i => i.type === 'ticket') || []);
const serviceItems = computed(() => venue.value?.items?.filter(i => i.type === 'service') || []);
const displayFields = computed(() => {
  if (venue.value?.fields?.length) return venue.value.fields;
  const bookingItem = venue.value?.items?.find(i => i.type === 'booking');
  return bookingItem ? bookingItem.fields : [];
});
const displaySlots = computed(() => {
  if (venue.value?.slots?.length) return venue.value.slots;
  const bookingItem = venue.value?.items?.find(i => i.type === 'booking');
  return bookingItem ? bookingItem.slots : [];
});

const dateList = computed(() => {
  const list = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const weekMap = ['周日','周一','周二','周三','周四','周五','周六'];
    list.push({ 
      weekLabel: i === 0 ? '今天' : weekMap[d.getDay()], 
      dateLabel: `${month}/${date}`,
      value: d.toISOString().split('T')[0] 
    });
  }
  return list;
});

const openMap = () => showToast('打开地图导航...');
const callPhone = () => showToast(`拨打 ${venue.value.phone}`);

const goToSubVenue = (sub) => {
  router.push(`/mobile/detail/${sub.id}`).then(() => {
    venue.value = sub;
    selectedSlots.value = [];
    activeDateIndex.value = 0;
    subVenues.value = [];
    window.scrollTo(0, 0);
  });
};

const getSlotClass = (field, slot) => {
  const isSelected = selectedSlots.value.some(s => s.fieldId === field.id && s.time === slot.time);
  return { selected: isSelected };
};

const handleSlotClick = (field, slot) => {
  const index = selectedSlots.value.findIndex(s => s.fieldId === field.id && s.time === slot.time);
  if (index !== -1) {
    selectedSlots.value.splice(index, 1);
  } else {
    if (selectedSlots.value.length >= 4) {
      showToast('一次最多选择4个时段');
      return;
    }
    selectedSlots.value.push({
      fieldId: field.id,
      fieldName: field.name,
      time: slot.time,
      price: slot.price
    });
  }
};

const totalPrice = computed(() => selectedSlots.value.reduce((sum, s) => sum + s.price, 0));

const submitOrder = () => {
  if (!selectedSlots.value.length) return;
  const orderData = {
    venueId: venue.value.id,
    venueName: venue.value.name,
    date: dateList.value[activeDateIndex.value].value,
    items: selectedSlots.value,
    totalPrice: totalPrice.value
  };
  sessionStorage.setItem('orderDraft', JSON.stringify(orderData));
  router.push('/mobile/order-confirm');
};

const buyTicket = (item) => {
  sessionStorage.setItem('orderDraft', JSON.stringify({
    venueId: venue.value.id,
    venueName: venue.value.name,
    itemId: item.id,
    itemName: item.name,
    price: item.price
  }));
  router.push('/mobile/order-confirm');
};
</script>

<style lang="scss" scoped>
.detail-page {
  background: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 20px;
}

// 1. Navigation Header
.nav-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  z-index: 100;
  transition: all 0.3s ease;
  
  &.scrolled {
    background: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  }
  
  .nav-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    transition: opacity 0.3s;
  }
}

// 2. Hero Section
.hero-section {
  position: relative;
  height: 280px;
  
  .hero-mask {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.8) 100%);
  }
  
  .hero-content {
    position: absolute;
    bottom: 40px;
    left: 20px;
    right: 20px;
    color: #fff;
    
    .venue-title {
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 8px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    
    .venue-tags {
      display: flex;
      align-items: center;
      gap: 10px;
      
      .rating {
        display: flex;
        align-items: center;
        gap: 4px;
        background: rgba(255,255,255,0.2);
        backdrop-filter: blur(4px);
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
      }
    }
  }
}

// 3. Main Container (overlaps hero)
.main-container {
  position: relative;
  margin-top: -20px;
  border-radius: 20px 20px 0 0;
  background: #f7f8fa;
  overflow: hidden;
  z-index: 10;
}

// 4. Info Card
.info-card {
  background: #fff;
  border-radius: 16px;
  margin: 16px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  
  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    
    .left {
      flex: 1;
      .address { font-size: 15px; font-weight: 600; color: #333; margin-bottom: 4px; }
      .distance, .time-label { font-size: 12px; color: #999; }
      .time-value { font-size: 14px; color: #333; font-weight: 500; }
    }
  }
  .divider { height: 1px; background: #f5f5f5; margin: 8px 0; }
}

// 5. Tabs & Content
::v-deep(.van-tabs__wrap) { border-radius: 0 0 16px 16px; }
.tab-pane { padding: 16px; }

// Sub-venues
.sub-venue-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.sub-venue-item {
  display: flex;
  background: #fff;
  padding: 12px;
  border-radius: 12px;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  
  .sub-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    .name { font-weight: bold; font-size: 16px; color: #333; }
    .tags { display: flex; gap: 4px; }
    .mini-tag { font-size: 10px; background: #f0f8ff; color: #1989fa; padding: 2px 4px; border-radius: 4px; }
    
    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .price { color: #ff5000; font-size: 16px; font-weight: bold; .unit { font-size: 12px; font-weight: normal; } }
    }
  }
}

// Booking Module
.booking-module {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.03);
}
.module-title { font-size: 16px; font-weight: 700; color: #333; margin-bottom: 12px; border-left: 4px solid #1989fa; padding-left: 8px; }

// Date Scroll
.date-scroll-wrapper {
  display: flex;
  overflow-x: auto;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 4px;
  
  .date-item {
    flex-shrink: 0;
    width: 60px;
    height: 64px;
    background: #f7f8fa;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    transition: all 0.2s;
    
    .week { font-size: 12px; color: #666; margin-bottom: 4px; }
    .day { font-size: 14px; font-weight: 600; color: #333; }
    
    &.active {
      background: #e6f7ff;
      border-color: #1989fa;
      .week, .day { color: #1989fa; }
    }
  }
}

// New Grid Style
.grid-container {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}
.grid-header {
  display: flex;
  background: #f9f9f9;
  border-bottom: 1px solid #eee;
  .corner { width: 80px; flex-shrink: 0; padding: 12px 0; text-align: center; font-size: 12px; color: #999; border-right: 1px solid #eee; }
  .time-row { flex: 1; display: flex; overflow-x: hidden; } // Hidden for simplicity here, ideally sync scroll
  .time-col { flex: 1; min-width: 70px; text-align: center; padding: 12px 0; font-size: 12px; color: #666; border-right: 1px solid #eee; }
}
.grid-body {
  overflow-x: auto;
  .field-row {
    display: flex;
    border-bottom: 1px solid #eee;
    &:last-child { border-bottom: none; }
    .field-name { width: 80px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: #fff; font-size: 13px; font-weight: 600; border-right: 1px solid #eee; position: sticky; left: 0; z-index: 2; }
    .slots-row { display: flex; }
    .slot-item {
      width: 70px;
      height: 56px;
      flex-shrink: 0;
      border-right: 1px solid #eee;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      
      .price { font-size: 13px; color: #ff5000; font-weight: 600; }
      .status { font-size: 10px; color: #999; margin-top: 2px; }
      
      &.selected {
        background: #1989fa;
        .price, .status { color: #fff; }
      }
      &:active { opacity: 0.8; }
    }
  }
}

// Product Cards
.product-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  
  .prod-left {
    flex: 1;
    margin-right: 12px;
    .prod-name { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 6px; }
    .prod-desc { font-size: 12px; color: #999; margin-bottom: 8px; }
    .prod-tags { display: flex; gap: 6px; }
    .tag { font-size: 10px; padding: 2px 6px; border-radius: 4px; }
    .tag.green { background: #e8f5e9; color: #4caf50; }
    .tag.blue { background: #e3f2fd; color: #2196f3; }
    .tag.gray { background: #f5f5f5; color: #999; }
  }
  .prod-right {
    text-align: right;
    .price { font-size: 18px; color: #ff5000; font-weight: bold; margin-bottom: 8px; }
  }
}

// Intro Card
.intro-card {
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  min-height: 200px;
  .intro-title { font-size: 18px; font-weight: bold; margin-bottom: 16px; }
  .intro-text { font-size: 14px; color: #666; line-height: 1.8; text-align: justify; }
}

// Floating Bar
.action-bar-placeholder { height: 70px; }
.floating-bar {
  position: fixed;
  bottom: 20px;
  left: 16px;
  right: 16px;
  height: 60px;
  background: #333;
  border-radius: 30px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  padding: 0 6px 0 24px;
  z-index: 999;
  
  .bar-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .left-info {
      color: #fff;
      .total { font-size: 14px; .num { font-size: 20px; font-weight: bold; } }
      .detail { font-size: 10px; color: #999; }
    }
    
    .right-btn {
      background: linear-gradient(135deg, #ff6034, #ee0a24);
      color: #fff;
      padding: 10px 24px;
      border-radius: 24px;
      font-weight: 600;
      font-size: 14px;
    }
  }
}
</style>
