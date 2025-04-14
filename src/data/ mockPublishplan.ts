import dayjs from 'dayjs';
// 注意：这里假设类型文件最终会放在 ../types/publish.ts, 如果路径不同需要调整
import { Plan, XHSAccount, ImageMaterial } from '../types/publish';

export const mockAccounts: XHSAccount[] = [
  {
    id: '1',
    avatar: 'https://picsum.photos/100/100?random=1',
    nickname: '时尚生活家',
    followers: 12580,
    posts: 326,
    status: 'active',
    growth: {
      followers: 580,
      views: 125000,
      likes: 8900,
      comments: 1200,
      saves: 3400
    },
    recentPosts: [
      {
        id: '1',
        title: '春季穿搭分享',
        views: 2451,
        likes: 167,
        comments: 32,
        saves: 89
      },
      {
        id: '2',
        title: '新品开箱测评',
        views: 1892,
        likes: 145,
        comments: 28,
        saves: 76
      }
    ]
  },
  {
    id: '2',
    avatar: 'https://picsum.photos/100/100?random=2',
    nickname: '美食探店达人',
    followers: 45678,
    posts: 892,
    status: 'active',
    growth: {
      followers: 678,
      views: 256000,
      likes: 15600,
      comments: 2100,
      saves: 5600
    },
    recentPosts: [
      {
        id: '3',
        title: '新开网红店打卡',
        views: 3421,
        likes: 156,
        comments: 42,
        saves: 89
      },
      {
        id: '4',
        title: '美食推荐合集',
        views: 2876,
        likes: 134,
        comments: 28,
        saves: 67
      }
    ]
  },
  {
    id: '3',
    avatar: 'https://picsum.photos/100/100?random=3',
    nickname: '旅行摄影师',
    followers: 89012,
    posts: 567,
    status: 'inactive',
    growth: {
      followers: 0,
      views: 0,
      likes: 0,
      comments: 0,
      saves: 0
    },
    recentPosts: []
  }
];

export const mockPlans: Plan[] = [
];

export const mockContentData = [
  {
    id: '1',
    title: '夏日护肤必备单品推荐',
    publishTime: dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm'),
    imageUrl: 'https://picsum.photos/400/400?random=1'
  },
  {
    id: '2',
    title: '清爽不油腻的面霜测评',
    publishTime: dayjs().add(2, 'day').format('YYYY-MM-DD HH:mm'),
    imageUrl: 'https://picsum.photos/400/400?random=2'
  },
  {
    id: '3',
    title: '敏感肌的福音-温和清洁',
    publishTime: dayjs().add(3, 'day').format('YYYY-MM-DD HH:mm'),
    imageUrl: 'https://picsum.photos/400/400?random=3'
  },
  {
    id: '4',
    title: '口碑爆款面霜大揭秘',
    publishTime: dayjs().add(4, 'day').format('YYYY-MM-DD HH:mm'),
    imageUrl: 'https://picsum.photos/400/400?random=4'
  },
  {
    id: '5',
    title: '新品首发-玫瑰精华水',
    publishTime: dayjs().add(5, 'day').format('YYYY-MM-DD HH:mm'),
    imageUrl: 'https://picsum.photos/400/400?random=5'
  }
];


// Mock 热点数据
export const mockHotTopics = [
  {
    id: 'ht-1',
    title: '春季流感多发预防指南',
    relevance: 85,
    created: false,
    date: '2024-03-25',
    views: 1520000,
    details: '近期气温变化大，流感病例增多，专家建议多注意个人卫生、勤洗手、戴口罩，避免到人员密集场所活动，增强体质预防流感。'
  },
  {
    id: 'ht-2',
    title: '居家小空间收纳技巧',
    relevance: 92,
    created: true,
    date: '2024-03-25',
    views: 2650000,
    details: '春季整理季，多功能家具、墙面收纳、抽屉分隔等技巧，让小户型空间利用最大化，打造整洁舒适的居家环境。'
  },
  {
    id: 'ht-3',
    title: '春季穿搭流行元素',
    relevance: 78,
    created: false,
    date: '2024-03-25',
    views: 1890000,
    details: '2024春季流行色彩包括薄荷绿、柔和蓝、奶油黄，流行元素有蝴蝶结、荷叶边、条纹，轻薄面料成为主流选择。'
  },
  {
    id: 'ht-4',
    title: '健康低卡减脂餐分享',
    relevance: 80,
    created: true,
    date: '2024-03-25',
    views: 2150000,
    details: '春季是减肥好时机，高蛋白低碳水饮食，搭配适量运动，有效促进新陈代谢，健康瘦身不反弹。'
  }
];

// 昨日热点数据
export const mockHotTopicsYesterday = [
  {
    id: 'ht-5',
    title: '春季皮肤护理必备品',
    relevance: 88,
    created: true,
    date: '2024-03-24',
    views: 1820000,
    details: '春季皮肤易干燥敏感，补水保湿成为首要任务，同时温和去角质，添加维生素C成分护肤品帮助提亮肤色。'
  },
  {
    id: 'ht-6',
    title: '阳台小花园打造指南',
    relevance: 76,
    created: false,
    date: '2024-03-24',
    views: 1420000,
    details: '春季是种植的好时节，阳台种植花草不仅美化环境，还能净化空气，从选盆、选土、选植物三步开始打造专属小花园。'
  }
];

// 热点日期选项
export const mockDateOptions = [
  { label: '今日(03-26)', value: 'today' },
  { label: '昨日(03-25)', value: 'yesterday' },
  { label: '前日(03-24)', value: 'day_before' }
];

// 模拟图片素材
export const imageMaterials: ImageMaterial[] = [
  {
    id: '1',
    url: 'https://picsum.photos/400/400?random=1',
    createTime: '2024-03-20 10:00:00',
    tags: ['产品图', '实拍'],
    usagePlan: {
      date: '2024-03-25',
      title: '春季新品开箱',
      contentType: '产品介绍'
    }
  },
  {
    id: '2',
    url: 'https://picsum.photos/400/400?random=2',
    createTime: '2024-03-19 15:30:00',
    tags: ['场景图', '生活'],
    usagePlan: {
      date: '2024-03-26',
      title: '日常穿搭分享',
      contentType: '生活记录'
    }
  },
  {
    id: '3',
    url: 'https://picsum.photos/400/400?random=3',
    createTime: '2024-03-18 09:15:00',
    tags: ['细节图', '产品'],
    usagePlan: {
      date: '2024-03-27',
      title: '产品细节展示',
      contentType: '产品介绍'
    }
  }
];

// 模拟的对话历史
export const dialogHistory = [
  {
    id: '1',
    type: 'user',
    content: '帮我把上周发的那篇"春日穿搭分享"再发一遍，但是要换个角度写',
    time: '2024-03-18 10:30'
  },
  {
    id: '2',
    type: 'assistant',
    content: `好的，我来帮你处理这个需求。让我先查看一下上周的内容...\n\n分析结果：\n1. 找到原文：《春日穿搭分享》，发布于 3月15日\n2. 核心要点：日常通勤穿搭、舒适度、时尚感\n3. 互动数据：获得2451次浏览，167个赞\n\n我的建议是从以下几个新角度改写：\n1. 将视角从"搭配展示"转变为"购物清单"\n2. 加入具体场景（如约会、面试）的搭配建议\n3. 结合最近的天气变化，增加应季性\n\n我已经开始生成新的内容，预计2分钟内完成。\n你觉得这个方向可以吗？`,
    time: '2024-03-18 10:31',
    status: 'thinking'
  },
  {
    id: '3',
    type: 'user',
    content: '最近降温了，帮我蹭一下这个热点，写几篇内容',
    time: '2024-03-18 11:00'
  },
  {
    id: '4',
    type: 'assistant',
    content: `正在分析降温话题的相关数据...\n\n发现以下热点机会：\n1. "倒春寒"话题阅读量：890万\n2. 相关关键词：保暖穿搭、养生茶饮、防感冒\n\n建议创建以下内容：\n1. 《紧急预警！降温10℃怎么穿？这些单品让你温暖又时髦》\n   - 重点：保暖单品推荐、叠穿技巧\n   - 预期互动：4.2%\n\n2. 《降温必备！5款养生茶饮在家也能轻松做》\n   - 重点：简单配方、养生知识\n   - 预期互动：3.8%\n\n3. 《春捂秋冻不是闹着玩！医生推荐的防感冒小妙招》\n   - 重点：实用建议、专业性\n   - 预期互动：3.5%\n\n是否需要我开始生成这些内容？`,
    time: '2024-03-18 11:01',
    status: 'analyzing'
  },
  {
    id: '5',
    type: 'user',
    content: '我们最近上了春季新品，帮我写几篇推广内容',
    time: '2024-03-18 11:30'
  },
  {
    id: '6',
    type: 'assistant',
    content: `让我查看一下最近的新品信息...\n\n已找到春季新品系列：\n- 连衣裙系列（3款）\n- 小众设计包包（2款）\n- 配饰系列（5款）\n\n分析建议：\n1. 内容节奏：\n   - 第1-2天：概览类内容，引发关注\n   - 第3-5天：单品深度测评\n   - 第6-7天：搭配案例分享\n\n具体方案：\n1. 《春日新品首发！这些单品让你美得不撞款》\n   - 重点：新品全系列概览\n   - 发布时间：今天下午 2点\n\n2. 《测评｜新款小众包包的5个惊喜细节》\n   - 重点：包包细节展示、使用场景\n   - 发布时间：明天上午 10点\n\n3. 《这条连衣裙=3种风格！春日穿搭速成攻略》\n   - 重点：单品多场景搭配\n   - 发布时间：后天下午 3点\n\n我已经开始准备第一篇内容，需要我先给你看看吗？`,
    time: '2024-03-18 11:31',
    status: 'working'
  }
];
