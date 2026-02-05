<template>
  <div class="landing-page">
    <!-- 顶部标题 -->
    <div class="landing-header">
      <h1>苏州市体育惠民系统</h1>
      <p>统一管理平台</p>
    </div>

    <!-- 豆腐块导航区 -->
    <div class="nav-section">
      <h2>系统入口</h2>
      <div class="grid-container">
        <div class="grid-item" @click="navigateTo('/admin/index.html')">
          <div class="icon-wrapper admin-icon">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
          </div>
          <span class="label">管理后台</span>
          <span class="desc">1920×1080</span>
        </div>

        <div class="grid-item" @click="navigateTo('/mobile/index.html')">
          <div class="icon-wrapper mobile-icon">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
              <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
            </svg>
          </div>
          <span class="label">移动端</span>
          <span class="desc">375×812</span>
        </div>

        <div class="grid-item" @click="navigateTo('/mobile/user/index.html')">
          <div class="icon-wrapper user-icon">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <span class="label">个人中心</span>
          <span class="desc">移动端页面</span>
        </div>

        <div class="grid-item" @click="openInNewTab('/mobile/index.html')">
          <div class="icon-wrapper external-icon">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
              <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
            </svg>
          </div>
          <span class="label">新窗口打开</span>
          <span class="desc">独立窗口</span>
        </div>
      </div>
    </div>

    <!-- 手机样机展示区 -->
    <div class="phone-section">
      <h2>移动端预览</h2>
      <div class="phone-mockup">
        <div class="phone-frame">
          <!-- 状态栏 -->
          <div class="phone-status-bar">
            <span class="time">9:41</span>
            <div class="status-icons">
              <svg viewBox="0 0 24 24" width="18" height="12" fill="currentColor">
                <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
              </svg>
              <svg viewBox="0 0 24 24" width="18" height="12" fill="currentColor">
                <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM13 18h-2v-2h2v2zm0-4h-2V9h2v5z"/>
              </svg>
            </div>
          </div>
          
        <!-- 手机内容区 - iframe 嵌入移动端 -->
        <div class="phone-content">
          <iframe 
            ref="phoneFrame"
            :src="currentSrc"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>

          <!-- 底部Home指示条 -->
          <div class="phone-home-bar">
            <div class="home-indicator"></div>
          </div>
        </div>
        
        <!-- 手机信息标签 -->
        <div class="phone-info">
          <span class="model">iPhone 14 Pro</span>
          <span class="size">375 × 812</span>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="landing-footer">
      <p>© 2024 苏州市体育惠民系统 | 技术支持</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const mobileSrc = ref('/mobile/index.html');

const navigateTo = (path) => {
  // 如果是相对路径，在当前窗口导航
  if (path.startsWith('/')) {
    window.location.href = path;
  } else {
    router.push(path);
  }
};

const openInNewTab = (path) => {
  window.open(path, '_blank');
};

onMounted(() => {
  // 确保 iframe 正确加载
  console.log('手机预览已加载:', mobileSrc.value);
});
</script>

<style lang="scss" scoped>
.landing-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.landing-header {
  text-align: center;
  color: #fff;
  margin-bottom: 40px;
  
  h1 {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 8px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.2);
  }
  
  p {
    font-size: 16px;
    opacity: 0.9;
  }
}

.nav-section, .phone-section {
  background: #fff;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  width: 100%;
  max-width: 900px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  
  h2 {
    font-size: 18px;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
    font-weight: 600;
  }
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    
    .icon-wrapper {
      transform: scale(1.1);
    }
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  .icon-wrapper {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    transition: transform 0.3s ease;
    
    &.admin-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
    }
    
    &.mobile-icon {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      color: #fff;
    }
    
    &.user-icon {
      background: linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%);
      color: #fff;
    }
    
    &.external-icon {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: #fff;
    }
  }
  
  .label {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
  }
  
  .desc {
    font-size: 12px;
    color: #999;
  }
}

.phone-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.phone-mockup {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.phone-frame {
  width: 375px;
  height: 812px;
  background: #000;
  border-radius: 50px;
  padding: 12px;
  box-shadow: 
    0 0 0 3px #1a1a1a,
    0 20px 60px rgba(0,0,0,0.4);
  position: relative;
}

.phone-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px 8px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  
  .status-icons {
    display: flex;
    gap: 6px;
  }
}

.phone-content {
  background: #f7f8fa;
  border-radius: 40px;
  height: calc(812px - 80px);
  overflow: hidden;
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
    transform-origin: top left;
  }
}

.phone-home-bar {
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  .home-indicator {
    width: 120px;
    height: 5px;
    background: #fff;
    border-radius: 3px;
  }
}

.phone-info {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  
  span {
    padding: 6px 12px;
    background: rgba(0,0,0,0.1);
    border-radius: 20px;
    font-size: 12px;
    color: #666;
  }
}

.landing-footer {
  color: rgba(255,255,255,0.7);
  font-size: 14px;
  margin-top: auto;
  padding-top: 20px;
}
</style>
