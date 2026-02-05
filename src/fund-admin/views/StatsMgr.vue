<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="header-actions">
          <div class="header-left">
            <span>统计报表</span>
          </div>
        </div>
      </template>
      <el-form :inline="true" class="search-form">
        <el-form-item label="场馆名称">
          <el-input v-model="filters.venueName" placeholder="请输入场馆名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="paginatedData" border style="width: 100%" show-summary>
        <el-table-column prop="id" label="序号" width="80" />
        <el-table-column prop="venueName" label="场馆名称" />
        <el-table-column prop="orderCount" label="场馆订单数量" sortable />
        <el-table-column prop="szdAmount" label="苏周到金额（万元）" sortable />
        <el-table-column prop="smkAmount" label="市民卡金额（万元）" sortable />
        <el-table-column prop="nbAmount" label="宁波银行总金额（万元）" sortable />
        <el-table-column prop="totalAmount" label="总金额（元）" sortable />
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

const tableData = ref([
  { id: 1, venueName: '苏州奥体中心', orderCount: 1520, szdAmount: 45.2, smkAmount: 30.5, nbAmount: 10.8, totalAmount: 865000 },
  { id: 2, venueName: '独墅湖体育馆', orderCount: 850, szdAmount: 22.1, smkAmount: 18.4, nbAmount: 5.2, totalAmount: 457000 },
  { id: 3, venueName: '苏州市体育中心', orderCount: 1200, szdAmount: 35.6, smkAmount: 25.8, nbAmount: 8.4, totalAmount: 698000 },
  { id: 4, venueName: '运河体育公园', orderCount: 600, szdAmount: 15.3, smkAmount: 12.1, nbAmount: 3.5, totalAmount: 309000 }
]);

const filters = reactive({
  venueName: ''
});

const currentPage = ref(1);
const pageSize = ref(10);

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    return !filters.venueName || item.venueName.includes(filters.venueName);
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
  filters.venueName = '';
  handleSearch();
};
</script>

<style scoped>
.header-actions { display: flex; justify-content: space-between; align-items: center; }
.search-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; justify-content: flex-end; display: flex; }
</style>
