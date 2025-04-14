import React, { useState, useEffect, useRef } from 'react';
import { Button, Drawer, Form, DatePicker, Space, List, Card, Modal, message, Input, Radio, Tooltip, Calendar, Tabs, Avatar, Select, Table, Badge, Row, Col, Checkbox, Typography, Tag } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { PlusOutlined, DeleteOutlined, QuestionCircleOutlined, LoadingOutlined, RobotOutlined, LeftOutlined, RightOutlined, ShareAltOutlined, HeartOutlined, MessageOutlined, StarOutlined, EllipsisOutlined, RiseOutlined, AppstoreOutlined, EditOutlined, SettingOutlined, PictureOutlined, FireOutlined, EyeOutlined, GiftOutlined, BulbOutlined, ShoppingOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useParams } from 'react-router-dom';
import OverviewTab from '../components/OverviewTab';
import PersonalizationTab from '../components/PersonalizationTab';
import ImagePreviewModal from '../components/ImagePreviewModal';
import { mockAccounts, mockPlans, mockContentData, mockHotTopics, mockHotTopicsYesterday, mockDateOptions, imageMaterials, dialogHistory } from '../data/ mockPublishplan'; // Adjust path if filename is different
import { Plan, Note, PublishStrategy, ImageMaterial } from '../types/publish';

dayjs.extend(isBetween);

interface PublishPlanProps {
  aiAssistantVisible?: boolean;
  setAiAssistantVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

const PublishPlan: React.FC<PublishPlanProps> = ({ 
  aiAssistantVisible: propAiAssistantVisible, 
  setAiAssistantVisible: propSetAiAssistantVisible 
}) => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [singleNoteForm] = Form.useForm();
  // 添加一个ref用于直接引用TextArea元素
  const contentTypeInputRef = useRef<any>(null);
  // 新增 state 用于受控管理内容诉求输入框的值
  const [contentTypeValue, setContentTypeValue] = useState<string>('');
  
  // 抽屉相关状态
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [showSkillConfig, setShowSkillConfig] = useState(false);
  const [singleNoteDrawerVisible, setSingleNoteDrawerVisible] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  // 计划相关状态
  const [plans, setPlans] = useState<Plan[]>(mockPlans);  // 使用 mock 数据初始化
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  
  // 获取当前账号信息
  const currentAccount = mockAccounts.find(acc => acc.id === id);
  
  // 热点话题状态
  const [hotTopicDateFilter, setHotTopicDateFilter] = useState('today');
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  
  // 内容配置相关状态
  const [activeTab, setActiveTab] = useState('overview');
  const [calendarVisible, setCalendarVisible] = useState(false);
  // 使用父组件传递的状态或本地状态
  const [localAiAssistantVisible, setLocalAiAssistantVisible] = useState(false);
  const [] = useState(true);
  
  // 计算实际使用的状态
  const aiAssistantVisible = propAiAssistantVisible !== undefined ? propAiAssistantVisible : localAiAssistantVisible;
  const setAiAssistantVisible = propSetAiAssistantVisible || setLocalAiAssistantVisible;
  
  const [] = useState(true);
  const [] = useState(true);
  const [] = useState(false);
  const [contentStyle, setContentStyle] = useState('轻松随意');
  const [customStyle, setCustomStyle] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageMaterial | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showHotTopicModal, setShowHotTopicModal] = useState(false);
  const [notifyDaysBeforePublish, setNotifyDaysBeforePublish] = useState(2);
  const [publishQuantity, setPublishQuantity] = useState("daily");
  const [imageSource, setImageSource] = useState('auto');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [mountType, setMountType] = useState('none');
  const [imageSelectMode, setImageSelectMode] = useState('auto');
  
  // 技能开启状态
  const [enableDailyCreation, setEnableDailyCreation] = useState(true);
  const [enableHotTopicCreation, setEnableHotTopicCreation] = useState(false);
  const [enableAssistCreation, setEnableAssistCreation] = useState(false);
  const [enableNewProductCreation, setEnableNewProductCreation] = useState(true); // 新增：商品上新创作技能状态
  
  // 热点策略配置
  const [hotTopicStrategy, setHotTopicStrategy] = useState<PublishStrategy>({
    mode: 'additional',
    priorities: ['时事热点', '行业趋势', '节日活动', '用户调研', '产品评测']
  });

  // 热文改写功能相关状态
  const [] = useState<string>('weekly');
  const [] = useState<PublishStrategy>({
    mode: 'additional',
    priorities: ['热文改写', '热点创作', '日常内容']
  });
  
  // 个性化配置
  const [] = useState<'additional' | 'replace'>('additional');
  const [] = useState(true);
  const [] = useState(true);
  const [] = useState<{
    regularPromotion: number;
    productPromotion: number;
  }>({
    regularPromotion: 60,
    productPromotion: 40
  });
  const [] = useState(70);
  
  // 当前选中的技能
  const [selectedSkill, setSelectedSkill] = useState('daily');

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
    setContentTypeValue(''); // 重置内容诉求 state
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

  // 添加handleEditNote函数
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
  };

  const renderTaskView = () => {
    // 定义技能列表数据
    const skillsList = [
      {
        id: 'daily',
        name: '内容托管',
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
            scheduledTime: item.publishTime
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
            scheduledTime: item.publishTime
          }))
        ]
      },
      {
        id: 'newProduct', // 修改 ID
        name: '商品上新创作', // 修改名称
        description: '当有新商品上架时，自动创作推广内容', // 修改描述
        enabled: enableNewProductCreation, // 使用新状态
        setEnabled: setEnableNewProductCreation, // 使用新状态设置函数
        icon: <FireOutlined />, // 修改图标
        color: '#fa8c16', // 修改颜色 (例如，橙色)
        content: [ // 更新示例内容
          {
            id: 'newProduct-1',
            title: '新品上市：智能降噪耳机',
            content: '全新智能降噪耳机震撼上市！沉浸式音乐体验，告别噪音干扰...',
            imageUrl: 'https://picsum.photos/400/400?random=501',
            scheduledTime: dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm')
          },
          {
            id: 'newProduct-2',
            title: '春季新款：设计师联名连衣裙',
            content: '探索春日浪漫，设计师联名款连衣裙优雅登场，限时优惠进行中...',
            imageUrl: 'https://picsum.photos/400/400?random=502',
            scheduledTime: dayjs().add(3, 'day').format('YYYY-MM-DD HH:mm')
          }
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
            scheduledTime: item.publishTime
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
          backgroundColor: '#fff', 
          padding: '16px',
          borderRadius: '8px',
          height: 'calc(100vh - 200px)',
          overflow: 'auto',
          flexShrink: 0,
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)'
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
                backgroundColor: selectedSkill === skill.id ? '#f7f7f7' : 'transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                border: selectedSkill === skill.id ? '1px solid #f0f0f0' : '1px solid transparent',
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
        <div style={{ 
          flex: 1, 
          overflow: 'auto', 
          maxWidth: 'calc(100vw - 250px)', 
          backgroundColor: '#fff', 
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)'
        }}>
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
                  </Card>
                ))}
              </div>
            </>
          )}
          
          {/* 商品上新创作技能 */}
          {currentSkill.id === 'newProduct' && ( // 修改 ID 判断
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
                {/* 移除按钮区域 */}
                {/* <Space>...</Space> */}
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
                      // 移除分享按钮
                    ]}
                    size="small"
                  >
                    {/* 移除互动笔记标签 */}
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
                  </Card>
                ))}
              </div>
            </>
          )}
          
          {/* 非辅助创作技能且未开启时显示配置界面 */}
          {currentSkill.id !== 'assist' && currentSkill.id !== 'newProduct' && !currentSkill.enabled ? ( // 修改 ID 判断
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
                        </div>
                      </Card>

                      <Card style={{ marginBottom: '16px' }} title="内容审批">
                        <div style={{ padding: '0' }}>
                          <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
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

                          <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1', minWidth: '200px' }}>
                              <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>审批人</div>
                              <Select
                                mode="multiple"
                                placeholder="请选择审批人"
                                defaultValue={['user1']}
                                style={{ width: '100%' }}
                              >
                                <Select.Option value="user1">张三（主管）</Select.Option>
                                <Select.Option value="user2">李四（经理）</Select.Option>
                                <Select.Option value="user3">王五（总监）</Select.Option>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card style={{ marginBottom: '16px' }} title="内容风格">
                        <div style={{ padding: '0' }}>
                          <div style={{ marginBottom: '16px' }}>
                            <div style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>
                              选择AI创作内容的风格基调，影响词汇选择和表达方式
                            </div>
                            <Radio.Group 
                              value={contentStyle}
                              onChange={(e) => {
                                setContentStyle(e.target.value);
                                if (e.target.value !== 'custom') {
                                  setCustomStyle('');
                                }
                              }}
                              style={{ marginBottom: contentStyle === 'custom' ? '16px' : '0' }}
                            >
                              <Space direction="vertical">
                                <Radio value="轻松随意">轻松随意</Radio>
                                <Radio value="专业正式">专业正式</Radio>
                                <Radio value="感性文艺">感性文艺</Radio>
                                <Radio value="幽默诙谐">幽默诙谐</Radio>
                                <Radio value="custom">自定义风格</Radio>
                              </Space>
                            </Radio.Group>
                            
                            {contentStyle === 'custom' && (
                              <div style={{ marginTop: '16px' }}>
                                <Input.TextArea
                                  placeholder="请输入描述风格的词语，如：清新自然、简约现代、温暖治愈..."
                                  value={customStyle}
                                  onChange={(e) => setCustomStyle(e.target.value)}
                                  rows={2}
                                  style={{ width: '100%' }}
                                />
                                <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                                  提示：词语之间可用逗号或空格分隔，建议3-5个词语最佳
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>

                      <Card style={{ marginBottom: '16px' }} title="挂载配置">
                        <div style={{ padding: '0' }}>
                          <div style={{ marginBottom: '16px' }}>
                            <Radio.Group 
                              defaultValue="none"
                              onChange={(e) => setMountType(e.target.value)}
                            >
                              <Space direction="vertical">
                                <Radio value="none">不挂载商品或POI</Radio>
                                <Radio value="product">挂载商品</Radio>
                                <Radio value="poi">挂载POI</Radio>
                              </Space>
                            </Radio.Group>
                          </div>

                          {mountType === 'product' && (
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
                          )}
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
                    </div>
                  )}
                  {currentSkill.id === 'hotTopic' && (
                    <>
                      <p>AI将实时监测行业热点和相关趋势，创作紧跟热点的内容。</p>
                      <p>提升内容的时效性和曝光率，让您的账号更具影响力。</p>
                    </>
                  )}
                  {/* 商品上新创作技能的未开启描述 */}
                  {currentSkill.id === 'newProduct' && (
                    <>
                      <p>当您在后台添加新商品时，AI会自动识别并创作推广这些新品的内容。</p>
                      <p>无需人工干预，让新品自动获得曝光和销售机会。</p>
                      <br/>
                      <Card title="配置选项 (示例)">
                        <Form layout="vertical">
                          <Form.Item label="触发创作的商品分类">
                            <Select mode="multiple" placeholder="选择需要自动创作的商品分类" defaultValue={['服装', '美妆']}>
                              <Select.Option value="服装">服装</Select.Option>
                              <Select.Option value="美妆">美妆</Select.Option>
                              <Select.Option value="家居">家居</Select.Option>
                              <Select.Option value="配饰">配饰</Select.Option>
                              <Select.Option value="食品">食品</Select.Option>
                            </Select>
                          </Form.Item>
                          <Form.Item label="内容生成风格">
                            <Radio.Group defaultValue="auto">
                                <Radio value="auto">根据商品自动判断</Radio>
                                <Radio value="style1">风格1 (活泼有趣)</Radio>
                                <Radio value="style2">风格2 (专业评测)</Radio>
                              </Radio.Group>
                          </Form.Item>
                        </Form>
                      </Card>
                    </>
                  )}
                </div>
                
                <div style={{ marginBottom: '24px', width: '100%' }}>
                  {currentSkill.id === 'hotTopic' && (
                    <div style={{ marginBottom: '24px', width: '100%' }}>
                      <Card title="发布策略">
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>当出现匹配度高的热点内容时：</div>
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
                  
                  {/* {currentSkill.id === 'newProduct' && ( */}
                  {/* // 移除原热文改写技能的配置，商品上新技能不需要这个 */}
                  {/* )} */}
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
          ) : currentSkill.id !== 'assist' && currentSkill.id !== 'newProduct' ? ( // 修改 ID 判断
            // 非辅助创作、非商品上新技能且已开启时显示内容列表
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

              {/* 显示昨日热点信息（仅在热点创作技能时显示） */}
              {currentSkill.id === 'hotTopic' && (
                <div style={{ 
                  marginBottom: '24px', 
                  padding: '12px 16px',
                  backgroundColor: '#FFF2E8', 
                  borderRadius: '8px',
                  border: '1px solid #FFCCA7',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FireOutlined style={{ color: '#FA541C', fontSize: '18px' }} />
                    <span style={{ fontWeight: 'bold', color: '#FA541C' }}>
                      热点推荐
                    </span>
                    <span style={{ color: '#666' }}>
                      正在持续为您监测品牌匹配度高的热点
                    </span>
                  </div>
                  <Button 
                    type="link" 
                    style={{ color: '#FA541C' }}
                    onClick={() => setShowHotTopicModal(true)}
                  >
                    查看详情
                  </Button>
                </div>
              )}

              {/* 热文改写技能内容区域 */}
              {/* {currentSkill.id === 'newProduct' && ( */}
                {/* // 移除原热文改写相关逻辑 */}
              {/* )} */}

              {/* 热点详情弹窗 */}
              <Modal
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FireOutlined style={{ color: '#FA541C' }} />
                    <span>热点内容</span>
                  </div>
                }
                open={showHotTopicModal}
                onCancel={() => setShowHotTopicModal(false)}
                footer={null}
                width={700}
              >
                <div style={{ marginBottom: '16px' }}>
                  <Radio.Group 
                    options={mockDateOptions} 
                    value={hotTopicDateFilter}
                    onChange={(e) => setHotTopicDateFilter(e.target.value)}
                    optionType="button"
                    buttonStyle="solid"
                    style={{ marginBottom: '16px' }}
                  />
                </div>
                
                <List
                  dataSource={hotTopicDateFilter === 'today' ? mockHotTopics : 
                             hotTopicDateFilter === 'yesterday' ? mockHotTopics : mockHotTopicsYesterday}
                  renderItem={item => (
                    <List.Item
                      style={{ 
                        padding: '16px',
                        borderRadius: '8px',
                        background: expandedTopics.includes(item.id) ? '#f9f9f9' : 'white',
                        marginBottom: '8px',
                        transition: 'all 0.3s'
                      }}
                    >
                      <div style={{ width: '100%' }}>
                        {/* 热点标题和操作区 */}
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          marginBottom: '12px'
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              fontWeight: 'bold', 
                              fontSize: '15px',
                              marginBottom: '8px'
                            }}>
                              {item.title}
                            </div>
                            <Space size={16}>
                              <span style={{ color: '#FA541C', fontWeight: 'bold' }}>
                                匹配度: {item.relevance}%
                              </span>
                              <span>
                                <EyeOutlined style={{ marginRight: '4px' }} />
                                {(item.views / 10000).toFixed(1)}万热度
                              </span>
                            </Space>
                          </div>
                          <Space>
                            {item.created ? (
                              <Tag color="green">已创作</Tag>
                            ) : (
                              <Button type="primary" size="small">创作内容</Button>
                            )}
                            <Button 
                              type="link" 
                              size="small"
                              onClick={() => {
                                setExpandedTopics(prev => 
                                  prev.includes(item.id) 
                                    ? prev.filter(id => id !== item.id)
                                    : [...prev, item.id]
                                );
                              }}
                            >
                              {expandedTopics.includes(item.id) ? '收起' : '展开'}
                            </Button>
                          </Space>
                        </div>

                        {/* 热点概述 */}
                        {expandedTopics.includes(item.id) && (
                          <div style={{ 
                            padding: '12px', 
                            backgroundColor: 'white', 
                            borderRadius: '4px',
                            border: '1px solid #f0f0f0',
                            marginTop: '8px'
                          }}>
                            {item.details}
                          </div>
                        )}
                      </div>
                    </List.Item>
                  )}
                />
              </Modal>

              {/* 图片素材预览模块 */}
              {false && (
                <div style={{ 
                  marginBottom: '24px',
                  padding: '8px 12px',
                  backgroundColor: '#f7f7f7',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    color: '#333',
                    flexShrink: 0
                  }}>
                    <PictureOutlined />
                    即将为你创作的内容素材
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    gap: '8px',
                    overflowX: 'auto',
                    flex: 1
                  }}>
                    {imageMaterials.map(image => (
                      <div
                        key={image.id}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          position: 'relative',
                          flexShrink: 0,
                          border: image.usagePlan ? '2px solid #1890ff' : 'none'
                        }}
                        onClick={() => {
                          setSelectedImage(image);
                          setShowImagePreview(true);
                        }}
                      >
                        <img
                          src={image.url}
                          alt=""
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <Button 
                    type="link" 
                    size="small" 
                    onClick={() => {
                      if (imageMaterials.length > 0) {
                        setSelectedImage(imageMaterials[0]);
                        setShowImagePreview(true);
                      }
                    }}
                  >
                    查看创作计划
                  </Button>
                </div>
              )}

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
                      </div>
                    </Card>

                    <Card style={{ marginBottom: '16px' }} title="内容审批">
                      <div style={{ padding: '0' }}>
                        <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
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

                        <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                          <div style={{ flex: '1', minWidth: '200px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>审批人</div>
                            <Select
                              mode="multiple"
                              placeholder="请选择审批人"
                              defaultValue={['user1']}
                              style={{ width: '100%' }}
                            >
                              <Select.Option value="user1">张三（主管）</Select.Option>
                              <Select.Option value="user2">李四（经理）</Select.Option>
                              <Select.Option value="user3">王五（总监）</Select.Option>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card style={{ marginBottom: '16px' }} title="内容风格">
                      <div style={{ padding: '0' }}>
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>
                            选择AI创作内容的风格基调，影响词汇选择和表达方式
                          </div>
                          <Radio.Group 
                            value={contentStyle}
                            onChange={(e) => {
                              setContentStyle(e.target.value);
                              if (e.target.value !== 'custom') {
                                setCustomStyle('');
                              }
                            }}
                            style={{ marginBottom: contentStyle === 'custom' ? '16px' : '0' }}
                          >
                            <Space direction="vertical">
                              <Radio value="轻松随意">轻松随意</Radio>
                              <Radio value="专业正式">专业正式</Radio>
                              <Radio value="感性文艺">感性文艺</Radio>
                              <Radio value="幽默诙谐">幽默诙谐</Radio>
                              <Radio value="custom">自定义风格</Radio>
                            </Space>
                          </Radio.Group>
                          
                          {contentStyle === 'custom' && (
                            <div style={{ marginTop: '16px' }}>
                              <Input.TextArea
                                placeholder="请输入描述风格的词语，如：清新自然、简约现代、温暖治愈..."
                                value={customStyle}
                                onChange={(e) => setCustomStyle(e.target.value)}
                                rows={2}
                                style={{ width: '100%' }}
                              />
                              <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                                提示：词语之间可用逗号或空格分隔，建议3-5个词语最佳
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>

                    <Card style={{ marginBottom: '16px' }} title="挂载配置">
                      <div style={{ padding: '0' }}>
                        <div style={{ marginBottom: '16px' }}>
                          <Radio.Group 
                            defaultValue="none"
                            onChange={(e) => setMountType(e.target.value)}
                          >
                            <Space direction="vertical">
                              <Radio value="none">不挂载商品或POI</Radio>
                              <Radio value="product">挂载商品</Radio>
                              <Radio value="poi">挂载POI</Radio>
                            </Space>
                          </Radio.Group>
                        </div>

                        {mountType === 'product' && (
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
                        )}
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
                  </div>
                )}
                {currentSkill.id === 'hotTopic' && (
                  <div style={{ marginBottom: '24px', width: '100%' }}>
                    <Card title="发布策略">
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>当出现匹配度高的热点内容时：</div>
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
                {/* 商品上新技能配置抽屉内容 */}
                {currentSkill.id === 'newProduct' && (
                  <div style={{ marginBottom: '24px', width: '100%' }}>
                    <p>当您在后台添加新商品时，AI会自动识别并创作推广这些新品的内容。</p>
                    <br/>
                    <Card title="触发条件与规则">
                       <Form layout="vertical">
                          <Form.Item label="触发创作的商品分类">
                            <Select mode="multiple" placeholder="选择需要自动创作的商品分类" defaultValue={['服装', '美妆']}>
                              <Select.Option value="服装">服装</Select.Option>
                              <Select.Option value="美妆">美妆</Select.Option>
                              <Select.Option value="家居">家居</Select.Option>
                              <Select.Option value="配饰">配饰</Select.Option>
                              <Select.Option value="食品">食品</Select.Option>
                            </Select>
                          </Form.Item>
                          <Form.Item label="创作频率限制">
                             <Select defaultValue="dailyMax1" style={{ width: '100%' }}>
                                <Select.Option value="dailyMax1">每天最多为1个新品创作</Select.Option>
                                <Select.Option value="dailyMax3">每天最多为3个新品创作</Select.Option>
                                <Select.Option value="noLimit">不限制</Select.Option>
                              </Select>
                          </Form.Item>
                       </Form>
                    </Card>
                    <br/>
                    <Card title="内容生成配置">
                       <Form layout="vertical">
                         <Form.Item label="内容生成风格">
                            <Radio.Group defaultValue="auto">
                                <Radio value="auto">根据商品自动判断</Radio>
                                <Radio value="style1">风格1 (活泼有趣)</Radio>
                                <Radio value="style2">风格2 (专业评测)</Radio>
                              </Radio.Group>
                          </Form.Item>
                          <Form.Item label="默认挂载商品">
                             <Checkbox defaultChecked>自动挂载对应的新商品链接</Checkbox>
                          </Form.Item>
                       </Form>
                    </Card>
                    <br/>
                    <Card title="内容审批">
                      <Form layout="vertical">
                        <Form.Item label="是否需要人工审批">
                          <Radio.Group defaultValue="no">
                            <Radio value="yes">需要审批</Radio>
                            <Radio value="no">无需审批，自动发布</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Form>
                    </Card>
                  </div>
                )}
              </Drawer>
              
              {/* 笔记列表 */}
              {currentSkill.id === 'daily' ? (
                        <>
                          {/* 图片素材预览模块 - 移动到已创作内容tab下 */}
                          <div style={{ 
                            marginTop: '8px',
                            marginBottom: '16px',
                            padding: '8px 12px',
                            backgroundColor: '#f7f7f7',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px',
                              fontWeight: 'bold',
                              fontSize: '14px',
                              color: '#333',
                              flexShrink: 0
                            }}>
                              <PictureOutlined />
                              即将为你创作的内容素材
                            </div>
                            <div style={{ 
                              display: 'flex', 
                              gap: '8px',
                              overflowX: 'auto',
                              flex: 1
                            }}>
                              {imageMaterials.map(image => (
                                <div
                                  key={image.id}
                                  style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    flexShrink: 0,
                                    border: image.usagePlan ? '2px solid #1890ff' : 'none'
                                  }}
                                  onClick={() => {
                                    setSelectedImage(image);
                                    setShowImagePreview(true);
                                  }}
                                >
                                  <img
                                    src={image.url}
                                    alt=""
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover'
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                            <Button 
                              type="link" 
                              size="small" 
                              onClick={() => {
                                if (imageMaterials.length > 0) {
                                  setSelectedImage(imageMaterials[0]);
                                  setShowImagePreview(true);
                                }
                              }}
                            >
                              查看创作计划
                            </Button>
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
                                {/* 添加热门笔记改写标签和来源信息，随机为部分笔记添加此信息 */}
                                {note.id.includes('daily') && Math.random() > 0.5 && (
                                  <div style={{ 
                                    marginTop: '8px', 
                                    fontSize: '11px', 
                                    backgroundColor: '#FFF7E6', 
                                    padding: '4px 6px',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                  }}>
                                    <Tag color="orange" style={{ margin: 0, fontSize: '10px', padding: '0 4px', lineHeight: '16px' }}>
                                      热门笔记改写
                                    </Tag>
                                    <span style={{ color: '#666', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      来源: {['「夏日穿搭分享」', '「生活好物推荐」', '「宝藏美食探店」'][Math.floor(Math.random() * 3)]}
                                    </span>
                                  </div>
                                )}
                                <div style={{ marginTop: '8px', fontSize: '11px', color: '#999' }}>
                                  计划发布时间: {dayjs(note.scheduledTime).format('YYYY-MM-DD HH:mm')}
                                </div>
                              </Card>
                            ))}
                          </div>
                        </>
              ) : (
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
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    );
  };


  return (
    <div className="publish-plan-container">
      <div style={{ marginBottom: '24px', marginTop: '24px' }}>
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
              <OverviewTab 
                setCalendarVisible={setCalendarVisible}
              />
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
              <PersonalizationTab />
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
            <Button type="primary" onClick={onClose}>取消</Button>
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
                <Radio value="custom">自定义</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          
          {/* 添加自定义风格输入框 */}
          <Form.Item
            name="customStyleText"
            noStyle
            shouldUpdate={(prevValues: Record<string, any>, currentValues: Record<string, any>) => {
              return prevValues.contentStyle !== currentValues.contentStyle;
            }}
          >
            {({ getFieldValue }) =>
              getFieldValue('contentStyle') === 'custom' ? (
                <Form.Item
                  name="customStyleDescription"
                  label="自定义风格描述"
                >
                  <Input placeholder="请描述您想要的内容风格" />
                </Form.Item>
              ) : null
            }
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

          {/* 将快速开始按钮和内容诉求输入框合并到一个模块 */}
          <Form.Item
            name="contentType"
            label="内容诉求"
            rules={[{ required: true, message: '请描述您的内容诉求' }]}
          >
            {/* 使用相对定位容器包裹输入框和按钮栏 */}
            <div style={{ position: 'relative' }}>
              {/* 内容诉求输入框，设置为受控组件 */}
              <Input.TextArea 
                rows={6} 
                placeholder="请详细描述您想创作的内容，AI将根据您的诉求生成笔记。"
                style={{ paddingBottom: '38px' }} 
                ref={contentTypeInputRef}
                id="content-type-textarea" 
                value={contentTypeValue} // 绑定 state 值
                onChange={(e) => {
                  const newValue = e.target.value;
                  setContentTypeValue(newValue); // 更新 state
                  singleNoteForm.setFieldsValue({ contentType: newValue }); // 同步更新 antd form
                }}
              />
              {/* 快速开始按钮栏，绝对定位到底部 */}
              <div style={{
                position: 'absolute',
                bottom: '1px', // 贴近边框
                left: '1px',
                right: '1px',
                padding: '8px 11px', // 调整内边距
                backgroundColor: '#f5f5f5', // 添加背景色
                borderTop: '1px solid #d9d9d9', // 添加上边框
                borderBottomLeftRadius: '6px', // 匹配输入框圆角
                borderBottomRightRadius: '6px',
                boxSizing: 'border-box',
                display: 'flex',
                flexWrap: 'nowrap',
                overflowX: 'auto',
                whiteSpace: 'nowrap'
              }}>
                <div style={{ 
                  display: 'flex', 
                  gap: '4px',
                  fontSize: '12px',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#999', marginRight: '4px' }}>模板:</span>
                  <Tag 
                    style={{ cursor: 'pointer', margin: '0 4px 0 0' }}
                    onClick={() => {
                      const newValue = '我想发起一个抽奖活动，奖品是[填写奖品]，时间是[填写时间]，参与方式是[填写方式，如点赞+评论]...';
                      setContentTypeValue(newValue); // 更新 state
                      singleNoteForm.setFieldsValue({ contentType: newValue }); // 更新 antd form
                      // 延迟设置焦点
                      setTimeout(() => {
                        if (contentTypeInputRef.current?.focus) {
                          contentTypeInputRef.current.focus();
                        } else if (contentTypeInputRef.current?.resizableTextArea?.textArea?.focus) {
                          contentTypeInputRef.current.resizableTextArea.textArea.focus();
                        }
                      }, 0);
                    }}
                    color="blue"
                  >
                    <HeartOutlined /> 抽奖
                  </Tag>
                  <Tag 
                    style={{ cursor: 'pointer', margin: '0 4px 0 0' }}
                    onClick={() => {
                      const newValue = '招募[数量]名新品体验官，体验[填写产品名称]，要求[填写要求，如撰写评测笔记]...';
                      setContentTypeValue(newValue); // 更新 state
                      singleNoteForm.setFieldsValue({ contentType: newValue }); // 更新 antd form
                      setTimeout(() => {
                        if (contentTypeInputRef.current?.focus) {
                          contentTypeInputRef.current.focus();
                        } else if (contentTypeInputRef.current?.resizableTextArea?.textArea?.focus) {
                          contentTypeInputRef.current.resizableTextArea.textArea.focus();
                        }
                      }, 0);
                    }}
                    color="purple"
                  >
                    <GiftOutlined /> 体验官
                  </Tag>
                  <Tag 
                    style={{ cursor: 'pointer', margin: '0 4px 0 0' }}
                    onClick={() => {
                      const newValue = '征集关于[填写主题]的用户故事/使用心得，优秀的分享将获得[填写奖励]...';
                      setContentTypeValue(newValue); // 更新 state
                      singleNoteForm.setFieldsValue({ contentType: newValue }); // 更新 antd form
                      setTimeout(() => {
                        if (contentTypeInputRef.current?.focus) {
                          contentTypeInputRef.current.focus();
                        } else if (contentTypeInputRef.current?.resizableTextArea?.textArea?.focus) {
                          contentTypeInputRef.current.resizableTextArea.textArea.focus();
                        }
                      }, 0);
                    }}
                    color="green"
                  >
                    <MessageOutlined /> 故事征集
                  </Tag>
                  <Tag 
                    style={{ cursor: 'pointer', margin: '0 4px 0 0' }}
                    onClick={() => {
                      const newValue = '分享我最近发现的好物：[填写产品名称]，推荐理由是...';
                      setContentTypeValue(newValue); // 更新 state
                      singleNoteForm.setFieldsValue({ contentType: newValue }); // 更新 antd form
                      setTimeout(() => {
                        if (contentTypeInputRef.current?.focus) {
                          contentTypeInputRef.current.focus();
                        } else if (contentTypeInputRef.current?.resizableTextArea?.textArea?.focus) {
                          contentTypeInputRef.current.resizableTextArea.textArea.focus();
                        }
                      }, 0);
                    }}
                    color="gold"
                  >
                    <ShoppingOutlined /> 好物分享
                  </Tag>
                  <Tag 
                    style={{ cursor: 'pointer', margin: '0 4px 0 0' }}
                    onClick={() => {
                      const newValue = '科普一下关于[填写领域]的小知识：[填写知识点]...';
                      setContentTypeValue(newValue); // 更新 state
                      singleNoteForm.setFieldsValue({ contentType: newValue }); // 更新 antd form
                      setTimeout(() => {
                        if (contentTypeInputRef.current?.focus) {
                          contentTypeInputRef.current.focus();
                        } else if (contentTypeInputRef.current?.resizableTextArea?.textArea?.focus) {
                          contentTypeInputRef.current.resizableTextArea.textArea.focus();
                        }
                      }, 0);
                    }}
                    color="orange"
                  >
                    <BulbOutlined /> 科普
                  </Tag>
                </div>
              </div>
            </div>
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
              <Radio.Button value="自定义">自定义</Radio.Button>
            </Radio.Group>
          </Form.Item>
          
          {/* 添加自定义语气输入框 */}
          <Form.Item
            name="customTone"
            noStyle
            shouldUpdate={(prevValues: Record<string, any>, currentValues: Record<string, any>) => {
              return prevValues.tone !== currentValues.tone;
            }}
          >
            {({ getFieldValue }) =>
              getFieldValue('tone') === '自定义' ? (
                <Form.Item
                  name="customToneText"
                  label="自定义语气描述"
                >
                  <Input placeholder="请描述您想要的语气风格" />
                </Form.Item>
              ) : null
            }
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
      <ImagePreviewModal
        open={showImagePreview}
        onClose={() => {
          setShowImagePreview(false);
          setSelectedImage(null);
        }}
        image={selectedImage}
      />
    </div>
  );
};

export default PublishPlan;