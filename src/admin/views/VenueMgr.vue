<template>
  <div class="venue-mgr">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span>场馆管理</span>
            <el-input
              v-model="searchKeyword"
              placeholder="搜索场馆名称"
              style="width: 200px; margin-left: 16px"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
          <el-button type="primary" @click="handleAdd">新增场馆</el-button>
        </div>
      </template>
      
      <el-table :data="paginatedVenues" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="image" label="图片" width="120">
          <template #default="{ row }">
            <el-image :src="row.image" style="width: 100px; height: 75px; border-radius: 4px;" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="场馆名称" width="180" />
        <el-table-column prop="district" label="区域" width="100" />
        <el-table-column prop="price" label="起步价" width="100">
          <template #default="{ row }">¥{{ row.price }}</template>
        </el-table-column>
        <el-table-column prop="tags" label="标签">
          <template #default="{ row }">
            <el-tag v-for="tag in row.tags" :key="tag" style="margin-right: 4px" size="small">{{ tag }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" @click="handleManageItems(row)">查看门票</el-button>
            <el-button link type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredVenues.length"
        />
      </div>
    </el-card>

    <!-- Edit Drawer -->
    <el-drawer v-model="dialogVisible" :title="isView ? '查看场馆' : (isEdit ? '编辑场馆' : '新增场馆')" size="800px">
      <el-form :model="form" label-width="140px" :disabled="isView">
        <el-tabs v-model="activeTab">
          <!-- Tab 1: 基本信息 -->
          <el-tab-pane label="基本信息" name="basic">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="场馆编号">
                  <el-input v-model="form.venueNo" placeholder="请输入场馆编号，如 V001" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                 <el-form-item label="是否启用">
                   <el-switch v-model="form.enabled" active-text="启用" inactive-text="停用" />
                 </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="场馆名称">
              <el-input v-model="form.name" placeholder="请输入场馆全称" />
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="惠民场馆">
                  <el-switch v-model="form.isHuimin" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="热门场馆">
                  <el-switch v-model="form.isHot" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="区县">
                   <el-select v-model="form.district" style="width: 100%">
                     <el-option label="工业园区" value="工业园区" />
                     <el-option label="姑苏区" value="姑苏区" />
                     <el-option label="高新区" value="高新区" />
                     <el-option label="吴中区" value="吴中区" />
                   </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="场馆类型">
                   <el-select v-model="form.venueType" style="width: 100%">
                     <el-option label="体育中心" value="体育中心" />
                     <el-option label="综合体" value="综合体" />
                     <el-option label="学校场馆" value="学校场馆" />
                     <el-option label="专业场馆" value="专业场馆" />
                   </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="详细地址">
              <el-input v-model="form.address" placeholder="请输入详细地址，包含街道门牌号" />
            </el-form-item>
            <el-form-item label="场馆项目类型">
              <el-input v-model="form.projectType" placeholder="请输入场馆项目类型，如羽毛球、篮球" />
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                 <el-form-item label="经度">
                   <el-input-number v-model="form.longitude" :precision="6" style="width: 100%" />
                 </el-form-item>
              </el-col>
              <el-col :span="12">
                 <el-form-item label="纬度">
                   <el-input-number v-model="form.latitude" :precision="6" style="width: 100%" />
                 </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="联系电话">
              <el-input v-model="form.phone" placeholder="请输入前台或负责人联系电话" />
            </el-form-item>
            <el-form-item label="轮播图">
               <el-button type="primary" size="small">添加图片</el-button>
               <div class="tip" style="font-size: 12px; color: #999; margin-top: 5px;">提示：仅允许上传 jpg, png, jpeg, bmp 格式图片！最多上传六张图片，每个限制 2 M</div>
            </el-form-item>
          </el-tab-pane>

          <!-- Tab 2: 扩展信息 -->
          <el-tab-pane label="扩展信息" name="extended">
             <el-form-item label="封面图">
                <el-input v-model="form.image" placeholder="图片URL" />
             </el-form-item>
             <el-form-item label="场馆视频">
                <el-button size="small">添加视频</el-button>
             </el-form-item>
             <el-form-item label="排序">
                <el-input-number v-model="form.sortOrder" />
             </el-form-item>
             <el-form-item label="营业时间">
                <el-input v-model="form.businessHours" placeholder="如 09:00 - 22:00" />
             </el-form-item>
             <el-row :gutter="20">
               <el-col :span="12">
                 <el-form-item label="公司品牌">
                   <el-input v-model="form.companyBrand" placeholder="运营公司品牌名" />
                 </el-form-item>
               </el-col>
               <el-col :span="12">
                 <el-form-item label="企业性质">
                    <el-select v-model="form.enterpriseNature" style="width: 100%">
                      <el-option label="国企" value="国企" />
                      <el-option label="民企" value="民企" />
                    </el-select>
                 </el-form-item>
               </el-col>
             </el-row>
             <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="场馆公众号名称">
                    <el-input v-model="form.officialAccountName" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="场馆小程序名称">
                    <el-input v-model="form.miniProgramName" />
                  </el-form-item>
                </el-col>
             </el-row>
             <el-form-item label="提交人">
               <el-input v-model="form.submitter" placeholder="信息录入人姓名" />
             </el-form-item>
             <el-form-item label="提交人电话">
               <el-input v-model="form.submitterPhone" placeholder="信息录入人联系方式" />
             </el-form-item>
          </el-tab-pane>

          <!-- Tab 3: 账号与财务 -->
          <el-tab-pane label="账号与财务" name="finance">
             <el-form-item label="登录账号">
               <div v-for="(acc, index) in form.accounts" :key="index" style="display: flex; gap: 10px; margin-bottom: 10px;">
                 <el-input v-model="acc.name" placeholder="账号名称" />
                 <el-input v-model="acc.account" placeholder="账号" />
                 <el-select v-model="acc.type" placeholder="类型">
                   <el-option label="管理员" value="管理员" />
                   <el-option label="操作员" value="操作员" />
                 </el-select>
                 <el-button type="danger" icon="Delete" circle @click="removeAccount(index)" />
               </div>
               <el-button type="primary" size="small" @click="addAccount">新增</el-button>
             </el-form-item>
             
             <el-row :gutter="20">
               <el-col :span="12"><el-form-item label="是否收费"><el-switch v-model="form.isChargeable" /></el-form-item></el-col>
               <el-col :span="12"><el-form-item label="是否需要预约"><el-switch v-model="form.needReservation" /></el-form-item></el-col>
               <el-col :span="12"><el-form-item label="是否有管理系统"><el-switch v-model="form.hasSystem" /></el-form-item></el-col>
               <el-col :span="12"><el-form-item label="是否资金监管"><el-switch v-model="form.fundSupervision" /></el-form-item></el-col>
             </el-row>
             
             <el-form-item label="场馆类型">
               <el-radio-group v-model="form.venueLevel">
                 <el-radio label="main">主场馆</el-radio>
                 <el-radio label="sub">子场馆</el-radio>
               </el-radio-group>
             </el-form-item>
             <el-form-item label="上级场馆" v-if="form.venueLevel === 'sub'">
               <el-select v-model="form.pid" placeholder="请选择主场馆" style="width: 100%">
                 <el-option v-for="v in mainVenues" :key="v.id" :label="v.name" :value="v.id" />
               </el-select>
             </el-form-item>
             
             <div style="font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">财务信息</div>
             <el-form-item label="商户名称(周到付)">
               <el-input v-model="form.financeInfo.merchantName" placeholder="支付结算商户全称" />
             </el-form-item>
             <el-form-item label="统一信用码">
               <el-input v-model="form.financeInfo.creditCode" placeholder="企业统一社会信用代码" />
             </el-form-item>
             <el-form-item label="场馆简介">
               <el-input v-model="form.intro" type="textarea" :rows="3" placeholder="展示给用户的场馆介绍，包含特色、设施等" />
             </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ isView ? '关闭' : '取消' }}</el-button>
          <el-button v-if="!isView" type="primary" @click="handleSave">确定</el-button>
        </span>
      </template>
    </el-drawer>

    <!-- Items Management Drawer -->
    <el-drawer v-model="itemsDialogVisible" title="门票/产品查看" size="800px">
      <div style="margin-bottom: 10px;">
        <el-alert title="总后台仅供查看，如需修改请登录【场馆端后台】" type="info" show-icon :closable="false" />
      </div>
      
      <!-- List View -->
      <div class="items-list">
        <el-collapse accordion>
          <el-collapse-item v-for="(item, index) in currentItems" :key="index" :name="index">
            <template #title>
              <div class="item-header">
                <span class="item-name">{{ item.name || '新产品' }}</span>
                <span class="item-price">¥{{ item.price }}</span>
                <el-tag size="small" :type="item.type === 'booking' ? 'warning' : (item.type === 'service' ? 'primary' : 'success')">
                  {{ item.type === 'booking' ? '场地预订' : (item.type === 'service' ? '服务项目' : '普通门票') }}
                </el-tag>
                <el-tag size="small" :type="item.status === 1 ? 'success' : 'info'" style="margin-left: 5px">
                  {{ item.status === 1 ? '上架中' : '已下架' }}
                </el-tag>
              </div>
            </template>
            
            <el-form label-width="100px" style="padding: 10px" disabled>
              <el-form-item label="产品名称">
                <el-input v-model="item.name" />
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="销售价格">
                    <el-input-number v-model="item.price" style="width: 100%" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="原价">
                    <el-input-number v-model="item.originalPrice" style="width: 100%" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="库存">
                <el-input-number v-model="item.stock" style="width: 100%" />
              </el-form-item>
              <el-form-item label="产品类型">
                <el-radio-group v-model="item.type">
                  <el-radio label="ticket">普通门票</el-radio>
                  <el-radio label="booking">场地预订</el-radio>
                  <el-radio label="service">服务项目</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <!-- Booking Configuration -->
              <div v-if="item.type === 'booking'" class="booking-config">
                <div style="font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">场地与时段配置</div>
                
                <div class="fields-section">
                  <div style="margin-bottom: 5px; font-size: 13px; color: #666;">场地列表</div>
                  <div v-for="(field, fIdx) in item.fields" :key="fIdx" style="display: flex; gap: 5px; margin-bottom: 5px;">
                    <el-input v-model="field.name" size="small" />
                  </div>
                </div>
                
                <div class="slots-section" style="margin-top: 15px;">
                  <div style="margin-bottom: 5px; font-size: 13px; color: #666;">时段价格</div>
                  <div v-for="(slot, sIdx) in item.slots" :key="sIdx" style="display: flex; gap: 5px; margin-bottom: 5px; align-items: center;">
                    <el-input v-model="slot.time" size="small" style="width: 200px" />
                    <el-input-number v-model="slot.price" size="small" style="width: 100px" />
                  </div>
                </div>
              </div>

              <!-- Service Configuration -->
              <div v-if="item.type === 'service'" class="service-config">
                 <el-form-item label="服务描述">
                   <el-input v-model="item.description" type="textarea" :rows="2" />
                 </el-form-item>
                 <el-form-item label="服务时长">
                   <el-input v-model="item.duration" />
                 </el-form-item>
              </div>
            </el-form>
            <div style="text-align: right; padding: 10px; border-top: 1px solid #eee;">
              <el-button 
                :type="item.status === 1 ? 'warning' : 'success'" 
                size="small" 
                @click="toggleItemStatus(item, index)"
              >
                {{ item.status === 1 ? '下架' : '上架' }}
              </el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="itemsDialogVisible = false">关闭</el-button>
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
const isView = ref(false);
const activeTab = ref('basic');
const form = ref({
  // Basic
  venueNo: '',
  name: '',
  enabled: true,
  isHuimin: false,
  isHot: false,
  district: '',
  venueType: '',
  address: '',
  projectType: '',
  longitude: 120.5853,
  latitude: 31.2989,
  phone: '',
  tags: [],
  
  // Extended
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=sports%20venue&image_size=landscape_4_3',
  video: '',
  sortOrder: 0,
  businessHours: '',
  companyBrand: '',
  enterpriseNature: '',
  officialAccountName: '',
  miniProgramName: '',
  submitter: '',
  submitterPhone: '',
  
  // Finance & Accounts
  accounts: [],
  isChargeable: false,
  needReservation: false,
  hasSystem: false,
  fundSupervision: false,
  venueLevel: 'main',
  pid: null,
  fields: [],
  slots: [],
  financeInfo: {
    merchantName: '',
    creditCode: ''
  },
  
  // Legacy
  price: 0,
  distance: '',
  intro: ''
});

const mainVenues = computed(() => store.venues.filter(v => v.venueLevel === 'main' && v.id !== form.value.id));

// Filter & Pagination
const searchKeyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

const filteredVenues = computed(() => {
  let data = store.venues;
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    data = data.filter(v => v.name.toLowerCase().includes(keyword));
  }
  return data;
});

const paginatedVenues = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredVenues.value.slice(start, end);
});

// Items Management
const itemsDialogVisible = ref(false);
const currentVenueId = ref(null);
const currentItems = ref([]);

const toggleItemStatus = (item, index) => {
  const newStatus = item.status === 1 ? 0 : 1;
  const actionName = newStatus === 1 ? '上架' : '下架';
  
  ElMessageBox.confirm(`确定${actionName}该商品吗？`, '提示', { type: 'warning' }).then(() => {
    item.status = newStatus;
    // Sync to store
    const v = store.venues.find(v => v.id === currentVenueId.value);
    if (v && v.items) {
      // Find the correct item in store
      const storeItem = v.items.find(i => i.id === item.id);
      if (storeItem) {
        storeItem.status = newStatus;
      }
    }
    ElMessage.success(`${actionName}成功`);
  });
};

const handleAdd = () => {
  isEdit.value = false;
  isView.value = false;
  activeTab.value = 'basic';
  form.value = {
    // Basic
    venueNo: '',
    name: '',
    enabled: true,
    isHuimin: false,
    isHot: false,
    district: '',
    venueType: '',
    address: '',
    projectType: '',
    longitude: 120.5853,
    latitude: 31.2989,
    phone: '',
    tags: [],
    
    // Extended
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=sports%20venue&image_size=landscape_4_3',
    video: '',
    sortOrder: 0,
    businessHours: '',
    companyBrand: '',
    enterpriseNature: '',
    officialAccountName: '',
    miniProgramName: '',
    submitter: '',
    submitterPhone: '',
    
    // Finance & Accounts
    accounts: [],
    isChargeable: false,
    needReservation: false,
    hasSystem: false,
    fundSupervision: false,
    venueLevel: 'main',
    pid: null,
    fields: [],
    slots: [],
    financeInfo: {
      merchantName: '',
      creditCode: ''
    },
    
    // Legacy
    price: 0,
    distance: '',
    intro: ''
  };
  dialogVisible.value = true;
};

const handleManageItems = (row) => {
  currentVenueId.value = row.id;
  currentItems.value = JSON.parse(JSON.stringify(row.items || []));
  itemsDialogVisible.value = true;
};

const addItem = () => {
  currentItems.value.push({ 
    id: Date.now(), 
    name: '新产品', 
    price: 0, 
    originalPrice: 0, 
    stock: 999, 
    type: 'ticket', // ticket | booking
    fields: [],
    slots: []
  });
};

const removeItem = (index) => {
  currentItems.value.splice(index, 1);
};

// Booking configuration helpers
const addField = (item) => {
  if (!item.fields) item.fields = [];
  item.fields.push({ name: '' });
};

const removeField = (item, index) => {
  item.fields.splice(index, 1);
};

const addSlot = (item) => {
  if (!item.slots) item.slots = [];
  item.slots.push({ timeRange: ['09:00', '10:00'], price: 0 });
};

const removeSlot = (item, index) => {
  item.slots.splice(index, 1);
};

const saveItems = () => {
  // Format slots time range for all booking items
  currentItems.value.forEach(item => {
    if (item.type === 'booking' && item.slots) {
      item.slots = item.slots.map(s => ({
        ...s,
        time: Array.isArray(s.timeRange) ? s.timeRange.join('-') : s.time
      }));
    }
  });

  const venue = store.venues.find(v => v.id === currentVenueId.value);
  if (venue) {
    venue.items = [...currentItems.value];
    ElMessage.success('产品保存成功');
  }
  itemsDialogVisible.value = false;
};

const handleEdit = (row) => {
  console.log('Editing venue:', row);
  isEdit.value = true;
  isView.value = false;
  activeTab.value = 'basic';
  const data = JSON.parse(JSON.stringify(row));
  // Ensure nested objects exist
  if (!data.financeInfo) data.financeInfo = {};
  if (!data.accounts) data.accounts = [];
  // Fields and slots are now managed in "Manage Items" for booking type items
  // But we keep them in form data for backward compatibility or if needed later
  if (!data.fields) data.fields = [];
  if (!data.slots) data.slots = [];
  form.value = data;
  dialogVisible.value = true;
};

const handleView = (row) => {
  isEdit.value = false;
  isView.value = true;
  activeTab.value = 'basic';
  const data = JSON.parse(JSON.stringify(row));
  if (!data.financeInfo) data.financeInfo = {};
  if (!data.accounts) data.accounts = [];
  if (!data.fields) data.fields = [];
  if (!data.slots) data.slots = [];
  form.value = data;
  dialogVisible.value = true;
};

const addAccount = () => {
  if (!form.value.accounts) form.value.accounts = [];
  form.value.accounts.push({ name: '', account: '', type: '操作员' });
};

const removeAccount = (index) => {
  form.value.accounts.splice(index, 1);
};

const handleDelete = (id) => {
  ElMessageBox.confirm('确定删除该场馆吗？', '提示', { type: 'warning' }).then(() => {
    const index = store.venues.findIndex(v => v.id === id);
    if (index !== -1) {
      store.venues.splice(index, 1);
      ElMessage.success('删除成功');
    }
  });
};

const handleSave = () => {
  // Format slots time range
  const slots = form.value.slots.map(s => ({
    time: Array.isArray(s.timeRange) ? s.timeRange.join('-') : s.time,
    price: s.price,
    timeRange: s.timeRange // Keep for UI
  }));
  
  const formData = { ...form.value, slots };

  if (isEdit.value) {
    const index = store.venues.findIndex(v => v.id === form.value.id);
    if (index !== -1) {
      store.venues[index] = formData;
      ElMessage.success('更新成功');
    }
  } else {
    // 确保id是数字类型
    const maxId = store.venues.length > 0 ? Math.max(...store.venues.map(v => Number(v.id))) : 0;
    const newId = maxId + 1;
    store.venues.push({ ...formData, id: newId });
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