<template>
  <div class="product-mgr">
    <!-- Main Venue Selector (Only if logged in as Main Venue) -->
    <div v-if="venueInfo.venueLevel === 'main'" class="venue-selector">
      <span class="label">当前管理场馆：</span>
      <el-select v-model="currentVenueId" placeholder="请选择场馆" @change="handleVenueChange">
        <el-option :label="venueInfo.name + ' (本馆)'" :value="venueInfo.id" />
        <el-option v-for="sub in subVenues" :key="sub.id" :label="sub.name" :value="sub.id" />
      </el-select>
    </div>

    <el-card>
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span>门票/服务管理</span>
          </div>
          <div class="header-right">
            <el-button type="primary" :icon="Plus" @click="showAddDialog">发布新商品</el-button>
          </div>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" class="no-border-tabs">
        <el-tab-pane label="商品列表" name="items">
          <el-table :data="items" style="width: 100%" :header-cell-style="{ background: '#fff', color: '#606266' }">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="商品名称" />
            <el-table-column prop="type" label="类型">
              <template #default="{ row }">
                <el-tag :type="row.type === 'booking' ? 'warning' : (row.type === 'service' ? 'primary' : 'success')" effect="light">
                  {{ row.type === 'booking' ? '场地预订' : (row.type === 'service' ? '服务项目' : '普通门票') }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="价格">
              <template #default="{ row }">¥{{ row.price }}</template>
            </el-table-column>
            <el-table-column prop="stock" label="库存" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '已上架' : '已下架' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row, $index }">
                <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
                <el-button link :type="row.status === 1 ? 'warning' : 'success'" @click="handleToggleStatus(row)">
                  {{ row.status === 1 ? '下架' : '上架' }}
                </el-button>
                <el-button link type="danger" @click="handleDelete(row, $index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="场地设置" name="venue">
          <div style="padding: 20px 0;">
            <el-alert title="场地基本信息修改需提交平台审核" type="warning" show-icon style="margin-bottom: 20px;" />
            <el-form label-width="100px" style="max-width: 600px;">
              <el-form-item label="场馆名称">
                <el-input v-model="currentVenueInfo.name" disabled />
              </el-form-item>
              <el-form-item label="营业时间">
                <el-input v-model="currentVenueInfo.businessHours" placeholder="如 09:00 - 22:00" />
              </el-form-item>
              <el-form-item label="联系电话">
                <el-input v-model="currentVenueInfo.phone" />
              </el-form-item>
              <el-form-item label="场馆简介">
                <el-input v-model="currentVenueInfo.intro" type="textarea" :rows="4" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveVenueInfo">保存修改</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- Add/Edit Item Dialog -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑商品' : '发布新商品'" width="600px">
      <!-- ... (Keep existing dialog content) ... -->
      <el-form :model="form" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="类型" v-if="!isEdit">
          <el-radio-group v-model="form.type">
            <el-radio label="ticket">普通门票</el-radio>
            <el-radio label="booking">场地预订</el-radio>
            <el-radio label="service">培训服务</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="form.price" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="库存" v-if="form.type !== 'booking'">
          <el-input-number v-model="form.stock" :min="1" />
        </el-form-item>
        
        <!-- Booking Config -->
        <div v-if="form.type === 'booking'" class="booking-config">
          <div style="font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #eee;">场地与时段</div>
          <div class="fields-section">
            <div v-for="(field, idx) in form.fields" :key="idx" style="display: flex; gap: 5px; margin-bottom: 5px;">
              <el-input v-model="field.name" size="small" placeholder="场地名称" />
              <el-button type="danger" icon="Delete" circle size="small" @click="form.fields.splice(idx, 1)" />
            </div>
            <el-button size="small" plain @click="addField">+ 添加场地</el-button>
          </div>
          <div class="slots-section" style="margin-top: 10px;">
            <div v-for="(slot, idx) in form.slots" :key="idx" style="display: flex; gap: 5px; margin-bottom: 5px; align-items: center;">
              <el-time-picker is-range v-model="slot.timeRange" format="HH:mm" value-format="HH:mm" size="small" style="width: 220px" />
              <el-input-number v-model="slot.price" size="small" :min="0" style="width: 100px" placeholder="价格" />
              <el-button type="danger" icon="Delete" circle size="small" @click="form.slots.splice(idx, 1)" />
            </div>
            <el-button size="small" plain @click="addSlot">+ 添加时段</el-button>
          </div>
        </div>

        <el-form-item label="描述" style="margin-top: 10px;">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { Plus, Delete } from '@element-plus/icons-vue';
import { useMockStore } from '../../stores/mock';
import { ElMessage, ElMessageBox } from 'element-plus';

const store = useMockStore();
const activeTab = ref('items');
const dialogVisible = ref(false);
const isEdit = ref(false);

// Mock Login User (Main Venue)
const venueInfo = ref({});
const subVenues = ref([]);
const currentVenueId = ref(null);
const currentVenueInfo = ref({});
const items = ref([]);

onMounted(() => {
  // Simulate login as Venue ID 1
  const loginId = 1;
  const v = store.venues.find(v => v.id === loginId);
  if (v) {
    venueInfo.value = v;
    currentVenueId.value = v.id;
    currentVenueInfo.value = v;
    items.value = v.items || [];
    
    if (v.venueLevel === 'main') {
      subVenues.value = store.venues.filter(sv => sv.pid === v.id);
    }
  }
});

const handleVenueChange = (val) => {
  const v = store.venues.find(v => v.id === val);
  if (v) {
    currentVenueInfo.value = v;
    items.value = v.items || [];
    activeTab.value = 'items'; // Reset tab
  }
};

const form = reactive({
  id: null,
  name: '',
  type: 'ticket',
  price: 0,
  stock: 100,
  description: '',
  fields: [],
  slots: []
});

const showAddDialog = () => {
  isEdit.value = false;
  Object.assign(form, {
    id: null,
    name: '',
    type: 'ticket',
    price: 0,
    stock: 100,
    description: '',
    fields: [],
    slots: [],
    status: 1
  });
  dialogVisible.value = true;
};

const handleEdit = (row) => {
  isEdit.value = true;
  // Deep copy to avoid direct mutation
  const data = JSON.parse(JSON.stringify(row));
  // Restore timeRange for UI
  if (data.slots) {
    data.slots = data.slots.map(s => ({
      ...s,
      timeRange: s.time.split('-')
    }));
  }
  Object.assign(form, data);
  dialogVisible.value = true;
};

const handleToggleStatus = (row) => {
  const newStatus = row.status === 1 ? 0 : 1;
  const actionName = newStatus === 1 ? '上架' : '下架';
  
  ElMessageBox.confirm(`确定${actionName}该商品吗？`, '提示', { type: 'warning' }).then(() => {
    row.status = newStatus;
    // Sync to store
    const v = store.venues.find(v => v.id === currentVenueId.value);
    if (v) v.items = items.value;
    ElMessage.success(`${actionName}成功`);
  });
};

const handleDelete = (row, index) => {
  ElMessageBox.confirm('确定删除该商品吗？', '提示', { type: 'warning' }).then(() => {
    items.value.splice(index, 1);
    // Sync to store
    const v = store.venues.find(v => v.id === currentVenueId.value);
    if (v) v.items = items.value;
    ElMessage.success('删除成功');
  });
};

const addField = () => {
  if (!form.fields) form.fields = [];
  form.fields.push({ name: '' });
};

const addSlot = () => {
  if (!form.slots) form.slots = [];
  form.slots.push({ timeRange: ['09:00', '10:00'], price: 0 });
};

const handleSave = () => {
  // Process slots time format
  const slots = (form.slots || []).map(s => ({
    time: Array.isArray(s.timeRange) ? s.timeRange.join('-') : s.time,
    price: s.price,
    timeRange: s.timeRange
  }));
  
  const newItem = {
    ...form,
    slots,
    id: form.id || Date.now()
  };

  if (isEdit.value) {
    const idx = items.value.findIndex(i => i.id === form.id);
    if (idx !== -1) items.value[idx] = newItem;
  } else {
    items.value.push(newItem);
  }

  // Sync to store
  const v = store.venues.find(v => v.id === currentVenueId.value);
  if (v) v.items = items.value;

  ElMessage.success(isEdit.value ? '修改成功' : '发布成功');
  dialogVisible.value = false;
};

const saveVenueInfo = () => {
  const v = store.venues.find(v => v.id === currentVenueId.value);
  if (v) {
    Object.assign(v, currentVenueInfo.value);
    ElMessage.success('场馆信息保存成功');
  }
};
</script>

<style scoped>
.venue-selector { margin-bottom: 20px; background: #fff; padding: 15px; border-radius: 4px; display: flex; align-items: center; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05); }
.venue-selector .label { font-size: 14px; color: #606266; margin-right: 10px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.header-left { display: flex; align-items: center; }
.header-right { display: flex; align-items: center; }
.booking-config { background: #f9f9f9; padding: 10px; border-radius: 4px; margin-top: 10px; }
:deep(.no-border-tabs .el-tabs__header) { margin-bottom: 0; }
:deep(.no-border-tabs .el-tabs__content) { padding-top: 20px; }
</style>
