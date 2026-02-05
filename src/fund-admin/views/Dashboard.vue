<template>
  <div class="dashboard-container">
    <!-- Top Stats -->
    <el-card class="box-card overall-stats">
      <template #header>
        <div class="card-header">
          <span>2026年资金池总额</span>
        </div>
      </template>
      <div class="stats-content">
        <div class="total-amount">￥{{ overallStats.total }}万</div>
        <div class="progress-info">
          <div class="item">
            <span class="label">已用额度</span>
            <span class="value">{{ overallStats.used }}万 / {{ overallStats.usedPercent }}%</span>
            <el-progress :percentage="overallStats.usedPercent" :status="overallStats.usedPercent > 80 ? 'warning' : ''" />
          </div>
          <div class="item">
            <span class="label">剩余额度</span>
            <span class="value">{{ overallStats.remaining }}万 / {{ overallStats.remainingPercent }}%</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- Channel Pools -->
    <div class="channel-grid">
      <el-card v-for="channel in channels" :key="channel.name" class="channel-card">
        <template #header>
          <div class="card-header">
            <span>{{ channel.name }}资金池</span>
            <el-tag size="small" :type="channel.status === 'active' ? 'success' : 'info'">{{ channel.status === 'active' ? '启用' : '停用' }}</el-tag>
          </div>
        </template>
        <div class="channel-stats">
          <div class="stat-row">
            <span class="label">总额度:</span>
            <span class="value">{{ channel.total }}万</span>
          </div>
          <div class="stat-row">
            <span class="label">已用额度:</span>
            <span class="value">{{ channel.used }}万 / {{ channel.usedPercent }}%</span>
          </div>
          <div class="stat-row">
            <span class="label">剩余额度:</span>
            <span class="value">{{ channel.remaining }}万 / {{ channel.remainingPercent }}%</span>
          </div>
          <el-progress :percentage="channel.usedPercent" :color="channel.color" />
        </div>
      </el-card>
    </div>

    <!-- Warning List -->
    <el-card class="box-card warning-list">
      <template #header>
        <div class="card-header">
          <span>资金池预警列表</span>
        </div>
      </template>
      <el-table :data="warningList" stripe style="width: 100%">
        <el-table-column prop="id" label="序号" width="80" />
        <el-table-column prop="type" label="类型" width="120" />
        <el-table-column prop="level" label="预警类型">
          <template #default="scope">
            <el-tag :type="getWarningTagType(scope.row.level)">{{ scope.row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="currentUsage" label="当前使用额度(万元)" />
        <el-table-column prop="time" label="预警时间" />
      </el-table>
      <div class="pagination-container">
        <el-pagination background layout="prev, pager, next" :total="100" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const overallStats = reactive({
  total: 6500,
  used: 2100,
  usedPercent: 32.3,
  remaining: 4400,
  remainingPercent: 67.7
});

const channels = reactive([
  { name: '苏周到', total: 2000, used: 800, usedPercent: 40, remaining: 1200, remainingPercent: 60, status: 'active', color: '#409EFF' },
  { name: '市民卡', total: 2500, used: 1000, usedPercent: 40, remaining: 1500, remainingPercent: 60, status: 'active', color: '#67C23A' },
  { name: '宁波银行', total: 2000, used: 300, usedPercent: 15, remaining: 1700, remainingPercent: 85, status: 'active', color: '#E6A23C' }
]);

const warningList = ref([
  { id: 1, type: '苏周到', level: '一级预警', currentUsage: 780.500000, time: '2024-05-10 14:30:00' },
  { id: 2, type: '市民卡', level: '二级预警', currentUsage: 950.200000, time: '2024-05-09 09:15:00' },
  { id: 3, type: '宁波银行', level: '三级预警', currentUsage: 280.000000, time: '2024-05-08 16:45:00' }
]);

const getWarningTagType = (level) => {
  if (level.includes('一级')) return 'danger';
  if (level.includes('二级')) return 'warning';
  return 'info';
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.overall-stats {
  .total-amount {
    font-size: 32px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 20px;
  }
  .progress-info {
    display: flex;
    gap: 40px;
    .item {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      .label { font-size: 14px; color: #909399; }
      .value { font-size: 16px; font-weight: bold; color: #606266; }
    }
  }
}

.channel-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.channel-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
  .stat-row {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    .label { color: #909399; }
    .value { font-weight: bold; color: #606266; }
  }
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
