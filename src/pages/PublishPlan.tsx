import React, { useState, useEffect } from 'react';
import { Button, Drawer, Form, DatePicker, Space, List, Card, Modal, message, Input, Radio, Tooltip, Calendar, Tabs, Avatar, Select, Table, Badge, Row, Col, Statistic, Checkbox, Switch, Typography, Tag, Slider } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { PlusOutlined, DeleteOutlined, QuestionCircleOutlined, LoadingOutlined, CalendarOutlined, RobotOutlined, LeftOutlined, RightOutlined, ShareAltOutlined, HeartOutlined, MessageOutlined, StarOutlined, EllipsisOutlined, RiseOutlined, AppstoreOutlined, EditOutlined, ShoppingOutlined, SettingOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useParams, useNavigate } from 'react-router-dom';

dayjs.extend(isBetween);

interface Plan {
  id: string;
  name?: string;
  startDate: string;
  endDate: string;
  count: number;
  notes: Note[];
  accountId?: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  contentType?: '产品介绍' | '使用体验' | '生活记录' | '探店安利' | '干货分享';
  tone?: '轻松随意' | '专业正式' | '感性文艺' | '幽默诙谐';
  tags?: string[];
  scheduledTime?: string;
  platforms?: {
    xiaohongshu?: {
      content?: string;
      title?: string;
      imageUrl?: string;
    };
    wechat?: {
      content?: string;
      title?: string;
      imageUrl?: string;
    };
  };
  status?: 'published' | 'unpublished';
}

interface XHSAccount {
  id: string;
  avatar: string;
  nickname: string;
  followers: number;
  posts: number;
  status: 'active' | 'inactive';
  growth: {
    followers: number;
    views: number;
    likes: number;
    comments: number;
    saves: number;
  };
  recentPosts: {
    id: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
    saves: number;
  }[];
}

interface ProductData {
  id: string;
  name: string;
  price: number;
  sales: number;
  revenue: number;
}

interface ContentData {
  id: string;
  title: string;
  publishTime: string;
  views: number;
  likes: number;
  comments: number;
  saves: number;
  products: ProductData[];
}

interface PublishStrategy {
  mode: 'additional' | 'replace';
  priorities: string[];
}

const mockAccounts: XHSAccount[] = [
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

const mockPlans: Plan[] = [
  {
    id: 'plan-1',
    name: '春季新品推广计划',
    startDate: '2024-03-18',
    endDate: '2024-03-24',
    count: 6,
    notes: [
      {
        id: 'note-1',
        title: '春季连衣裙上新',
        content: '分享一款春季必备的连衣裙...',
        imageUrl: 'https://picsum.photos/400/400?random=1',
        contentType: '产品介绍',
        tone: '轻松随意',
        tags: ['春季新品', '连衣裙', '穿搭'],
        scheduledTime: '2024-03-18 10:00'
      },
      {
        id: 'note-2',
        title: '春日搭配指南',
        content: '教你如何搭配这款百搭连衣裙...',
        imageUrl: 'https://picsum.photos/400/400?random=2',
        contentType: '使用体验',
        tone: '专业正式',
        tags: ['搭配指南', '穿搭技巧'],
        scheduledTime: '2024-03-20 14:00'
      }
    ]
  },
  {
    id: 'plan-2',
    name: '美妆护肤分享',
    startDate: '2024-03-25',
    endDate: '2024-03-31',
    count: 4,
    notes: [
      {
        id: 'note-3',
        title: '春季护肤重点',
        content: '分享春季护肤的注意事项...',
        imageUrl: 'https://picsum.photos/400/400?random=3',
        contentType: '干货分享',
        tone: '专业正式',
        tags: ['护肤', '干货'],
        scheduledTime: '2024-03-25 10:00'
      }
    ]
  }
];

const mockContentData: ContentData[] = [
  {
    id: '1',
    title: '春季新品首发：轻奢设计感连衣裙',
    publishTime: '2024-03-15',
    views: 25678,
    likes: 1234,
    comments: 89,
    saves: 567,
    products: [
      {
        id: 'p1',
        name: '设计感泡泡袖连衣裙',
        price: 299,
        sales: 156,
        revenue: 46644
      },
      {
        id: 'p2',
        name: '配套腰带',
        price: 69,
        sales: 89,
        revenue: 6141
      }
    ]
  },
  {
    id: '2',
    title: '春日穿搭指南：3个实用技巧',
    publishTime: '2024-03-17',
    views: 18965,
    likes: 876,
    comments: 45,
    saves: 234,
    products: [
      {
        id: 'p3',
        name: '百搭小白鞋',
        price: 399,
        sales: 78,
        revenue: 31122
      }
    ]
  },
  {
    id: '3',
    title: '新款眼霜测评：一周使用感受分享',
    publishTime: '2024-03-20',
    views: 17450,
    likes: 945,
    comments: 76,
    saves: 321,
    products: [
      {
        id: 'p4',
        name: '多效修护眼霜',
        price: 219,
        sales: 135,
        revenue: 29565
      }
    ]
  },
  {
    id: '4',
    title: '早春约会穿搭灵感：清甜风VS成熟风',
    publishTime: '2024-03-22',
    views: 24120,
    likes: 1378,
    comments: 120,
    saves: 489,
    products: [
      {
        id: 'p5',
        name: '绑带凉鞋',
        price: 359,
        sales: 98,
        revenue: 35182
      },
      {
        id: 'p6',
        name: '小香风套装',
        price: 599,
        sales: 62,
        revenue: 37138
      }
    ]
  },
  {
    id: '5',
    title: '每天10分钟：春季懒人护肤攻略',
    publishTime: '2024-03-25',
    views: 21340,
    likes: 1056,
    comments: 94,
    saves: 378,
    products: [
      {
        id: 'p7',
        name: '温和洁面乳',
        price: 99,
        sales: 176,
        revenue: 17424
      },
      {
        id: 'p8',
        name: '多效乳液',
        price: 189,
        sales: 104,
        revenue: 19656
      }
    ]
  }
];


// Mock 热点数据

const PublishPlan: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [] = useState<'task' | 'timeline' | 'list'>('task');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [singleNoteDrawerVisible, setSingleNoteDrawerVisible] = useState(false);
  const [plans, setPlans] = useState<Plan[]>(mockPlans);  // 使用 mock 数据初始化
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [form] = Form.useForm();
  const [singleNoteForm] = Form.useForm();
  const [imageSource, setImageSource] = useState('auto');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(-1);
  const [aiAssistantVisible, setAiAssistantVisible] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [autoGenerateContent, setAutoGenerateContent] = useState(false);
  const [showAllReviewContent, setShowAllReviewContent] = useState(false);
  
  // 选题偏好状态
  const [enableHotTopics, setEnableHotTopics] = useState(true); 
  const [enableNewProducts, setEnableNewProducts] = useState(true);
  const [enableNewActivities, setEnableNewActivities] = useState(false);
  const [dynamicTopicStrategy, setDynamicTopicStrategy] = useState<'additional' | 'replace'>('additional');
  
  // 静态选题设置
  const [enableRegularPromotion, setEnableRegularPromotion] = useState(true);
  const [enableProductPromotion, setEnableProductPromotion] = useState(true);
  const [topicDistribution, setTopicDistribution] = useState({
    regularPromotion: 60,
    productPromotion: 40,
  });
  
  // 创作技能相关状态
  const [selectedSkill, setSelectedSkill] = useState<string | null>('daily');
  const [enableDailyCreation, setEnableDailyCreation] = useState(false);
  const [enableHotTopicCreation, setEnableHotTopicCreation] = useState(false);
  const [enableNewProductCreation, setEnableNewProductCreation] = useState(false);
  const [enableAssistCreation, setEnableAssistCreation] = useState(true); // 默认开启辅助创作
  
  // 热点相关度配置
  const [hotTopicRelevance, setHotTopicRelevance] = useState<number>(70);
  const [hotTopicStrategy, setHotTopicStrategy] = useState<PublishStrategy>({
    mode: 'additional',
    priorities: ['热点创作', '商品上新', '日常内容']
  });
  
  const [newProductStrategy, setNewProductStrategy] = useState<PublishStrategy>({
    mode: 'additional',
    priorities: ['商品上新', '热点创作', '日常内容']
  });
  
  // 审批提前通知时间
  const [notifyDaysBeforePublish, setNotifyDaysBeforePublish] = useState<number>(3);
  const [publishQuantity, setPublishQuantity] = useState<string>('daily');
  const [] = useState<string[]>(['10:00', '20:00']);

  const [showSkillConfig, setShowSkillConfig] = useState(false);

  const [imageSelectMode, setImageSelectMode] = useState<'auto' | 'manual'>('auto');

  // 获取当前账号信息
  const currentAccount = mockAccounts.find(acc => acc.id === id);

  // 如果没有找到账号，返回账号概览页面
  React.useEffect(() => {
    if (!currentAccount) {
      navigate('/accounts');
    }
  }, [currentAccount, navigate]);

  // 在组件useEffect部分添加默认选择第一个计划的逻辑
  useEffect(() => {
    // 初始化数据
    // ... existing code ...
    
    // 默认选中第一个发布计划
    if (plans.length > 0 && !selectedPlan) {
      setSelectedPlan(plans[0]);
    }
  }, []);


  const onClose = () => {
    setDrawerVisible(false);
    form.resetFields();
    setSelectedImages([]);
  };

  const showSingleNoteDrawer = () => {
    setSingleNoteDrawerVisible(true);
  };

  const onSingleNoteDrawerClose = () => {
    setSingleNoteDrawerVisible(false);
    singleNoteForm.resetFields();
    setSelectedImages([]);
  };

  const handleSingleNoteSubmit = async () => {
    try {
      const values = await singleNoteForm.validateFields();
      const currentDate = dayjs();
      
      const newPlan: Plan = {
        id: `plan-${Date.now()}`,
        startDate: currentDate.format('YYYY-MM-DD'),
        endDate: currentDate.format('YYYY-MM-DD'),
        count: 1,
        notes: [{
          id: `note-${Date.now()}`,
          title: `笔记-${Date.now()}`,
          content: '根据内容诉求和语气生成的内容...',
          imageUrl: values.imageUrl || `https://picsum.photos/400/400?random=${Date.now()}`,
          contentType: values.contentType,
          tone: values.tone
        }]
      };
      
      setPlans([...plans, newPlan]);
      setSelectedPlan(newPlan);
      message.success('单篇笔记创建成功！');
      onSingleNoteDrawerClose();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const startDate = values.dateRange?.[0];
      const endDate = values.dateRange?.[1];
      
      if (!startDate || !endDate) {
        message.error('请选择有效的日期范围');
        return;
      }

      const newPlan: Plan = {
        id: `plan-${Date.now()}`,
        name: values.name,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        count: values.count,
        notes: Array(values.count).fill(null).map((_, index) => ({
          id: `note-${Date.now()}-${index}`,
          title: `笔记 ${index + 1}`,
          content: '这是一篇小红书笔记内容示例...',
          imageUrl: values.imageSource === 'manual' && selectedImages[index] 
            ? selectedImages[index]
            : `https://picsum.photos/400/400?random=${index}`,
          tags: ['测试标签']
        })),
        accountId: values.accountId
      };
      
      setPlans([...plans, newPlan]);
      setSelectedPlan(newPlan);
      message.success('发布计划创建成功！');
      onClose();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  
  const handlePrevNote = () => {
    if (currentNoteIndex > 0 && selectedPlan) {
      const prevNote = selectedPlan.notes[currentNoteIndex - 1];
      setEditingNote(prevNote);
      setCurrentNoteIndex(currentNoteIndex - 1);
    }
  };
  
  const handleNextNote = () => {
    if (selectedPlan && currentNoteIndex < selectedPlan.notes.length - 1) {
      const nextNote = selectedPlan.notes[currentNoteIndex + 1];
      setEditingNote(nextNote);
      setCurrentNoteIndex(currentNoteIndex + 1);
    }
  };
  
  const handleEditSubmit = (updatedNote: Note, platform?: 'xiaohongshu' | 'wechat') => {
    if (!selectedPlan) return;
    
    const updatedPlans = plans.map(plan => {
      if (plan.id === selectedPlan.id) {
        return {
          ...plan,
          notes: plan.notes.map(note => {
            if (note.id === updatedNote.id) {
              if (platform) {
                return {
                  ...note,
                  platforms: {
                    ...note.platforms,
                    [platform]: {
                      content: updatedNote.content,
                      title: updatedNote.title,
                      imageUrl: updatedNote.imageUrl
                    }
                  }
                };
              }
              return updatedNote;
            }
            return note;
          })
        };
      }
      return plan;
    });
  
    setPlans(updatedPlans);
    setSelectedPlan(updatedPlans.find(p => p.id === selectedPlan.id) || null);
    setEditingNote(null);
    message.success('笔记更新成功！');
  };
  
  const handleDeleteNote = (noteId: string) => {
    if (!selectedPlan) return;
  
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这篇笔记吗？',
      onOk: () => {
        const updatedPlans = plans.map(plan => {
          if (plan.id === selectedPlan.id) {
            return {
              ...plan,
              notes: plan.notes.filter(note => note.id !== noteId),
              count: plan.notes.length - 1
            };
          }
          return plan;
        });
  
        setPlans(updatedPlans);
        setSelectedPlan(updatedPlans.find(p => p.id === selectedPlan.id) || null);
        message.success('笔记删除成功！');
      }
    });
  };
  


  const dateCellRender = (date: Dayjs) => {
    const dayStr = date.format('YYYY-MM-DD');
    const dayPosts = plans.flatMap(plan => {
      const startDate = dayjs(plan.startDate);
      const endDate = dayjs(plan.endDate);
      if (date.isAfter(startDate.subtract(1, 'day')) && date.isBefore(endDate.add(1, 'day'))) {
        return plan.notes.filter((_, index) => {
          const noteDate = dayjs(startDate).add(index, 'days');
          return noteDate.format('YYYY-MM-DD') === dayStr;
        });
      }
      return [];
    });

    return dayPosts.length > 0 ? (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {dayPosts.map(post => (
          <li
            key={post.id}
            style={{
              backgroundColor: '#e6f7ff',
              borderRadius: '3px',
              padding: '2px 4px',
              marginBottom: '2px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {post.title}
          </li>
        ))}
      </ul>
    ) : null;
  };

  // 模拟的对话历史
  const dialogHistory = [
    {
      id: '1',
      type: 'user',
      content: '帮我把上周发的那篇"春日穿搭分享"再发一遍，但是要换个角度写',
      time: '2024-03-18 10:30'
    },
    {
      id: '2',
      type: 'assistant',
      content: `好的，我来帮你处理这个需求。让我先查看一下上周的内容...

分析结果：
1. 找到原文：《春日穿搭分享》，发布于 3月15日
2. 核心要点：日常通勤穿搭、舒适度、时尚感
3. 互动数据：获得2451次浏览，167个赞

我的建议是从以下几个新角度改写：
1. 将视角从"搭配展示"转变为"购物清单"
2. 加入具体场景（如约会、面试）的搭配建议
3. 结合最近的天气变化，增加应季性

我已经开始生成新的内容，预计2分钟内完成。
你觉得这个方向可以吗？`,
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
      content: `正在分析降温话题的相关数据...

发现以下热点机会：
1. "倒春寒"话题阅读量：890万
2. 相关关键词：保暖穿搭、养生茶饮、防感冒

建议创建以下内容：
1. 《紧急预警！降温10℃怎么穿？这些单品让你温暖又时髦》
   - 重点：保暖单品推荐、叠穿技巧
   - 预期互动：4.2%

2. 《降温必备！5款养生茶饮在家也能轻松做》
   - 重点：简单配方、养生知识
   - 预期互动：3.8%

3. 《春捂秋冻不是闹着玩！医生推荐的防感冒小妙招》
   - 重点：实用建议、专业性
   - 预期互动：3.5%

是否需要我开始生成这些内容？`,
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
      content: `让我查看一下最近的新品信息...

已找到春季新品系列：
- 连衣裙系列（3款）
- 小众设计包包（2款）
- 配饰系列（5款）

分析建议：
1. 内容节奏：
   - 第1-2天：概览类内容，引发关注
   - 第3-5天：单品深度测评
   - 第6-7天：搭配案例分享

具体方案：
1. 《春日新品首发！这些单品让你美得不撞款》
   - 重点：新品全系列概览
   - 发布时间：今天下午 2点

2. 《测评｜新款小众包包的5个惊喜细节》
   - 重点：包包细节展示、使用场景
   - 发布时间：明天上午 10点

3. 《这条连衣裙=3种风格！春日穿搭速成攻略》
   - 重点：单品多场景搭配
   - 发布时间：后天下午 3点

我已经开始准备第一篇内容，需要我先给你看看吗？`,
      time: '2024-03-18 11:31',
      status: 'working'
    }
  ];

  // 添加handleEditNote函数
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
  };

  const renderTaskView = () => {
    // 定义技能列表数据
    const skillsList = [
      {
        id: 'daily',
        name: '日常内容托管',
        description: '定期基于素材库图片与商品进行创作',
        enabled: enableDailyCreation,
        setEnabled: setEnableDailyCreation,
        icon: <AppstoreOutlined />,
        color: '#1890ff',
        content: [
          ...mockContentData.slice(0, 3).map(item => ({
            id: `daily-${item.id}`,
            title: item.title,
            content: '基于素材库的日常创作内容，结合店铺商品生成有吸引力的内容...',
            imageUrl: `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 100)}`,
            scheduledTime: item.publishTime,
            platforms: { 
              xiaohongshu: {
                content: '',
                title: '',
                imageUrl: ''
              },
              wechat: {
                content: '',
                title: '',
                imageUrl: ''
              }
            }
          }))
        ]
      },
      {
        id: 'hotTopic',
        name: '热点创作',
        description: '结合外部热点数据进行创作',
        enabled: enableHotTopicCreation,
        setEnabled: setEnableHotTopicCreation,
        icon: <RiseOutlined />,
        color: '#fa541c',
        content: [
          ...mockContentData.slice(3, 5).map(item => ({
            id: `hot-${item.id}`,
            title: `热点：${item.title}`,
            content: '结合当前热点话题创作的内容，紧跟潮流增加曝光率...',
            imageUrl: `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 100) + 100}`,
            scheduledTime: item.publishTime,
            platforms: { 
              xiaohongshu: {
                content: '',
                title: '',
                imageUrl: ''
              },
              wechat: {
                content: '',
                title: '',
                imageUrl: ''
              }
            }
          }))
        ]
      },
      {
        id: 'newProduct',
        name: '商品上新创作',
        description: '商品上新时自动进行创作',
        enabled: enableNewProductCreation,
        setEnabled: setEnableNewProductCreation,
        icon: <ShoppingOutlined />,
        color: '#52c41a',
        content: [
          ...mockContentData.slice(5, 8).map(item => ({
            id: `product-${item.id}`,
            title: `新品：${item.title}`,
            content: '针对新上架商品自动创作的推广内容，突出商品卖点...',
            imageUrl: `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 100) + 200}`,
            scheduledTime: item.publishTime,
            platforms: { 
              xiaohongshu: {
                content: '',
                title: '',
                imageUrl: ''
              },
              wechat: {
                content: '',
                title: '',
                imageUrl: ''
              }
            }
          }))
        ]
      },
      {
        id: 'assist',
        name: '辅助创作',
        description: 'AI辅助你进行内容创作',
        enabled: enableAssistCreation,
        setEnabled: setEnableAssistCreation,
        icon: <EditOutlined />,
        color: '#722ed1',
        content: [
          ...mockContentData.slice(2, 4).map(item => ({
            id: `assist-${item.id}`,
            title: `${item.title}`,
            content: 'AI辅助创作的内容，通过简单的提示词由你主导创作方向...',
            imageUrl: `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 100) + 300}`,
            scheduledTime: item.publishTime,
            platforms: { 
              xiaohongshu: {
                content: '',
                title: '',
                imageUrl: ''
              },
              wechat: {
                content: '',
                title: '',
                imageUrl: ''
              }
            }
          }))
        ]
      }
    ];

    // 获取当前选中的技能
    const currentSkill = skillsList.find(skill => skill.id === selectedSkill) || skillsList[0];

    return (
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧技能列表 */}
        <div style={{ 
          width: '260px', 
          backgroundColor: '#f7f7f7', 
          padding: '16px',
          borderRadius: '8px',
          height: 'calc(100vh - 200px)',
          overflow: 'auto',
          flexShrink: 0
        }}>
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '16px', 
            marginBottom: '16px',
            padding: '0 8px'
          }}>
            创作技能列表
          </div>
          
          {skillsList.map(skill => (
            <div 
              key={skill.id}
              onClick={() => setSelectedSkill(skill.id)}
              style={{ 
                padding: '12px 16px',
                marginBottom: '12px',
                backgroundColor: selectedSkill === skill.id ? '#fff' : 'transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                border: selectedSkill === skill.id ? '1px solid #ffffff' : '1px solid transparent',
                boxShadow: selectedSkill === skill.id ? '0 2px 8px rgba(0, 0, 0, 0.05)' : 'none',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: selectedSkill === skill.id ? 'bold' : 'normal',
                marginBottom: '4px',
                color: selectedSkill === skill.id ? skill.color : '#333'
              }}>
                <span style={{ 
                  display: 'inline-flex',
                  padding: '4px',
                  borderRadius: '4px',
                  backgroundColor: `${skill.color}10`
                }}>
                  {skill.icon}
                </span>
                {skill.name}
                <Badge status={skill.enabled ? "success" : "default"} style={{ marginLeft: 'auto' }} />
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {skill.description}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#999', 
                marginTop: '4px',
              }}>
                {skill.enabled ? `已创作内容：${skill.content.length}篇` : '未启用'}
              </div>
            </div>
          ))}
        </div>

        {/* 右侧内容区域 */}
        <div style={{ flex: 1, overflow: 'auto', maxWidth: 'calc(100vw - 250px)' }}>
          {/* 辅助创作技能 */}
          {currentSkill.id === 'assist' && (
            <>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '24px',
                padding: '0px 16px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  color: currentSkill.color
                }}>
                  <span style={{ 
                    display: 'inline-flex',
                    padding: '4px',
                    borderRadius: '4px',
                    backgroundColor: `${currentSkill.color}10`
                  }}>
                    {currentSkill.icon}
                  </span>
                  {currentSkill.name}
                </div>
                <Space>
                  <Button type="primary" icon={<PlusOutlined />} onClick={showSingleNoteDrawer}>
                    创作笔记
                  </Button>
                </Space>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', 
                gap: '16px' 
              }}>
                {currentSkill.content.map(note => (
                  <Card 
                    key={note.id}
                    hoverable
                    style={{ height: '100%', fontSize: '0.9em' }}
                    cover={note.imageUrl ? <img alt={note.title} src={note.imageUrl} style={{ height: '140px', objectFit: 'cover' }} /> : null}
                    actions={[
                      <EditOutlined key="edit" onClick={() => handleEditNote(note)} />,
                      <DeleteOutlined key="delete" onClick={() => handleDeleteNote(note.id)} />
                    ]}
                    size="small"
                  >
                    <Card.Meta
                      title={<div style={{ fontSize: '0.95em' }}>{note.title}</div>}
                      description={
                        <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ fontSize: '0.85em' }}>
                          {note.content}
                        </Typography.Paragraph>
                      }
                    />
                    <div style={{ marginTop: '8px', fontSize: '11px', color: '#999' }}>
                      计划发布时间: {dayjs(note.scheduledTime).format('YYYY-MM-DD HH:mm')}
                    </div>
                    {note.platforms && (
                      <div style={{ marginTop: '6px' }}>
                        {note.platforms.xiaohongshu && <Tag color="red" style={{ fontSize: '10px', padding: '0 4px' }}>小红书</Tag>}
                        {note.platforms.wechat && <Tag color="green" style={{ fontSize: '10px', padding: '0 4px' }}>微信</Tag>}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </>
          )}
          
          {/* 非辅助创作技能且未开启时显示配置界面 */}
          {currentSkill.id !== 'assist' && !currentSkill.enabled ? (
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      display: 'inline-flex',
                      padding: '6px',
                      borderRadius: '6px',
                      backgroundColor: `${currentSkill.color}10`,
                      color: currentSkill.color
                    }}>
                      {currentSkill.icon}
                    </span>
                    <span>{currentSkill.name}技能</span>
                  </div>
                  <Button 
                    type="primary" 
                    onClick={() => {
                      currentSkill.setEnabled(true);
                      message.success(`已开启${currentSkill.name}技能`);
                    }}
                  >
                    开启{currentSkill.name}技能
                  </Button>
                </div>
              }
            >
              <div style={{ padding: '0 0 20px 0' }}>
                <div style={{ marginBottom: '24px', fontSize: '16px', width: '100%' }}>
                  {currentSkill.id === 'daily' && (
                    <div style={{ marginBottom: '24px', width: '100%' }}>
                      <p>AI会根据您的素材库和商品信息，定期创作高质量的日常内容。</p>
                      <br></br>

                      <Card style={{ marginBottom: '16px' }} title="创作频率">
                        <div style={{ padding: '0' }}>
                          <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1', minWidth: '200px' }}>
                              <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>发布频率</div>
                              <Select
                                defaultValue="daily1"
                                style={{ width: '100%' }}
                              >
                                <Select.Option value="daily1">每日一篇</Select.Option>
                                <Select.Option value="daily2">每日两篇</Select.Option>
                                <Select.Option value="daily3">每日三篇</Select.Option>
                                <Select.Option value="twoday1">两日一篇</Select.Option>
                              </Select>
                            </div>
                            
                            <div style={{ flex: '1', minWidth: '200px' }}>
                              <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>发布时间</div>
                              <Select
                                mode="multiple"
                                defaultValue={['10:00', '20:00']}
                                style={{ width: '100%' }}
                              >
                                <Select.Option value="09:00">上午9:00</Select.Option>
                                <Select.Option value="10:00">上午10:00</Select.Option>
                                <Select.Option value="12:00">中午12:00</Select.Option>
                                <Select.Option value="15:00">下午15:00</Select.Option>
                                <Select.Option value="18:00">晚上18:00</Select.Option>
                                <Select.Option value="20:00">晚上20:00</Select.Option>
                              </Select>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1', minWidth: '200px' }}>
                              <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>AI提前几天通知我审批内容</div>
                              <Select
                                value={notifyDaysBeforePublish}
                                onChange={(value) => setNotifyDaysBeforePublish(value)}
                                style={{ width: '100%' }}
                              >
                                <Select.Option value={1}>提前1天</Select.Option>
                                <Select.Option value={2}>提前2天</Select.Option>
                                <Select.Option value={3}>提前3天</Select.Option>
                                <Select.Option value={5}>提前5天</Select.Option>
                                <Select.Option value={7}>提前7天</Select.Option>
                              </Select>
                            </div>
                            
                            <div style={{ flex: '1', minWidth: '200px' }}>
                              <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>一次性审批几天的发布内容</div>
                              <Select
                                value={publishQuantity}
                                onChange={(value) => setPublishQuantity(value)}
                                style={{ width: '100%' }}
                              >
                                <Select.Option value="daily">7天内容</Select.Option>
                                <Select.Option value="weekly">每周三篇</Select.Option>
                                <Select.Option value="biweekly">每两周五篇</Select.Option>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card style={{ marginBottom: '16px' }} title="图片源选择">
                        <div style={{ padding: '0' }}>
                          <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>选图模式</div>
                            <Radio.Group 
                              defaultValue="auto" 
                              style={{ marginBottom: '16px' }}
                              onChange={(e) => setImageSelectMode(e.target.value)}
                            >
                              <Radio value="auto">自动选图</Radio>
                              <Radio value="manual">手动选图</Radio>
                            </Radio.Group>

                            {imageSelectMode === 'auto' ? (
                              <>
                                <div style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>
                                  AI将在所选素材库分类中，自动为每篇内容匹配最合适的图片
                                </div>
                                <Checkbox.Group 
                                  style={{ width: '100%' }} 
                                  defaultValue={['product', 'fashion']}
                                >
                                  <Row>
                                    <Col span={8}><Checkbox value="product">商品图片</Checkbox></Col>
                                    <Col span={8}><Checkbox value="fashion">时尚生活</Checkbox></Col>
                                    <Col span={8}><Checkbox value="people">人物图片</Checkbox></Col>
                                    <Col span={8}><Checkbox value="food">美食图片</Checkbox></Col>
                                    <Col span={8}><Checkbox value="scene">场景图片</Checkbox></Col>
                                    <Col span={8}><Checkbox value="travel">旅行图片</Checkbox></Col>
                                  </Row>
                                </Checkbox.Group>
                              </>
                            ) : (
                              <>
                                <div style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>
                                  AI将在您指定的图片中，自动为每篇内容选择最合适的图片
                                </div>
                                <div style={{ 
                                  border: '1px dashed #d9d9d9',
                                  borderRadius: '8px',
                                  padding: '16px',
                                  backgroundColor: '#fafafa'
                                }}>
                                  <div style={{ 
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                                    gap: '8px',
                                    marginBottom: '16px'
                                  }}>
                                    {selectedImages.map((image, index) => (
                                      <div 
                                        key={index}
                                        style={{ 
                                          position: 'relative',
                                          aspectRatio: '1',
                                          borderRadius: '4px',
                                          overflow: 'hidden'
                                        }}
                                      >
                                        <img 
                                          src={image} 
                                          style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                          }}
                                          alt={`已选图片 ${index + 1}`}
                                        />
                                        <Button
                                          type="text"
                                          icon={<DeleteOutlined />}
                                          style={{
                                            position: 'absolute',
                                            top: '4px',
                                            right: '4px',
                                            background: 'rgba(255,255,255,0.8)',
                                            padding: '4px',
                                            minWidth: 'unset',
                                            height: 'unset'
                                          }}
                                          onClick={() => {
                                            const newImages = [...selectedImages];
                                            newImages.splice(index, 1);
                                            setSelectedImages(newImages);
                                          }}
                                        />
                                      </div>
                                    ))}
                                    <Button 
                                      type="dashed"
                                      style={{ 
                                        height: '100%',
                                        aspectRatio: '1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                      onClick={() => {
                                        Modal.info({
                                          title: '选择图片',
                                          width: 800,
                                          content: (
                                            <div style={{ 
                                              display: 'grid', 
                                              gridTemplateColumns: 'repeat(4, 1fr)', 
                                              gap: 12,
                                              padding: '12px 0'
                                            }}>
                                              {Array(12).fill(null).map((_, index) => (
                                                <div
                                                  key={index}
                                                  style={{
                                                    border: '1px solid #f0f0f0',
                                                    borderRadius: 8,
                                                    padding: 4,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s'
                                                  }}
                                                  onClick={() => {
                                                    const imageUrl = `https://picsum.photos/400/400?random=${index}`;
                                                    if (!selectedImages.includes(imageUrl)) {
                                                      setSelectedImages([...selectedImages, imageUrl]);
                                                    }
                                                  }}
                                                >
                                                  <img
                                                    src={`https://picsum.photos/400/400?random=${index}`}
                                                    alt={`素材 ${index + 1}`}
                                                    style={{ 
                                                      width: '100%', 
                                                      height: 150, 
                                                      objectFit: 'cover',
                                                      borderRadius: 4
                                                    }}
                                                  />
                                                </div>
                                              ))}
                                            </div>
                                          ),
                                          onOk() {}
                                        });
                                      }}
                                    >
                                      <PlusOutlined />
                                    </Button>
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#999', textAlign: 'center' }}>
                                    已选择 {selectedImages.length} 张图片
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </Card>

                      <Card style={{ marginBottom: '16px' }} title="主推商品">
                        <div style={{ padding: '0' }}>
                          <div className="setting-section">
                            <Table
                              dataSource={[
                                {
                                  id: '1',
                                  name: '设计感泡泡袖连衣裙',
                                  category: '服装',
                                  price: '¥299'
                                },
                                {
                                  id: '2',
                                  name: '多效修护眼霜',
                                  category: '护肤',
                                  price: '¥219'
                                },
                                {
                                  id: '3',
                                  name: '法式复古小方包',
                                  category: '配饰',
                                  price: '¥399'
                                },
                              ]}
                              columns={[
                                {
                                  title: '商品名称',
                                  dataIndex: 'name',
                                  key: 'name',
                                },
                                {
                                  title: '分类',
                                  dataIndex: 'category',
                                  key: 'category',
                                },
                                {
                                  title: '价格',
                                  dataIndex: 'price',
                                  key: 'price',
                                },
                                {
                                  title: '操作',
                                  key: 'action',
                                  render: (_) => (
                                    <Button type="link" danger size="small">
                                      删除
                                    </Button>
                                  ),
                                },
                              ]}
                              size="small"
                              pagination={false}
                            />
                            <Button 
                              type="dashed" 
                              block 
                              icon={<PlusOutlined />} 
                              style={{ marginTop: '16px' }}
                            >
                              添加主推商品
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                  {currentSkill.id === 'hotTopic' && (
                    <>
                      <p>AI将实时监测行业热点和相关趋势，创作紧跟热点的内容。</p>
                      <p>提升内容的时效性和曝光率，让您的账号更具影响力。</p>
                    </>
                  )}
                  {currentSkill.id === 'newProduct' && (
                    <>
                      <p>当您添加新商品时，AI会自动识别并创作推广这些新品的内容。</p>
                      <p>无需人工干预，让新品自动获得曝光和销售机会。</p>
                    </>
                  )}
                </div>
                
                <div style={{ marginBottom: '24px', width: '100%' }}>
                  {currentSkill.id === 'hotTopic' && (
                    <div style={{ marginBottom: '24px', width: '100%' }}>
                      <Card title="热点相关度配置">
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ marginBottom: '8px' }}>相关度阈值（仅创作与您业务相关度高于此阈值的热点内容）：</div>
                          <Select 
                            value={hotTopicRelevance} 
                            onChange={(value: number) => {
                              setHotTopicRelevance(value);
                            }}
                            style={{ width: 120 }}
                          >
                            <Select.Option value={50}>50%</Select.Option>
                            <Select.Option value={60}>60%</Select.Option>
                            <Select.Option value={70}>70%</Select.Option>
                            <Select.Option value={80}>80%</Select.Option>
                            <Select.Option value={90}>90%</Select.Option>
                          </Select>
                        </div>
                      </Card>

                      <Card title="发布策略" style={{ marginTop: '16px' }}>
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>当出现热点内容时：</div>
                          <Radio.Group 
                            value={hotTopicStrategy.mode}
                            onChange={(e: RadioChangeEvent) => setHotTopicStrategy({
                              ...hotTopicStrategy,
                              mode: e.target.value as 'additional' | 'replace'
                            })}
                          >
                            <Space direction="vertical">
                              <Radio value="additional">额外发布一篇内容</Radio>
                              <Radio value="replace">替换已计划的内容（根据优先级）</Radio>
                            </Space>
                          </Radio.Group>
                        </div>

                        <div>
                          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>内容优先级排序：</div>
                          <div style={{ color: '#666', fontSize: '12px', marginBottom: '12px' }}>
                            拖动调整顺序，优先级从高到低
                          </div>
                          <div style={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                          }}>
                            {hotTopicStrategy.priorities.map((item, index) => (
                              <div
                                key={item}
                                style={{
                                  padding: '8px 16px',
                                  backgroundColor: '#f5f5f5',
                                  borderRadius: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  cursor: 'move'
                                }}
                              >
                                <div style={{ marginRight: '8px', color: '#999' }}>{index + 1}</div>
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                  
                  {currentSkill.id === 'newProduct' && (
                    <div style={{ marginBottom: '24px', width: '100%' }}>
                      <Card title="推广力度">
                        <Select defaultValue="medium" style={{ width: 300 }}>
                          <Select.Option value="light">轻度推广 (每个新品1篇内容)</Select.Option>
                          <Select.Option value="medium">中度推广 (每个新品2篇内容)</Select.Option>
                          <Select.Option value="heavy">重度推广 (每个新品3篇内容)</Select.Option>
                        </Select>
                      </Card>

                      <Card title="发布策略" style={{ marginTop: '16px' }}>
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>当有新品上架时：</div>
                          <Radio.Group 
                            value={newProductStrategy.mode}
                            onChange={(e: RadioChangeEvent) => setNewProductStrategy({
                              ...newProductStrategy,
                              mode: e.target.value as 'additional' | 'replace'
                            })}
                          >
                            <Space direction="vertical">
                              <Radio value="additional">额外发布一篇内容</Radio>
                              <Radio value="replace">替换已计划的内容（根据优先级）</Radio>
                            </Space>
                          </Radio.Group>
                        </div>

                        <div>
                          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>内容优先级排序：</div>
                          <div style={{ color: '#666', fontSize: '12px', marginBottom: '12px' }}>
                            拖动调整顺序，优先级从高到低
                          </div>
                          <div style={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                          }}>
                            {newProductStrategy.priorities.map((item, index) => (
                              <div
                                key={item}
                                style={{
                                  padding: '8px 16px',
                                  backgroundColor: '#f5f5f5',
                                  borderRadius: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  cursor: 'move'
                                }}
                              >
                                <div style={{ marginRight: '8px', color: '#999' }}>{index + 1}</div>
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    type="primary" 
                    size="large"
                    onClick={() => {
                      currentSkill.setEnabled(true);
                      message.success(`已开启${currentSkill.name}技能`);
                    }}
                  >
                    开启{currentSkill.name}技能
                  </Button>
                </div>
              </div>
            </Card>
          ) : currentSkill.id !== 'assist' ? (
            // 非辅助创作技能且已开启时显示内容列表
            <>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '24px',
                padding: '0px 16px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  color: currentSkill.color
                }}>
                  <span style={{ 
                    display: 'inline-flex',
                    padding: '4px',
                    borderRadius: '4px',
                    backgroundColor: `${currentSkill.color}10`
                  }}>
                    {currentSkill.icon}
                  </span>
                  {currentSkill.name}技能创作内容
                </div>
                <Space>
                  <Button type="default" icon={<SettingOutlined />} onClick={() => setShowSkillConfig(true)}>
                    编辑配置
                  </Button>
                  <Button type="primary" danger onClick={() => {
                    currentSkill.setEnabled(false);
                    message.info(`已关闭${currentSkill.name}技能`);
                  }}>
                    关闭技能
                  </Button>
                </Space>
              </div>

              {/* 技能配置抽屉 */}
              <Drawer
                title={`${currentSkill.name}技能配置`}
                placement="right"
                width={600}
                onClose={() => setShowSkillConfig(false)}
                open={showSkillConfig}
                extra={
                  <Button type="primary" onClick={() => {
                    setShowSkillConfig(false);
                    message.success('配置已保存');
                  }}>
                    保存配置
                  </Button>
                }
              >
                {currentSkill.id === 'daily' && (
                  <div style={{ marginBottom: '24px', width: '100%' }}>
                    <p>AI会根据您的素材库和商品信息，定期创作高质量的日常内容。</p>
                    <p></p>

                    <Card style={{ marginBottom: '16px' }} title="创作频率">
                      <div style={{ padding: '0' }}>
                        <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                          <div style={{ flex: '1', minWidth: '200px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>发布频率</div>
                            <Select
                              defaultValue="daily1"
                              style={{ width: '100%' }}
                            >
                              <Select.Option value="daily1">每日一篇</Select.Option>
                              <Select.Option value="daily2">每日两篇</Select.Option>
                              <Select.Option value="daily3">每日三篇</Select.Option>
                              <Select.Option value="twoday1">两日一篇</Select.Option>
                            </Select>
                          </div>
                          
                          <div style={{ flex: '1', minWidth: '200px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>发布时间</div>
                            <Select
                              mode="multiple"
                              defaultValue={['10:00', '20:00']}
                              style={{ width: '100%' }}
                            >
                              <Select.Option value="09:00">上午9:00</Select.Option>
                              <Select.Option value="10:00">上午10:00</Select.Option>
                              <Select.Option value="12:00">中午12:00</Select.Option>
                              <Select.Option value="15:00">下午15:00</Select.Option>
                              <Select.Option value="18:00">晚上18:00</Select.Option>
                              <Select.Option value="20:00">晚上20:00</Select.Option>
                            </Select>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                          <div style={{ flex: '1', minWidth: '200px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>AI提前几天通知我审批内容</div>
                            <Select
                              value={notifyDaysBeforePublish}
                              onChange={(value) => setNotifyDaysBeforePublish(value)}
                              style={{ width: '100%' }}
                            >
                              <Select.Option value={1}>提前1天</Select.Option>
                              <Select.Option value={2}>提前2天</Select.Option>
                              <Select.Option value={3}>提前3天</Select.Option>
                              <Select.Option value={5}>提前5天</Select.Option>
                              <Select.Option value={7}>提前7天</Select.Option>
                            </Select>
                          </div>
                          
                          <div style={{ flex: '1', minWidth: '200px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>一次性审批几天的发布内容</div>
                            <Select
                              value={publishQuantity}
                              onChange={(value) => setPublishQuantity(value)}
                              style={{ width: '100%' }}
                            >
                              <Select.Option value="daily">7天内容</Select.Option>
                              <Select.Option value="weekly">每周三篇</Select.Option>
                              <Select.Option value="biweekly">每两周五篇</Select.Option>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </Card>
                    <Card style={{ marginBottom: '16px' }} title="图片源选择">
                      {/* 保持原有的图片源选择配置内容 */}
                      // ... existing code ...
                    </Card>
                    <Card style={{ marginBottom: '16px' }} title="主推商品">
                      {/* 保持原有的主推商品配置内容 */}
                      // ... existing code ...
                    </Card>
                  </div>
                )}
                {currentSkill.id === 'hotTopic' && (
                  <div style={{ marginBottom: '24px', width: '100%' }}>
                    <Card title="热点相关度配置">
                      {/* 保持原有的热点相关度配置内容 */}
                      // ... existing code ...
                    </Card>
                  </div>
                )}
                {currentSkill.id === 'newProduct' && (
                  <div style={{ marginBottom: '24px', width: '100%' }}>
                    <Card title="推广力度">
                      {/* 保持原有的推广力度配置内容 */}
                      // ... existing code ...
                    </Card>
                  </div>
                )}
              </Drawer>
              
              {/* 笔记列表 */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', 
                gap: '16px' 
              }}>
                {currentSkill.content.map(note => (
                  <Card 
                    key={note.id}
                    hoverable
                    style={{ height: '100%', fontSize: '0.9em' }}
                    cover={note.imageUrl ? <img alt={note.title} src={note.imageUrl} style={{ height: '140px', objectFit: 'cover' }} /> : null}
                    actions={[
                      <EditOutlined key="edit" onClick={() => handleEditNote(note)} />,
                      <DeleteOutlined key="delete" onClick={() => handleDeleteNote(note.id)} />
                    ]}
                    size="small"
                  >
                    <Card.Meta
                      title={<div style={{ fontSize: '0.95em' }}>{note.title}</div>}
                      description={
                        <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ fontSize: '0.85em' }}>
                          {note.content}
                        </Typography.Paragraph>
                      }
                    />
                    <div style={{ marginTop: '8px', fontSize: '11px', color: '#999' }}>
                      计划发布时间: {dayjs(note.scheduledTime).format('YYYY-MM-DD HH:mm')}
                    </div>
                    {note.platforms && (
                      <div style={{ marginTop: '6px' }}>
                        {note.platforms.xiaohongshu && <Tag color="red" style={{ fontSize: '10px', padding: '0 4px' }}>小红书</Tag>}
                        {note.platforms.wechat && <Tag color="green" style={{ fontSize: '10px', padding: '0 4px' }}>微信</Tag>}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    );
  };


  return (
    <div className="publish-plan-container">
      <div style={{ marginBottom: '24px' }}>
        <Button 
          type="link" 
          icon={<LeftOutlined />} 
          onClick={() => navigate('/accounts')}
          style={{ padding: 0, marginBottom: '16px' }}
        >
          返回账号列表
        </Button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Avatar size={64} src={currentAccount?.avatar} />
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>{currentAccount?.nickname}</div>
              <Space size={16}>
                <span style={{ color: '#666' }}>
                  {currentAccount?.followers.toLocaleString()} 粉丝
                </span>
                <span style={{ color: '#666' }}>
                  {currentAccount?.posts} 笔记
                </span>
              </Space>
            </div>
          </div>
          <Space>
            <Badge count={showBadge ? 1 : 0} offset={[-5, 0]}>
              <Button icon={<RobotOutlined />} onClick={() => {
                setAiAssistantVisible(true);
                setShowBadge(false);
              }}>
                唤起助手
              </Button>
            </Badge>
            <Button icon={<CalendarOutlined />} onClick={() => setCalendarVisible(true)}>
              查看日历
            </Button>
          </Space>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'overview',
            label: '概览',
            children: (
              <div>
                <Card 
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '16px' }}>待审核内容</span>
                      <span 
                        style={{ color: '#1890ff', fontWeight: 'normal', fontSize: '14px', cursor: 'pointer' }}
                        onClick={() => setShowAllReviewContent(!showAllReviewContent)}
                      >
                        {showAllReviewContent ? '收起' : '展开全部'} | 您有 <b>3</b> 篇内容待审核
                      </span>
                    </div>
                  } 
                  style={{ marginBottom: '24px' }}
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={showAllReviewContent ? [
                      {
                        id: 'review1',
                        title: '春季新款分享：这件连衣裙也太显瘦了',
                        scheduledTime: '2024-03-22 10:00:00',
                        imageUrl: 'https://picsum.photos/400/400?random=101'
                      },
                      {
                        id: 'review2',
                        title: '我的日常护肤步骤大公开',
                        scheduledTime: '2024-03-23 15:30:00',
                        imageUrl: 'https://picsum.photos/400/400?random=102'
                      },
                      {
                        id: 'review3',
                        title: '最近超爱的小众咖啡店推荐',
                        scheduledTime: '2024-03-24 19:00:00',
                        imageUrl: 'https://picsum.photos/400/400?random=103'
                      }
                    ] : [
                      {
                        id: 'review1',
                        title: '春季新款分享：这件连衣裙也太显瘦了',
                        scheduledTime: '2024-03-22 10:00:00',
                        imageUrl: 'https://picsum.photos/400/400?random=101'
                      }
                    ]}
                    renderItem={(item) => (
                      <List.Item
                        actions={[
                          <Button type="primary" size="small" key="review">审核</Button>
                        ]}
                        style={{ padding: '8px 0' }}
                      >
                        <List.Item.Meta
                          avatar={<Avatar shape="square" size={48} src={item.imageUrl} />}
                          title={<div style={{ fontSize: '14px' }}>{item.title}</div>}
                          description={<div style={{ fontSize: '12px' }}>{`计划发布时间：${item.scheduledTime}`}</div>}
                          style={{ margin: '0' }}
                        />
                      </List.Item>
                    )}
                  />
                </Card>

                <Row gutter={[24, 24]}>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="本周涨粉"
                        value={currentAccount?.growth?.followers || 0}
                        prefix={<RiseOutlined />}
                        valueStyle={{ color: '#3f8600' }}
                      />
                      <div style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>
                        较上周 {(currentAccount?.growth?.followers || 0) > 0 ? '增长' : '减少'} {Math.abs(currentAccount?.growth?.followers || 0)}
                      </div>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="本周阅读"
                        value={currentAccount?.growth?.views || 0}
                      />
                      <div style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>
                        较上周增长 12.5%
                      </div>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="本周互动"
                        value={(currentAccount?.growth?.likes || 0) + (currentAccount?.growth?.comments || 0)}
                      />
                      <div style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>
                        较上周增长 8.3%
                      </div>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="本周GMV"
                        value={83907}
                        prefix="¥"
                      />
                      <div style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>
                        较上周增长 23.5%
                      </div>
                    </Card>
                  </Col>
                </Row>

                <Card 
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>最近发布内容数据</span>
                      <Button type="link" size="small" style={{ padding: '0', fontSize: '14px' }}>
                        查看全部
                      </Button>
                    </div>
                  } 
                  style={{ marginTop: '24px' }}
                >
                  <Table
                    dataSource={mockContentData}
                    columns={[
                      {
                        title: '内容标题',
                        dataIndex: 'title',
                        key: 'title',
                      },
                      {
                        title: '发布时间',
                        dataIndex: 'publishTime',
                        key: 'publishTime',
                      },
                      {
                        title: '浏览',
                        dataIndex: 'views',
                        key: 'views',
                        render: (views: number) => views.toLocaleString()
                      },
                      {
                        title: '点赞',
                        dataIndex: 'likes',
                        key: 'likes',
                        render: (likes: number) => likes.toLocaleString()
                      },
                      {
                        title: '评论',
                        dataIndex: 'comments',
                        key: 'comments',
                        render: (comments: number) => comments.toLocaleString()
                      },
                      {
                        title: '收藏',
                        dataIndex: 'saves',
                        key: 'saves',
                        render: (saves: number) => saves.toLocaleString()
                      },
                      {
                        title: '带货转化',
                        key: 'conversion',
                        render: (_, record: ContentData) => (
                          <span>
                            ¥{record.products.reduce((sum, product) => sum + product.revenue, 0).toLocaleString()}
                          </span>
                        )
                      }
                    ]}
                    pagination={false}
                  />
                </Card>

                <Card 
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>下周发布计划</span>
                      <Button 
                        type="link" 
                        size="small" 
                        style={{ padding: '0', fontSize: '14px' }}
                        onClick={() => setCalendarVisible(true)}
                      >
                        查看全部
                      </Button>
                    </div>
                  } 
                  style={{ marginTop: '24px' }}
                >
                  <div className="calendar-week-view" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {Array.from({ length: 7 }).map((_, index) => {
                      const date = dayjs().add(index, 'day');
                      return (
                        <div 
                          key={index} 
                          className="day-column"
                          style={{ 
                            flex: 1, 
                            padding: '8px', 
                            textAlign: 'center',
                            borderRight: index < 6 ? '1px solid #f0f0f0' : 'none',
                            minHeight: '200px'
                          }}
                        >
                          <div style={{ 
                            padding: '8px 0', 
                            borderBottom: '1px solid #f0f0f0', 
                            marginBottom: '8px',
                            fontWeight: date.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD') ? 'bold' : 'normal',
                            color: date.day() === 0 || date.day() === 6 ? '#1890ff' : 'inherit'
                          }}>
                            <div>{date.format('MM/DD')}</div>
                            <div style={{ fontSize: '12px', color: '#999' }}>{date.format('ddd')}</div>
                          </div>
                          
                          {/* 模拟数据 */}
                          {index === 1 && (
                            <div className="plan-item" style={{ 
                              backgroundColor: '#e6f7ff', 
                              padding: '8px', 
                              borderRadius: '4px',
                              marginBottom: '8px',
                              fontSize: '12px',
                              textAlign: 'left'
                            }}>
                              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>春季新品分享</div>
                              <div style={{ color: '#666' }}>10:00 发布</div>
                            </div>
                          )}
                          
                          {index === 3 && (
                            <div className="plan-item" style={{ 
                              backgroundColor: '#f6ffed', 
                              padding: '8px', 
                              borderRadius: '4px',
                              marginBottom: '8px',
                              fontSize: '12px',
                              textAlign: 'left'
                            }}>
                              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>护肤品测评</div>
                              <div style={{ color: '#666' }}>15:30 发布</div>
                            </div>
                          )}
                          
                          {index === 3 && (
                            <div className="plan-item" style={{ 
                              backgroundColor: '#fff7e6', 
                              padding: '8px', 
                              borderRadius: '4px',
                              marginBottom: '8px',
                              fontSize: '12px',
                              textAlign: 'left'
                            }}>
                              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>搭配技巧分享</div>
                              <div style={{ color: '#666' }}>20:00 发布</div>
                            </div>
                          )}
                          
                          {index === 5 && (
                            <div className="plan-item" style={{ 
                              backgroundColor: '#fff2f0', 
                              padding: '8px', 
                              borderRadius: '4px',
                              marginBottom: '8px',
                              fontSize: '12px',
                              textAlign: 'left'
                            }}>
                              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>断桥奶茶探店</div>
                              <div style={{ color: '#666' }}>12:30 发布</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            )
          },
          {
            key: 'plan',
            label: '创作',
            children: (
              <div>
                {renderTaskView()}
              </div>
            )
          },
          {
            key: 'settings',
            label: '个性化',
            children: (
              <div>
                <Card title="品牌之声设置" style={{ marginBottom: '24px' }}>
                  <div style={{ marginBottom: '16px', color: '#666' }}>
                    请添加品牌之声，AI将模拟这些语气和风格特点为您创作内容。添加得越详细，生成的内容越符合品牌调性。
                  </div>
                  
                  <Form layout="vertical">
                    <Form.List name="brandVoice" initialValue={[{ content: '' }]}>
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <Form.Item key={key} style={{ marginBottom: '16px' }}>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <Input.TextArea 
                                  {...restField}
                                  placeholder="例如：我们的内容风格偏向于专业但不失亲和力，会使用'美丽''优雅'等正面词汇，避免使用网络流行语..." 
                                  rows={4}
                                  style={{ flex: 1 }}
                                  defaultValue={key === 0 ? "「生活不是选择题，而是一道填空题。」今天想和你分享的这个小众香水，就像是为都市生活填上的一抹诗意。前调是晨露般的柑橘，中调藏着一片薰衣草田，后调却意外地温暖，像是被阳光晒过的羊毛衫。没有人规定都市生活该是什么样，我们都在用自己的方式，填写着属于自己的答案。" : ""}
                                />
                                {fields.length > 1 && (
                                  <Button 
                                    type="text" 
                                    danger 
                                    icon={<DeleteOutlined />}
                                    onClick={() => remove(name)} 
                                    style={{ alignSelf: 'center' }}
                                  />
                                )}
                              </div>
                            </Form.Item>
                          ))}
                          <Form.Item>
                            <Button 
                              type="dashed" 
                              onClick={() => add()} 
                              block 
                              icon={<PlusOutlined />}
                            >
                              添加更多品牌之声
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </Form>
                </Card>

                <Card title="Agent设置" style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                    <Switch 
                      checked={autoGenerateContent} 
                      onChange={(checked) => {
                        setAutoGenerateContent(checked);
                        if (checked) {
                          message.success('已开启AI自动生产内容');
                        } else {
                          message.info('已关闭AI自动生产内容');
                        }
                      }} 
                      style={{ marginRight: '16px' }}
                    />
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                        内容全托管
                      </div>
                      <div style={{ color: '#666', fontSize: '14px' }}>
                        开启后，AI将定期根据你的设置自动生成内容，并将生成的内容提交人工审核。审核后的内容将自动发布。
                      </div>
                    </div>
                  </div>
                </Card>

                {autoGenerateContent && (
                  <>
                    <Card title="AI选题偏好设置" style={{ marginBottom: '24px' }}>
                      <div style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
                        开启后，AI将根据您的配置自动进行选题，确保内容与您的运营策略一致
                      </div>
                      
                      <Row gutter={24}>
                        {/* 左侧：动态选题 */}
                        <Col span={12}>
                          <div style={{ padding: '0 0 8px 0', borderBottom: '1px solid #f0f0f0', marginBottom: '12px' }}>
                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>动态选题</span>
                            <Tooltip title="根据外部事件动态进行的选题策略">
                              <QuestionCircleOutlined style={{ marginLeft: '5px', color: '#999' }} />
                            </Tooltip>
                          </div>
                          
                          <Space direction="vertical" style={{ width: '100%' }} size={16}>
                            <div>
                              <Checkbox 
                                checked={enableHotTopics}
                                onChange={(e) => {
                                  setEnableHotTopics(e.target.checked);
                                  message.success('已更新热点选题设置');
                                }}
                              >
                                <span style={{ fontWeight: 'bold' }}>热点选题</span>
                              </Checkbox>
                              <div style={{ color: '#666', fontSize: '13px', margin: '4px 0 0 22px' }}>
                                选题时，AI将自动结合近期外部热点话题
                              </div>
                              {enableHotTopics && (
                                <div style={{ margin: '8px 0 0 22px', display: 'flex', alignItems: 'center' }}>
                                  <span style={{ fontSize: '13px', marginRight: '8px' }}>相关度阈值：</span>
                                  <Select 
                                    value={hotTopicRelevance} 
                                    onChange={(value: number) => {
                                      setHotTopicRelevance(value);
                                      message.success('已更新热点相关度阈值');
                                    }}
                                    style={{ width: 80 }}
                                    size="small"
                                  >
                                    <Select.Option value={50}>50%</Select.Option>
                                    <Select.Option value={60}>60%</Select.Option>
                                    <Select.Option value={70}>70%</Select.Option>
                                    <Select.Option value={80}>80%</Select.Option>
                                    <Select.Option value={90}>90%</Select.Option>
                                  </Select>
                                </div>
                              )}
                            </div>

                            <div>
                              <Checkbox 
                                checked={enableNewProducts}
                                onChange={(e) => {
                                  setEnableNewProducts(e.target.checked);
                                  message.success('已更新商品上新选题设置');
                                }}
                              >
                                <span style={{ fontWeight: 'bold' }}>商品上新选题</span>
                              </Checkbox>
                              <div style={{ color: '#666', fontSize: '13px', margin: '4px 0 0 22px' }}>
                                选题时，AI将结合近期的商品上新情况
                              </div>
                            </div>

                            <div>
                              <Checkbox 
                                checked={enableNewActivities}
                                onChange={(e) => {
                                  setEnableNewActivities(e.target.checked);
                                  message.success('已更新活动上新选题设置');
                                }}
                              >
                                <span style={{ fontWeight: 'bold' }}>活动上新选题</span>
                              </Checkbox>
                              <div style={{ color: '#666', fontSize: '13px', margin: '4px 0 0 22px' }}>
                                有新营销活动时自动选题
                              </div>
                            </div>

                            {(enableHotTopics || enableNewProducts || enableNewActivities) && (
                              <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }}>动态选题策略</div>
                                <Radio.Group 
                                  value={dynamicTopicStrategy} 
                                  onChange={(e) => {
                                    setDynamicTopicStrategy(e.target.value);
                                    message.success('已更新动态选题策略');
                                  }}
                                  size="small"
                                >
                                  <Space direction="vertical">
                                    <Radio value="additional">额外发布一篇</Radio>
                                    <Radio value="replace">替换当日内容</Radio>
                                  </Space>
                                </Radio.Group>
                              </div>
                            )}
                          </Space>
                        </Col>

                        {/* 右侧：静态选题 */}
                        <Col span={12}>
                          <div style={{ padding: '0 0 8px 0', borderBottom: '1px solid #f0f0f0', marginBottom: '12px' }}>
                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>日常选题</span>
                            <Tooltip title="在没有特殊事件时的日常选题策略">
                              <QuestionCircleOutlined style={{ marginLeft: '5px', color: '#999' }} />
                            </Tooltip>
                          </div>

                          <Space direction="vertical" style={{ width: '100%' }} size={16}>
                            <div>
                              <Checkbox 
                                checked={enableRegularPromotion}
                                onChange={(e) => {
                                  setEnableRegularPromotion(e.target.checked);
                                  if (e.target.checked && !enableProductPromotion) {
                                    setTopicDistribution({...topicDistribution, regularPromotion: 100, productPromotion: 0});
                                  } else if (e.target.checked) {
                                    const newProductValue = Math.min(topicDistribution.productPromotion, 70);
                                    setTopicDistribution({
                                      regularPromotion: 100 - newProductValue,
                                      productPromotion: newProductValue
                                    });
                                  } else if (enableProductPromotion) {
                                    setTopicDistribution({
                                      regularPromotion: 0,
                                      productPromotion: 100
                                    });
                                  }
                                  message.success('已更新日常推广选题设置');
                                }}
                              >
                                <span style={{ fontWeight: 'bold' }}>日常推广选题</span>
                              </Checkbox>
                              <div style={{ color: '#666', fontSize: '13px', margin: '4px 0 0 22px' }}>
                                基于素材库中的图片进行选题创作
                              </div>
                            </div>

                            <div>
                              <Checkbox 
                                checked={enableProductPromotion}
                                onChange={(e) => {
                                  setEnableProductPromotion(e.target.checked);
                                  if (e.target.checked && !enableRegularPromotion) {
                                    setTopicDistribution({...topicDistribution, regularPromotion: 0, productPromotion: 100});
                                  } else if (e.target.checked) {
                                    const newRegularValue = Math.min(topicDistribution.regularPromotion, 70);
                                    setTopicDistribution({
                                      regularPromotion: newRegularValue,
                                      productPromotion: 100 - newRegularValue
                                    });
                                  } else if (enableRegularPromotion) {
                                    setTopicDistribution({
                                      regularPromotion: 100,
                                      productPromotion: 0
                                    });
                                  }
                                  message.success('已更新商品推广选题设置');
                                }}
                              >
                                <span style={{ fontWeight: 'bold' }}>商品推广选题</span>
                              </Checkbox>
                              <div style={{ color: '#666', fontSize: '13px', margin: '4px 0 0 22px' }}>
                                定期为商品创建推广内容
                              </div>
                            </div>

                            {(enableRegularPromotion || enableProductPromotion) && (
                              <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }}>静态选题比例</div>
                                
                                {enableRegularPromotion && (
                                  <div style={{ marginBottom: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontSize: '13px' }}>
                                      <span>日常推广：</span>
                                      <span>{topicDistribution.regularPromotion}%</span>
                                    </div>
                                    <Slider 
                                      value={topicDistribution.regularPromotion} 
                                      onChange={(value) => {
                                        if (enableProductPromotion) {
                                          setTopicDistribution({
                                            regularPromotion: value,
                                            productPromotion: 100 - value
                                          });
                                        } else {
                                          setTopicDistribution({
                                            ...topicDistribution,
                                            regularPromotion: value
                                          });
                                        }
                                      }}
                                      onAfterChange={() => message.success('已更新选题比例')}
                                      disabled={!enableProductPromotion}
                                      min={0}
                                      max={100}
                                    />
                                  </div>
                                )}

                                {enableProductPromotion && (
                                  <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontSize: '13px' }}>
                                      <span>商品推广：</span>
                                      <span>{topicDistribution.productPromotion}%</span>
                                    </div>
                                    <Slider 
                                      value={topicDistribution.productPromotion} 
                                      onChange={(value) => {
                                        if (enableRegularPromotion) {
                                          setTopicDistribution({
                                            regularPromotion: 100 - value,
                                            productPromotion: value
                                          });
                                        } else {
                                          setTopicDistribution({
                                            ...topicDistribution,
                                            productPromotion: value
                                          });
                                        }
                                      }}
                                      onAfterChange={() => message.success('已更新选题比例')}
                                      disabled={!enableRegularPromotion}
                                      min={0}
                                      max={100}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </Space>
                        </Col>
                      </Row>
                    </Card>

                    <Card title="发布策略设置" style={{ marginBottom: '24px' }}>
                      <Form layout="vertical">
                        <h3 style={{ marginBottom: '16px', fontWeight: 'bold' }}>AI自动创作配置</h3>
                        
                        <Row gutter={24}>
                          <Col span={12}>
                            <Form.Item 
                              label="AI提前几天通知我审批内容" 
                              name="notificationDays"
                              tooltip="设置AI在内容发布前多少天提醒您审批内容"
                              initialValue={3}
                            >
                              <Select>
                                <Select.Option value={1}>提前1天</Select.Option>
                                <Select.Option value={2}>提前2天</Select.Option>
                                <Select.Option value={3}>提前3天</Select.Option>
                                <Select.Option value={5}>提前5天</Select.Option>
                                <Select.Option value={7}>提前7天</Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item 
                              label="一次性审批几天的发布内容" 
                              name="batchApprovalDays"
                              tooltip="设置每次审批包含几天的内容"
                              initialValue={7}
                            >
                              <Select>
                                <Select.Option value={3}>3天内容</Select.Option>
                                <Select.Option value={5}>5天内容</Select.Option>
                                <Select.Option value={7}>7天内容</Select.Option>
                                <Select.Option value={10}>10天内容</Select.Option>
                                <Select.Option value={14}>14天内容</Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                        
                        <Row gutter={24}>
                          <Col span={12}>
                            <Form.Item 
                              label="频率" 
                              name="publishFrequency"
                              tooltip="设置笔记发布的频率"
                              initialValue="daily"
                            >
                              <Select>
                                <Select.Option value="daily">每日一篇</Select.Option>
                                <Select.Option value="alternate">两天一篇</Select.Option>
                                <Select.Option value="twice">每日两篇</Select.Option>
                                <Select.Option value="weekly">每周三篇</Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item 
                              label="发布时间" 
                              name="publishTime"
                              tooltip="设置笔记发布的最佳时间"
                              initialValue={['10:00', '20:00']}
                            >
                              <Select mode="multiple">
                                <Select.Option value="10:00">上午 10:00</Select.Option>
                                <Select.Option value="12:00">中午 12:00</Select.Option>
                                <Select.Option value="15:00">下午 15:00</Select.Option>
                                <Select.Option value="20:00">晚上 20:00</Select.Option>
                                <Select.Option value="22:00">晚上 22:00</Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form>
                    </Card>

                    <Card title="创作偏好设置" style={{ marginBottom: '24px' }}>
                      <Form layout="vertical">
                        <Form.Item 
                          label="图片源设置" 
                          name="imageSource"
                          tooltip="设置AI创作内容时使用的图片分类"
                          extra="AI将自动在您选择的分类下挑选最适合内容的图片"
                          initialValue={['时尚', '美妆']}
                        >
                          <Select mode="multiple">
                            <Select.Option value="时尚">时尚穿搭</Select.Option>
                            <Select.Option value="美妆">美妆护肤</Select.Option>
                            <Select.Option value="美食">美食探店</Select.Option>
                            <Select.Option value="家居">家居生活</Select.Option>
                            <Select.Option value="旅行">旅行风景</Select.Option>
                            <Select.Option value="数码">数码产品</Select.Option>
                          </Select>
                        </Form.Item>

                        <Form.Item
                          label="主推商品配置"
                          name="featuredProducts"
                          tooltip="设置AI创作内容时优先挂载的商品"
                          extra="AI将根据内容主题自动从列表中挑选最相关的商品进行挂载"
                        >
                          <Table
                            dataSource={[
                              {
                                key: '1',
                                name: '设计感泡泡袖连衣裙',
                                category: '服装',
                                price: 299,
                                priority: 'high'
                              },
                              {
                                key: '2',
                                name: '多效修护眼霜',
                                category: '护肤',
                                price: 219,
                                priority: 'medium'
                              },
                              {
                                key: '3',
                                name: '百搭小白鞋',
                                category: '鞋包',
                                price: 399,
                                priority: 'high'
                              }
                            ]}
                            columns={[
                              {
                                title: '商品名称',
                                dataIndex: 'name',
                                key: 'name',
                              },
                              {
                                title: '分类',
                                dataIndex: 'category',
                                key: 'category',
                              },
                              {
                                title: '价格',
                                dataIndex: 'price',
                                key: 'price',
                                render: (price: number) => `¥${price}`
                              },
                              {
                                title: '优先级',
                                dataIndex: 'priority',
                                key: 'priority',
                                render: (priority: string) => (
                                  <Select 
                                    defaultValue={priority} 
                                    style={{ width: 100 }}
                                    options={[
                                      { value: 'high', label: '高' },
                                      { value: 'medium', label: '中' },
                                      { value: 'low', label: '低' }
                                    ]}
                                  />
                                )
                              },
                              {
                                title: '操作',
                                key: 'action',
                                render: () => (
                                  <Space>
                                    <Button type="text" danger icon={<DeleteOutlined />} />
                                  </Space>
                                )
                              }
                            ]}
                            pagination={false}
                            footer={() => (
                              <Button type="dashed" block icon={<PlusOutlined />}>
                                添加商品
                              </Button>
                            )}
                          />
                        </Form.Item>
                      </Form>
                    </Card>
                  </>
                )}
              </div>
            )
          }
        ]}
      />

      <Drawer
        title="智能内容规划"
        placement="right"
        onClose={onClose}
        open={drawerVisible}
        width={400}
        extra={
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" onClick={handleSubmit}>
              创建
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="dateRange"
            label="发布时间周期"
            rules={[{ required: true, message: '请选择发布时间周期' }]}
          >
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="imageSource"
            label={
              <Space>
                图片来源
                <Tooltip title="选择笔记图片的来源方式：自动选择将随机使用示例图片，手动选择允许您从素材库中挑选图片">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Space>
            }
            initialValue="auto"
          >
            <Radio.Group onChange={(e) => setImageSource(e.target.value)}>
              <Radio value="auto">自动选择</Radio>
              <Radio value="manual">手动选择</Radio>
            </Radio.Group>
          </Form.Item>

          {imageSource === 'manual' && (
            <Form.Item label="选择图片">
              <Button
                onClick={() => {
                  Modal.info({
                    title: '选择图片',
                    width: 800,
                    content: (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                        {Array(12).fill(null).map((_, index) => (
                          <div
                            key={index}
                            style={{
                              border: selectedImages.includes(`https://picsum.photos/400/400?random=${index}`) ? '2px solid #1890ff' : '1px solid #d9d9d9',
                              borderRadius: 4,
                              padding: 4,
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              const imageUrl = `https://picsum.photos/400/400?random=${index}`;
                              if (selectedImages.includes(imageUrl)) {
                                setSelectedImages(selectedImages.filter(url => url !== imageUrl));
                              } else {
                                setSelectedImages([...selectedImages, imageUrl]);
                              }
                            }}
                          >
                            <img
                              src={`https://picsum.photos/400/400?random=${index}`}
                              alt={`素材 ${index + 1}`}
                              style={{ width: '100%', height: 150, objectFit: 'cover' }}
                            />
                          </div>
                        ))}
                      </div>
                    ),
                    onOk() {}
                  });
                }}
                style={{ width: '100%' }}
              >
                从素材库选择图片（已选择 {selectedImages.length} 张）
              </Button>
            </Form.Item>
          )}

          <Form.Item>
            <Space size="middle" style={{ marginBottom: 16 }}>
              发布频率：
              <Button
                onClick={() => {
                  const days = Math.abs(form.getFieldValue('dateRange')?.[0]?.diff(form.getFieldValue('dateRange')?.[1], 'days'));
                  if (days !== undefined) {
                    form.setFieldsValue({ count: days + 1 });
                  }
                }}
              >
                一天一篇
              </Button>
              <Button
                onClick={() => {
                  const days = Math.abs(form.getFieldValue('dateRange')?.[0]?.diff(form.getFieldValue('dateRange')?.[1], 'days'));
                  if (days !== undefined) {
                    form.setFieldsValue({ count: Math.ceil((days + 1) / 2) });
                  }
                }}
              >
                两天一篇
              </Button>
              <Button
                onClick={() => {
                  const days = Math.abs(form.getFieldValue('dateRange')?.[0]?.diff(form.getFieldValue('dateRange')?.[1], 'days'));
                  if (days !== undefined) {
                    form.setFieldsValue({ count: (days + 1) * 2 });
                  }
                }}
              >
                一天两篇
              </Button>
            </Space>
          </Form.Item>

          <Form.Item
            name="contentStyle"
            label="内容风格"
            rules={[{ required: true, message: '请选择内容风格' }]}
            initialValue="casual"
          >
            <Radio.Group style={{ width: '100%' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Radio value="casual">轻松随意</Radio>
                <Radio value="professional">专业正式</Radio>
                <Radio value="artistic">感性文艺</Radio>
                <Radio value="humorous">幽默诙谐</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="mountType"
            label="挂载配置"
            rules={[{ required: true, message: '请选择挂载配置' }]}
            initialValue="none"
          >
            <Radio.Group 
              style={{ width: '100%' }}
              onChange={(e) => {
                if (e.target.value === 'specific') {
                  // 显示商品选择弹窗
                  setTimeout(() => {
                    Modal.info({
                      title: '选择推荐商品',
                      width: 800,
                      content: (
                        <div>
                          <Table
                            dataSource={[
                              {
                                key: '1',
                                name: '设计感泡泡袖连衣裙',
                                category: '服装',
                                price: 299,
                                selected: false
                              },
                              {
                                key: '2',
                                name: '多效修护眼霜',
                                category: '护肤',
                                price: 219,
                                selected: false
                              },
                              {
                                key: '3',
                                name: '百搭小白鞋',
                                category: '鞋包',
                                price: 399,
                                selected: false
                              },
                              {
                                key: '4',
                                name: '轻奢小众香水',
                                category: '美妆',
                                price: 469,
                                selected: false
                              },
                              {
                                key: '5',
                                name: '纯棉舒适T恤',
                                category: '服装',
                                price: 129,
                                selected: false
                              }
                            ]}
                            columns={[
                              {
                                title: '选择',
                                key: 'select',
                                render: (_) => (
                                  <Checkbox />
                                )
                              },
                              {
                                title: '商品名称',
                                dataIndex: 'name',
                                key: 'name'
                              },
                              {
                                title: '分类',
                                dataIndex: 'category',
                                key: 'category'
                              },
                              {
                                title: '价格',
                                dataIndex: 'price',
                                key: 'price',
                                render: (price) => `¥${price}`
                              }
                            ]}
                            pagination={false}
                            rowSelection={{
                              type: 'checkbox',
                              onChange: (selectedRowKeys, selectedRows) => {
                                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                              }
                            }}
                          />
                        </div>
                      ),
                      onOk() {
                        message.success('已选择3件商品');
                      }
                    });
                  }, 300);
                }
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Radio value="none">不挂载商品或POI</Radio>
                <Radio value="auto">自动推荐热卖商品</Radio>
                <Radio value="specific">指定推荐商品</Radio>
                <Radio value="poi">挂载POI地点</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="additionalInstructions"
            label="补充指令"
          >
            <Input.TextArea 
              placeholder="可以输入额外的AI指令，例如：需要强调产品的哪些特点、内容重点方向等..." 
              rows={4} 
            />
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="创建单篇笔记"
        placement="right"
        onClose={onSingleNoteDrawerClose}
        open={singleNoteDrawerVisible}
        width={400}
        extra={
          <Space>
            <Button onClick={onSingleNoteDrawerClose}>取消</Button>
            <Button type="primary" onClick={handleSingleNoteSubmit}>
              创建
            </Button>
          </Space>
        }
      >
        <Form form={singleNoteForm} layout="vertical">
          <Form.Item
            name="imageUrl"
            label="图片"
            rules={[{ required: true, message: '请选择图片' }]}
          >
            <Button
              onClick={() => {
                Modal.info({
                  title: '选择图片',
                  width: 800,
                  content: (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                      {Array(12).fill(null).map((_, index) => (
                        <div
                          key={index}
                          style={{
                            border: singleNoteForm.getFieldValue('imageUrl') === `https://picsum.photos/400/400?random=${index}` ? '2px solid #1890ff' : '1px solid #d9d9d9',
                            borderRadius: 4,
                            padding: 4,
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            const imageUrl = `https://picsum.photos/400/400?random=${index}`;
                            singleNoteForm.setFieldsValue({ imageUrl });
                          }}
                        >
                          <img
                            src={`https://picsum.photos/400/400?random=${index}`}
                            alt={`素材 ${index + 1}`}
                            style={{ width: '100%', height: 150, objectFit: 'cover' }}
                          />
                        </div>
                      ))}
                    </div>
                  ),
                  onOk() {}
                });
              }}
              style={{ width: '100%' }}
            >
              从素材库选择图片
            </Button>
          </Form.Item>

          <Form.Item
            name="platforms"
            label="发布平台"
            rules={[{ required: true, message: '请选择至少一个发布平台' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择发布平台"
              options={[
                { label: '小红书', value: 'xiaohongshu' },
                { label: '微信', value: 'wechat' }
              ]}
            />
          </Form.Item>

          <Form.Item
            name="contentType"
            label="内容诉求"
            rules={[{ required: true, message: '请选择内容诉求' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入内容诉求" />
          </Form.Item>

          <Form.Item
            name="tone"
            label="内容语气"
            rules={[{ required: true, message: '请选择内容语气' }]}
          >
            <Radio.Group>
              <Radio.Button value="轻松随意">轻松随意</Radio.Button>
              <Radio.Button value="专业正式">专业正式</Radio.Button>
              <Radio.Button value="感性文艺">感性文艺</Radio.Button>
              <Radio.Button value="幽默诙谐">幽默诙谐</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Drawer>

      <Modal
        title={
          <div style={{ 
            borderBottom: '1px solid #f0f0f0',
            padding: '16px 24px',
            margin: '-20px -24px 20px',
          }}>
            <Space>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>编辑笔记</span>
              <span style={{ fontSize: '14px', color: '#999' }}>
                {currentNoteIndex + 1} / {selectedPlan?.notes.length}
              </span>
            </Space>
          </div>
        }
        open={!!editingNote}
        onCancel={() => setEditingNote(null)}
        onOk={() => {
          if (editingNote) {
            handleEditSubmit(editingNote);
          }
        }}
        width={1000}
        style={{ top: 20 }}
        footer={
          <div style={{
            borderTop: '1px solid #f0f0f0',
            padding: '16px 0',
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Space>
              <Button
                disabled={currentNoteIndex <= 0}
                onClick={handlePrevNote}
                icon={<LeftOutlined />}
              >
                上一篇
              </Button>
              <Button
                disabled={!selectedPlan || currentNoteIndex >= selectedPlan.notes.length - 1}
                onClick={handleNextNote}
                icon={<RightOutlined />}
              >
                下一篇
              </Button>
            </Space>
            <Space>
              <Button onClick={() => setEditingNote(null)}>取消</Button>
              <Button type="primary" onClick={() => editingNote && handleEditSubmit(editingNote)}>
                保存
              </Button>
            </Space>
          </div>
        }
        bodyStyle={{ padding: '0 24px' }}
      >
        {editingNote && (
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ flex: '0 0 45%' }}>
              <Form layout="vertical">
                <Form.Item 
                  label={<span style={{ fontSize: '15px', fontWeight: 500 }}>标题</span>}
                  style={{ marginBottom: '20px' }}
                >
                  <Input
                    value={editingNote.title}
                    onChange={e => setEditingNote({ ...editingNote, title: e.target.value })}
                    placeholder="请输入笔记标题"
                    style={{ height: '40px', fontSize: '14px' }}
                  />
                </Form.Item>
                <Form.Item 
                  label={<span style={{ fontSize: '15px', fontWeight: 500 }}>正文</span>}
                  style={{ marginBottom: '20px' }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Input.TextArea
                      value={editingNote.content}
                      onChange={e => setEditingNote({ ...editingNote, content: e.target.value })}
                      placeholder="请输入笔记正文"
                      rows={6}
                      style={{ fontSize: '14px' }}
                    />
                    <Button
                      icon={<RobotOutlined />}
                      style={{ width: '100%', height: '40px' }}
                      onClick={() => {
                        Modal.confirm({
                          title: 'AI调整内容',
                          content: (
                            <Input.TextArea
                              placeholder="请输入调整方向，例如：'更活泼'、'更专业'等"
                              rows={3}
                              id="adjustmentDirection"
                            />
                          ),
                          onOk: () => {
                            const direction = (document.getElementById('adjustmentDirection') as HTMLTextAreaElement)?.value;
                            if (!direction) {
                              message.error('请输入调整方向');
                              return;
                            }
                            const adjustedContent = `${editingNote.content}\n\n[根据"${direction}"的方向调整后的内容]`;
                            setEditingNote({ ...editingNote, content: adjustedContent });
                            message.success('内容调整完成！');
                          }
                        });
                      }}
                    >
                      AI调整内容
                    </Button>
                  </Space>
                </Form.Item>
                <Form.Item 
                  label={<span style={{ fontSize: '15px', fontWeight: 500 }}>图片</span>}
                  style={{ marginBottom: '20px' }}
                >
                  <Button
                    onClick={() => {
                      Modal.info({
                        title: '选择图片',
                        width: 800,
                        content: (
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(4, 1fr)', 
                            gap: 12,
                            padding: '12px 0'
                          }}>
                            {Array(12).fill(null).map((_, index) => (
                              <div
                                key={index}
                                style={{
                                  border: editingNote.imageUrl === `https://picsum.photos/400/400?random=${index}` 
                                    ? '2px solid #1890ff' 
                                    : '1px solid #f0f0f0',
                                  borderRadius: 8,
                                  padding: 4,
                                  cursor: 'pointer',
                                  transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                  const target = e.currentTarget;
                                  target.style.borderColor = '#1890ff';
                                  target.style.transform = 'scale(1.02)';
                                }}
                                onMouseLeave={(e) => {
                                  const target = e.currentTarget;
                                  if (editingNote.imageUrl !== `https://picsum.photos/400/400?random=${index}`) {
                                    target.style.borderColor = '#f0f0f0';
                                  }
                                  target.style.transform = 'scale(1)';
                                }}
                                onClick={() => {
                                  const imageUrl = `https://picsum.photos/400/400?random=${index}`;
                                  setEditingNote({ ...editingNote, imageUrl });
                                }}
                              >
                                <img
                                  src={`https://picsum.photos/400/400?random=${index}`}
                                  alt={`素材 ${index + 1}`}
                                  style={{ 
                                    width: '100%', 
                                    height: 150, 
                                    objectFit: 'cover',
                                    borderRadius: 4
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        ),
                        onOk() {}
                      });
                    }}
                    style={{ width: '100%', height: '40px' }}
                  >
                    从素材库选择图片
                  </Button>
                </Form.Item>
                <Form.Item 
                  label={<span style={{ fontSize: '15px', fontWeight: 500 }}>标签</span>}
                  style={{ marginBottom: '20px' }}
                >
                  <Input
                    value={editingNote.tags?.join(', ')}
                    onChange={e => setEditingNote({
                      ...editingNote,
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    })}
                    placeholder="使用逗号分隔多个标签"
                    style={{ height: '40px', fontSize: '14px' }}
                  />
                </Form.Item>
              </Form>
            </div>
            <div style={{ flex: '0 0 55%' }}>
              <div style={{ 
                backgroundColor: '#fafafa',
                borderRadius: 12,
                padding: 20,
                height: '100%'
              }}>
                {/* 手机外壳 */}
                <div style={{
                  width: '320px',
                  margin: '0 auto',
                  backgroundColor: '#000',
                  borderRadius: '36px',
                  padding: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                }}>
                  {/* 手机内容区 */}
                  <div style={{
                    backgroundColor: '#fff',
                    height: '520px',
                    overflow: 'hidden',
                    position: 'relative',
                    borderRadius: '24px',
                  }}>
                    {/* 笔记内容 */}
                    <div style={{
                      height: '100%',
                      overflow: 'auto'
                    }}>
                      <div style={{
                        backgroundColor: '#fff',
                        borderRadius: 0
                      }}>
                        {/* 图片区域 */}
                        <div style={{ position: 'relative' }}>
                          <img
                            src={editingNote.imageUrl}
                            alt={editingNote.title}
                            style={{
                              width: '100%',
                              height: '375px',
                              objectFit: 'cover'
                            }}
                          />
                          {/* 返回按钮 */}
                          <div style={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff'
                          }}>
                            <LeftOutlined />
                          </div>
                          {/* 分享按钮 */}
                          <div style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff'
                          }}>
                            <ShareAltOutlined />
                          </div>
                        </div>
                        {/* 内容区域 */}
                        <div style={{ padding: '16px' }}>
                          {/* 用户信息 */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: 12
                          }}>
                            <Avatar
                              size={36}
                              src={mockAccounts[0].avatar}
                              style={{ marginRight: 8 }}
                            />
                            <div>
                              <div style={{ 
                                fontSize: 14,
                                fontWeight: 600,
                                color: '#333',
                                marginBottom: 2
                              }}>
                                {mockAccounts[0].nickname}
                              </div>
                              <div style={{
                                fontSize: 12,
                                color: '#999'
                              }}>
                                IP 归属地：上海
                              </div>
                            </div>
                            <Button
                              type="primary"
                              size="small"
                              style={{
                                marginLeft: 'auto',
                                borderRadius: '16px',
                                fontSize: '12px',
                                height: '28px'
                              }}
                            >
                              关注
                            </Button>
                          </div>
                          {/* 标题和正文 */}
                          <h3 style={{ 
                            fontSize: 16, 
                            fontWeight: 600,
                            color: '#333',
                            marginBottom: 8,
                            lineHeight: 1.5
                          }}>
                            {editingNote.title || '请输入标题'}
                          </h3>
                          <p style={{ 
                            fontSize: 14, 
                            color: '#666', 
                            marginBottom: 12,
                            lineHeight: 1.6,
                            whiteSpace: 'pre-wrap'
                          }}>
                            {editingNote.content || '请输入正文内容'}
                          </p>
                          {/* 标签 */}
                          {editingNote.tags && editingNote.tags.length > 0 && (
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                              {editingNote.tags.map(tag => (
                                <span
                                  key={tag}
                                  style={{
                                    color: '#999',
                                    fontSize: 12
                                  }}
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                          {/* 互动栏 */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderTop: '1px solid #f5f5f0',
                            paddingTop: 12
                          }}>
                            <Space size={24}>
                              <Space>
                                <HeartOutlined style={{ fontSize: 16 }} />
                                <span style={{ fontSize: 12, color: '#999' }}>赞</span>
                              </Space>
                              <Space>
                                <MessageOutlined style={{ fontSize: 16 }} />
                                <span style={{ fontSize: 12, color: '#999' }}>评论</span>
                              </Space>
                              <Space>
                                <StarOutlined style={{ fontSize: 16 }} />
                                <span style={{ fontSize: 12, color: '#999' }}>收藏</span>
                              </Space>
                            </Space>
                            <Button
                              type="text"
                              icon={<EllipsisOutlined />}
                              style={{ color: '#999' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 手机底部黑条 */}
                  <div style={{
                    height: '4px',
                    width: '120px',
                    backgroundColor: '#000',
                    margin: '8px auto 0',
                    borderRadius: '2px'
                  }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="内容发布日历"
        open={calendarVisible}
        onCancel={() => setCalendarVisible(false)}
        width={800}
        footer={null}
      >
        <Calendar
          mode="month"
          defaultValue={dayjs('2025-03-01')}
          dateCellRender={dateCellRender}
        />
      </Modal>

      {/* AI 助手抽屉 */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RobotOutlined />
            <span>AI 助手</span>
          </div>
        }
        placement="right"
        width={500}
        open={aiAssistantVisible}
        onClose={() => setAiAssistantVisible(false)}
        extra={
          <Space>
            <Button onClick={() => setAiAssistantVisible(false)}>关闭</Button>
          </Space>
        }
      >
        <div style={{ height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflow: 'auto', padding: '0 16px' }}>
            {dialogHistory.map(dialog => (
              <div
                key={dialog.id}
                style={{
                  marginBottom: 24,
                  display: 'flex',
                  flexDirection: dialog.type === 'user' ? 'row-reverse' : 'row',
                  gap: 12
                }}
              >
                <Avatar
                  style={{
                    backgroundColor: dialog.type === 'user' ? '#1890ff' : '#f56a00',
                    flexShrink: 0
                  }}
                >
                  {dialog.type === 'user' ? '我' : 'AI'}
                </Avatar>
                <div
                  style={{
                    maxWidth: '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4
                  }}
                >
                  <div
                    style={{
                      padding: 12,
                      background: dialog.type === 'user' ? '#1890ff' : '#f5f5f5',
                      color: dialog.type === 'user' ? '#fff' : '#000',
                      borderRadius: 8,
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {dialog.content}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#999',
                      textAlign: dialog.type === 'user' ? 'right' : 'left'
                    }}
                  >
                    {dialog.time}
                  </div>
                  {dialog.type === 'assistant' && dialog.status && (
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {dialog.status === 'thinking' && <LoadingOutlined />}
                      <span style={{ fontSize: 12, color: '#666' }}>
                        {dialog.status === 'thinking' && '正在思考...'}
                        {dialog.status === 'analyzing' && '正在分析数据...'}
                        {dialog.status === 'working' && '正在生成内容...'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #f0f0f0', padding: '16px 0', marginTop: 16 }}>
            <Input.TextArea
              placeholder="输入你的需求，比如：帮我写一篇关于新品上市的笔记..."
              autoSize={{ minRows: 3, maxRows: 6 }}
              style={{ marginBottom: 16 }}
            />
            <Button type="primary" block>
              发送
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default PublishPlan;