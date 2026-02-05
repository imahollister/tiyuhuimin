<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="header-actions">
          <div class="header-left">
            <span>场馆列表</span>
          </div>
          <el-button type="primary" @click="handleAdd">新增场馆</el-button>
        </div>
      </template>
      <el-form :inline="true" class="search-form">
        <el-form-item label="场馆名称">
          <el-input v-model="filters.name" placeholder="请输入场馆名称" clearable />
        </el-form-item>
        <el-form-item label="所属公司">
          <el-select v-model="filters.company" placeholder="请选择" clearable>
            <el-option label="奥体运营公司" value="奥体运营公司" />
            <el-option label="独墅湖高教区" value="独墅湖高教区" />
          </el-select>
        </el-form-item>
        <el-form-item label="行政区域">
          <el-select v-model="filters.area" placeholder="请选择" clearable>
            <el-option label="工业园区" value="工业园区" />
            <el-option label="姑苏区" value="姑苏区" />
            <el-option label="高新区" value="高新区" />
            <el-option label="吴中区" value="吴中区" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="请选择" clearable>
            <el-option label="启用" value="启用" />
            <el-option label="停用" value="停用" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="paginatedData" border style="width: 100%">
        <el-table-column prop="id" label="场馆编号" width="120" />
        <el-table-column prop="name" label="场馆名称" />
        <el-table-column prop="area" label="行政区域" />
        <el-table-column prop="company" label="所属公司" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === '启用' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button link type="danger" @click="handleToggleStatus(scope.row)">
              {{ scope.row.status === '启用' ? '停用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
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

    <!-- Add/Edit Drawer -->
    <el-drawer v-model="drawerVisible" :title="isEdit ? '编辑场馆' : '新增场馆'" size="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="场馆名称">
          <el-input v-model="form.name" placeholder="请输入场馆名称" />
        </el-form-item>
        <el-form-item label="行政区域">
          <el-select v-model="form.area" placeholder="请选择行政区域" style="width: 100%">
            <el-option label="工业园区" value="工业园区" />
            <el-option label="姑苏区" value="姑苏区" />
            <el-option label="高新区" value="高新区" />
            <el-option label="吴中区" value="吴中区" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属公司">
          <el-select v-model="form.company" placeholder="请选择所属公司" style="width: 100%">
            <el-option label="奥体运营公司" value="奥体运营公司" />
            <el-option label="独墅湖高教区" value="独墅湖高教区" />
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="form.address" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="启用">启用</el-radio>
            <el-radio label="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确认</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const tableData = ref([
  { id: 'VEN001', name: '苏州奥体中心', area: '工业园区', company: '奥体运营公司', status: '启用', address: '中新大道东999号' },
  { id: 'VEN002', name: '独墅湖体育馆', area: '工业园区', company: '独墅湖高教区', status: '启用', address: '翠薇街1号' }
]);

const filters = reactive({
  name: '',
  company: '',
  area: '',
  status: ''
});

const currentPage = ref(1);
const pageSize = ref(10);

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    const matchName = !filters.name || item.name.includes(filters.name);
    const matchCompany = !filters.company || item.company === filters.company;
    const matchArea = !filters.area || item.area === filters.area;
    const matchStatus = !filters.status || item.status === filters.status;
    return matchName && matchCompany && matchArea && matchStatus;
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
  filters.name = '';
  filters.company = '';
  filters.area = '';
  filters.status = '';
  handleSearch();
};

// Drawer Logic
const drawerVisible = ref(false);
const isEdit = ref(false);
const form = reactive({
  id: '',
  name: '',
  area: '',
  company: '',
  address: '',
  status: '启用'
});

const handleAdd = () => {
  isEdit.value = false;
  form.id = '';
  form.name = '';
  form.area = '';
  form.company = '';
  form.address = '';
  form.status = '启用';
  drawerVisible.value = true;
};

const handleEdit = (row) => {
  isEdit.value = true;
  Object.assign(form, row);
  drawerVisible.value = true;
};

const handleSave = () => {
  if (isEdit.value) {
    const index = tableData.value.findIndex(item => item.id === form.id);
    if (index !== -1) {
      tableData.value[index] = { ...form };
      ElMessage.success('更新成功');
    }
  } else {
    const newId = `VEN${String(tableData.value.length + 1).padStart(3, '0')}`;
    tableData.value.push({ ...form, id: newId });
    ElMessage.success('添加成功');
  }
  drawerVisible.value = false;
};

const handleToggleStatus = (row) => {
  const action = row.status === '启用' ? '停用' : '启用';
  ElMessageBox.confirm(`确认${action}该场馆吗？`, '提示', { type: 'warning' }).then(() => {
    row.status = action;
    ElMessage.success(`${action}成功`);
  });
};
</script>

<style scoped>
.header-actions { display: flex; justify-content: space-between; align-items: center; }
.search-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; justify-content: flex-end; display: flex; }
</style>
