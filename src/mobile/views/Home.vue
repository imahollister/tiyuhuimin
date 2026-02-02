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
      <!-- Banner -->
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

    <!-- 领券中心入口 -->
    <div class="coupon-entry" @click="showCouponPopup = true">
      <div class="left">
        <div class="icon-box">
          <van-icon name="coupon" size="24" color="#ff5000" />
        </div>
        <div class="text">
          <div class="title">领券中心</div>
          <div class="desc">今日还有 <span style="color: #ff5000; font-weight: bold;">3</span> 张好券待领取</div>
        </div>
      </div>
      <van-button size="small" round color="linear-gradient(to right, #ff6034, #ee0a24)">立即领取</van-button>
    </div>

    <!-- 金刚区分类 -->
    <div class="category-grid">
      <div class="grid-item" v-for="cat in store.categories" :key="cat.id" @click="onCategoryClick(cat)">
        <div class="icon-wrapper">
          <van-image :src="cat.icon" width="40" height="40" round />
        </div>
        <span class="label">{{ cat.name }}</span>
      </div>
    </div>

    <!-- 筛选栏 -->
    <van-sticky offset-top="98">
      <van-dropdown-menu>
        <van-dropdown-item v-model="area" :options="areaOptions" />
        <van-dropdown-item v-model="sort" :options="sortOptions" />
      </van-dropdown-menu>
    </van-sticky>

    <!-- 场馆列表 -->
    <div class="venue-list">
      <div class="section-header">
        <div class="title">推荐场馆</div>
        <div class="more">查看全部 <van-icon name="arrow" /></div>
      </div>
      
      <van-skeleton title avatar :row="3" :loading="loading" v-for="n in 3" :key="n" style="margin-bottom: 12px; background: #fff; padding: 12px; border-radius: 12px;">
      </van-skeleton>

      <div v-if="!loading">
        <div v-for="venue in filteredVenues" :key="venue.id" class="venue-card" @click="goDetail(venue.id)">
          <div class="venue-image">
            <van-image :src="venue.image" width="100%" height="100%" fit="cover" />
            <div class="badges-overlay">
               <van-tag type="danger" v-if="venue.isHot" class="badge">热门</van-tag>
               <van-tag type="primary" v-if="venue.isHuimin" class="badge">惠民</van-tag>
            </div>
            <div class="tag-overlay" v-if="venue.tags.includes('惠民卡')">惠民卡可用</div>
          </div>
          <div class="venue-info">
            <div class="row-1">
              <div class="name-box">
                <div class="name">{{ venue.name }}</div>
                <van-tag plain type="primary" size="mini" v-if="venue.venueType">{{ venue.venueType }}</van-tag>
              </div>
              <div class="distance">{{ venue.distance }}</div>
            </div>
            <div class="row-2">
              <div class="score">
                <van-icon name="star" color="#ff9800" size="12" />
                <span>{{ venue.score }}分</span>
              </div>
              <div class="tags">
                <van-tag plain color="#ff976a" text-color="#ff5000" v-for="tag in venue.tags.slice(0,2)" :key="tag" style="margin-right: 4px;">{{ tag }}</van-tag>
              </div>
            </div>
            <div class="row-3">
              <div class="price">
                <span class="symbol">¥</span>
                <span class="num">{{ venue.price }}</span>
                <span class="unit">起</span>
              </div>
              <van-button size="mini" type="primary" round>预订</van-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- 领券弹窗 -->
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
               <van-button 
                 size="small" 
                 round 
                 color="linear-gradient(to right, #ff6034, #ee0a24)" 
                 @click="onExchange(coupon)"
                 :disabled="coupon.hasClaimed"
               >
                 {{ coupon.hasClaimed ? '已领取' : '立即领取' }}
               </van-button>
             </div>
          </div>
          <van-empty v-if="availableCoupons.length === 0" description="暂无优惠券可领" />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMockStore } from '../../stores/mock';
import { showToast } from 'vant';

const router = useRouter();
const store = useMockStore();

const area = ref(0);
const sort = ref(0);
const showCouponPopup = ref(false);
const searchValue = ref('');
const loading = ref(false);
const activeCategory = ref(null);

const onSearch = () => {
  if (!searchValue.value.trim()) {
    showToast('请输入搜索关键词');
    return;
  }
  // 简单的滚动到列表区域（因为列表已经是 computed 自动过滤的了，如果我们在 filteredVenues 里加了 search 逻辑）
  // 但 filteredVenues 目前只处理了 area/sort/category。我们需要加上 keyword。
  // 这里其实不需要做什么，因为 v-model 绑定了 searchValue，我们只需要修改 filteredVenues
};

const onCategoryClick = (cat) => {
  if (activeCategory.value === cat.id) {
    activeCategory.value = null; // 取消选中
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

// 场馆筛选逻辑
const filteredVenues = computed(() => {
  let list = [...store.venues];
  
  // 关键词搜索
  if (searchValue.value.trim()) {
    const keyword = searchValue.value.trim().toLowerCase();
    list = list.filter(v => v.name.toLowerCase().includes(keyword) || (v.items && v.items.some(i => i.name.toLowerCase().includes(keyword))));
  }

  // 区域筛选
  if (area.value !== 0) {
    const areaMap = { 1: '工业园区', 2: '姑苏区', 3: '高新区' };
    const targetArea = areaMap[area.value];
    if (targetArea) {
      list = list.filter(v => v.district === targetArea);
    }
  }

  // 分类筛选
  if (activeCategory.value) {
    const cat = store.categories.find(c => c.id === activeCategory.value);
    if (cat && cat.name !== '全部') {
      // 筛选包含该分类项目的场馆
      list = list.filter(v => v.items && v.items.some(i => i.name.includes(cat.name)));
    }
  }
  
  // 排序
  if (sort.value === 1) {
    // 离我最近 (简单按 distance 字符串排序，实际应解析数值)
    list.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  } else if (sort.value === 2) {
    // 价格最低
    list.sort((a, b) => a.price - b.price);
  } else {
    // 智能排序 (默认按评分降序)
    list.sort((a, b) => b.score - a.score);
  }
  
  return list;
});

// 可领取优惠券
const availableCoupons = computed(() => {
  return store.availableCoupons.map(c => {
    // 检查是否已领取
    const hasClaimed = store.userAssets.coupons.some(uc => uc.name === c.name);
    
    return {
      id: c.id,
      name: c.name,
      condition: `满${c.minSpend}元可用`,
      startAt: Date.now() / 1000,
      endAt: Date.now() / 1000 + 30 * 24 * 3600, // 默认有效期30天
      description: c.desc,
      reason: '',
      value: c.value * 100,
      valueDesc: c.value,
      unitDesc: '元',
      hasClaimed // 新增状态
    };
  });
});

const onExchange = (coupon) => {
  // 模拟领券
  const template = store.availableCoupons.find(c => c.id === coupon.id);
  if (template) {
    // 检查是否已领过 (简化逻辑：每种券每人限领一张)
    const hasClaimed = store.userAssets.coupons.some(c => c.name === template.name); // 用名字简单判断
    if (hasClaimed) {
      showToast('您已领取过该优惠券');
      return;
    }

    const newCoupon = {
      id: Date.now(), // 生成新ID
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
    // showCouponPopup.value = false; // 不关闭弹窗，允许继续领
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
  ::v-deep(.van-nav-bar__content) {
    background: #fff;
  }
}

.banner-area {
  padding: 12px;
  background: #fff;
  margin-bottom: 10px;
  
  .my-swipe {
    border-radius: 8px;
    overflow: hidden;
    height: 160px;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
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
  box-shadow: 0 2px 8px rgba(255, 80, 0, 0.05);
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
    }
    
    .text {
      .title {
        font-size: 15px;
        font-weight: bold;
        color: #333;
        margin-bottom: 2px;
      }
      .desc {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  margin: 0 12px 12px;
  border-radius: 12px;
  padding: 16px 0;
  
  .grid-item {
    width: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 12px;
    
    .icon-wrapper {
      margin-bottom: 6px;
      transition: transform 0.2s;
      &:active {
        transform: scale(0.95);
      }
    }
    
    .label {
      font-size: 12px;
      color: #333;
    }
  }
}

.venue-list {
  padding: 0 12px;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      position: relative;
      padding-left: 10px;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 16px;
        background: #1989fa;
        border-radius: 2px;
      }
    }
    
    .more {
      font-size: 12px;
      color: #999;
      display: flex;
      align-items: center;
    }
  }
}

.venue-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
  
  .venue-image {
    height: 140px;
    position: relative;
    
    .tag-overlay {
      position: absolute;
      top: 10px;
      left: 10px;
      background: rgba(0,0,0,0.6);
      color: #fff;
      font-size: 10px;
      padding: 4px 8px;
      border-radius: 4px;
      backdrop-filter: blur(4px);
    }
    
    .badges-overlay {
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
      gap: 4px;
      
      .badge {
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
    }
  }
  
  .venue-info {
    padding: 12px;
    
    .row-1 {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
      
      .name-box {
        display: flex;
        align-items: center;
        gap: 6px;
        flex: 1;
        margin-right: 10px;
        
        .name {
          font-size: 16px;
          font-weight: bold;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .distance {
        font-size: 12px;
        color: #999;
        flex-shrink: 0;
      }
    }
    
    .row-2 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      
      .score {
        display: flex;
        align-items: center;
        gap: 2px;
        font-size: 12px;
        color: #666;
        font-weight: 500;
      }
    }
    
    .row-3 {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      
      .price {
        color: #ff5000;
        
        .symbol { font-size: 12px; font-weight: bold; }
        .num { font-size: 20px; font-weight: bold; line-height: 1; }
        .unit { font-size: 12px; color: #999; margin-left: 2px; }
      }
    }
  }
}

.coupon-popup {
  padding-top: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .title {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
    flex-shrink: 0;
  }
  
  .coupon-list-custom {
    flex: 1;
    overflow-y: auto;
    padding: 0 16px 20px;
  }
  
  .coupon-item-custom {
    display: flex;
    background: #fff0eb;
    border-radius: 8px;
    margin-bottom: 12px;
    padding: 12px;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      left: -6px;
      top: 50%;
      transform: translateY(-50%);
      width: 12px;
      height: 12px;
      background: #fff;
      border-radius: 50%;
    }
    
    &::after {
      content: '';
      position: absolute;
      right: -6px;
      top: 50%;
      transform: translateY(-50%);
      width: 12px;
      height: 12px;
      background: #fff;
      border-radius: 50%;
    }
    
    .left {
      width: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #ff5000;
      border-right: 1px dashed rgba(255, 80, 0, 0.3);
      margin-right: 12px;
      
      .value {
        font-weight: bold;
        .symbol { font-size: 14px; }
        .num { font-size: 24px; }
      }
      .cond {
        font-size: 10px;
        opacity: 0.8;
      }
    }
    
    .middle {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      
      .name {
        font-size: 15px;
        font-weight: bold;
        color: #333;
        margin-bottom: 4px;
      }
      .desc {
        font-size: 12px;
        color: #666;
        margin-bottom: 4px;
      }
      .time {
        font-size: 10px;
        color: #999;
      }
    }
    
    .right {
      display: flex;
      align-items: center;
      padding-left: 8px;
    }
  }
}
</style>