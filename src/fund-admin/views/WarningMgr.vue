<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="header-actions">
          <div class="header-left">
            <span>预警记录列表</span>
          </div>
        </div>
      </template>
      <el-form :inline="true" class="search-form">
        <el-form-item label="类型">
          <el-select v-model="filters.type" placeholder="请选择" clearable>
            <el-option label="苏周到" value="苏周到" />
            <el-option label="市民卡" value="市民卡" />
            <el-option label="宁波银行" value="宁波银行" />
          </el-select>
        </el-form-item>
        <el-form-item label="预警类型">
          <el-select v-model="filters.level" placeholder="请选择" clearable>
            <el-option label="一级预警" value="一级预警" />
            <el-option label="二级预警" value="二级预警" />
            <el-option label="三级预警" value="三级预警" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="paginatedData" border style="width: 100%">
        <el-table-column prop="id" label="序号" width="80" />
        <el-table-column prop="type" label="类型" />
        <el-table-column prop="level" label="预警类型">
          <template #default="scope">
            <el-tag :type="getWarningTagType(scope.row.level)">{{ scope.row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="usage" label="当前使用额度(万元)" />
        <el-table-column prop="time" label="预警时间" />
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
  { id: 1, type: '苏周到', level: '一级预警', usage: 800, time: '2025-02-01 10:00:00' },
  { id: 2, type: '市民卡', level: '二级预警', usage: 950, time: '2025-02-02 11:30:00' }
]);

const filters = reactive({
  type: '',
  level: ''
});

const currentPage = ref(1);
const pageSize = ref(10);

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    const matchType = !filters.type || item.type === filters.type;
    const matchLevel = !filters.level || item.level === filters.level;
    return matchType && matchLevel;
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
  filters.type = '';
  filters.level = '';
  handleSearch();
};

const getWarningTagType = (level) => {
  if (level.includes('一级')) return 'danger';
  if (level.includes('二级')) return 'warning';
  return 'info';
};
</script>

<style scoped>
.header-actions { display: flex; justify-content: space-between; align-items: center; }
.search-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; justify-content: flex-end; display: flex; }
</style>
