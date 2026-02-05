<template>
  <div class="order-mgr">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span>订单管理</span>
            <el-input
              v-model="searchKeyword"
              placeholder="搜索订单号或场馆名称"
              style="width: 250px; margin-left: 16px"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="statusFilter" placeholder="状态筛选" style="width: 120px; margin-left: 10px" clearable>
              <el-option label="待支付" value="pending" />
              <el-option label="待核销" value="paid" />
              <el-option label="已完成" value="used" />
              <el-option label="已退款" value="refunded" />
            </el-select>
            <el-select v-model="typeFilter" placeholder="类型筛选" style="width: 120px; margin-left: 10px" clearable>
              <el-option label="订场/门票" value="booking" />
              <el-option label="教培服务" value="service" />
            </el-select>
          </div>
          <el-button type="success" @click="handleExport">导出订单</el-button>
        </div>
      </template>
      
      <el-table :data="paginatedOrders" style="width: 100%">
        <el-table-column prop="id" label="订单号" width="180" />
        <el-table-column prop="venueName" label="场馆" width="150" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'service' ? 'warning' : 'info'" effect="plain">
              {{ row.type === 'service' ? '教培服务' : '订场/门票' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="itemName" label="项目" />
        <el-table-column prop="realPay" label="实付金额" width="100">
          <template #default="{ row }">¥{{ row.realPay }}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ formatStatus(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredOrders.length"
        />
      </div>
    </el-card>

    <!-- Order Detail Drawer -->
    <el-drawer v-model="viewDrawerVisible" title="订单详情" size="500px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="订单号">{{ currentOrder.id }}</el-descriptions-item>
        <el-descriptions-item label="场馆">{{ currentOrder.venueName }}</el-descriptions-item>
        <el-descriptions-item label="项目">{{ currentOrder.itemName }}</el-descriptions-item>
        <el-descriptions-item label="实付金额">¥{{ currentOrder.realPay }}</el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ currentOrder.createTime }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentOrder.status)">{{ formatStatus(currentOrder.status) }}</el-tag>
        </el-descriptions-item>
        
        <el-descriptions-item label="用户信息">
          <div>姓名：{{ currentOrder.userInfo?.name }}</div>
          <div>电话：{{ currentOrder.userInfo?.phone }}</div>
        </el-descriptions-item>
        
        <el-descriptions-item label="支付信息">
          <div>方式：{{ currentOrder.paymentInfo?.method }}</div>
          <div>流水号：{{ currentOrder.paymentInfo?.transactionId }}</div>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="viewDrawerVisible = false">关闭</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useMockStore } from '../../stores/mock';
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue';

const store = useMockStore();

// Filter & Pagination
const searchKeyword = ref('');
const statusFilter = ref('');
const typeFilter = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

// View Drawer
const viewDrawerVisible = ref(false);
const currentOrder = ref({});

const filteredOrders = computed(() => {
  let data = store.userAssets.orders;
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    data = data.filter(o => 
      String(o.id).toLowerCase().includes(keyword) || 
      o.venueName.toLowerCase().includes(keyword)
    );
  }
  
  if (statusFilter.value) {
    data = data.filter(o => o.status === statusFilter.value);
  }
  
  if (typeFilter.value) {
    data = data.filter(o => o.type === typeFilter.value);
  }

  // 按时间倒序
  return [...data].sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
});

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredOrders.value.slice(start, end);
});

const getStatusType = (status) => {
  const map = {
    pending: 'warning',
    paid: 'primary',
    used: 'success',
    refunded: 'info'
  };
  return map[status] || 'info';
};

const formatStatus = (status) => {
  const map = {
    pending: '待支付',
    paid: '待核销',
    used: '已完成',
    refunded: '已退款'
  };
  return map[status] || status;
};

const handleView = (row) => {
  currentOrder.value = { 
    ...row,
    // Mock extra info
    userInfo: { name: '张三', phone: '13800138000' },
    paymentInfo: { method: '微信支付', transactionId: 'TXN' + Date.now() }
  };
  viewDrawerVisible.value = true;
};

const handleExport = () => {
  ElMessage.success('订单导出任务已提交，请稍后在下载中心查看');
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-left {
  display: flex;
  align-items: center;
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>