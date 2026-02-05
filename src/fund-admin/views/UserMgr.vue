<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="header-actions">
          <div class="header-left">
            <span>用户列表</span>
          </div>
          <el-button type="primary" @click="handleAdd">新增用户</el-button>
        </div>
      </template>
      <el-form :inline="true" class="search-form">
        <el-form-item label="姓名">
          <el-input v-model="filters.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="filters.mobile" placeholder="请输入手机号" clearable />
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
        <el-table-column prop="username" label="账号" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === '启用' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button link type="primary" @click="handlePassword(scope.row)">修改密码</el-button>
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
    <el-drawer v-model="drawerVisible" :title="isEdit ? '编辑用户' : '新增用户'" size="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="账号">
          <el-input v-model="form.username" :disabled="isEdit" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="启用">启用</el-radio>
            <el-radio label="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="warning-settings">
          <div style="margin-bottom: 10px; font-weight: bold;">预警通知设置</div>
          <el-form-item label="一级预警">
            <el-switch v-model="form.warn1" />
          </el-form-item>
          <el-form-item label="二级预警">
            <el-switch v-model="form.warn2" />
          </el-form-item>
          <el-form-item label="三级预警">
            <el-switch v-model="form.warn3" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确认</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- Password Dialog -->
    <el-dialog v-model="passwordVisible" title="修改密码" width="400px">
      <el-form :model="passwordForm" label-width="80px">
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passwordVisible = false">取消</el-button>
          <el-button type="primary" @click="savePassword">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';

const tableData = ref([
  { username: 'admin', name: '管理员', mobile: '13800138000', status: '启用', warn1: true, warn2: true, warn3: true }
]);

const filters = reactive({
  name: '',
  mobile: '',
  status: ''
});

const currentPage = ref(1);
const pageSize = ref(10);

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    const matchName = !filters.name || item.name.includes(filters.name);
    const matchMobile = !filters.mobile || item.mobile.includes(filters.mobile);
    const matchStatus = !filters.status || item.status === filters.status;
    return matchName && matchMobile && matchStatus;
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
  filters.mobile = '';
  filters.status = '';
  handleSearch();
};

// Drawer Logic
const drawerVisible = ref(false);
const isEdit = ref(false);
const form = reactive({
  username: '',
  name: '',
  mobile: '',
  status: '启用',
  warn1: false,
  warn2: false,
  warn3: false
});

const handleAdd = () => {
  isEdit.value = false;
  form.username = '';
  form.name = '';
  form.mobile = '';
  form.status = '启用';
  form.warn1 = false;
  form.warn2 = false;
  form.warn3 = false;
  drawerVisible.value = true;
};

const handleEdit = (row) => {
  isEdit.value = true;
  Object.assign(form, row);
  drawerVisible.value = true;
};

const handleSave = () => {
  if (isEdit.value) {
    const index = tableData.value.findIndex(item => item.username === form.username);
    if (index !== -1) {
      tableData.value[index] = { ...form };
      ElMessage.success('更新成功');
    }
  } else {
    if (tableData.value.some(u => u.username === form.username)) {
      ElMessage.error('账号已存在');
      return;
    }
    tableData.value.push({ ...form });
    ElMessage.success('添加成功');
  }
  drawerVisible.value = false;
};

// Password Logic
const passwordVisible = ref(false);
const passwordForm = reactive({ newPassword: '' });
const currentUsername = ref('');

const handlePassword = (row) => {
  currentUsername.value = row.username;
  passwordForm.newPassword = '';
  passwordVisible.value = true;
};

const savePassword = () => {
  ElMessage.success(`用户 ${currentUsername.value} 密码修改成功`);
  passwordVisible.value = false;
};
</script>

<style scoped>
.header-actions { display: flex; justify-content: space-between; align-items: center; }
.search-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; justify-content: flex-end; display: flex; }
.warning-settings { margin-top: 20px; padding-top: 10px; border-top: 1px solid #eee; }
</style>
