<template>
  <div class="home-page">
    <van-sticky>
      <div class="home-header-fixed">
        <van-nav-bar title="苏州市体育惠民" :border="false" />
        <van-search
          v-model="searchValue"
          shape="round"
          background="#fff"
          placeholder="搜索场馆、项目"
          @search="onSearch"
        />
      </div>
    </van-sticky>
    
    <div class="home-content">
      <div class="banner-area">
        <van-swipe class="my-swipe" :autoplay="4000" indicator-color="#fff">
          <van-swipe-item>
            <img src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=people%20playing%20badminton%20in%20a%20modern%20gym%2C%20bright%20lighting%2C%20dynamic%20action%2C%20high%20quality&image_size=landscape_16_9" />
          </van-swipe-item>
          <van-swipe-item>
            <img src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=swimming%20pool%20with%20lanes%2C%20blue%20water%2C%20indoor%20sports%20center&image_size=landscape_16_9" />
          </van-swipe-item>
          <van-swipe-item>
            <img src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=outdoor%20running%20track%20in%20park%2C%20sunny%20day%2C%20green%20trees&image_size=landscape_16_9" />
          </van-swipe-item>
        </van-swipe>
      </div>

      <div class="coupon-entry" @click="showCouponPopup = true">
        <div class="left">
          <div class="icon-box">
            <i class="ri-coupon-3-fill"></i>
          </div>
          <div class="text">
            <div class="title">领券中心</div>
            <div class="desc">今日还有 <span style="color: #ff5000; font-weight: bold;">3</span> 张好券待领取</div>
          </div>
        </div>
        <van-button size="small" round color="linear-gradient(to right, #ff6034, #ee0a24)">立即领取</van-button>
      </div>

      <div class="category-grid">
        <div class="grid-item" v-for="cat in store.categories" :key="cat.id" @click="onCategoryClick(cat)">
          <div class="icon-wrapper">
            <van-image :src="cat.icon" width="40" height="40" round />
          </div>
          <span class="label">{{ cat.name }}</span>
        </div>
      </div>

      <van-sticky offset-top="98">
        <van-dropdown-menu>
          <van-dropdown-item v-model="area" :options="areaOptions" />
          <van-dropdown-item v-model="sort" :options="sortOptions" />
        </van-dropdown-menu>
      </van-sticky>

      <div class="venue-list">
        <div class="section-header">
          <div class="title">推荐场馆</div>
          <div class="more">查看全部 <i class="ri-arrow-right-s-line"></i></div>
        </div>
        
        <div v-for="venue in filteredVenues" :key="venue.id" class="venue-card" @click="goDetail(venue.id)">
          <div class="venue-image">
            <van-image :src="venue.image" width="100%" height="100%" fit="cover" />
            <div class="badges-overlay">
               <van-tag type="danger" v-if="venue.isHot" class="badge">热门</van-tag>
               <van-tag type="primary" v-if="venue.isHuimin" class="badge">惠民</van-tag>
            </div>
          </div>
          <div class="venue-info">
            <div class="row-1">
              <div class="name">{{ venue.name }}</div>
              <div class="distance">{{ venue.distance }}</div>
            </div>
            <div class="row-2">
              <div class="score">
                <i class="ri-star-fill" style="color: #ff9800; font-size: 14px;"></i>
                <span>{{ venue.score }}分</span>
              </div>
              <div class="tags" v-if="venue.tags && venue.tags.length">
                <van-tag plain type="primary" v-for="tag in venue.tags.slice(0, 3)" :key="tag" style="margin-left: 5px">{{ tag }}</van-tag>
              </div>
            </div>
            <div class="row-3">
              <div class="price">
                <span class="symbol">¥</span>
                <span class="num">{{ venue.price }}</span>
                <span class="unit">起</span>
              </div>
              <van-button size="small" type="primary" round class="book-btn">预订</van-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <van-popup v-model:show="showCouponPopup" position="bottom" round style="height: 60%">
      <div class="coupon-popup">
        <div class="title">领券中心</div>
        <div class="coupon-list-custom">
          <div class="coupon-item-custom" v-for="coupon in availableCoupons" :key="coupon.id">
             <div class="left">
               <div class="value">
                 <span class="symbol">¥</span><span class="num">{{ coupon.valueDesc }}</span>
               </div>
               <div class="cond">{{ coupon.condition }}</div>
             </div>
             <div class="middle">
               <div class="name">{{ coupon.name }}</div>
               <div class="desc">{{ coupon.description }}</div>
               <div class="time">有效期至: {{ new Date(coupon.endAt * 1000).toLocaleDateString() }}</div>
             </div>
             <div class="right">
               <van-button size="small" round color="linear-gradient(to right, #ff6034, #ee0a24)" @click="onExchange(coupon)" :disabled="coupon.hasClaimed">
                 {{ coupon.hasClaimed ? '已领取' : '立即领取' }}
               </van-button>
             </div>
          </div>
        </div>
      </div>
    </van-popup>
    
    <Tabbar />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useMockStore } from '../../stores/mock';
import { showToast } from 'vant';
import Tabbar from '../components/Tabbar.vue';

const router = useRouter();
const store = useMockStore();

const area = ref(0);
const sort = ref(0);
const showCouponPopup = ref(false);
const searchValue = ref('');
const activeCategory = ref(null);

// 检测是否在 iframe 中（预览模式）
const isInPreview = computed(() => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return false;
  }
});

const onSearch = () => {
  if (!searchValue.value.trim()) {
    showToast('请输入搜索关键词');
    return;
  }
};

const onCategoryClick = (cat) => {
  if (activeCategory.value === cat.id) {
    activeCategory.value = null;
    showToast('已取消筛选');
  } else {
    activeCategory.value = cat.id;
    showToast(`已筛选: ${cat.name}`);
  }
};

const areaOptions = [
  { text: '全苏州', value: 0 },
  { text: '工业园区', value: 1 },
  { text: '姑苏区', value: 2 },
  { text: '高新区', value: 3 },
];

const sortOptions = [
  { text: '智能排序', value: 0 },
  { text: '离我最近', value: 1 },
  { text: '价格最低', value: 2 },
];

const filteredVenues = computed(() => {
  let list = [...store.venues];
  
  if (searchValue.value.trim()) {
    const keyword = searchValue.value.trim().toLowerCase();
    list = list.filter(v => v.name.toLowerCase().includes(keyword));
  }

  if (area.value !== 0) {
    const areaMap = { 1: '工业园区', 2: '姑苏区', 3: '高新区' };
    const targetArea = areaMap[area.value];
    if (targetArea) {
      list = list.filter(v => v.district === targetArea);
    }
  }

  if (sort.value === 1) {
    list.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  } else if (sort.value === 2) {
    list.sort((a, b) => a.price - b.price);
  } else {
    list.sort((a, b) => b.score - a.score);
  }
  
  return list;
});

const availableCoupons = computed(() => {
  return store.availableCoupons.map(c => {
    const hasClaimed = store.userAssets.coupons.some(uc => uc.name === c.name);
    return {
      id: c.id,
      name: c.name,
      condition: `满${c.minSpend}元可用`,
      startAt: Date.now() / 1000,
      endAt: Date.now() / 1000 + 30 * 24 * 3600,
      description: c.desc,
      value: c.value * 100,
      valueDesc: c.value,
      unitDesc: '元',
      hasClaimed
    };
  });
});

const onExchange = (coupon) => {
  const template = store.availableCoupons.find(c => c.id === coupon.id);
  if (template) {
    const hasClaimed = store.userAssets.coupons.some(c => c.name === template.name);
    if (hasClaimed) {
      showToast('您已领取过该优惠券');
      return;
    }
    const newCoupon = {
      id: Date.now(),
      name: template.name,
      value: template.value,
      minSpend: template.minSpend,
      type: template.type,
      status: 0,
      endDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      desc: template.desc
    };
    store.userAssets.coupons.unshift(newCoupon);
    showToast('领取成功');
  }
};

const goDetail = (id) => {
  router.push(`/mobile/detail/${id}`);
};
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 50px;
}

.home-header-fixed {
  background: #fff;
  z-index: 99;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
}

.banner-area {
  padding: 12px;
  background: #fff;
  margin-bottom: 10px;
  .my-swipe {
    border-radius: 8px;
    overflow: hidden;
    height: 160px;
    img { width: 100%; height: 100%; object-fit: cover; }
  }
}

.coupon-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 12px 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #fff5f0 0%, #fff 100%);
  border-radius: 12px;
  border: 1px solid rgba(255, 80, 0, 0.1);
  .left {
    display: flex;
    align-items: center;
    gap: 12px;
    .icon-box {
      width: 40px;
      height: 40px;
      background: rgba(255, 80, 0, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: #ff5000;
    }
    .title { font-size: 15px; font-weight: bold; color: #333; }
    .desc { font-size: 12px; color: #999; }
  }
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  margin: 0 12px 12px;
  border-radius: 16px;
  padding: 20px 0;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  
  .grid-item {
    width: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;
    
    .icon-wrapper {
      margin-bottom: 8px;
      transition: transform 0.2s;
      &:active { transform: scale(0.95); }
      // Add a subtle shadow to icons if transparent, but here they are images.
      // Let's add a soft glow effect
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
    }
    .label { font-size: 12px; color: #333; font-weight: 500; }
  }
}

.venue-list {
  padding: 0 12px;
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 0 4px;
    .title { font-size: 18px; font-weight: 800; color: #1a1a1a; letter-spacing: 0.5px; }
    .more { font-size: 12px; color: #999; display: flex; align-items: center; }
  }
}

.venue-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  transition: transform 0.2s;
  
  &:active { transform: scale(0.99); }

  .venue-image { 
    height: 160px; 
    position: relative; 
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 60px;
      background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
    }
  }
  
  .badges-overlay {
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
    gap: 6px;
    .badge { border-radius: 4px; padding: 2px 6px; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
  }
  
  .venue-info { padding: 16px; }
  
  .row-1 {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
    .name { font-size: 17px; font-weight: 700; color: #1a1a1a; line-height: 1.4; }
    .distance { font-size: 12px; color: #999; margin-top: 2px; background: #f5f5f5; padding: 2px 6px; border-radius: 4px; }
  }
  
  .row-2 { margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; }
  .score { 
    display: flex; align-items: center; gap: 4px; font-size: 13px; color: #333; font-weight: 600; 
    van-icon { margin-top: -1px; }
  }
  
  .row-3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid #f7f7f7;
    
    .price {
      color: #ff5000;
      display: flex; align-items: baseline;
      .symbol { font-size: 14px; font-weight: bold; margin-right: 2px; }
      .num { font-size: 22px; font-weight: 800; font-family: 'DIN Alternate', sans-serif; }
      .unit { font-size: 12px; color: #999; margin-left: 2px; font-weight: normal; }
    }
    
    .book-btn {
      padding: 0 16px;
      height: 32px;
      line-height: 30px;
      font-weight: 600;
      box-shadow: 0 4px 10px rgba(25, 137, 250, 0.3);
    }
  }
}

.coupon-popup {
  padding-top: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .title { text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 20px; }
  .coupon-list-custom { flex: 1; overflow-y: auto; padding: 0 16px 20px; }
  .coupon-item-custom {
    display: flex;
    background: #fff0eb;
    border-radius: 8px;
    margin-bottom: 12px;
    padding: 12px;
    .left {
      width: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #ff5000;
      border-right: 1px dashed rgba(255, 80, 0, 0.3);
      margin-right: 12px;
      .value { font-weight: bold; .num { font-size: 24px; } }
      .cond { font-size: 10px; opacity: 0.8; }
    }
    .middle {
      flex: 1;
      .name { font-size: 15px; font-weight: bold; color: #333; margin-bottom: 4px; }
      .desc { font-size: 12px; color: #666; margin-bottom: 4px; }
      .time { font-size: 10px; color: #999; }
    }
    .right { display: flex; align-items: center; padding-left: 8px; }
  }
}
</style>
