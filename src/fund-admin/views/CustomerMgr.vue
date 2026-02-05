<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="header-actions">
          <div class="header-left">
            <span>注册客户列表</span>
          </div>
        </div>
      </template>
      <el-form :inline="true" class="search-form">
        <el-form-item label="关键字">
          <el-input v-model="filters.keyword" placeholder="身份证号/手机号" clearable />
        </el-form-item>
        <el-form-item label="注册时间">
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
        <el-table-column prop="id" label="序号" width="80" />
        <el-table-column prop="idCard" label="用户身份证" />
        <el-table-column prop="year" label="年份" />
        <el-table-column prop="totalQuota" label="折上折总额度" />
        <el-table-column prop="usedQuota" label="已用额度" />
        <el-table-column prop="regTime" label="注册时间" />
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
  { id: 1, idCard: '3205011990********', year: '2025', totalQuota: 500, usedQuota: 100, regTime: '2025-01-01' }
]);

const filters = reactive({
  keyword: '',
  timeRange: []
});

const currentPage = ref(1);
const pageSize = ref(10);

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    const matchKeyword = !filters.keyword || item.idCard.includes(filters.keyword);
    let matchTime = true;
    if (filters.timeRange && filters.timeRange.length === 2) {
      const time = item.regTime.split(' ')[0];
      matchTime = time >= filters.timeRange[0] && time <= filters.timeRange[1];
    }
    return matchKeyword && matchTime;
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
  filters.timeRange = [];
  handleSearch();
};

const handleExport = () => {
  ElMessage.success('导出任务已提交，请稍后下载');
};
</script>

<style scoped>
.header-actions { display: flex; justify-content: space-between; align-items: center; }
.search-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; justify-content: flex-end; display: flex; }
</style>
