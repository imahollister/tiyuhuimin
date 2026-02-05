<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>今日营收</span>
              <el-tag type="success">日</el-tag>
            </div>
          </template>
          <div class="card-value">¥12,580.00</div>
          <div class="card-footer">昨日: ¥11,200.00</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>今日订单</span>
              <el-tag type="primary">单</el-tag>
            </div>
          </template>
          <div class="card-value">128</div>
          <div class="card-footer">待核销: 45</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>今日核销</span>
              <el-tag type="warning">次</el-tag>
            </div>
          </template>
          <div class="card-value">86</div>
          <div class="card-footer">核销率: 67%</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>累计会员</span>
              <el-tag type="info">人</el-tag>
            </div>
          </template>
          <div class="card-value">3,520</div>
          <div class="card-footer">本月新增: +120</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>快速入口</span>
            </div>
          </template>
          <div class="quick-actions">
            <div class="action-item" @click="$router.push('/verification')">
              <el-icon class="icon" :size="32" color="#409EFF"><Checked /></el-icon>
              <span>核销验券</span>
            </div>
            <div class="action-item" @click="$router.push('/product')">
              <el-icon class="icon" :size="32" color="#67C23A"><Goods /></el-icon>
              <span>发布商品</span>
            </div>
            <div class="action-item" @click="$router.push('/order')">
              <el-icon class="icon" :size="32" color="#E6A23C"><List /></el-icon>
              <span>订单查询</span>
            </div>
            <div class="action-item" @click="$router.push('/finance')">
              <el-icon class="icon" :size="32" color="#F56C6C"><Money /></el-icon>
              <span>财务提现</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>系统公告</span>
              <el-button link type="primary">更多</el-button>
            </div>
          </template>
          <div class="notice-list">
            <div class="notice-item">
              <span class="title">关于春节期间结算时间调整的通知</span>
              <span class="date">02-01</span>
            </div>
            <div class="notice-item">
              <span class="title">体育惠民平台新版本功能上线说明</span>
              <span class="date">01-28</span>
            </div>
            <div class="notice-item">
              <span class="title">请各场馆做好冬季安全检查工作</span>
              <span class="date">01-15</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { Checked, Goods, List, Money } from '@element-plus/icons-vue';
</script>

<style lang="scss" scoped>
.data-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .card-value {
    font-size: 24px;
    font-weight: bold;
    margin: 10px 0;
    color: #303133;
  }
  .card-footer {
    font-size: 12px;
    color: #909399;
  }
}

.quick-actions {
  display: flex;
  gap: 40px;
  padding: 20px;
  
  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: transform 0.2s;
    
    &:hover {
      transform: scale(1.05);
    }
    
    span {
      margin-top: 10px;
      font-size: 14px;
      color: #606266;
    }
  }
}

.notice-list {
  .notice-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #f0f2f5;
    &:last-child { border-bottom: none; }
    
    .title { font-size: 14px; color: #606266; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .date { font-size: 12px; color: #909399; flex-shrink: 0; margin-left: 10px; }
  }
}
</style>