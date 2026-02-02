<template>
  <div class="coupon-mgr">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span>优惠券管理</span>
            <el-input
              v-model="searchKeyword"
              placeholder="搜索优惠券名称"
              style="width: 200px; margin-left: 16px"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
          <div class="header-right">
             <el-button type="success" @click="handleExport">导出记录</el-button>
             <el-button type="primary" @click="handleAdd">新增优惠券</el-button>
          </div>
        </div>
      </template>
      
      <el-table :data="paginatedCoupons" style="width: 100%">
        <el-table-column type="expand">
           <template #default="props">
             <div style="padding: 10px 20px; background: #f9f9f9;">
               <p><strong>领取记录 (最近5条):</strong></p>
               <el-table :data="getUsageRecords(props.row)" size="small" border style="width: 100%">
                 <el-table-column prop="user" label="用户" width="120" />
                 <el-table-column prop="time" label="操作时间" width="180" />
                 <el-table-column prop="action" label="操作类型">
                   <template #default="{ row }">
                     <el-tag :type="row.action === 'claim' ? 'primary' : 'success'" size="small">
                       {{ row.action === 'claim' ? '领取' : '核销' }}
                     </el-tag>
                   </template>
                 </el-table-column>
               </el-table>
             </div>
           </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="优惠券名称" width="180" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'general' ? 'success' : 'warning'">
              {{ row.type === 'general' ? '通用券' : '专项券' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="面额/门槛" width="180">
          <template #default="{ row }">
            满 {{ row.minSpend }} 减 {{ row.value }}
          </template>
        </el-table-column>
        <el-table-column label="库存" width="150">
          <template #default="{ row }">
            {{ row.remaining }} / {{ row.total }}
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="描述" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredCoupons.length"
        />
      </div>
    </el-card>

    <!-- Edit Drawer -->
    <el-drawer v-model="dialogVisible" :title="isEdit ? '编辑优惠券' : '新增优惠券'" size="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="form.name" placeholder="如：春季运动券" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type">
            <el-option label="通用券" value="general" />
            <el-option label="专项券" value="category" />
          </el-select>
        </el-form-item>
        <el-form-item label="指定项目" v-if="form.type === 'category'">
           <el-select v-model="form.category" placeholder="请选择适用项目">
             <el-option label="羽毛球" value="羽毛球" />
             <el-option label="游泳" value="游泳" />
             <el-option label="篮球" value="篮球" />
             <el-option label="足球" value="足球" />
           </el-select>
           <div class="tip" style="font-size: 12px; color: #999;">专项券仅可用于指定项目的场馆消费</div>
        </el-form-item>
        <el-form-item label="面额">
          <el-input-number v-model="form.value" :min="1" label="元" />
          <div class="tip" style="font-size: 12px; color: #999; margin-left: 10px; display: inline-block;">抵扣金额</div>
        </el-form-item>
        <el-form-item label="最低消费">
          <el-input-number v-model="form.minSpend" :min="0" label="元" />
          <div class="tip" style="font-size: 12px; color: #999; margin-left: 10px; display: inline-block;">满多少可用，0代表无门槛</div>
        </el-form-item>
        <el-form-item label="发行总量">
          <el-input-number v-model="form.total" :min="1" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.desc" type="textarea" :rows="2" placeholder="展示给用户的详细说明，如：仅限工作日使用" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确定</el-button>
        </span>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useMockStore } from '../../stores/mock';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue';

const store = useMockStore();
const dialogVisible = ref(false);
const isEdit = ref(false);
const form = ref({});

// Filter & Pagination
const searchKeyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

const filteredCoupons = computed(() => {
  let data = store.availableCoupons;
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    data = data.filter(c => c.name.toLowerCase().includes(keyword));
  }
  return data;
});

const paginatedCoupons = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredCoupons.value.slice(start, end);
});

const getUsageRecords = (coupon) => {
  // 模拟领取记录
  return [
    { user: '张三', time: '2023-05-20 14:30', action: 'claim' },
    { user: '李四', time: '2023-05-21 09:15', action: 'claim' },
    { user: '张三', time: '2023-05-22 18:20', action: 'use' }
  ];
};

const handleExport = () => {
  ElMessage.success('优惠券记录导出任务已提交');
};

const handleAdd = () => {
  isEdit.value = false;
  form.value = {
    name: '',
    type: 'general',
    category: '', // 新增
    value: 10,
    minSpend: 0,
    total: 100,
    desc: ''
  };
  dialogVisible.value = true;
};

const handleEdit = (row) => {
  isEdit.value = true;
  form.value = { ...row };
  dialogVisible.value = true;
};

const handleDelete = (id) => {
  ElMessageBox.confirm('确定删除该优惠券吗？', '提示', { type: 'warning' }).then(() => {
    const index = store.availableCoupons.findIndex(c => c.id === id);
    if (index !== -1) {
      store.availableCoupons.splice(index, 1);
      ElMessage.success('删除成功');
    }
  });
};

const handleSave = () => {
  if (isEdit.value) {
    const index = store.availableCoupons.findIndex(c => c.id === form.value.id);
    if (index !== -1) {
      // 保持 remaining 逻辑正确 (如果增加了 total, remaining 也增加)
      const oldTotal = store.availableCoupons[index].total;
      const diff = form.value.total - oldTotal;
      form.value.remaining = store.availableCoupons[index].remaining + diff;
      
      store.availableCoupons[index] = { ...form.value };
      ElMessage.success('更新成功');
    }
  } else {
    const newId = Math.max(...store.availableCoupons.map(c => c.id)) + 1;
    store.availableCoupons.push({ 
      ...form.value, 
      id: newId,
      remaining: form.value.total 
    });
    ElMessage.success('添加成功');
  }
  dialogVisible.value = false;
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
