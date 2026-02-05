<template>
  <div class="verification-page">
    <el-card class="verify-box">
      <div class="title">核销验券</div>
      <div class="input-area">
        <el-input v-model="verifyCode" placeholder="请输入6位核销码" size="large" clearable style="width: 300px; margin-right: 10px;">
          <template #prefix>
            <el-icon><Checked /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" size="large" @click="handleVerify">验证并核销</el-button>
      </div>
      <div class="tips">支持扫码枪直接扫描核销</div>
    </el-card>

    <el-card class="history-box" header="今日核销记录">
      <el-table :data="history" style="width: 100%">
        <el-table-column prop="time" label="核销时间" width="180" />
        <el-table-column prop="code" label="核销码" width="120" />
        <el-table-column prop="item" label="商品名称" />
        <el-table-column prop="operator" label="操作员" width="120" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Checked } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const verifyCode = ref('');
const history = ref([
  { time: '10:23:45', code: '882910', item: '游泳私教体验课', operator: '前台01' },
  { time: '09:15:20', code: '110293', item: '羽毛球场 3号场', operator: '前台01' }
]);

const handleVerify = () => {
  if (!verifyCode.value) {
    ElMessage.warning('请输入核销码');
    return;
  }
  // Mock verification
  ElMessage.success('核销成功！商品：游泳单次票');
  history.value.unshift({
    time: new Date().toLocaleTimeString(),
    code: verifyCode.value,
    item: '游泳单次票',
    operator: '管理员'
  });
  verifyCode.value = '';
};
</script>

<style scoped>
.verify-box { text-align: center; padding: 40px; margin-bottom: 20px; }
.title { font-size: 24px; margin-bottom: 30px; font-weight: bold; }
.input-area { display: flex; justify-content: center; margin-bottom: 10px; }
.tips { color: #909399; font-size: 14px; }
</style>