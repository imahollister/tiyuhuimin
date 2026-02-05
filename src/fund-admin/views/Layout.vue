<template>
  <el-container class="layout-container">
    <el-aside width="240px">
      <div class="logo">
        <el-icon class="logo-icon"><Wallet /></el-icon>
        <span>资金管理后台</span>
      </div>
      <el-menu
        router
        :default-active="activeMenu"
        background-color="#ffffff"
        text-color="#606266"
        active-text-color="#E11D48"
        class="custom-menu"
      >
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <span>首页</span>
        </el-menu-item>

        <el-sub-menu index="basic-data">
          <template #title>
            <el-icon><DataBoard /></el-icon>
            <span>基础数据</span>
          </template>
          <el-menu-item index="/venue">场馆管理</el-menu-item>
          <el-menu-item index="/company">公司管理</el-menu-item>
          <el-menu-item index="/customer">注册客户查询</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="fund-center">
          <template #title>
            <el-icon><Money /></el-icon>
            <span>资金中心</span>
          </template>
          <el-menu-item index="/fund-pool">主题资金池管理</el-menu-item>
          <el-menu-item index="/reconciliation">对账清单查询</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="data-center">
          <template #title>
            <el-icon><TrendCharts /></el-icon>
            <span>数据中心</span>
          </template>
          <el-menu-item index="/stats">统计报表</el-menu-item>
          <el-menu-item index="/warning">预警记录查询</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="system-manage">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/user">用户管理</el-menu-item>
          <el-menu-item index="/dict">字典管理</el-menu-item>
          <el-menu-item index="/password">修改密码</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="header-content">
          <div class="breadcrumb">
            <el-icon><HomeFilled /></el-icon>
            <span class="sep">/</span>
            <span>资金监管</span>
            <span class="sep">/</span>
            <span class="current">{{ currentRouteName }}</span>
          </div>
          <div class="user-info">
            <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <span class="username">财务管理员</span>
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
import { Odometer, DataBoard, Money, TrendCharts, Setting, Wallet, HomeFilled } from '@element-plus/icons-vue';

const route = useRoute();
const activeMenu = computed(() => route.path);
const currentRouteName = computed(() => {
  const map = {
    Dashboard: '首页',
    VenueMgr: '场馆管理',
    CompanyMgr: '公司管理',
    FundPoolMgr: '主题资金池管理',
    ReconciliationMgr: '对账清单查询',
    CustomerMgr: '注册客户查询',
    WarningMgr: '预警记录查询',
    StatsMgr: '统计报表',
    UserMgr: '用户管理',
    DictMgr: '字典管理',
    PasswordMgr: '修改密码'
  };
  return map[route.name] || '';
});
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
  display: flex;
  flex-direction: column;
  
  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 16px;
    font-weight: 600;
    color: #E11D48;
    background-color: #ffffff;
    border-bottom: 1px solid #f0f0f0;
    
    .logo-icon {
      font-size: 20px;
    }
  }
  
  .el-menu {
    border-right: none;
    flex: 1;
    overflow-y: auto;
    
    :deep(.el-sub-menu__title:hover), :deep(.el-menu-item:hover) {
      background-color: #fff1f2;
      color: #E11D48;
    }
    
    :deep(.el-menu-item.is-active) {
      background-color: #ffe4e6;
      color: #E11D48;
      border-right: 3px solid #E11D48;
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
