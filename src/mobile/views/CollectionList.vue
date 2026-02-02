<template>
  <div class="collection-list-page">
    <van-nav-bar :title="pageTitle" left-arrow @click-left="router.back()" fixed placeholder />
    
    <div class="list-container">
      <van-empty v-if="venues.length === 0" description="暂无相关记录" />
      
      <van-cell-group inset v-for="venue in venues" :key="venue.id" class="venue-card" @click="goDetail(venue.id)">
        <div class="venue-content">
          <van-image :src="venue.image" width="90" height="70" radius="4" fit="cover" />
          <div class="info">
            <div class="name">{{ venue.name }}</div>
            <div class="tags">
              <van-tag plain type="danger" v-for="tag in venue.tags" :key="tag" style="margin-right: 4px">{{ tag }}</van-tag>
            </div>
            <div class="price-row">
              <span class="price">¥{{ venue.price }}<span class="unit">起</span></span>
              <span class="distance">{{ venue.distance }}</span>
            </div>
            <div class="location">
              <van-icon name="location-o" /> {{ venue.district }}
            </div>
          </div>
        </div>
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMockStore } from '../../stores/mock';

const route = useRoute();
const router = useRouter();
const store = useMockStore();

const type = ref('collection'); // collection or history

onMounted(() => {
  type.value = route.query.type || 'collection';
});

const pageTitle = computed(() => {
  return type.value === 'collection' ? '我的收藏' : '浏览足迹';
});

const venues = computed(() => {
  let ids = [];
  if (type.value === 'collection') {
    ids = store.userAssets.favorites;
  } else {
    ids = store.userAssets.history;
  }
  
  // 根据ID列表从 venues 中获取完整信息
  // 保持 ids 的顺序
  return ids.map(id => store.venues.find(v => v.id === id)).filter(v => !!v);
});

const goDetail = (id) => {
  router.push(`/mobile/detail/${id}`);
};
</script>

<style lang="scss" scoped>
.collection-list-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.list-container {
  padding-top: 12px;
}

.venue-card {
  margin-bottom: 12px;
  
  .venue-content {
    display: flex;
    padding: 12px;
    gap: 12px;
    
    .info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      .name {
        font-size: 15px;
        font-weight: 600;
        color: #333;
      }
      
      .price-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        
        .price {
          color: #ff5000;
          font-size: 16px;
          font-weight: bold;
          .unit {
            font-size: 12px;
            font-weight: normal;
          }
        }
        
        .distance {
          font-size: 12px;
          color: #999;
        }
      }
      
      .location {
        font-size: 12px;
        color: #999;
        margin-top: 4px;
      }
    }
  }
}
</style>