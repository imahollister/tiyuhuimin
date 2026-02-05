<template>
  <div class="page-container">
    <el-card style="max-width: 500px; margin: 0 auto;">
      <template #header>
        <span>修改密码</span>
      </template>
      <el-form label-width="80px">
        <el-form-item label="旧密码">
          <el-input type="password" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input type="password" />
        </el-form-item>
        <el-form-item label="验证密码">
          <el-input type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">确定</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
