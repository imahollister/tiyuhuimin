<template>
  <div class="fund-pool-mgr">
    <!-- Header Actions -->
    <div class="header-actions">
      <div class="year-selector">
        <span>年份：</span>
        <el-select v-model="currentYear" placeholder="请选择年份" style="width: 120px">
          <el-option label="2025" value="2025" />
          <el-option label="2024" value="2024" />
        </el-select>
        <span class="total-quota">总额度：{{ totalQuota }}万元</span>
      </div>
      <el-button type="primary" @click="handleAddYear">新增年份</el-button>
    </div>

    <!-- Theme Capital Pool Table -->
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>主题资金池</span>
        </div>
      </template>
      <el-table :data="poolList" border style="width: 100%">
        <el-table-column prop="year" label="年份" width="80" />
        <el-table-column prop="type" label="类型" width="120" />
        <el-table-column prop="total" label="总额度(万元)" />
        <el-table-column prop="warn1" label="一级预警值(万元)" />
        <el-table-column prop="warn2" label="二级预警值(万元)" />
        <el-table-column prop="warn3" label="三级预警值(万元)" />
        <el-table-column prop="startTime" label="开始时间" width="160" />
        <el-table-column prop="endTime" label="结束时间" width="160" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="handleWarning(scope.row)">预警设置</el-button>
            <el-button link type="primary" @click="handleToggleStatus(scope.row)">
              {{ scope.row.status === 'active' ? '停用' : '启用' }}
            </el-button>
            <el-button link type="primary" @click="handleInject(scope.row)">注入</el-button>
            <el-button link type="danger" @click="handleReduce(scope.row)">减额</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- User Quota Table -->
    <el-card class="box-card" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>用户额度</span>
        </div>
      </template>
      <el-table :data="userQuotaList" border style="width: 100%">
        <el-table-column prop="year" label="年份" width="80" />
        <el-table-column prop="discount" label="折扣" />
        <el-table-column prop="limit" label="单笔限额(元)" />
        <el-table-column prop="superDiscount" label="折上折折扣额度(元)" />
        <el-table-column prop="endTime" label="结束时间" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag type="success">启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button link type="primary" @click="handleUserQuota(scope.row)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Change History -->
    <el-card class="box-card" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>变更记录</span>
        </div>
      </template>
      <el-table :data="historyList" border style="width: 100%">
        <el-table-column prop="id" label="序号" width="80" />
        <el-table-column prop="type" label="类型" />
        <el-table-column prop="before" label="修改前总额(万元)" />
        <el-table-column prop="after" label="修改后总额(万元)" />
        <el-table-column prop="operator" label="修改人姓名" />
        <el-table-column prop="time" label="修改时间" />
      </el-table>
    </el-card>

    <!-- Dialogs -->
    <el-dialog v-model="injectDialogVisible" title="资金注入" width="30%">
      <el-form :model="injectForm">
        <el-form-item label="注入金额(万元)">
          <el-input-number v-model="injectForm.amount" :min="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="injectDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmInject">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="reduceDialogVisible" title="资金减额" width="30%">
      <el-form :model="reduceForm">
        <el-form-item label="减额金额(万元)">
          <el-input-number v-model="reduceForm.amount" :min="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reduceDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmReduce">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="warningDialogVisible" title="预警设置" width="40%">
      <el-form :model="warningForm" label-width="120px">
        <el-form-item label="一级预警值">
          <el-input-number v-model="warningForm.warn1" :min="0" /> 万元
        </el-form-item>
        <el-form-item label="二级预警值">
          <el-input-number v-model="warningForm.warn2" :min="0" /> 万元
        </el-form-item>
        <el-form-item label="三级预警值">
          <el-input-number v-model="warningForm.warn3" :min="0" /> 万元
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="warningDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmWarning">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const currentYear = ref('2025');

const poolList = ref([
  { id: 1, year: '2025', type: '苏周到', total: 2000, warn1: 500, warn2: 300, warn3: 100, startTime: '2025-01-01', endTime: '2025-12-31', status: 'active' },
  { id: 2, year: '2025', type: '市民卡', total: 2500, warn1: 600, warn2: 400, warn3: 200, startTime: '2025-01-01', endTime: '2025-12-31', status: 'active' },
  { id: 3, year: '2025', type: '宁波银行', total: 2000, warn1: 500, warn2: 300, warn3: 100, startTime: '2025-01-01', endTime: '2025-12-31', status: 'stopped' }
]);

const userQuotaList = ref([
  { id: 1, year: '2025', discount: 0.9, limit: 500, superDiscount: 500, endTime: '2025-12-31', status: 'active' }
]);

const historyList = ref([
  { id: 1, type: '苏周到', before: 1800, after: 2000, operator: 'admin', time: '2025-01-15 10:00:00' },
  { id: 2, type: '市民卡', before: 2000, after: 2500, operator: 'admin', time: '2025-01-10 09:30:00' }
]);

const totalQuota = computed(() => poolList.value.reduce((sum, item) => sum + item.total, 0));

const handleAddYear = () => {
  ElMessage.info('新增年份功能演示');
};

const handleToggleStatus = (row) => {
  const newStatus = row.status === 'active' ? 'stopped' : 'active';
  const action = newStatus === 'active' ? '启用' : '停用';
  ElMessageBox.confirm(`确定要${action}该资金池吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    row.status = newStatus;
    ElMessage.success(`${action}成功`);
  });
};

// Injection
const injectDialogVisible = ref(false);
const injectForm = reactive({ amount: 0, row: null });
const handleInject = (row) => {
  injectForm.row = row;
  injectForm.amount = 0;
  injectDialogVisible.value = true;
};
const confirmInject = () => {
  if (injectForm.row) {
    const before = injectForm.row.total;
    injectForm.row.total += injectForm.amount;
    historyList.value.unshift({
      id: historyList.value.length + 1,
      type: injectForm.row.type,
      before,
      after: injectForm.row.total,
      operator: 'admin',
      time: new Date().toLocaleString()
    });
    ElMessage.success('注入成功');
    injectDialogVisible.value = false;
  }
};

// Reduce
const reduceDialogVisible = ref(false);
const reduceForm = reactive({ amount: 0, row: null });
const handleReduce = (row) => {
  reduceForm.row = row;
  reduceForm.amount = 0;
  reduceDialogVisible.value = true;
};
const confirmReduce = () => {
  if (reduceForm.row) {
    if (reduceForm.row.total < reduceForm.amount) {
      ElMessage.error('减额金额不能大于当前总额度');
      return;
    }
    const before = reduceForm.row.total;
    reduceForm.row.total -= reduceForm.amount;
    historyList.value.unshift({
      id: historyList.value.length + 1,
      type: reduceForm.row.type,
      before,
      after: reduceForm.row.total,
      operator: 'admin',
      time: new Date().toLocaleString()
    });
    ElMessage.success('减额成功');
    reduceDialogVisible.value = false;
  }
};

// Warning Settings
const warningDialogVisible = ref(false);
const warningForm = reactive({ warn1: 0, warn2: 0, warn3: 0, row: null });
const handleWarning = (row) => {
  warningForm.row = row;
  warningForm.warn1 = row.warn1;
  warningForm.warn2 = row.warn2;
  warningForm.warn3 = row.warn3;
  warningDialogVisible.value = true;
};
const confirmWarning = () => {
  if (warningForm.row) {
    warningForm.row.warn1 = warningForm.warn1;
    warningForm.row.warn2 = warningForm.warn2;
    warningForm.row.warn3 = warningForm.warn3;
    ElMessage.success('预警设置已更新');
    warningDialogVisible.value = false;
  }
};

const handleUserQuota = (row) => {
  ElMessage.info('用户额度设置功能演示');
};
</script>

<style lang="scss" scoped>
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  
  .year-selector {
    display: flex;
    align-items: center;
    gap: 10px;
    
    .total-quota {
      margin-left: 20px;
      font-weight: bold;
      color: #F56C6C;
    }
  }
}

.box-card {
  margin-bottom: 20px;
}
</style>
