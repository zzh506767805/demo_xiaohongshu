import React, { useState } from 'react';
import { Button, Drawer, Form, InputNumber, DatePicker, Space, List, Card, Modal, message, Input, Radio, Tooltip, Calendar, Tabs, Avatar, Select, Statistic, Row, Col, Timeline, Table } from 'antd';
import { PlusOutlined, DeleteOutlined, QuestionCircleOutlined, LoadingOutlined, CalendarOutlined, RobotOutlined, LeftOutlined, RightOutlined, ShareAltOutlined, HeartOutlined, MessageOutlined, StarOutlined, EllipsisOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

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
}

interface XHSAccount {
  id: string;
  avatar: string;
  nickname: string;
  followers: number;
  posts: number;
  status: 'active' | 'inactive';
}

const mockAccounts: XHSAccount[] = [
  {
    id: '1',
    avatar: 'https://picsum.photos/100/100?random=1',
    nickname: '时尚生活家',
    followers: 12580,
    posts: 326,
    status: 'active'
  },
  {
    id: '2',
    avatar: 'https://picsum.photos/100/100?random=2',
    nickname: '美食探店达人',
    followers: 45678,
    posts: 892,
    status: 'active'
  },
  {
    id: '3',
    avatar: 'https://picsum.photos/100/100?random=3',
    nickname: '旅行摄影师',
    followers: 89012,
    posts: 567,
    status: 'inactive'
  }
];

const PublishPlan: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'task' | 'timeline' | 'list'>('task');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [singleNoteDrawerVisible, setSingleNoteDrawerVisible] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [form] = Form.useForm();
  const [, setSelectedAccount] = useState<string>();
  const [singleNoteForm] = Form.useForm();
  const [imageSource, setImageSource] = useState('auto');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loadingTips, setLoadingTips] = useState<string>('');
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [demoPlans, setDemoPlans] = useState<Plan[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(-1);
  const [aiAssistantVisible, setAiAssistantVisible] = useState(false);
  const [isFirstVisit] = useState(() => !localStorage.getItem('hasVisited'));

  const showDrawer = () => {
    setDrawerVisible(true);
  };

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

  // 初始化演示数据
  React.useEffect(() => {
    const march2025Plans = [
      {
        id: 'demo-1',
        name: '春季穿搭系列计划',
        startDate: '2025-03-01',
        endDate: '2025-03-07',
        count: 7,
        accountId: '1', // 关联到时尚生活家账号
        notes: Array(7).fill(null).map((_, index) => ({
          id: `demo-note-1-${index}`,
          title: `春季穿搭分享 ${index + 1}`,
          content: '分享一套春季日常穿搭，舒适又时尚...',
          imageUrl: `https://picsum.photos/400/400?random=${index}`,
          tags: ['穿搭', '春季', '日常']
        }))
      },
      {
        id: 'demo-2',
        name: '美食探店系列计划',
        startDate: '2025-03-15',
        endDate: '2025-03-20',
        count: 6,
        accountId: '2', // 关联到美食探店达人账号
        notes: Array(6).fill(null).map((_, index) => ({
          id: `demo-note-2-${index}`,
          title: `美食探店记录 ${index + 1}`,
          content: '发现了一家超级好吃的餐厅，必须安利给大家...',
          imageUrl: `https://picsum.photos/400/400?random=${index + 10}`,
          tags: ['美食', '探店', '推荐']
        }))
      }
    ];
    setDemoPlans(march2025Plans);
  }, []);

  const allPlans = [...plans, ...demoPlans];

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
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        count: values.count,
        notes: [],
        accountId: values.accountId
      };
      
      setPlans([...plans, newPlan]);
      setSelectedPlan(newPlan);
      message.success('发布计划创建成功！');
      onClose();

      if (isFirstVisit) {
        localStorage.setItem('hasVisited', 'true');
        setLoadingVisible(true);
        const tips = ['正在帮您寻找合适的笔记素材', '正在为笔记素材配图', '正在编排笔记发布计划'];
        let currentTipIndex = 0;
    
        const tipInterval = setInterval(() => {
          setLoadingTips(tips[currentTipIndex]);
          currentTipIndex = (currentTipIndex + 1) % tips.length;
        }, 2000);
    
        setTimeout(() => {
          clearInterval(tipInterval);
          setLoadingVisible(false);
          
          const updatedPlan = {
            ...newPlan,
            notes: Array(values.count).fill(null).map((_, index) => ({
              id: `note-${Date.now()}-${index}`,
              title: `笔记 ${index + 1}`,
              content: '这是一篇小红书笔记内容示例...',
              imageUrl: values.imageSource === 'manual' && selectedImages[index] 
                ? selectedImages[index]
                : `https://picsum.photos/400/400?random=${index}`,
              tags: ['测试标签']
            }))
          };
          
          setPlans(plans => plans.map(p => p.id === newPlan.id ? updatedPlan : p));
          setSelectedPlan(updatedPlan);
        }, 3000);  // 从6秒改为3秒
      } else {
        const updatedPlan = {
          ...newPlan,
          notes: Array(values.count).fill(null).map((_, index) => ({
            id: `note-${Date.now()}-${index}`,
            title: `笔记 ${index + 1}`,
            content: '这是一篇小红书笔记内容示例...',
            imageUrl: values.imageSource === 'manual' && selectedImages[index] 
              ? selectedImages[index]
              : `https://picsum.photos/400/400?random=${index}`,
            tags: ['测试标签']
          }))
        };
        
        setPlans(plans => plans.map(p => p.id === newPlan.id ? updatedPlan : p));
        setSelectedPlan(updatedPlan);
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleEdit = (note: Note, index: number) => {
    setEditingNote(note);
    setCurrentNoteIndex(index);
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
  
  const handleConfirmPlan = () => {
    if (!selectedPlan) return;
  
    Modal.confirm({
      title: '确认执行发布计划',
      content: `确定要执行从 ${selectedPlan.startDate} 至 ${selectedPlan.endDate} 的发布计划吗？`,
      onOk: () => {
        message.success('发布计划已确认，将按计划执行！');
        // TODO: 实现实际的发布逻辑
      }
    });
  };

  const renderAccountList = () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>账号管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => {
          Modal.confirm({
            title: '添加账号',
            width: 600,
            content: (
              <Form layout="vertical">
                <Form.Item
                  name="nickname"
                  label="账号昵称"
                  rules={[{ required: true, message: '请输入账号昵称' }]}
                >
                  <Input placeholder="请输入账号昵称" />
                </Form.Item>
                <Form.Item
                  name="avatar"
                  label="账号头像"
                  rules={[{ required: true, message: '请上传账号头像' }]}
                >
                  <Input placeholder="请输入头像URL" />
                </Form.Item>
              </Form>
            ),
            onOk: () => {
              message.success('账号添加成功！');
            }
          });
        }}>
          添加账号
        </Button>
      </div>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={mockAccounts}
        renderItem={account => (
          <List.Item>
            <Card>
              <Card.Meta
                avatar={<Avatar size={64} src={account.avatar} />}
                title={account.nickname}
                description={
                  <Space direction="vertical">
                    <div>粉丝数：{account.followers.toLocaleString()}</div>
                    <div>笔记数：{account.posts}</div>
                    <div>
                      状态：
                      <span style={{ color: account.status === 'active' ? '#52c41a' : '#ff4d4f' }}>
                        {account.status === 'active' ? '已激活' : '未激活'}
                      </span>
                    </div>
                  </Space>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      {/* 品牌之声模块 */}
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', marginTop: '24px' }}>品牌之声</h2>
      <div style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: '#666', fontSize: '14px' }}>
              添加几段最能代表你风格的文案，AI 将学习并模仿你的语气，让每篇笔记都充满你的个性
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: '添加品牌文案',
                  width: 600,
                  content: (
                    <Form layout="vertical">
                      <Form.Item
                        name="content"
                        label="文案内容"
                        rules={[{ required: true, message: '请输入文案内容' }]}
                      >
                        <Input.TextArea
                          placeholder="输入一段最能代表你风格的文案..."
                          rows={4}
                        />
                      </Form.Item>
                      <Form.Item
                        name="tags"
                        label="文案特点"
                      >
                        <Select
                          mode="multiple"
                          placeholder="选择这段文案的特点"
                          options={[
                            { label: '俏皮可爱', value: 'cute' },
                            { label: '优雅知性', value: 'elegant' },
                            { label: '专业严谨', value: 'professional' },
                            { label: '亲切自然', value: 'natural' },
                            { label: '幽默诙谐', value: 'humorous' }
                          ]}
                        />
                      </Form.Item>
                    </Form>
                  ),
                  onOk: () => {
                    message.success('文案添加成功！');
                  }
                });
              }}
            >
              添加文案
            </Button>
          </div>
          
          <List
            itemLayout="vertical"
            dataSource={[
              {
                id: '1',
                content: '姐妹们！这件风衣真的绝了！穿上去感觉自己就是行走的香奈儿～不过最让我惊喜的是这个小心机：袖口居然暗藏了一圈小珍珠🤫 低调又高级～ 而且面料是可以揉成一团都不会皱的那种！上班通勤约会都能穿，绝对是今年春天的股票，建议买入！'
              },
              {
                id: '2',
                content: '「生活不是选择题，而是一道填空题。」\n\n今天想和你分享的这个小众香水，就像是为都市生活填上的一抹诗意。\n前调是晨露般的柑橘，中调藏着一片薰衣草田，后调却意外地温暖，像是被阳光晒过的羊毛衫。\n\n没有人规定都市生活该是什么样，我们都在用自己的方式，填写着属于自己的答案。'
              },
              {
                id: '3',
                content: '最近疯狂被这个小眼影盘种草！！！\n\n不是我说，这个眼影盘绝对是为手残党量身定制的！！\n一个色号就能化出高级感，而且每个色号都标注了使用顺序和部位，连我这种手残都能化出新手咖啡店店主的感觉！！\n\n重点是！！它的壳子是磁吸的！！拿在手上的时候发出"咔哒"一声，爽到起飞！！\n\n姐妹们快去给我买爆它！！'
              }
            ]}
            renderItem={item => (
              <List.Item
                style={{
                  backgroundColor: '#fff',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}
                actions={[
                  <Button type="text" key="edit">编辑</Button>,
                  <Button type="text" danger key="delete">删除</Button>
                ]}
              >
                <div style={{ whiteSpace: 'pre-wrap' }}>{item.content}</div>
              </List.Item>
            )}
          />
        </Space>
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', marginTop: '24px' }}>偏好设置</h2>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            Modal.confirm({
              title: '添加参考笔记',
              width: 600,
              content: (
                <Form layout="vertical">
                  <Form.Item
                    name="accountId"
                    label="选择账号"
                    rules={[{ required: true, message: '请选择账号' }]}
                  >
                    <Select placeholder="请选择账号">
                      {mockAccounts.map(account => (
                        <Select.Option key={account.id} value={account.id}>
                          {account.nickname}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="noteUrl"
                    label="小红书笔记链接"
                    rules={[{ required: true, message: '请输入小红书笔记链接' }]}
                  >
                    <Input placeholder="请输入小红书笔记链接" />
                  </Form.Item>
                </Form>
              ),
              onOk: () => {
                message.success('参考笔记添加成功！');
              }
            });
          }}
        >
          添加参考笔记
        </Button>
        <div style={{ color: '#666', fontSize: '14px', marginTop: '8px', marginBottom: '16px' }}>
          添加的参考笔记将帮助智能体更好地理解您需要的内容风格
        </div>
      </div>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={[
          {
            id: '1',
            title: '超实用的居家收纳技巧分享',
            cover: 'https://picsum.photos/400/400?random=1',
            author: '收纳达人',
            likes: 2345
          },
          {
            id: '2',
            title: '春季穿搭必备单品推荐',
            cover: 'https://picsum.photos/400/400?random=2',
            author: '时尚博主',
            likes: 3456
          }
        ]}
        renderItem={note => (
          <List.Item>
            <Card
              hoverable
              cover={<img alt={note.title} src={note.cover} style={{ height: 200, objectFit: 'cover' }} />}
            >
              <Card.Meta
                title={note.title}
                description={
                  <Space direction="vertical">
                    <div>作者：{note.author}</div>
                    <div>点赞数：{note.likes}</div>
                  </Space>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );

  const dateCellRender = (date: Dayjs) => {
    const dayStr = date.format('YYYY-MM-DD');
    const dayPosts = allPlans.flatMap(plan => {
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

  const renderTaskView = () => (
    <div style={{ display: 'flex', height: 'calc(100vh - 100px)' }}>
      <div style={{ 
        width: '180px', 
        minWidth: '150px',
        maxWidth: '300px',
        flexShrink: 0,
        borderRight: '1px solid #f0f0f0', 
        padding: '12px', 
        overflow: 'auto',
        resize: 'horizontal',
        userSelect: 'none',  // 防止文本选择影响拖动
        position: 'relative'  // 确保定位正确
      }}>
        <List
          dataSource={allPlans}
          renderItem={plan => (
            <List.Item
              style={{ 
                cursor: 'pointer', 
                padding: '4px 0',
                marginBottom: '8px'
              }}
              onClick={() => setSelectedPlan(plan)}
            >
              <Card
                size="small"
                title={
                  <div style={{ fontSize: '13px' }}>
                    <div style={{ marginBottom: '4px' }}>
                      <span style={{ fontWeight: 'bold' }}>{plan.name || '未命名计划'}</span>
                    </div>
                    {plan.accountId && (
                      <div style={{ marginBottom: '4px' }}>
                        <Avatar
                          size="small"
                          src={mockAccounts.find(acc => acc.id === plan.accountId)?.avatar}
                        />
                        <span style={{ marginLeft: '4px', fontSize: '12px' }}>{mockAccounts.find(acc => acc.id === plan.accountId)?.nickname}</span>
                      </div>
                    )}
                    <div style={{ color: '#666', fontSize: '12px' }}>{plan.startDate} 至 {plan.endDate}</div>
                  </div>
                }
                style={{ 
                  width: '100%', 
                  backgroundColor: selectedPlan?.id === plan.id ? '#f0f0f0' : 'white',
                  borderRadius: '6px'
                }}
              >
                <p style={{ fontSize: '12px', margin: 0 }}>计划发布: {plan.count} 篇</p>
              </Card>
            </List.Item>
          )}
        />
      </div>
      <div style={{ flex: 1, padding: '16px' }}>
        {loadingVisible ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            backgroundColor: '#fff',
            borderRadius: 8,
            padding: '24px'
          }}>
            <LoadingOutlined style={{ fontSize: '36px', color: '#1890ff', marginBottom: '16px' }} />
            <div style={{ fontSize: '16px', color: '#666' }}>{loadingTips}</div>
          </div>
        ) : selectedPlan && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2>{selectedPlan.startDate} 至 {selectedPlan.endDate}的发布计划</h2>
              <Space>
                <Button type="primary" onClick={handleConfirmPlan}>确认执行计划</Button>
              </Space>
            </div>
            <Tabs
              defaultActiveKey="xiaohongshu"
              items={[
                {
                  key: 'xiaohongshu',
                  label: '小红书',
                  children: (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                      {selectedPlan.notes.map((note, index) => (
                        <Card key={note.id}>
                          <img
                            alt="小红书预览"
                            src={note.platforms?.xiaohongshu?.imageUrl || note.imageUrl}
                            style={{ height: 200, width: '100%', objectFit: 'cover', marginBottom: 16 }}
                          />
                          <Card.Meta
                            title={
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{note.platforms?.xiaohongshu?.title || note.title}</span>
                                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteNote(note.id)} />
                              </div>
                            }
                            description={
                              <div>
                                <p>{note.platforms?.xiaohongshu?.content || note.content}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                                  <Button type="link" onClick={() => handleEdit(note, index)}>编辑</Button>
                                  <span style={{ color: '#666' }}>发布时间：{dayjs(note.scheduledTime || selectedPlan.startDate).format('YYYY-MM-DD HH:mm')}</span>
                                </div>
                              </div>
                            }
                          />
                        </Card>
                      ))}
                    </div>
                  )
                },
                {
                  key: 'wechat',
                  label: '微信',
                  children: (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                      {selectedPlan.notes.map((note, index) => (
                        <Card key={note.id}>
                          <img
                            alt="微信预览"
                            src={note.platforms?.wechat?.imageUrl || note.imageUrl}
                            style={{ height: 200, width: '100%', objectFit: 'cover', marginBottom: 16 }}
                          />
                          <Card.Meta
                            title={
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{note.platforms?.wechat?.title || note.title}</span>
                                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteNote(note.id)} />
                              </div>
                            }
                            description={
                              <div>
                                <p>{note.platforms?.wechat?.content || note.content}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                                  <Button type="link" onClick={() => handleEdit(note, index)}>编辑</Button>
                                  <span style={{ color: '#666' }}>发布时间：{dayjs(note.scheduledTime || selectedPlan.startDate).format('YYYY-MM-DD HH:mm')}</span>
                                </div>
                              </div>
                            }
                          />
                        </Card>
                      ))}
                    </div>
                  )
                }
              ]}
            />
            <div style={{ marginTop: 16, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
              <Space>
                <Button type="text" icon={<DeleteOutlined />} onClick={() => editingNote && handleDeleteNote(editingNote.id)}>删除</Button>
                <p style={{ color: '#1890ff' }}>计划发布时间：{selectedPlan.startDate}</p>
              </Space>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTimelineView = () => {
    const allNotes = allPlans.flatMap(plan => 
      plan.notes.map((note, index) => ({
        ...note,
        planName: plan.name || '未命名计划',
        planId: plan.id,
        scheduledTime: dayjs(plan.startDate).add(index, 'days').format('YYYY-MM-DD'),
        account: mockAccounts.find(acc => acc.id === plan.accountId)
      }))
    ).sort((a, b) => dayjs(b.scheduledTime).diff(dayjs(a.scheduledTime))); // 修改排序为倒序

    const groupedNotes = allNotes.reduce((acc, note) => {
      const date = note.scheduledTime;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(note);
      return acc;
    }, {} as Record<string, typeof allNotes>);

    return (
      <div style={{ padding: '16px', display: 'flex' }}>
        <Timeline 
          mode="left"
          style={{ 
            flex: '0 0 200px',
            borderRight: '1px solid #f0f0f0',
            paddingRight: '16px',
            marginRight: '16px'
          }}
        >
          {Object.entries(groupedNotes).map(([date]) => (
            <Timeline.Item 
              key={date}
              label={
                <div style={{
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  padding: '4px 0'
                }}>
                  {dayjs(date).format('YYYY年MM月DD日')}
                </div>
              }
              style={{
                paddingBottom: '20px'
              }}
            />
          ))}
        </Timeline>
        <div style={{ flex: 1, overflow: 'auto' }}>
          {Object.entries(groupedNotes).map(([date, notes]) => (
            <div 
              key={date}
              style={{ 
                marginBottom: '24px',
              }}
            >
              <div style={{ 
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '16px',
                color: '#1890ff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CalendarOutlined />
                {dayjs(date).format('YYYY年MM月DD日')}
                <span style={{ 
                  fontSize: '14px',
                  fontWeight: 'normal',
                  color: '#666',
                  marginLeft: '8px'
                }}>
                  {notes.length} 篇笔记
                </span>
              </div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '16px',
                padding: '4px'
              }}>
                {notes.map(note => (
                  <Card
                    key={note.id}
                    size="small"
                    hoverable
                    cover={
                      <img
                        alt={note.title}
                        src={note.imageUrl}
                        style={{ height: 160, objectFit: 'cover' }}
                      />
                    }
                  >
                    <Card.Meta
                      avatar={note.account && <Avatar src={note.account.avatar} />}
                      title={note.title}
                      description={
                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            来自：{note.planName}
                          </div>
                          <div style={{ fontSize: '12px', color: '#999' }}>
                            {note.tags?.map(tag => `#${tag}`).join(' ')}
                          </div>
                        </Space>
                      }
                    />
                    <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button type="link" size="small" onClick={() => handleEdit(note, 0)}>
                        编辑
                      </Button>
                      <Button 
                        type="text" 
                        size="small" 
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteNote(note.id)}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderListView = () => {
    const allNotes = allPlans.flatMap(plan => 
      plan.notes.map((note, index) => ({
        ...note,
        planName: plan.name || '未命名计划',
        planId: plan.id,
        scheduledTime: dayjs(plan.startDate).add(index, 'days').format('YYYY-MM-DD'),
        account: mockAccounts.find(acc => acc.id === plan.accountId),
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100),
        saves: Math.floor(Math.random() * 500)
      }))
    );

    const columns = [
      {
        title: '封面',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        width: 100,
        render: (imageUrl: string) => (
          <img src={imageUrl} alt="封面" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} />
        )
      },
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        render: (title: string, record: any) => (
          <div>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 12, color: '#666' }}>
              来自：{record.planName}
            </div>
          </div>
        )
      },
      {
        title: '发布账号',
        dataIndex: 'account',
        key: 'account',
        render: (account: any) => account ? (
          <Space>
            <Avatar size="small" src={account.avatar} />
            <span>{account.nickname}</span>
          </Space>
        ) : '-'
      },
      {
        title: '发布时间',
        dataIndex: 'scheduledTime',
        key: 'scheduledTime',
        sorter: (a: any, b: any) => dayjs(a.scheduledTime).unix() - dayjs(b.scheduledTime).unix(),
        render: (date: string) => dayjs(date).format('YYYY-MM-DD')
      },
      {
        title: '互动数据',
        key: 'interactions',
        render: (record: any) => (
          <Space size={16}>
            <span>
              <HeartOutlined /> {record.likes}
            </span>
            <span>
              <MessageOutlined /> {record.comments}
            </span>
            <span>
              <StarOutlined /> {record.saves}
            </span>
          </Space>
        ),
        sorter: (a: any, b: any) => a.likes - b.likes
      },
      {
        title: '操作',
        key: 'action',
        render: (record: any) => (
          <Space>
            <Button type="link" size="small" onClick={() => handleEdit(record, 0)}>
              编辑
            </Button>
            <Button 
              type="text" 
              size="small" 
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteNote(record.id)}
            />
          </Space>
        )
      }
    ];

    return (
      <div style={{ padding: '16px' }}>
        <Table
          columns={columns}
          dataSource={allNotes}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条数据`
          }}
        />
      </div>
    );
  };

  return (
    <div className="publish-plan-container">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        tabBarExtraContent={
          <Space>
            <Button icon={<RobotOutlined />} onClick={() => setAiAssistantVisible(true)}>
              唤起助手
            </Button>
            <Button icon={<CalendarOutlined />} onClick={() => setCalendarVisible(true)}>
              查看日历
            </Button>
          </Space>
        }
        items={[
          {
            key: 'overview',
            label: '概览',
            children: (
              <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h2 style={{ margin: 0 }}>上周核心数据</h2>
                    <Select
                      defaultValue={mockAccounts[0].id}
                      style={{ width: 200 }}
                      options={mockAccounts.map(account => ({
                        value: account.id,
                        label: account.nickname
                      }))}
                    />
                  </div>
                  <div style={{ marginBottom: '32px' }}>
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Card title="商品上新" bordered={false}>
                        <List
                          dataSource={[
                            { title: '新款春季连衣裙', views: 2341, likes: 89, comments: 15, saves: 45 },
                            { title: '小众设计感包包', views: 1892, likes: 76, comments: 12, saves: 38 }
                          ]}
                          renderItem={item => (
                            <List.Item>
                              <div style={{ width: '100%' }}>
                                <div style={{ marginBottom: '8px' }}>{item.title}</div>
                                <Row gutter={16}>
                                  <Col span={6}>
                                    <Statistic title="浏览" value={item.views} />
                                  </Col>
                                  <Col span={6}>
                                    <Statistic title="点赞" value={item.likes} />
                                  </Col>
                                  <Col span={6}>
                                    <Statistic title="评论" value={item.comments} />
                                  </Col>
                                  <Col span={6}>
                                    <Statistic title="收藏" value={item.saves} />
                                  </Col>
                                </Row>
                              </div>
                            </List.Item>
                          )}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card title="活动推广" bordered={false}>
                        <List
                          dataSource={[
                            { title: '春季焕新活动', views: 3421, likes: 156, comments: 42, saves: 89 },
                            { title: '会员日特惠', views: 2876, likes: 134, comments: 28, saves: 67 }
                          ]}
                          renderItem={item => (
                            <List.Item>
                              <div style={{ width: '100%' }}>
                                <div style={{ marginBottom: '8px' }}>{item.title}</div>
                                <Row gutter={16}>
                                  <Col span={6}>
                                    <Statistic title="浏览" value={item.views} />
                                  </Col>
                                  <Col span={6}>
                                    <Statistic title="点赞" value={item.likes} />
                                  </Col>
                                  <Col span={6}>
                                    <Statistic title="评论" value={item.comments} />
                                  </Col>
                                  <Col span={6}>
                                    <Statistic title="收藏" value={item.saves} />
                                  </Col>
                                </Row>
                              </div>
                            </List.Item>
                          )}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card title="日常宣发" bordered={false}>
                        <List
                          dataSource={[
                            { title: '穿搭日记分享', views: 1987, likes: 87, comments: 23, saves: 42 },
                            { title: '生活美学记录', views: 1654, likes: 65, comments: 18, saves: 31 }
                          ]}
                          renderItem={item => (
                            <List.Item>
                              <div style={{ width: '100%' }}>
                                <div style={{ marginBottom: '8px' }}>{item.title}</div>
                                <Row gutter={16}>
                                  <Col span={6}>
                                    <Statistic title="浏览" value={item.views} />
                                  </Col>
                                  <Col span={6}>
                                    <Statistic title="点赞" value={item.likes} />
                                  </Col>
                                  <Col span={6}>
                                    <Statistic title="评论" value={item.comments} />
                                  </Col>
                                  <Col span={6}>
                                    <Statistic title="收藏" value={item.saves} />
                                  </Col>
                                </Row>
                              </div>
                            </List.Item>
                          )}
                        />
                      </Card>
                    </Col>
                  </Row>
                  <Card style={{ marginTop: '16px' }} title="深度复盘">
                    <List
                      dataSource={[
                        '商品上新类笔记互动率偏低，建议增加实拍图片和细节展示，提升产品信息的真实感和说服力',
                        '活动推广类笔记表现最好，可以适当增加发布频率，并注意活动信息的清晰传达',
                        '日常宣发类笔记互动质量较好，建议保持个人化视角，增加情感共鸣'
                      ]}
                      renderItem={item => <List.Item>{item}</List.Item>}
                    />
                  </Card>
                </div>
              
                <h3 style={{ marginBottom: 16, marginTop: 24 }}>下周计划</h3>
                <Card
                  title="热点嗅探"
                  extra={<Tooltip title="根据账号内容特征，智能推荐相关热点话题"><QuestionCircleOutlined /></Tooltip>}
                  style={{ marginBottom: 16 }}
                >
                  <div style={{ marginBottom: 16, color: '#1890ff' }}>
                    最近发现5篇热点与品牌相关度较高，预计将在近期创作以下内容
                  </div>
                  <List
                    dataSource={[
                      { topic: '春日樱花季', relevance: 95, expectedTime: '2024-03-21 12:00', content: '赏樱踏青穿搭灵感，搭配春日限定饮品', hot: '123w' },
                      { topic: '断舍离整理术', relevance: 88, expectedTime: '2024-03-21 15:00', content: '春季换季收纳整理指南', hot: '98w' },
                      { topic: '春季美妆趋势', relevance: 85, expectedTime: '2024-03-21 18:00', content: '2024春季妆容趋势解析', hot: '156w' },
                      { topic: '轻食食谱', relevance: 82, expectedTime: '2024-03-22 10:00', content: '春季轻食搭配提案', hot: '78w' },
                      { topic: '手作DIY', relevance: 78, expectedTime: '2024-03-22 14:00', content: '春季手工DIY创意分享', hot: '89w' }
                    ]}
                    renderItem={item => (
                      <List.Item>
                        <div style={{ width: '100%' }}>
                          <Row align="middle" justify="space-between">
                            <Col span={6}>
                              <Space>
                                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{item.topic}</div>
                                <div style={{ color: '#ff4d4f' }}>{item.hot}</div>
                              </Space>
                            </Col>
                            <Col span={4}>
                              <div style={{ color: '#1890ff' }}>相关度：{item.relevance}%</div>
                            </Col>
                            <Col span={7}>
                              <div style={{ color: '#666' }}>预计发布：{item.expectedTime}</div>
                            </Col>
                            <Col span={7}>
                              <div style={{ color: '#666' }}>预期内容：{item.content}</div>
                            </Col>
                          </Row>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
                <Card
                  title="下周发布计划"
                  style={{ marginBottom: 16 }}
                >
                  <Row gutter={16}>
                    <Col span={6}>
                      <Statistic title="预计发布笔记" value={12} suffix="篇" />
                    </Col>
                    <Col span={18}>
                      <div style={{ marginBottom: 16, color: '#666' }}>
                        <p>根据本周数据分析和内容规划，下周将重点关注以下方面：</p>
                        <ul style={{ paddingLeft: 20 }}>
                          <li>本周微商城新上架春季新品系列尚未进行推广，计划发布5篇笔记重点展示新品特色和搭配方案</li>
                          <li>即将开展的春季焕新促销活动需要预热，安排3篇笔记进行活动预告和爆品推荐</li>
                          <li>基于用户画像分析，增加4篇轻松生活类内容，提升账号日常互动率</li>
                        </ul>
                      </div>
                      <List
                        size="small"
                        dataSource={[
                          { type: '商品上新', count: 5, interaction: '预期互动率 4.2%' },
                          { type: '活动推广', count: 3, interaction: '预期互动率 3.8%' },
                          { type: '日常宣发', count: 4, interaction: '预期互动率 3.5%' }
                        ]}
                        renderItem={item => (
                          <List.Item>
                            <Row style={{ width: '100%' }}>
                              <Col span={8}>{item.type}</Col>
                              <Col span={8}>{item.count} 篇</Col>
                              <Col span={8}>{item.interaction}</Col>
                            </Row>
                          </List.Item>
                        )}
                      />
                    </Col>
                  </Row>
                </Card>
              </div>
            )
          },
          {
            key: 'plan',
            label: '发布计划',
            children: (
              <div>
                <div style={{ 
                  padding: '16px 16px 0',
                  borderBottom: '1px solid #f0f0f0',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={showDrawer}>
                      智能内容规划
                    </Button>
                    <Button icon={<PlusOutlined />} onClick={showSingleNoteDrawer}>
                      创作笔记
                    </Button>
                  </Space>
                  <Radio.Group
                    value={viewMode}
                    onChange={e => setViewMode(e.target.value)}
                    optionType="button"
                    buttonStyle="solid"
                  >
                    <Radio.Button value="task">任务视图</Radio.Button>
                    <Radio.Button value="timeline">时间轴视图</Radio.Button>
                    <Radio.Button value="list">列表视图</Radio.Button>
                  </Radio.Group>
                </div>
                {viewMode === 'task' ? renderTaskView() : viewMode === 'timeline' ? renderTimelineView() : renderListView()}
              </div>
            )
          },
          {
            key: 'account',
            label: '账号管理',
            children: renderAccountList()
          }
        ]}
      />

      <Drawer
        title="创建发布计划"
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
            name="accountId"
            label="选择账号"
            rules={[{ required: true, message: '请选择发布账号' }]}
          >
            <Select
              placeholder="请选择发布账号"
              onChange={(value) => setSelectedAccount(value)}
            >
              {mockAccounts.filter(account => account.status === 'active').map(account => (
                <Select.Option key={account.id} value={account.id}>
                  <Space>
                    <Avatar size="small" src={account.avatar} />
                    {account.nickname}
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label="计划名称"
            rules={[{ required: true, message: '请输入计划名称' }]}
          >
            <Input placeholder="请输入计划名称" />
          </Form.Item>
          <Form.Item
            name="dateRange"
            label="发布时间周期"
            rules={[{ required: true, message: '请选择发布时间周期' }]}
          >
            <DatePicker.RangePicker />
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

          <Form.Item
            name="count"
            label="计划发布数量"
            rules={[{ required: true, message: '请输入计划发布数量' }]}
          >
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>

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