# 苏州市体育惠民系统 (Suzhou Sports Benefit System)

苏州市体育惠民系统是一个连接市民、体育场馆、运营平台及资金监管方的综合性服务平台。本项目旨在提供便捷的体育服务预订、优惠券发放核销、资金监管及数据分析功能。

## 📂 项目结构

本项目采用多端统一管理架构，包含以下四个核心子系统：

| 子系统名称 | 对应端 | 目录位置 | 描述 |
| :--- | :--- | :--- | :--- |
| **平台运营后台** | **O端** (Operation) | `src/admin` | 负责资源整合、优惠券发放、订单管理及系统配置。 |
| **场馆管理后台** | **B端** (Business) | `src/venue-admin` | 场馆商户使用的后台，用于商品上下架、订单处理及核销。 |
| **资金监管后台** | **F端** (Fund) | `src/fund-admin` | 负责资金池管理、对账清单查询、预警监控及财务统计。 |
| **移动客户端** | **C端** (Client) | `src/mobile` | 市民使用的移动端界面，支持场馆预订、门票购买及个人中心。 |

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

启动后访问 `http://localhost:3000/` 即可进入**统一管理门户**。

### 3. 构建生产环境

```bash
npm run build
```

## 🛠 技术栈

- **构建工具**: [Vite](https://vitejs.dev/)
- **前端框架**: [Vue 3](https://vuejs.org/) (Composition API)
- **UI 组件库**: 
  - PC端: [Element Plus](https://element-plus.org/)
  - 移动端: [Vant](https://vant-ui.github.io/vant/)
- **样式工具**: [Tailwind CSS](https://tailwindcss.com/) (用于门户及新UI), SCSS
- **状态管理**: Pinia (Mock数据存储在 `src/stores/mock.js`)
- **路由管理**: Vue Router

## ✨ 核心功能

### 统一门户 (Portal)
- 提供全局导航侧边栏，支持在不同子系统间无缝切换。
- 集成移动端样机预览功能。

### 平台运营 (Admin)
- **资源管理**: 场馆信息维护。
- **运营中心**: 优惠券策略配置、订单综合查询。
- **系统管理**: 基础设置与权限控制。

### 场馆商户 (Venue Admin)
- **业务管理**: 场地/票务商品管理、上下架控制。
- **核销管理**: 支持二维码及验证码核销。
- **财务中心**: 结算记录查询。

### 资金监管 (Fund Admin)
- **资金池管理**: 专项资金池监控与调度。
- **数据中心**: 实时交易统计与异常预警。
- **对账管理**: 多维度财务对账。

### 移动端 (Mobile)
- 首页推荐、场馆列表、详情页预订。
- 个人中心、订单管理、优惠券领取。
- 微信/手机号一键登录模拟。

## 📝 目录说明

```
/
├── src/
│   ├── admin/          # 平台运营后台源码
│   ├── venue-admin/    # 场馆商户后台源码
│   ├── fund-admin/     # 资金监管后台源码
│   ├── mobile/         # 移动端源码
│   ├── stores/         # 全局状态/Mock数据
│   ├── styles/         # 全局样式文件
│   └── index.html      # 统一门户入口
├── public/             # 静态资源
└── vite.config.js      # Vite 配置文件
```

## 📄 许可证

[MIT License](LICENSE)
