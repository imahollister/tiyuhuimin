<template>
  <div class="order-mgr">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span>订单管理</span>
            <el-input 
              v-model="filters.keyword" 
              placeholder="搜索订单号或场馆名称" 
              style="width: 250px; margin-left: 16px"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="filters.status" placeholder="状态筛选" style="width: 120px; margin-left: 10px" clearable>
              <el-option label="全部" value="" />
              <el-option label="待支付" value="pending" />
              <el-option label="待核验" value="paid" />
              <el-option label="已完成" value="used" />
              <el-option label="已退款" value="refunded" />
            </el-select>
          </div>
          <el-button type="success" @click="handleExport">导出订单</el-button>
        </div>
      </template>

      <el-table :data="orders" style="width: 100%" :header-cell-style="{ background: '#fff', color: '#606266' }">
        <el-table-column prop="id" label="订单号" width="180" />
        <el-table-column prop="venueName" label="场馆" width="180" />
        <el-table-column prop="itemName" label="项目">
          <template #default="{ row }">
            {{ row.itemName }}
            <span v-if="row.bookingDetails" style="font-size: 12px; color: #909399; margin-left: 5px;">
              {{ row.bookingDetails.map(d => d.time).join(',') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="实付金额" width="120">
          <template #default="{ row }">¥{{ row.price }}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" effect="dark" style="border: none;">{{ formatStatus(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button 
              v-if="row.status === 'paid'" 
              link type="primary" 
              @click="handleVerify(row)"
            >
              核销
            </el-button>
            <el-button 
              v-if="['paid', 'pending'].includes(row.status)" 
              link type="danger" 
              @click="handleRefund(row)"
            >
              退款/取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="orders.length"
        />
      </div>
    </el-card>

    <!-- Order Detail Drawer -->
    <el-drawer v-model="drawerVisible" title="订单详情" size="600px">
      <!-- ... (Keep existing drawer content) ... -->
      <div v-if="currentOrder" class="order-detail">
        <el-descriptions title="基本信息" :column="2" border>
          <el-descriptions-item label="订单编号">{{ currentOrder.id }}</el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ currentOrder.createTime }}</el-descriptions-item>
          <el-descriptions-item label="支付状态">
             <el-tag :type="getStatusType(currentOrder.status)">{{ formatStatus(currentOrder.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="支付金额">¥{{ currentOrder.price }}</el-descriptions-item>
          <el-descriptions-item label="用户信息">{{ currentOrder.userPhone || '138****8888' }}</el-descriptions-item>
          <el-descriptions-item label="所属场馆">{{ currentOrder.venueName }}</el-descriptions-item>
        </el-descriptions>

        <div class="section-title">商品信息</div>
        <el-table :data="[currentOrder]" border style="width: 100%">
          <el-table-column prop="itemName" label="商品名称" />
          <el-table-column label="详细信息">
            <template #default>
              <div v-if="currentOrder.bookingDetails">
                <div v-for="(item, idx) in currentOrder.bookingDetails" :key="idx">
                  {{ item.fieldName }} ({{ item.time }})
                </div>
                <div>预约日期: {{ currentOrder.bookingDate }}</div>
              </div>
              <div v-else>
                 {{ currentOrder.description || '无详细描述' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价" width="100" />
        </el-table>

        <div class="section-title" v-if="currentOrder.status === 'used' || currentOrder.status === 'refunded'">核销/退款记录</div>
        <el-timeline v-if="currentOrder.status === 'used'">
          <el-timeline-item :timestamp="currentOrder.verifyTime || '2025-02-03 14:00:00'" type="success">
            核销成功 (操作员: 前台01)
          </el-timeline-item>
        </el-timeline>
        <el-timeline v-if="currentOrder.status === 'refunded'">
          <el-timeline-item :timestamp="currentOrder.refundTime || '2025-02-03 15:00:00'" type="warning">
            发起退款申请 (原因: 用户申请)
          </el-timeline-item>
          <el-timeline-item :timestamp="currentOrder.refundFinishTime || '2025-02-03 15:30:00'" type="primary">
            退款成功 (金额: ¥{{ currentOrder.price }})
          </el-timeline-item>
        </el-timeline>
        
        <div class="drawer-footer" v-if="currentOrder.status === 'paid'">
          <el-button type="success" @click="handleVerify(currentOrder)">立即核销</el-button>
          <el-button type="danger" @click="handleRefund(currentOrder)">发起退款</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue';

const filters = reactive({
  keyword: '',
  status: '',
  dateRange: []
});

const drawerVisible = ref(false);
const currentOrder = ref(null);
const currentPage = ref(1);
const pageSize = ref(10);

const orders = ref([
  { 
    id: 'ORD17067899993', 
    venueName: '运河体育公园',
    itemName: '网球初级培训班', 
    price: 1200, 
    createTime: '2025-02-03 10:00:00', 
    status: 'paid',
    description: '10节课时'
  },
  { 
    id: 'ORD17067899992', 
    venueName: '苏州奥体中心',
    itemName: '奥体中心参观票', 
    price: 20, 
    createTime: '2025-02-03 09:30:00', 
    status: 'paid',
    description: '单人票'
  },
  { 
    id: 'ORD17067899991', 
    venueName: '苏州奥体中心',
    itemName: '游泳私教体验课', 
    price: 150, 
    createTime: '2025-02-03 09:00:00', 
    status: 'paid',
    description: '含私教1小时，泳池门票1张'
  },
  { 
    id: 'ORD17067890123', 
    venueName: '苏州奥体中心',
    itemName: '羽毛球 - 1号场', 
    price: 60, 
    createTime: '2025-02-02 10:15:22', 
    status: 'pending',
    bookingDate: '2025-02-04',
    bookingDetails: [
      { fieldName: '1号场', time: '19:00-20:00', price: 60 }
    ]
  },
  {
    id: 'ORD17067888111',
    venueName: '独墅湖体育馆',
    itemName: '游泳单次票',
    price: 25,
    createTime: '2025-02-01 14:30:00',
    status: 'paid',
    description: '通用票'
  },
  {
    id: 'ORD17067812345',
    venueName: '苏州市体育中心',
    itemName: '篮球半场包场',
    price: 250,
    createTime: '2025-01-20 18:00:00',
    status: 'used',
    verifyTime: '2025-01-20 19:00:00',
    bookingDetails: [
      { fieldName: '篮球半场', time: '18:00-20:00', price: 250 }
    ]
  },
  {
    id: 'ORD17067800001',
    venueName: '运河体育公园',
    itemName: '网球场 - 中心场',
    price: 120,
    createTime: '2025-01-15 09:00:00',
    status: 'refunded',
    refundTime: '2025-01-15 10:00:00',
    bookingDetails: [
      { fieldName: '中心场', time: '09:00-10:00', price: 120 }
    ]
  }
]);

const getStatusType = (status) => {
  // pending: 橙色(warning), paid: 蓝色(primary/custom), used: 绿色(success), refunded: 灰色(info)
  const map = { pending: 'warning', paid: '', used: 'success', refunded: 'info' };
  // Note: Element Plus 'primary' is blue, but reference image shows 'paid' as blue.
  // If map returns empty string for type, it defaults to blueish primary or we can specify color.
  // Actually Element Plus default type is blue.
  return map[status] || ''; 
};

const formatStatus = (status) => {
  const map = { pending: '待支付', paid: '待核验', used: '已完成', refunded: '已退款' };
  return map[status] || status;
};

const handleSearch = () => {
  ElMessage.success('查询成功');
};

const handleExport = () => {
  ElMessage.success('导出任务已添加到后台');
};

const showDetail = (row) => {
  currentOrder.value = row;
  drawerVisible.value = true;
};

const handleVerify = (row) => {
  ElMessageBox.confirm('确定核销该订单吗？', '核销确认', {
    confirmButtonText: '确定核销',
    cancelButtonText: '取消',
    type: 'success',
  }).then(() => {
    row.status = 'used';
    row.verifyTime = new Date().toLocaleString();
    ElMessage.success('核销成功');
    if (drawerVisible.value) drawerVisible.value = false;
  });
};

const handleRefund = (row) => {
  ElMessageBox.prompt('请输入退款原因', '退款/取消确认', {
    confirmButtonText: '确定退款',
    cancelButtonText: '取消',
    confirmButtonClass: 'el-button--danger'
  }).then(({ value }) => {
    row.status = 'refunded';
    row.refundTime = new Date().toLocaleString();
    row.refundFinishTime = new Date().toLocaleString();
    ElMessage.success(`退款申请已提交，原因: ${value}`);
    if (drawerVisible.value) drawerVisible.value = false;
  });
};
</script>

<style lang="scss" scoped>
.order-mgr {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
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
  
  .section-title {
    font-weight: bold;
    margin: 20px 0 10px;
    border-left: 4px solid #409EFF;
    padding-left: 10px;
    font-size: 15px;
  }
  
  .drawer-footer {
    margin-top: 30px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  // Custom tag colors to match image
  :deep(.el-tag) {
    &.el-tag--primary { // paid -> 待核验 (Blue)
      background-color: #ecf5ff;
      border-color: #d9ecff;
      color: #409eff;
    }
    &.el-tag--warning { // pending -> 待支付 (Orange)
      background-color: #fdf6ec;
      border-color: #faecd8;
      color: #e6a23c;
    }
    &.el-tag--success { // used -> 已完成 (Green)
      background-color: #f0f9eb;
      border-color: #e1f3d8;
      color: #67c23a;
    }
    &.el-tag--info { // refunded -> 已退款 (Grey)
      background-color: #f4f4f5;
      border-color: #e9e9eb;
      color: #909399;
    }
    
    // Dark effect override if needed, but 'dark' prop usually handles it.
    // The code uses `effect="dark"`, so colors are solid.
    // Blue: #409eff, Orange: #e6a23c, Green: #67c23a, Grey: #909399
  }
}
</style>
