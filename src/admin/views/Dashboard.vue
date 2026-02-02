<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>总用户数</template>
          <div class="card-value">12,345</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>总订单数</template>
          <div class="card-value">{{ totalOrders }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>总成交额</template>
          <div class="card-value">¥{{ totalRevenue.toFixed(2) }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>入驻场馆</template>
          <div class="card-value">{{ venueCount }}</div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-card style="margin-top: 20px">
      <template #header>快捷入口</template>
      <el-button type="primary" plain @click="$router.push('/admin/venue')">场馆管理</el-button>
      <el-button type="success" plain @click="$router.push('/admin/order')">订单管理</el-button>
      <el-button type="warning" plain @click="$router.push('/admin/coupon')">优惠券管理</el-button>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMockStore } from '../../stores/mock';

const store = useMockStore();

const venueCount = computed(() => store.venues.length);
const totalOrders = computed(() => store.userAssets.orders.length);
const totalRevenue = computed(() => store.userAssets.orders.reduce((sum, order) => sum + order.realPay, 0));
</script>

<style scoped>
.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}
</style>