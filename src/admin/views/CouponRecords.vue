<template>
  <div class="coupon-records">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-page-header @back="goBack" :title="pageTitle">
              <template #content>
                <span class="text-large font-600 mr-3"> 领取记录 </span>
              </template>
            </el-page-header>
          </div>
          <div class="header-right">
             <el-button type="success" @click="handleExport">导出记录</el-button>
          </div>
        </div>
      </template>
      
      <!-- 搜索栏 -->
      <div class="filter-container" style="margin-bottom: 20px;">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索用户姓名/手机号"
          style="width: 250px; margin-right: 15px;"
          clearable
          @clear="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-select v-model="statusFilter" placeholder="记录状态" style="width: 150px; margin-right: 15px;" clearable>
          <el-option label="已领取" value="claim" />
          <el-option label="已核销" value="use" />
          <el-option label="已过期" value="expire" />
        </el-select>
        
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="margin-right: 15px;"
          value-format="YYYY-MM-DD"
        />
        
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>

      <!-- 记录列表 -->
      <el-table :data="paginatedRecords" border style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="记录ID" width="100" />
        <el-table-column prop="user" label="用户姓名" width="120" />
        <el-table-column prop="phone" label="手机号" width="150" />
        <el-table-column prop="time" label="操作时间" width="180" sortable />
        <el-table-column prop="action" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getActionType(row.action)">
              {{ getActionLabel(row.action) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderNo" label="关联订单" min-width="180">
          <template #default="{ row }">
            <span v-if="row.orderNo" class="link-text">{{ row.orderNo }}</span>
            <span v-else class="text-gray">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredRecords.length"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMockStore } from '../../stores/mock';
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const store = useMockStore();

const couponId = ref(null);
const couponInfo = ref({});
const loading = ref(false);

// Filters
const searchKeyword = ref('');
const statusFilter = ref('');
const dateRange = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);

// Mock Records Data Generator
const generateMockRecords = (id) => {
  const records = [];
  const actions = ['claim', 'use', 'expire'];
  const users = ['张三', '李四', '王五', '赵六', '孙七'];
  
  for (let i = 0; i < 50; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)];
    records.push({
      id: 10000 + i,
      user: users[Math.floor(Math.random() * users.length)],
      phone: `138${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      time: `2025-02-${Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0')} ${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      action: action,
      orderNo: action === 'use' ? `ORD202502${Math.floor(Math.random() * 100000)}` : '',
      remark: action === 'claim' ? '活动领取' : (action === 'use' ? '订单抵扣' : '过期失效')
    });
  }
  return records.sort((a, b) => new Date(b.time) - new Date(a.time));
};

const allRecords = ref([]);

const pageTitle = computed(() => {
  return couponInfo.value.name ? `${couponInfo.value.name} - 领取记录` : '优惠券记录';
});

onMounted(() => {
  couponId.value = Number(route.params.id);
  const coupon = store.availableCoupons.find(c => c.id === couponId.value);
  if (coupon) {
    couponInfo.value = coupon;
    // Generate mock data for this coupon
    loading.value = true;
    setTimeout(() => {
      allRecords.value = generateMockRecords(couponId.value);
      loading.value = false;
    }, 500);
  } else {
    ElMessage.error('优惠券不存在');
    router.push('/admin/coupon');
  }
});

const filteredRecords = computed(() => {
  let data = allRecords.value;
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    data = data.filter(r => 
      r.user.includes(keyword) || 
      r.phone.includes(keyword)
    );
  }
  
  if (statusFilter.value) {
    data = data.filter(r => r.action === statusFilter.value);
  }
  
  if (dateRange.value && dateRange.value.length === 2) {
    const start = dateRange.value[0];
    const end = dateRange.value[1];
    data = data.filter(r => {
      const date = r.time.split(' ')[0];
      return date >= start && date <= end;
    });
  }
  
  return data;
});

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredRecords.value.slice(start, end);
});

const getActionType = (action) => {
  const map = {
    claim: 'primary',
    use: 'success',
    expire: 'info'
  };
  return map[action] || 'info';
};

const getActionLabel = (action) => {
  const map = {
    claim: '已领取',
    use: '已核销',
    expire: '已过期'
  };
  return map[action] || action;
};

const handleSearch = () => {
  currentPage.value = 1;
};

const handleReset = () => {
  searchKeyword.value = '';
  statusFilter.value = '';
  dateRange.value = [];
  handleSearch();
};

const handleExport = () => {
  ElMessage.success('导出任务已提交，请稍后在下载中心查看');
};

const goBack = () => {
  router.push('/admin/coupon');
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
.text-gray {
  color: #999;
}
.link-text {
  color: #409EFF;
  cursor: pointer;
}
</style>