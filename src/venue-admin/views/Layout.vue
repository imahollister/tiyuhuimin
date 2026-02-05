<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="logo">
        <el-icon class="logo-icon"><Shop /></el-icon>
        <span>场馆管理后台</span>
      </div>
      <el-menu
        router
        :default-active="activeMenu"
        background-color="#ffffff"
        text-color="#606266"
        active-text-color="#8E2DE2"
        class="custom-menu"
      >
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <span>首页概览</span>
        </el-menu-item>
        
        <el-sub-menu index="business-center">
          <template #title>
            <el-icon><Goods /></el-icon>
            <span>业务管理</span>
          </template>
          <el-menu-item index="/product">场馆/商品管理</el-menu-item>
          <el-menu-item index="/order">订单管理</el-menu-item>
          <el-menu-item index="/verification">核销管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="finance-center">
          <template #title>
            <el-icon><Money /></el-icon>
            <span>财务中心</span>
          </template>
          <el-menu-item index="/finance">财务结算</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="system-center">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/settings">系统设置</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="header-content">
          <div class="breadcrumb">
            <el-icon><HomeFilled /></el-icon>
            <span class="sep">/</span>
            <span>商户后台</span>
            <span class="sep">/</span>
            <span class="current">{{ currentRouteName }}</span>
          </div>
          <div class="user-info">
            <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <span class="username">商户管理员</span>
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
import { Odometer, Goods, List, Checked, Money, Setting, Shop, HomeFilled } from '@element-plus/icons-vue';

const route = useRoute();
const activeMenu = computed(() => route.path);
const currentRouteName = computed(() => route.meta.title || '工作台');
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
}

.el-aside {
  background-color: #ffffff;
  color: #333;
  border-right: 1px solid #e6e6e6;
  transition: width 0.3s;
  
  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 16px;
    font-weight: 600;
    color: #8E2DE2;
    background-color: #ffffff;
    border-bottom: 1px solid #f0f0f0;
    
    .logo-icon {
      font-size: 20px;
    }
  }
  
  .el-menu {
    border-right: none;
    
    :deep(.el-sub-menu__title:hover), :deep(.el-menu-item:hover) {
      background-color: #f8f0ff;
      color: #8E2DE2;
    }
    
    :deep(.el-menu-item.is-active) {
      background-color: #f3e5ff;
      color: #8E2DE2;
      border-right: 3px solid #8E2DE2;
    }
  }
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  height: 60px;
  box-shadow: 0 1px 4px rgba(0,21,41,0.08);
  z-index: 10;
  
  .header-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .breadcrumb {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #606266;
      
      .el-icon {
        margin-right: 4px;
        color: #909399;
      }
      
      .sep {
        margin: 0 8px;
        color: #c0c4cc;
      }
      
      .current {
        font-weight: 500;
        color: #303133;
      }
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 4px 12px;
      border-radius: 20px;
      transition: background 0.3s;
      
      &:hover {
        background: #f5f7fa;
      }
      
      .username {
        font-size: 14px;
        color: #606266;
      }
    }
  }
}

.el-main {
  background-color: #f5f7fa;
  padding: 20px;
}
</style>
