<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="logo">体育惠民后台</div>
      <el-menu
        router
        :default-active="activeMenu"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><Odometer /></el-icon>
          <span>首页概览</span>
        </el-menu-item>
        <el-menu-item index="/admin/venue">
          <el-icon><Location /></el-icon>
          <span>场馆管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/coupon">
          <el-icon><Ticket /></el-icon>
          <span>优惠券管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/order">
          <el-icon><List /></el-icon>
          <span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/settings">
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="header-content">
          <div class="breadcrumb">
            管理后台 / {{ currentRouteName }}
          </div>
          <div class="user-info">
            <el-avatar :size="32" icon="UserFilled" />
            <span class="username">管理员</span>
          </div>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const activeMenu = computed(() => route.path);
const currentRouteName = computed(() => {
  const map = {
    Dashboard: '首页概览',
    VenueMgr: '场馆管理',
    CouponMgr: '优惠券管理',
    OrderMgr: '订单管理',
    Settings: '系统设置'
  };
  return map[route.name] || '';
});
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
}

.el-aside {
  background-color: #001529;
  color: #fff;
  
  .logo {
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    background-color: #002140;
  }
  
  .el-menu {
    border-right: none;
  }
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  
  .header-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }
  }
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
