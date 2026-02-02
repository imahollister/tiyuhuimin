import { defineStore } from 'pinia';

export const useMockStore = defineStore('mock', {
  state: () => ({
    // 热门分类
    categories: [
      { id: 1, name: '羽毛球', icon: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=badminton%20shuttlecock%20icon%203d%20render%2C%20colorful%2C%20cute&image_size=square' },
      { id: 2, name: '篮球', icon: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=basketball%20icon%203d%20render%2C%20colorful%2C%20cute&image_size=square' },
      { id: 3, name: '游泳', icon: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=swimming%20goggles%20icon%203d%20render%2C%20colorful%2C%20cute&image_size=square' },
      { id: 4, name: '足球', icon: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=soccer%20ball%20icon%203d%20render%2C%20colorful%2C%20cute&image_size=square' },
      { id: 5, name: '网球', icon: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=tennis%20ball%20icon%203d%20render%2C%20colorful%2C%20cute&image_size=square' },
      { id: 6, name: '健身', icon: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=dumbbell%20icon%203d%20render%2C%20colorful%2C%20cute&image_size=square' },
      { id: 7, name: '瑜伽', icon: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=yoga%20mat%20icon%203d%20render%2C%20colorful%2C%20cute&image_size=square' },
      { id: 8, name: '全部', icon: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=menu%20grid%20icon%203d%20render%2C%20colorful%2C%20cute&image_size=square' },
    ],
    // 可领取的优惠券配置
    availableCoupons: [
      { id: 101, name: '春季运动券', value: 15, minSpend: 30, type: 'general', desc: '全场通用，春季限定', total: 1000, remaining: 850 },
      { id: 102, name: '游泳专项券', value: 20, minSpend: 40, type: 'category', desc: '仅限游泳项目使用', total: 500, remaining: 120 },
      { id: 103, name: '新人见面礼', value: 50, minSpend: 0, type: 'general', desc: '新用户注册专享', total: 9999, remaining: 9999 }
    ],
    // 苏州场馆数据
    venues: [
      {
        id: 1,
        name: '苏州奥体中心',
        district: '工业园区',
        address: '工业园区中新大道东999号',
        latitude: 31.3155,
        longitude: 120.7388,
        phone: '0512-62626262',
        intro: '苏州奥林匹克体育中心（Suzhou Olympic Sports Centre），位于江苏省苏州市苏州工业园区金鸡湖东核心区，规划总面积60公顷，建筑面积约36万平方米。是集体育竞技、休闲健身、商业娱乐、文艺演出于一体的多功能、综合性、生态型的甲级体育中心。包含体育场（45000座）、体育馆（13000座）、游泳馆（3000座）等顶级设施。',
        distance: '2.5km',
        tags: ['惠民卡', '可用券', '离我最近'],
        image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20sports%20center%20building%20exterior%20in%20Suzhou%2C%20blue%20sky%2C%20high%20quality%20photography&image_size=landscape_4_3',
        price: 80,
        score: 4.9,
        // 新增字段
        venueNo: 'V001',
        enabled: true,
        isHot: true,
        isHuimin: true,
        venueType: '体育中心',
        projectType: '综合',
        video: '',
        sortOrder: 1,
        businessHours: '09:00 - 22:00',
        companyBrand: '奥体运营',
        enterpriseNature: '国企',
        officialAccountName: '苏州奥体',
        miniProgramName: '苏州奥体中心',
        miniProgramLink: '',
        miniProgramAppId: '',
        miniProgramPath: '',
        appInfo: '奥体App',
        operationCompany: '苏州奥体中心管理有限公司',
        submitter: '管理员',
        submitterPhone: '13800138000',
        accounts: [{ name: 'admin', account: 'admin01', type: '管理员' }],
        isChargeable: true,
        needReservation: true,
        hasSystem: true,
        fundSupervision: true,
        venueLevel: 'main', // main or sub
        financeInfo: {
          merchantName: '苏州奥体中心',
          creditCode: '91320594MA1XYXXXX',
          zhoudaofuId: '',
          zhoudaofuDeviceId: '',
          alipayId: '',
          huishibaoId: ''
        },
        items: [
          { id: 101, name: '羽毛球', price: 80, originalPrice: 100, stock: 12 },
          { id: 102, name: '篮球', price: 300, originalPrice: 350, stock: 5 },
          { id: 103, name: '游泳', price: 50, originalPrice: 60, stock: 99 },
          { id: 104, name: '网球', price: 120, originalPrice: 150, stock: 3 }
        ]
      },
      {
        id: 2,
        name: '苏州市体育中心',
        district: '姑苏区',
        address: '姑苏区三香路1131号',
        latitude: 31.2989,
        longitude: 120.5853,
        phone: '0512-68686868',
        intro: '苏州市体育中心体育场位于苏州市三香路1131号，建筑面积28000平方米，拥有35000个座位。体育场内场种植了高质量草皮，并拥有全天候塑胶跑道。附属设施包括18个看台休息室，1个贵宾休息室等。是苏州老牌的综合性体育场所，承载了无数苏州人的运动记忆。',
        distance: '5.0km',
        tags: ['惠民卡', '可用券', '停车免费'],
        image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Suzhou%20Sports%20Center%20stadium%20view%2C%20architectural%20photography&image_size=landscape_4_3',
        price: 60,
        score: 4.7,
        items: [
          { id: 201, name: '羽毛球', price: 60, originalPrice: 80, stock: 8 },
          { id: 202, name: '足球', price: 500, originalPrice: 600, stock: 2 },
          { id: 203, name: '乒乓球', price: 30, originalPrice: 40, stock: 15 }
        ]
      },
      {
        id: 3,
        name: '独墅湖体育馆',
        district: '工业园区',
        address: '工业园区翠薇街1号',
        latitude: 31.2680,
        longitude: 120.7250,
        phone: '0512-62888888',
        intro: '独墅湖体育馆位于苏州独墅湖科教创新区，紧邻独墅湖，风景秀丽。馆内设施先进，主要服务于周边高校师生及社区居民。拥有室内篮球场、羽毛球场、乒乓球室以及专业的攀岩设施。是举办中小型赛事和日常健身的理想场所。',
        distance: '8.2km',
        tags: ['惠民卡', '可用券'],
        image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=gymnasium%20interior%20with%20wooden%20floor%2C%20bright%20lighting&image_size=landscape_4_3',
        price: 45,
        score: 4.8,
        items: [
          { id: 301, name: '羽毛球', price: 45, originalPrice: 60, stock: 10 },
          { id: 302, name: '乒乓球', price: 30, originalPrice: 40, stock: 8 },
          { id: 303, name: '攀岩', price: 80, originalPrice: 100, stock: 20 }
        ]
      },
      {
        id: 4,
        name: '运河体育公园',
        district: '高新区',
        address: '高新区狮山路',
        latitude: 31.2950,
        longitude: 120.5600,
        phone: '0512-66666666',
        intro: '运河体育公园依托京杭大运河风光带而建，是一座开放式的生态体育公园。公园内设有专业的网球中心、篮球公园以及长达5公里的滨河健身步道。空气清新，绿树成荫，是市民晨练夜跑的首选之地。',
        distance: '6.5km',
        tags: ['惠民卡', '新店特惠'],
        image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=outdoor%20sports%20park%20with%20running%20track%20and%20green%20trees&image_size=landscape_4_3',
        price: 0,
        score: 4.6,
        items: [
          { id: 401, name: '公园门票', price: 0, originalPrice: 0, stock: 999 },
          { id: 402, name: '网球场', price: 100, originalPrice: 120, stock: 4 }
        ]
      },
      {
        id: 5,
        name: '乐动力·尹山湖全民健身中心',
        district: '吴中区',
        address: '吴中区郭巷街道',
        latitude: 31.2300,
        longitude: 120.6800,
        phone: '0512-65555555',
        intro: '乐动力·尹山湖全民健身中心引入了阿里体育的智慧场馆系统，实现了全流程智能化服务。支持人脸识别入场、智能灯光控制、运动数据分析等功能。场馆环境现代时尚，深受年轻人群喜爱。',
        distance: '12.0km',
        tags: ['可用券', '智能场馆'],
        image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20fitness%20center%20interior%20with%20gym%20equipment&image_size=landscape_4_3',
        price: 35,
        score: 4.8,
        items: [
          { id: 501, name: '健身单次', price: 35, originalPrice: 50, stock: 50 },
          { id: 502, name: '篮球散客', price: 20, originalPrice: 25, stock: 30 }
        ]
      }
    ],
    // 用户资产
    userAssets: {
      balance: 1200.50, // 惠民余额
      favorites: [], // 收藏的场馆ID列表
      history: [], // 浏览足迹ID列表 (新)
      coupons: [
        { id: 1, name: '全市通用券', value: 20, minSpend: 50, type: 'general', status: 0, endDate: '2026-12-31', desc: '适用于所有参与惠民活动的场馆' },
        { id: 2, name: '园区专项券', value: 50, minSpend: 100, type: 'district', status: 0, endDate: '2026-12-31', desc: '仅限工业园区场馆使用' },
        { id: 3, name: '大额满减券', value: 100, minSpend: 300, type: 'general', status: 0, endDate: '2026-06-30', desc: '单笔订单满300可用' },
        { id: 4, name: '新用户体验券', value: 10, minSpend: 0, type: 'general', status: 1, endDate: '2025-12-31', desc: '新人专享无门槛' }, // 已使用
        { id: 5, name: '限时活动券', value: 30, minSpend: 100, type: 'general', status: 2, endDate: '2023-12-31', desc: '过期不可用' } // 已过期
      ],
      orders: [
        {
          id: 'ORD17067890123',
          venueName: '苏州奥体中心',
          itemName: '羽毛球 - 1号场 19:00-20:00',
          price: 80,
          realPay: 60,
          status: 'pending',
          createTime: '2025-02-02 10:15:22',
          image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=badminton%20court&image_size=square'
        },
        {
          id: 'ORD17067888111',
          venueName: '独墅湖体育馆',
          itemName: '游泳单次票',
          price: 45,
          realPay: 25,
          status: 'paid',
          createTime: '2025-02-01 14:30:00',
          image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=swimming%20pool&image_size=square'
        },
        {
          id: 'ORD17067812345',
          venueName: '苏州市体育中心',
          itemName: '篮球半场包场',
          price: 300,
          realPay: 250,
          status: 'used',
          createTime: '2025-01-20 18:00:00',
          image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=basketball%20court&image_size=square'
        },
        {
          id: 'ORD17067800001',
          venueName: '运河体育公园',
          itemName: '网球场 - 中心场',
          price: 120,
          realPay: 120,
          status: 'refunded',
          createTime: '2025-01-15 09:00:00',
          image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=tennis%20court&image_size=square'
        }
      ]
    },
    // 当前订单
    currentOrder: null
  }),
  actions: {
    toggleFavorite(venueId) {
      const index = this.userAssets.favorites.indexOf(venueId);
      if (index === -1) {
        this.userAssets.favorites.push(venueId);
        return true; // 收藏成功
      } else {
        this.userAssets.favorites.splice(index, 1);
        return false; // 取消收藏
      }
    },
    addToHistory(venueId) {
      // 移除旧的记录（如果存在），添加到头部
      const index = this.userAssets.history.indexOf(venueId);
      if (index !== -1) {
        this.userAssets.history.splice(index, 1);
      }
      this.userAssets.history.unshift(venueId);
      // 限制记录数量，比如最近20条
      if (this.userAssets.history.length > 20) {
        this.userAssets.history.pop();
      }
    },
    createOrder(order) {
      const newOrder = {
        ...order,
        id: 'ORD' + Date.now(),
        status: 'pending', // pending, paid, used, refunded
        createTime: new Date().toLocaleString()
      };
      this.userAssets.orders.unshift(newOrder);
      this.currentOrder = newOrder;
      return newOrder;
    },
    payOrder(orderId) {
      const order = this.userAssets.orders.find(o => o.id === orderId);
      if (order) {
        order.status = 'paid';
        // 扣除余额
        if (order.balanceUsed > 0) {
          this.userAssets.balance -= order.balanceUsed;
        }
        // 标记优惠券已使用
        if (order.couponId) {
          const coupon = this.userAssets.coupons.find(c => c.id === order.couponId);
          if (coupon) coupon.status = 1;
        }
      }
    }
  },
  persist: true // 需要配合插件，这里暂时用简单的 store
});
