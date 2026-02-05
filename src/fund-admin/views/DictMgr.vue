<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="header-actions">
          <div class="header-left">
            <span>字典列表</span>
          </div>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>
      </template>
      <el-form :inline="true" class="search-form">
        <el-form-item label="字典类型名称">
          <el-input v-model="filters.typeName" placeholder="请输入类型名称" clearable />
        </el-form-item>
        <el-form-item label="字典名称">
          <el-input v-model="filters.name" placeholder="请输入名称" clearable />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="filters.type" placeholder="请选择" clearable>
            <el-option label="区域" value="区域" />
            <el-option label="订单状态" value="订单状态" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="paginatedData" border style="width: 100%">
        <el-table-column prop="typeName" label="字典类型名称" />
        <el-table-column prop="name" label="字典名称" />
        <el-table-column prop="value" label="字典值" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" @click="handleEdit(scope.row)">修改</el-button>
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
    <el-drawer v-model="drawerVisible" :title="isEdit ? '修改字典' : '新增字典'" size="500px">
      <el-form :model="form" label-width="120px">
        <el-form-item label="字典类型名称">
          <el-input v-model="form.typeName" placeholder="如：区域" />
        </el-form-item>
        <el-form-item label="字典名称">
          <el-input v-model="form.name" placeholder="如：姑苏区" />
        </el-form-item>
        <el-form-item label="字典值">
          <el-input v-model="form.value" placeholder="如：320508" />
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
  { id: 1, typeName: '区域', name: '姑苏区', value: '320508' },
  { id: 2, typeName: '区域', name: '工业园区', value: '320594' }
]);

const filters = reactive({
  typeName: '',
  name: '',
  type: ''
});

const currentPage = ref(1);
const pageSize = ref(10);

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    const matchTypeName = !filters.typeName || item.typeName.includes(filters.typeName);
    const matchName = !filters.name || item.name.includes(filters.name);
    const matchType = !filters.type || item.typeName === filters.type;
    return matchTypeName && matchName && matchType;
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
  filters.typeName = '';
  filters.name = '';
  filters.type = '';
  handleSearch();
};

// Drawer Logic
const drawerVisible = ref(false);
const isEdit = ref(false);
const form = reactive({
  id: '',
  typeName: '',
  name: '',
  value: ''
});

const handleAdd = () => {
  isEdit.value = false;
  form.id = '';
  form.typeName = '';
  form.name = '';
  form.value = '';
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
  ElMessageBox.confirm('确定删除该字典项吗？', '提示', { type: 'warning' }).then(() => {
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
