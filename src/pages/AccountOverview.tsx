import React, { useState } from 'react';
import { Card, Row, Col, Button, Modal, Form, Input, Select, Avatar, Statistic, Tooltip, Timeline, Tag, Calendar, Space } from 'antd';
import { PlusOutlined, UserOutlined, RiseOutlined, QuestionCircleOutlined, SearchOutlined, EditOutlined, SendOutlined, BarChartOutlined, CalendarOutlined, RocketOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import InitializationGuide from '../components/InitializationGuide';

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
    saves: number;
    comments: number;
  };
}

interface WorkLog {
  id: string;
  type: '选题' | '创作' | '发布' | '互动分析';
  content: string;
  detail: string;
  timestamp: string;
  accountId: string;
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
      saves: 3400,
      comments: 0
    }
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
      saves: 5600,
      comments: 0
    }
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
      saves: 0,
      comments: 0
    }
  }
];

const mockWorkLogs: WorkLog[] = [
  {
    id: '1',
    type: '选题',
    content: '基于#春季穿搭#热度上升，规划3篇春季穿搭内容',
    detail: '检测到春季穿搭话题24小时内热度上升32%，计划创建3篇春季出游穿搭内容，预计带货连衣裙和外套品类',
    timestamp: '2024-03-20 09:30',
    accountId: '1'
  },
  {
    id: '2',
    type: '创作',
    content: '完成"春日必备：5款适合约会的连衣裙"内容创作',
    detail: '结合店铺新品连衣裙和当前流行元素，完成5款连衣裙推荐内容创作，共植入3款自营商品，预计发布转化率5.2%',
    timestamp: '2024-03-20 10:15',
    accountId: '1'
  },
  {
    id: '3',
    type: '发布',
    content: '已将"春日必备：5款适合约会的连衣裙"定时发布',
    detail: '根据历史数据分析，选择在3月21日10:30（周四）发布，预计可获得最佳曝光效果',
    timestamp: '2024-03-20 14:20',
    accountId: '1'
  },
  {
    id: '4',
    type: '选题',
    content: '检测到用户对探店内容互动率高，规划美食探店系列',
    detail: '分析账号近30天数据，发现探店类内容互动率高出平均值38%，计划开展5篇城市网红店打卡系列',
    timestamp: '2024-03-19 16:45',
    accountId: '2'
  },
  {
    id: '5',
    type: '互动分析',
    content: '"春季穿搭"系列表现优异，推荐持续生产',
    detail: '3篇春季穿搭内容平均获赞同比上升28%，其中连衣裙款式引导入店率达6.8%，建议持续生产类似内容',
    timestamp: '2024-03-21 11:30',
    accountId: '1'
  },
  {
    id: '6',
    type: '创作',
    content: '完成"探店|这家小众咖啡店藏着全城最佳松饼"内容创作',
    detail: '基于网络热门咖啡店数据，创作沉浸式探店体验内容，突出特色松饼和环境，预计能吸引年轻女性用户关注',
    timestamp: '2024-03-19 18:20',
    accountId: '2'
  }
];

const AccountOverview: React.FC = () => {
  const navigate = useNavigate();
  const [addAccountVisible, setAddAccountVisible] = useState(false);
  const [initGuideVisible, setInitGuideVisible] = useState(false);
  const [form] = Form.useForm();
  const [visibleWorkLog, setVisibleWorkLog] = useState<WorkLog | null>(null);
  const [activeAccountFilter] = useState<string | null>(null);
  const [calendarVisible, setCalendarVisible] = useState(false);

  const filteredWorkLogs = activeAccountFilter 
    ? mockWorkLogs.filter(log => log.accountId === activeAccountFilter) 
    : mockWorkLogs;

  const handleCancel = () => {
    setAddAccountVisible(false);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
      setAddAccountVisible(false);
      form.resetFields();
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  // 日历单元格渲染函数
  const dateCellRender = (date: Dayjs) => {
    // 简单日历渲染逻辑，可以根据需要扩展
    const dayStr = date.format('YYYY-MM-DD');
    
    // 模拟一些日期有内容
    const hasContent = dayStr === '2024-03-22' || dayStr === '2024-03-25' || dayStr === '2024-03-28';
    
    return hasContent ? (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li
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
          {dayStr === '2024-03-22' ? '春季新品分享' : dayStr === '2024-03-25' ? '护肤品测评' : '探店日记'}
        </li>
      </ul>
    ) : null;
  };

  return (
    <div className="account-overview">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <img src="/Frame 427320693.png" alt="内容托管" height="30" style={{ marginRight: '12px' }} />
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>小红书内容托管</h1>
        <Button 
          type="primary"
          icon={<RocketOutlined />}
          style={{ marginLeft: 'auto' }}
          onClick={() => setInitGuideVisible(true)}
        >
          系统初始化
        </Button>
      </div>
      
      <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', marginBottom: '20px' }}>
        我可以帮你一站式小红书账号托管，从选题规划、内容创作，到商品挂载、数据分析全流程。AI实时嗅探热点，创作原创内容，定时发布，实现账号轻松增长。
      </div>

      <div style={{ marginBottom: '20px', backgroundColor: '#f7f7f7', padding: '16px', borderRadius: '8px' }}>
        <Row gutter={[24, 16]}>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="已托管账号"
                value={mockAccounts.length}
                valueStyle={{ color: '#000000' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="总粉丝增长"
                value={mockAccounts.reduce((sum, account) => sum + account.growth.followers, 0)}
                valueStyle={{ color: '#000000' }}
                prefix={<RiseOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="总阅读量"
                value={mockAccounts.reduce((sum, account) => sum + account.growth.views, 0)}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="总互动量"
                value={mockAccounts.reduce((sum, account) => sum + account.growth.likes + account.growth.comments, 0)}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '18px' }}>已托管账号</h2>
        <Space>
          <Button icon={<CalendarOutlined />} onClick={() => setCalendarVisible(true)}>
            查看日历
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddAccountVisible(true)}>
            添加账号
          </Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {mockAccounts.map(account => (
          <Col span={8} key={account.id}>
            <Card
              hoverable
              style={{ height: '100%' }}
              onClick={() => navigate(`/account/${account.id}`)}
            >
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <Avatar size={64} src={account.avatar} />
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                    {account.nickname}
                  </div>
                  <div style={{ color: '#666' }}>
                    {account.followers.toLocaleString()} 粉丝 · {account.posts} 笔记
                  </div>
                </div>
              </div>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="本周涨粉"
                    value={account.growth?.followers || 0}
                    valueStyle={{ color: '#3f8600', fontSize: '16px' }}
                    prefix={<RiseOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="本周阅读"
                    value={account.growth?.views || 0}
                    valueStyle={{ fontSize: '16px' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="本周互动"
                    value={(account.growth?.likes || 0) + (account.growth?.comments || 0)}
                    valueStyle={{ fontSize: '16px' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title={
                      <span>
                        本周GMV 
                        <Tooltip title="通过小红书笔记进入到小程序店铺并成交的金额">
                          <QuestionCircleOutlined style={{ marginLeft: '4px' }} />
                        </Tooltip>
                      </span>
                    }
                    value={Math.floor(Math.random() * 100000)}
                    prefix="¥"
                    valueStyle={{ fontSize: '16px' }}
                  />
                </Col>
              </Row>
              <div style={{ marginTop: '16px', textAlign: 'right' }}>
                <Button 
                  type="link" 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/account/${account.id}`);
                  }}
                  style={{ padding: 0 }}
                >
                  查看详情 →
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: '40px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>智能体工作记录</h2>
        </div>

        <div style={{ backgroundColor: '#f7f7f7', padding: '16px', borderRadius: '8px' }}>
          <Timeline>
            {filteredWorkLogs.map(log => (
              <Timeline.Item 
                key={log.id} 
                color={
                  log.type === '选题' ? 'blue' : 
                  log.type === '创作' ? 'green' : 
                  log.type === '发布' ? 'orange' : 
                  'purple'
                }
                dot={
                  log.type === '选题' ? <SearchOutlined /> : 
                  log.type === '创作' ? <EditOutlined /> : 
                  log.type === '发布' ? <SendOutlined /> : 
                  <BarChartOutlined />
                }
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 'bold' }}>
                    [{log.type}] {log.content}
                  </span>
                  <span style={{ color: '#999', fontSize: '13px' }}>{log.timestamp}</span>
                </div>
                <div style={{ color: '#666', fontSize: '13px' }}>
                  {log.detail.length > 80 ? log.detail.substring(0, 80) + '...' : log.detail}
                  {log.detail.length > 80 && (
                    <Button 
                      type="link" 
                      size="small" 
                      style={{ padding: '0 4px' }}
                      onClick={() => setVisibleWorkLog(log)}
                    >
                      查看详情
                    </Button>
                  )}
                </div>
                <div style={{ marginTop: '4px' }}>
                  <Tag color="cyan">
                    {mockAccounts.find(acc => acc.id === log.accountId)?.nickname || '未知账号'}
                  </Tag>
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      </div>

      <Modal
        title={visibleWorkLog ? `[${visibleWorkLog.type}] ${visibleWorkLog.content}` : ''}
        open={!!visibleWorkLog}
        footer={null}
        onCancel={() => setVisibleWorkLog(null)}
      >
        {visibleWorkLog && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px', color: '#999' }}>时间</div>
              <div>{visibleWorkLog.timestamp}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px', color: '#999' }}>账号</div>
              <div>{mockAccounts.find(acc => acc.id === visibleWorkLog.accountId)?.nickname || '未知账号'}</div>
            </div>
            <div>
              <div style={{ marginBottom: '8px', color: '#999' }}>详细内容</div>
              <div style={{ lineHeight: '1.8' }}>{visibleWorkLog.detail}</div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="添加托管账号"
        open={addAccountVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ platform: 'xiaohongshu' }}
        >
          <Form.Item
            name="platform"
            label="平台"
            rules={[{ required: true, message: '请选择平台' }]}
          >
            <Select>
              <Select.Option value="xiaohongshu">小红书</Select.Option>
              <Select.Option value="douyin" disabled>抖音（即将上线）</Select.Option>
              <Select.Option value="bilibili" disabled>B站（即将上线）</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="nickname"
            label="账号昵称"
            rules={[{ required: true, message: '请输入账号昵称' }]}
          >
            <Input placeholder="请输入账号昵称" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="avatar"
            label="头像链接"
            rules={[{ required: true, message: '请输入头像链接' }]}
          >
            <Input placeholder="请输入头像图片链接" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加日历弹窗 */}
      <Modal
        title="内容发布日历"
        open={calendarVisible}
        onCancel={() => setCalendarVisible(false)}
        width={800}
        footer={null}
      >
        <Calendar
          mode="month"
          defaultValue={dayjs()}
          dateCellRender={dateCellRender}
        />
      </Modal>

      <InitializationGuide 
        visible={initGuideVisible}
        onClose={() => setInitGuideVisible(false)}
      />
    </div>
  );
};

export default AccountOverview; 