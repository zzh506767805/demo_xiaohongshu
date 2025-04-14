import React, { useState } from 'react';
import { Card, Row, Col, Button, Modal, Form, Input, Select, Avatar, Tooltip, Timeline, Tag, Calendar, Space } from 'antd';
import { PlusOutlined, UserOutlined, QuestionCircleOutlined, SearchOutlined, EditOutlined, SendOutlined, BarChartOutlined, CalendarOutlined, RocketOutlined } from '@ant-design/icons';
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
    nickname: '小苍兰和它的朋友们📍成都店',
    followers: 8307,
    posts: 300,
    status: 'active',
    growth: {
      followers: 590,
      views: 80000,
      likes: 5900,
      saves: 0,
      comments: 0
    }
  },
  {
    id: '2',
    avatar: 'https://picsum.photos/100/100?random=2',
    nickname: '小苍兰的员工',
    followers: 837,
    posts: 30,
    status: 'active',
    growth: {
      followers: 5,
      views: 800,
      likes: 59,
      saves: 0,
      comments: 0
    }
  },
  
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
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '16px', 
        marginTop: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/Frame 427320693.png" alt="内容托管" height="40" style={{ marginRight: '12px' }} />
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '500', 
            margin: 0, 
            color: '#333333',
            fontFamily: 'PingFang SC'
          }}>小红书内容托管</h1>
        </div>
        <Button 
          type="primary"
          icon={<RocketOutlined />}
          style={{ 
            marginLeft: 'auto',
             color: '#155BD4',
              background: 'rgba(21, 91, 212, 0.03)',
              fontFamily: 'PingFang SC',
              fontSize: '12px',
              fontWeight: '400',
              lineHeight: '1.5'
            
          }}
          onClick={() => setInitGuideVisible(true)}
        >
          初始化演示
        </Button>
      </div>
      
      <div style={{ 
        display: 'flex',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {/* 描述部分 */}
        <div style={{ 
          fontSize: '14px', 
          lineHeight: '1.6', 
          color: '#666', 
          padding: '16px',
          background: '#FFFFFF',
          borderRadius: '8px',
          width: '436px',
          height: '116px'
        }}>
          <div style={{ 
            fontSize: '14px', 
            color: '#333333', 
            marginBottom: '8px',
            fontFamily: 'PingFang SC',
            fontWeight: '500'
          }}>描述</div>
          一站式小红书账号托管，从选题规划、内容创作，到商品挂载、数据分析全流程。AI实时嗅探热点，创作原创内容，定时发...
        </div>

        {/* 数据统计部分 */}
        <div style={{ 
          padding: '30px 40px', 
          background: '#FFFFFF', 
          borderRadius: '8px',
          width: '840px',
          height: '116px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Row gutter={[56, 16]} style={{ width: '100%' }}>
            <Col span={6}>
              <div>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#999999', 
                  marginBottom: '8px',
                  fontFamily: 'PingFang SC',
                  lineHeight: '1.7',
                  fontWeight: '400'
                }}>已托管账号</div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <span style={{ 
                    fontSize: '24px', 
                    fontWeight: '500', 
                    color: '#333333',
                    fontFamily: 'Avenir',
                    lineHeight: '1'
                  }}>3</span>
                  <span style={{ 
                    marginLeft: '4px', 
                    color: '#999999',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'PingFang SC',
                    lineHeight: '1.43'
                  }}>个</span>
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#999999', 
                  marginBottom: '8px',
                  fontFamily: 'PingFang SC',
                  lineHeight: '1.7',
                  fontWeight: '400'
                }}>总粉丝增长</div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <span style={{ 
                    fontSize: '24px', 
                    fontWeight: '500', 
                    color: '#333333',
                    fontFamily: 'Avenir',
                    lineHeight: '1'
                  }}>3,000</span>
                  <span style={{ 
                    marginLeft: '4px', 
                    color: '#999999',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'PingFang SC',
                    lineHeight: '1.43'
                  }}>人</span>
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#999999', 
                  marginBottom: '8px',
                  fontFamily: 'PingFang SC',
                  lineHeight: '1.7',
                  fontWeight: '400'
                }}>总阅读量</div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <span style={{ 
                    fontSize: '24px', 
                    fontWeight: '500', 
                    color: '#333333',
                    fontFamily: 'Avenir',
                    lineHeight: '1'
                  }}>281,000</span>
                  <span style={{ 
                    marginLeft: '4px', 
                    color: '#999999',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'PingFang SC',
                    lineHeight: '1.43'
                  }}>次</span>
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#999999', 
                  marginBottom: '8px',
                  fontFamily: 'PingFang SC',
                  lineHeight: '1.7',
                  fontWeight: '400'
                }}>总互动量</div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <span style={{ 
                    fontSize: '24px', 
                    fontWeight: '500', 
                    color: '#333333',
                    fontFamily: 'Avenir',
                    lineHeight: '1'
                  }}>4,500</span>
                  <span style={{ 
                    marginLeft: '4px', 
                    color: '#999999',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'PingFang SC',
                    lineHeight: '1.43'
                  }}>次</span>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: '16px', 
          fontWeight: '500', 
          color: '#333333',
          fontFamily: 'PingFang SC',
          lineHeight: '1.5'
        }}>账号管理</h2>
        <Space>
          <Button 
            icon={<CalendarOutlined />} 
            onClick={() => setCalendarVisible(true)}
            style={{
              color: '#155BD4',
              background: 'rgba(21, 91, 212, 0.03)',
              fontFamily: 'PingFang SC',
              fontSize: '12px',
              fontWeight: '400',
              lineHeight: '1.5'
            }}
          >
            查看日历
          </Button>
          
        </Space>
      </div>

      <Row gutter={[20, 20]}>
        {mockAccounts.map(account => (
          <Col span={8} key={account.id}>
            <Card
              hoverable
              style={{ 
                height: '100%', 
                border: '1px solid #EEEEEE',
                borderRadius: '8px'
              }}
              bodyStyle={{ padding: '20px' }}
              onClick={() => navigate(`/account/${account.id}`)}
            >
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <Avatar size={64} src={account.avatar} style={{ borderRadius: '100px' }} />
                <div>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    marginBottom: '4px', 
                    color: '#333333',
                    fontFamily: 'PingFang SC',
                    lineHeight: '1.4'
                  }}>
                    {account.nickname}
                  </div>
                  <div style={{ 
                    color: '#999999', 
                    fontSize: '12px',
                    fontFamily: 'PingFang SC',
                    lineHeight: '1.5'
                  }}>
                    {account.id === '1' && (
                      <span style={{ marginRight: '4px' }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="8" cy="8" r="8" fill="#5E91DD" />
                          <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        企业号｜
                      </span>
                    )}
                    {account.followers.toLocaleString()} 粉丝｜{account.posts} 笔记
                  </div>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '32px', 
                marginBottom: '16px' 
              }}>
                <div style={{ width: '116px' }}>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#999999', 
                    marginBottom: '4px',
                    fontFamily: 'PingFang SC',
                    lineHeight: '1.5'
                  }}>本周涨粉</div>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: '500', 
                    color: '#333333',
                    fontFamily: 'Avenir'
                  }}>
                    {account.growth?.followers || 0}
                  </div>
                </div>
                <div style={{ width: '116px' }}>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#999999', 
                    marginBottom: '4px',
                    fontFamily: 'PingFang SC',
                    lineHeight: '1.5'
                  }}>本周阅读</div>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: '500', 
                    color: '#333333',
                    fontFamily: 'Avenir'
                  }}>
                    {account.growth?.views || 0}
                  </div>
                </div>
                <div style={{ width: '116px' }}>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#999999', 
                    marginBottom: '4px',
                    fontFamily: 'PingFang SC',
                    lineHeight: '1.5'
                  }}>本周互动</div>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: '500', 
                    color: '#333333',
                    fontFamily: 'Avenir'
                  }}>
                    {(account.growth?.likes || 0) + (account.growth?.comments || 0)}
                  </div>
                </div>
                <div style={{ width: '116px' }}>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#999999', 
                    marginBottom: '4px',
                    fontFamily: 'PingFang SC',
                    lineHeight: '1.5'
                  }}>
                    本周GMV
                    <Tooltip title="通过小红书笔记进入到小程序店铺并成交的金额">
                      <QuestionCircleOutlined style={{ marginLeft: '4px' }} />
                    </Tooltip>
                  </div>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: '500', 
                    color: '#333333',
                    fontFamily: 'Avenir'
                  }}>
                    {account.id === '1' ? '1,888,888' : account.id === '2' ? '188' : Math.floor(Math.random() * 100000)}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
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
        <Col span={8}>
          <Card
            hoverable
            style={{ 
              height: '100%', 
              border: '1px dashed #EEEEEE',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            bodyStyle={{ 
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}
            onClick={() => setAddAccountVisible(true)}
          >
            <PlusOutlined style={{ fontSize: '24px', color: '#999999', marginBottom: '8px' }} />
            <div style={{ 
              color: '#999999', 
              fontSize: '14px',
              fontFamily: 'PingFang SC'
            }}>添加账号</div>
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: '40px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '500', color: '#333333' }}>智能体工作记录</h2>
        </div>

        <div style={{ padding: '16px', borderRadius: '8px', background: '#FFFFFF' }}>
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
                  <span style={{ fontWeight: 'bold', color: '#333333' }}>
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