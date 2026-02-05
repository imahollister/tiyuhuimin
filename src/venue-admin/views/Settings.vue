<template>
  <div class="settings-page">
    <el-tabs type="border-card">
      <el-tab-pane label="基本设置">
        <el-form label-width="120px" style="max-width: 500px;">
          <el-form-item label="店铺名称">
            <el-input v-model="form.name" disabled />
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="form.contact" />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="form.phone" />
          </el-form-item>
          <el-form-item label="店铺公告">
            <el-input v-model="form.notice" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary">保存设置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="账号安全">
        <el-form label-width="120px" style="max-width: 500px;">
          <el-form-item label="当前账号">
            <span>admin_szat</span>
          </el-form-item>
          <el-form-item label="旧密码">
            <el-input type="password" />
          </el-form-item>
          <el-form-item label="新密码">
            <el-input type="password" />
          </el-form-item>
          <el-form-item label="确认新密码">
            <el-input type="password" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary">修改密码</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const form = reactive({
  name: '苏州奥体中心',
  contact: '王经理',
  phone: '13800138000',
  notice: '欢迎光临苏州奥体中心！'
});
</script>