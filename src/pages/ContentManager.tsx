import React, { useState } from 'react';
import { Card, List, Space, Tag, Statistic, Row, Col, Button, Drawer, Form, Input, Select, InputNumber, Progress, message, DatePicker, Tabs, Calendar, Badge } from 'antd';
import { PlusOutlined, CalendarOutlined, AppstoreOutlined, RobotOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

interface ContentItem {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  status: 'published' | 'pending' | 'draft';
  publishTime?: string;
  tags?: string[];
  views?: number;
  likes?: number;
  favorites?: number;
  comments?: number;
  contentType?: string;
  tone?: string;
}

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const ContentManager: React.FC = () => {
  const [contents, setContents] = useState<ContentItem[]>([
    {
      id: '1',
      title: '春日穿搭分享',
      content: '分享一套春季日常穿搭，舒适又时尚...',
      imageUrl: 'https://picsum.photos/400/400?random=1',
      status: 'published',
      publishTime: '2024-03-15 10:00:00',
      tags: ['穿搭', '春季', '日常'],
      views: 2451,
      likes: 167,
      favorites: 89,
      comments: 32
    },
    {
      id: '2',
      title: '美食探店推荐',
      content: '发现了一家超级好吃的餐厅，必须安利给大家...',
      imageUrl: 'https://picsum.photos/400/400?random=2',
      status: 'pending',
      publishTime: '2024-03-20 15:00:00',
      tags: ['美食', '探店', '推荐']
    },
    {
      id: '3',
      title: '护肤品使用心得',
      content: '最近使用的一款精华液体验分享...',
      imageUrl: 'https://picsum.photos/400/400?random=3',
      status: 'pending',
      publishTime: '2024-03-25 20:00:00',
      tags: ['护肤', '美妆', '测评']
    },
    {
      id: '4',
      title: '旅行日记',
      content: '周末来一场说走就走的旅行，探索城市新风景...',
      imageUrl: 'https://picsum.photos/400/400?random=4',
      status: 'published',
      publishTime: '2024-03-16 09:30:00',
      tags: ['旅行', '周末', '城市探索'],
      views: 1892,
      likes: 145,
      favorites: 76,
      comments: 28
    },
    {
      id: '5',
      title: '居家布置灵感',
      content: '分享我的房间改造计划，打造温馨舒适的生活空间...',
      imageUrl: 'https://picsum.photos/400/400?random=5',
      status: 'pending',
      publishTime: '2024-03-22 14:00:00',
      tags: ['家居', '生活', 'DIY']
    },
    {
      id: '6',
      title: '健身打卡记录',
      content: '记录我的健身历程，一起保持运动的好习惯...',
      imageUrl: 'https://picsum.photos/400/400?random=6',
      status: 'published',
      publishTime: '2024-03-17 18:00:00',
      tags: ['运动', '健身', '生活方式'],
      views: 2156,
      likes: 198,
      favorites: 94,
      comments: 45
    }
  ]);

  // 批量创建相关状态
  const [batchDrawerVisible, setBatchDrawerVisible] = useState(false);
  const [batchForm] = Form.useForm();
  const [generating, setGenerating] = useState(false);
  const [generatingProgress, setGeneratingProgress] = useState(0);
  const [generatingStatus, setGeneratingStatus] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [calendarMode, setCalendarMode] = useState(false);
  const [dateFilter, setDateFilter] = useState<[Dayjs | null, Dayjs | null]>([null, null]);

  // 打开批量创建抽屉
  const showBatchDrawer = () => {
    setBatchDrawerVisible(true);
  };

  // 关闭批量创建抽屉
  const onBatchDrawerClose = () => {
    setBatchDrawerVisible(false);
    batchForm.resetFields();
  };

  // 提交批量创建表单
  const handleBatchSubmit = async () => {
    try {
      const values = await batchForm.validateFields();
      setGenerating(true);
      setGeneratingProgress(0);
      setGeneratingStatus('正在准备生成笔记...');
      
      // 模拟异步生成过程
      const totalNotes = values.count;
      const contentTypes = ['产品介绍', '使用体验', '生活记录', '探店安利', '干货分享'];
      const tones = ['轻松随意', '专业正式', '感性文艺', '幽默诙谐'];
      
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        if (currentProgress < 95) {
          currentProgress += Math.floor(Math.random() * 10) + 1;
          setGeneratingProgress(Math.min(currentProgress, 95));
          
          // 更新状态消息
          if (currentProgress < 30) {
            setGeneratingStatus('正在分析主题和关键词...');
          } else if (currentProgress < 60) {
            setGeneratingStatus('正在生成笔记内容...');
          } else if (currentProgress < 90) {
            setGeneratingStatus('正在优化内容并配图...');
          }
        }
      }, 800);
      
      // 模拟生成完成
      setTimeout(() => {
        clearInterval(progressInterval);
        setGeneratingProgress(100);
        setGeneratingStatus('笔记生成完成！');
        
        // 创建新笔记
        const newNotes: ContentItem[] = Array(totalNotes).fill(null).map((_, index) => ({
          id: `note-${Date.now()}-${index}`,
          title: `${values.theme || '主题'} ${index + 1}`,
          content: `这是一篇关于${values.theme || '主题'}的笔记，风格${values.tone || '轻松随意'}...`,
          imageUrl: `https://picsum.photos/400/400?random=${Date.now() + index}`,
          status: 'draft',
          tags: values.theme ? [values.theme] : [],
          contentType: values.contentType || contentTypes[Math.floor(Math.random() * contentTypes.length)],
          tone: values.tone || tones[Math.floor(Math.random() * tones.length)]
        }));
        
        setContents([...contents, ...newNotes]);
        
        // 完成后重置状态
        setTimeout(() => {
          setGenerating(false);
          onBatchDrawerClose();
          message.success(`成功创建 ${totalNotes} 篇笔记！`);
        }, 1000);
      }, totalNotes * 800); // 笔记数量越多，生成时间越长
      
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 根据状态筛选内容
  const filteredContents = contents.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'published') return item.status === 'published';
    if (activeTab === 'pending') return item.status === 'pending';
    if (activeTab === 'draft') return item.status === 'draft';
    return true;
  }).filter(item => {
    // 日期筛选
    if (!dateFilter[0] || !dateFilter[1] || !item.publishTime) return true;
    const publishDate = dayjs(item.publishTime);
    return publishDate.isAfter(dateFilter[0]) && publishDate.isBefore(dateFilter[1]);
  });

  // 日历数据处理
  const getCalendarData = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    const listData = contents.filter(item => {
      if (!item.publishTime) return false;
      return item.publishTime.startsWith(dateStr);
    });
    return listData;
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getCalendarData(value);
    return (
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {listData.map(item => (
          <li key={item.id}>
            <Badge 
              color={item.status === 'published' ? 'green' : item.status === 'pending' ? 'blue' : 'gray'} 
              text={<span style={{ fontSize: '10px' }}>{item.title.length > 6 ? `${item.title.substring(0, 6)}...` : item.title}</span>} 
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ marginBottom: 16 }}>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          style={{ marginBottom: 16 }}
        >
          <TabPane tab="全部" key="all" />
          <TabPane tab="已发布" key="published" />
          <TabPane tab="待发布" key="pending" />
          <TabPane tab="草稿" key="draft" />
        </Tabs>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <RangePicker 
            onChange={(dates) => setDateFilter(dates as [Dayjs | null, Dayjs | null])} 
            placeholder={['开始日期', '结束日期']}
            style={{ width: 280 }}
          />
          <Select
            placeholder="选择账号"
            style={{ width: 200 }}
            options={[
              { value: 'account1', label: '时尚生活家 (@fashion_life)' },
              { value: 'account2', label: '美食探店达人 (@food_explorer)' },
              { value: 'account3', label: '旅行摄影师 (@travel_photo)' }
            ]}
          />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showBatchDrawer}
          >
            批量创建笔记
          </Button>
          <Button 
            icon={calendarMode ? <AppstoreOutlined /> : <CalendarOutlined />} 
            onClick={() => setCalendarMode(!calendarMode)}
          >
            {calendarMode ? '切换到列表视图' : '切换到日历视图'}
          </Button>
        </Space>
      </div>

      {calendarMode ? (
        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px' }}>
          <Calendar dateCellRender={dateCellRender} />
        </div>
      ) : (
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={filteredContents}
          renderItem={item => (
          <List.Item>
            <Card
              cover={
                <img
                  alt={item.title}
                  src={item.imageUrl}
                  style={{ height: 200, objectFit: 'cover' }}
                />
              }
              actions={item.status === 'draft' ? [
                <Button 
                  key="submit"
                  type="primary" 
                  onClick={() => {
                    const updatedContents = contents.map(content => 
                      content.id === item.id 
                        ? { ...content, status: 'pending' as const } 
                        : content
                    );
                    setContents(updatedContents);
                    message.success('已添加到待发布列表');
                  }}
                >
                  提交审核
                </Button>
              ] : undefined}
            >
              <Card.Meta
                title={
                  <Space direction="vertical" size={4} style={{ width: '100%' }}>
                    <div>{item.title}</div>
                    <Space>
                      <Tag color={item.status === 'published' ? '#52c41a' : item.status === 'pending' ? '#1890ff' : '#8c8c8c'}>
                        {item.status === 'published' ? '已发布' : item.status === 'pending' ? '待发布' : '草稿'}
                      </Tag>
                      {item.publishTime && (
                        <span style={{ fontSize: '12px', color: '#888' }}>
                          {item.status === 'published' ? '发布时间' : '预计发布时间'}：{item.publishTime}
                        </span>
                      )}
                    </Space>
                  </Space>
                }
                description={
                  <div>
                    <p style={{ marginBottom: 8 }}>{item.content}</p>
                    <Space size={[0, 8]} wrap>
                      {item.tags?.map(tag => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </Space>
                    {item.status === 'published' && (
                      <Row gutter={16} style={{ marginTop: 16 }}>
                        <Col span={6}>
                          <Statistic title="浏览" value={item.views} />
                        </Col>
                        <Col span={6}>
                          <Statistic title="点赞" value={item.likes} />
                        </Col>
                        <Col span={6}>
                          <Statistic title="收藏" value={item.favorites} />
                        </Col>
                        <Col span={6}>
                          <Statistic title="评论" value={item.comments} />
                        </Col>
                      </Row>
                    )}
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />
      )}

      {/* 批量创建抽屉 */}
      <Drawer
        title="批量创建笔记"
        placement="right"
        onClose={onBatchDrawerClose}
        open={batchDrawerVisible}
        width={400}
        extra={
          <Space>
            <Button onClick={onBatchDrawerClose}>取消</Button>
            <Button type="primary" onClick={handleBatchSubmit} disabled={generating}>
              开始生成
            </Button>
          </Space>
        }
      >
        {generating ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Progress percent={generatingProgress} status="active" />
            <p style={{ marginTop: 16 }}>{generatingStatus}</p>
            <p style={{ color: '#888', fontSize: '12px', marginTop: 8 }}>
              笔记生成中，您可以先进行其他操作，生成完成后会通知您
            </p>
          </div>
        ) : (
          <Form form={batchForm} layout="vertical">
            <Form.Item
              name="count"
              label="笔记数量"
              rules={[{ required: true, message: '请输入笔记数量' }]}
              initialValue={5}
            >
              <InputNumber min={1} max={20} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="theme"
              label="笔记主题"
            >
              <Input placeholder="例如：春季穿搭、美食探店" />
            </Form.Item>

            <Form.Item
              name="contentType"
              label="内容类型"
            >
              <Select placeholder="选择内容类型">
                <Select.Option value="产品介绍">产品介绍</Select.Option>
                <Select.Option value="使用体验">使用体验</Select.Option>
                <Select.Option value="生活记录">生活记录</Select.Option>
                <Select.Option value="探店安利">探店安利</Select.Option>
                <Select.Option value="干货分享">干货分享</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="tone"
              label="语气风格"
            >
              <Select placeholder="选择语气风格">
                <Select.Option value="轻松随意">轻松随意</Select.Option>
                <Select.Option value="专业正式">专业正式</Select.Option>
                <Select.Option value="感性文艺">感性文艺</Select.Option>
                <Select.Option value="幽默诙谐">幽默诙谐</Select.Option>
              </Select>
            </Form.Item>

            <div style={{ marginTop: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
              <h4 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center' }}>
                <RobotOutlined style={{ marginRight: 8 }} />
                AI 助手提示
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                批量创建的笔记将保存在草稿池中，您可以随时编辑并安排发布时间。
                <br />
                使用日历视图可以方便地查看和规划笔记发布时间。
              </p>
            </div>
          </Form>
        )}
      </Drawer>
    </div>
  );
};

export default ContentManager;