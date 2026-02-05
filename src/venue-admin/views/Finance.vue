<template>
  <div class="finance-page">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="label">可提现余额</div>
            <div class="value money">¥8,560.00</div>
            <el-button type="primary" size="small">申请提现</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="label">待结算金额</div>
            <div class="value">¥2,300.00</div>
            <div class="sub">T+1 自动结算</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="label">本月累计收入</div>
            <div class="value">¥45,200.00</div>
            <div class="sub">较上月 +12%</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card header="收支明细" style="margin-top: 20px;">
      <el-table :data="transactions" style="width: 100%">
        <el-table-column prop="time" label="交易时间" width="180" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag :type="row.type === 'income' ? 'success' : 'warning'">
              {{ row.type === 'income' ? '收入' : '提现' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额">
          <template #default="{ row }">
            <span :style="{ color: row.type === 'income' ? '#67C23A' : '#F56C6C' }">
              {{ row.type === 'income' ? '+' : '-' }}¥{{ row.amount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="source" label="来源/去向" />
        <el-table-column prop="status" label="状态" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const transactions = ref([
  { time: '2025-02-03 10:00:00', type: 'income', amount: 150.00, source: '订单结算 ORD...991', status: '成功' },
  { time: '2025-02-03 09:30:00', type: 'income', amount: 20.00, source: '订单结算 ORD...992', status: '成功' },
  { time: '2025-02-02 18:00:00', type: 'withdraw', amount: 5000.00, source: '提现至银行卡(尾号8888)', status: '处理中' }
]);
</script>

<style scoped>
.stat-item { text-align: center; }
.label { color: #909399; font-size: 14px; margin-bottom: 8px; }
.value { font-size: 24px; font-weight: bold; color: #303133; margin-bottom: 8px; }
.money { color: #F56C6C; }
.sub { font-size: 12px; color: #909399; }
</style>