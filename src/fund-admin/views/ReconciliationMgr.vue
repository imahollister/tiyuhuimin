<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="header-actions">
          <div class="header-left">
            <span>对账清单列表</span>
          </div>
        </div>
      </template>
      <el-form :inline="true" class="search-form">
        <el-form-item label="关键字">
          <el-input v-model="filters.keyword" placeholder="订单号/身份证号" clearable />
        </el-form-item>
        <el-form-item label="订单来源">
          <el-select v-model="filters.source" placeholder="请选择" clearable>
            <el-option label="苏周到" value="苏周到" />
            <el-option label="市民卡" value="市民卡" />
            <el-option label="宁波银行" value="宁波银行" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="filters.status" placeholder="请选择" clearable>
            <el-option label="已支付" value="已支付" />
            <el-option label="待核销" value="待核销" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已退款" value="已退款" />
          </el-select>
        </el-form-item>
        <el-form-item label="交易时间">
          <el-date-picker
            v-model="filters.timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button type="success" @click="handleExport">导出</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="paginatedData" border style="width: 100%">
        <el-table-column prop="source" label="订单来源" />
        <el-table-column prop="orderNo" label="订单编号" />
        <el-table-column prop="amount" label="订单总金额" />
        <el-table-column prop="realPay" label="实付金额" />
        <el-table-column prop="status" label="订单状态">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="交易时间" />
      </el-table>
      <el-pagination 
        class="pagination" 
        layout="total, sizes, prev, pager, next, jumper" 
        :total="filteredData.length" 
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';

const tableData = ref([
  { source: '苏周到', orderNo: 'ORD20250203001', amount: 100, realPay: 80, status: '已支付', time: '2025-02-03 10:00:00' },
  { source: '市民卡', orderNo: 'ORD20250203002', amount: 200, realPay: 180, status: '已完成', time: '2025-02-02 14:30:00' }
]);

const filters = reactive({
  keyword: '',
  source: '',
  status: '',
  timeRange: []
});

const currentPage = ref(1);
const pageSize = ref(10);

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    const matchKeyword = !filters.keyword || item.orderNo.includes(filters.keyword);
    const matchSource = !filters.source || item.source === filters.source;
    const matchStatus = !filters.status || item.status === filters.status;
    
    let matchTime = true;
    if (filters.timeRange && filters.timeRange.length === 2) {
      const time = item.time.split(' ')[0];
      matchTime = time >= filters.timeRange[0] && time <= filters.timeRange[1];
    }
    
    return matchKeyword && matchSource && matchStatus && matchTime;
  });
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredData.value.slice(start, start + pageSize.value);
});

const handleSearch = () => {
  currentPage.value = 1;
};

const handleReset = () => {
  filters.keyword = '';
  filters.source = '';
  filters.status = '';
  filters.timeRange = [];
  handleSearch();
};

const handleExport = () => {
  ElMessage.success('导出任务已提交，请稍后下载');
};

const getStatusType = (status) => {
  if (status === '已支付') return 'primary';
  if (status === '已完成') return 'success';
  if (status === '待核销') return 'warning';
  return 'info';
};
</script>

<style scoped>
.header-actions { display: flex; justify-content: space-between; align-items: center; }
.search-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; justify-content: flex-end; display: flex; }
</style>
