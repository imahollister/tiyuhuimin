<template>
  <div class="preview-container">
    <!-- 左侧导航 -->
    <div class="nav-sidebar">
      <div class="nav-title">页面导航</div>
      
      <a href="javascript:void(0)" class="nav-item active" @click="navigateTo('/mobile/home', $event)">
        <span class="nav-icon">🏠</span>
        <span>首页</span>
      </a>
      
      <a href="javascript:void(0)" class="nav-item" @click="navigateTo('/mobile/detail/1', $event)">
        <span class="nav-icon">📍</span>
        <span>场馆详情</span>
      </a>
      
      <a href="javascript:void(0)" class="nav-item" @click="navigateTo('/mobile/order-confirm', $event)">
        <span class="nav-icon">📝</span>
        <span>订单确认</span>
      </a>
      
      <a href="javascript:void(0)" class="nav-item" @click="navigateTo('/mobile/order-list', $event)">
        <span class="nav-icon">📋</span>
        <span>订单列表</span>
      </a>
      
      <a href="javascript:void(0)" class="nav-item" @click="navigateTo('/mobile/coupon-list', $event)">
        <span class="nav-icon">🎫</span>
        <span>优惠券</span>
      </a>
      
      <a href="javascript:void(0)" class="nav-item" @click="navigateTo('/mobile/user', $event)">
        <span class="nav-icon">👤</span>
        <span>个人中心</span>
      </a>
      
      <a href="javascript:void(0)" class="nav-item" @click="navigateTo('/mobile/balance-history', $event)">
        <span class="nav-icon">💰</span>
        <span>余额明细</span>
      </a>
      
      <a href="javascript:void(0)" class="nav-item" @click="navigateTo('/mobile/collection-list', $event)">
        <span class="nav-icon">⭐</span>
        <span>我的收藏</span>
      </a>
    </div>

    <!-- 中间手机样机 -->
    <div class="phone-section">
      <div class="phone-frame">
        <div class="phone-notch"></div>
        <div class="phone-status">
          <span>9:41</span>
          <div style="display: flex; gap: 6px;">
            <svg viewBox="0 0 24 24" width="16" height="12" fill="currentColor">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9z"/>
            </svg>
            <svg viewBox="0 0 24 24" width="16" height="12" fill="currentColor">
              <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>
            </svg>
          </div>
        </div>
        <div class="phone-content">
          <iframe :src="currentPath" ref="phoneFrame" frameborder="0"></iframe>
        </div>
        <div class="phone-home">
          <div class="home-bar"></div>
        </div>
      </div>
      <div class="phone-info">
        <span>iPhone 14 Pro</span>
        <span>375 × 812</span>
      </div>
    </div>

    <!-- 右侧开发说明 -->
    <div class="doc-sidebar">
      <div class="doc-header">
        <h2>📖 开发说明</h2>
      </div>
      <div class="doc-content">
        <div class="doc-section">
          <h3>技术栈</h3>
          <p>移动端基于 Vue 3 + Vant UI 构建，采用 SPA 单页应用架构。</p>
        </div>
        
        <div class="doc-section">
          <h3>页面路由</h3>
          <ul class="doc-list">
            <li>/mobile/home - 首页（场馆列表）</li>
            <li>/mobile/detail/:id - 场馆详情</li>
            <li>/mobile/order-confirm - 订单确认</li>
            <li>/mobile/order-list - 订单列表</li>
            <li>/mobile/coupon-list - 优惠券</li>
            <li>/mobile/user - 个人中心</li>
          </ul>
        </div>
        
        <div class="doc-section">
          <h3>核心组件</h3>
          <ul class="doc-list">
            <li>VanSearch - 搜索组件</li>
            <li>VanSwipe - 轮播组件</li>
            <li>VanCard - 场馆卡片</li>
            <li>VanPopup - 弹窗组件</li>
            <li>VanTabbar - 底部导航</li>
          </ul>
        </div>
        
        <div class="doc-section">
          <h3>状态管理</h3>
          <p>使用 Pinia 进行状态管理，数据源：</p>
          <div class="doc-code">
stores/mock.js - 模拟数据
          </div>
        </div>
        
        <div class="doc-section">
          <h3>交互说明</h3>
          <p>点击左侧导航按钮，样机中的页面会同步跳转。页面内所有交互与真实移动端体验一致。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const phoneFrame = ref(null);
const currentPath = ref('/mobile/home');

const navigateTo = (path, event) => {
  // 更新激活状态
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));
  event.currentTarget.classList.add('active');
  
  // 导航 iframe
  currentPath.value = path;
  
  // 如果在 iframe 内部，也同步更新路由
  try {
    phoneFrame.value.contentWindow.location.href = path;
  } catch (e) {
    // 跨域限制，无法直接访问
    currentPath.value = path;
  }
};

// 从 URL 参数读取初始页面
onMounted(() => {
  const page = route.query.page;
  if (page) {
    currentPath.value = page;
  }
});
</script>

<style scoped>
.preview-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #1a1a2e;
}

/* 左侧导航 */
.nav-sidebar {
  width: 220px;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  padding: 24px 16px;
  border-right: 1px solid rgba(102, 126, 234, 0.2);
  overflow-y: auto;
}

.nav-title {
  font-size: 12px;
  color: #667eea;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 600;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  margin-bottom: 6px;
  background: rgba(31, 52, 96, 0.6);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  color: #a0aec0;
  text-decoration: none;
  border: 1px solid transparent;
}

.nav-item:hover {
  background: rgba(102, 126, 234, 0.2);
  color: #fff;
  transform: translateX(4px);
}

.nav-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.nav-icon {
  font-size: 20px;
}

/* 中间手机样机 */
.phone-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.phone-frame {
  width: 375px;
  height: 812px;
  background: #000;
  border-radius: 50px;
  padding: 12px;
  box-shadow: 
    0 0 0 3px #333,
    0 25px 80px rgba(0,0,0,0.5);
  position: relative;
}

.phone-notch {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 30px;
  background: #000;
  border-radius: 0 0 20px 20px;
  z-index: 10;
}

.phone-status {
  display: flex;
  justify-content: space-between;
  padding: 14px 20px 8px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}

.phone-content {
  background: #f7f8fa;
  border-radius: 40px;
  height: calc(812px - 80px);
  overflow: hidden;
}

.phone-content iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.phone-home {
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.home-bar {
  width: 120px;
  height: 5px;
  background: #fff;
  border-radius: 3px;
}

.phone-info {
  margin-top: 16px;
  display: flex;
  gap: 12px;
}

.phone-info span {
  padding: 6px 14px;
  background: rgba(255,255,255,0.1);
  border-radius: 20px;
  font-size: 12px;
  color: #888;
}

/* 右侧开发说明 */
.doc-sidebar {
  width: 350px;
  background: #0f0f23;
  padding: 20px;
  border-left: 1px solid #333;
  overflow-y: auto;
}

.doc-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #333;
}

.doc-header h2 {
  font-size: 18px;
  color: #667eea;
}

.doc-content {
  font-size: 14px;
  line-height: 1.8;
}

.doc-section {
  margin-bottom: 24px;
}

.doc-section h3 {
  font-size: 15px;
  color: #f7b733;
  margin-bottom: 10px;
}

.doc-section p {
  color: #aaa;
  margin-bottom: 8px;
}

.doc-list {
  list-style: none;
  padding: 0;
}

.doc-list li {
  padding: 8px 12px;
  background: #1a1a2e;
  border-radius: 6px;
  margin-bottom: 6px;
  font-size: 13px;
  color: #ccc;
}

.doc-code {
  background: #1a1a2e;
  padding: 12px;
  border-radius: 8px;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 12px;
  color: #38ef7d;
  overflow-x: auto;
}
</style>
