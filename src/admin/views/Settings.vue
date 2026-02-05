<template>
  <div class="settings-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>系统设置</span>
        </div>
      </template>
      
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基础设置" name="basic">
          <el-form label-width="120px" style="max-width: 600px; margin-top: 20px">
            <el-form-item label="系统名称">
              <el-input v-model="config.appName" />
            </el-form-item>
            <el-form-item label="客服电话">
              <el-input v-model="config.servicePhone" />
            </el-form-item>
            <el-form-item label="版权信息">
              <el-input v-model="config.copyright" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveConfig">保存配置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="Banner管理" name="banner">
          <el-table :data="banners" style="width: 100%; margin-bottom: 20px">
            <el-table-column prop="title" label="标题" />
            <el-table-column label="图片" width="200">
              <template #default="{ row }">
                <el-image :src="row.image" style="width: 160px; height: 90px; border-radius: 4px;" fit="cover" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row, $index }">
                <el-button link type="danger" @click="banners.splice($index, 1)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" @click="addBanner">添加Banner</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const activeTab = ref('basic');

const config = ref({
  appName: '苏州市体育惠民',
  servicePhone: '0512-12345678',
  copyright: '© 2024 苏州市体育局'
});

const banners = ref([
  { title: '羽毛球活动', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=badminton%20activity%20banner&image_size=landscape_16_9' },
  { title: '游泳健身', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=swimming%20pool%20banner&image_size=landscape_16_9' }
]);

const saveConfig = () => {
  ElMessage.success('配置已保存');
};

const addBanner = () => {
  banners.value.push({
    title: '新活动',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=sports%20event%20banner&image_size=landscape_16_9'
  });
  ElMessage.success('Banner已添加');
};
</script>