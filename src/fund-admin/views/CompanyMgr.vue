<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="header-actions">
          <div class="header-left">
            <span>公司列表</span>
          </div>
          <el-button type="primary" @click="handleAdd">新增公司</el-button>
        </div>
      </template>
      <el-form :inline="true" class="search-form">
        <el-form-item label="统一信用代码">
          <el-input v-model="filters.code" placeholder="请输入信用代码" clearable />
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input v-model="filters.name" placeholder="请输入公司名称" clearable />
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
        <el-table-column prop="id" label="序号" width="80" />
        <el-table-column prop="name" label="公司名称" />
        <el-table-column prop="code" label="统一信用代码" />
        <el-table-column prop="email" label="电子邮箱" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === '启用' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
    <el-drawer v-model="drawerVisible" :title="isEdit ? '编辑公司' : '新增公司'" size="600px">
      <el-form :model="form" label-width="120px">
        <el-form-item label="公司名称">
          <el-input v-model="form.name" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="统一信用代码">
          <el-input v-model="form.code" placeholder="请输入18位统一社会信用代码" />
        </el-form-item>
        <el-form-item label="电子邮箱">
          <el-input v-model="form.email" placeholder="请输入电子邮箱" />
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
  { id: 1, name: '苏州体育投资发展有限公司', code: '91320500MA1XXXXXXX', email: 'contact@suzhousports.com', status: '启用', address: '苏州市姑苏区' }
]);

const filters = reactive({
  code: '',
  name: '',
  status: ''
});

const currentPage = ref(1);
const pageSize = ref(10);

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    const matchCode = !filters.code || item.code.includes(filters.code);
    const matchName = !filters.name || item.name.includes(filters.name);
    const matchStatus = !filters.status || item.status === filters.status;
    return matchCode && matchName && matchStatus;
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
  filters.code = '';
  filters.name = '';
  filters.status = '';
  handleSearch();
};

// Drawer Logic
const drawerVisible = ref(false);
const isEdit = ref(false);
const form = reactive({
  id: '',
  name: '',
  code: '',
  email: '',
  address: '',
  status: '启用'
});

const handleAdd = () => {
  isEdit.value = false;
  form.id = '';
  form.name = '';
  form.code = '';
  form.email = '';
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
    const newId = tableData.value.length + 1;
    tableData.value.push({ ...form, id: newId });
    ElMessage.success('添加成功');
  }
  drawerVisible.value = false;
};

const handleDelete = (row) => {
  ElMessageBox.confirm('确定删除该公司吗？', '提示', { type: 'warning' }).then(() => {
    const index = tableData.value.findIndex(item => item.id === row.id);
    if (index !== -1) {
      tableData.value.splice(index, 1);
      ElMessage.success('删除成功');
    }
  });
};
</script>

<style scoped>
.header-actions { display: flex; justify-content: space-between; align-items: center; }
.search-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; justify-content: flex-end; display: flex; }
</style>
