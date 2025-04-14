import React, { useState } from 'react';
import { Input, Button, List, Avatar, Space, Tag, Modal, message, Card } from 'antd';
import { UserAddOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { mockHotTopics } from '../data/ mockPublishplan'; // Adjust path if filename is different

// 定义 Props 类型 (需要从 PublishPlan.tsx 移动或重新定义)
interface PersonalizationTabProps {
  // 该组件目前不需要从父组件接收 props
}

const PersonalizationTab: React.FC<PersonalizationTabProps> = () => {
  const [] = useState(30);
  const [benchmarkAccounts] = useState<{id: string, name: string, avatar: string, selected: boolean}[]>([
    { id: '1', name: '时尚StyleShop', avatar: 'https://picsum.photos/64/64?random=201', selected: true },
    { id: '2', name: '生活方式指南', avatar: 'https://picsum.photos/64/64?random=202', selected: true },
    { id: '3', name: '美妆达人Bella', avatar: 'https://picsum.photos/64/64?random=203', selected: false }
  ]);

  const titleStyle = {
    fontFamily: 'PingFang SC',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '1.5em',
    color: '#333333'
  };

  return (
    <div style={{ marginTop: '8px' }}>
      <Card 
        title={<div style={titleStyle}>对标账号</div>}
        style={{ marginBottom: '24px', background: '#FFFFFF' }}
        headStyle={{ borderBottom: 'none', padding: '16px 20px 0', marginBottom: 0 }}
        bodyStyle={{ padding: '12px 20px 20px' }}
      >
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '16px'
        }}>
          {benchmarkAccounts.map(account => (
            <div
              key={account.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                backgroundColor: account.selected ? '#f6f6f6' : 'white'
              }}
            >
              <Avatar src={account.avatar} size="small" />
              <span>{account.name}</span>
            </div>
          ))}
          <Button
            icon={<UserAddOutlined />}
            style={{ height: '40px' }}
            onClick={() => {
              Modal.confirm({
                title: '添加对标账号',
                content: (
                  <Input.TextArea
                    placeholder="请输入小红书账号链接或ID"
                    rows={2}
                    style={{ marginTop: '12px' }}
                  />
                ),
                onOk() {
                  message.success('对标账号添加成功，系统将自动抓取相关热文');
                }
              });
            }}
          >
            添加对标账号
          </Button>
        </div>
        
        <div style={{
          padding: '12px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#666'
        }}>
          系统已基于你的对标账号和店铺信息，智能挖掘到28篇相关热文。这些热文与你的产品/账号风格相似度较高，可作为内容创作参考。
        </div>
      </Card>
    
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={titleStyle}>范文列表</div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: '添加范文链接',
                  content: (
                    <Input.TextArea
                      placeholder="请输入范文链接，支持小红书、抖音、微博等平台"
                      rows={4}
                      style={{ marginTop: '12px' }}
                    />
                  ),
                  onOk() {
                    message.success('范文链接添加成功，AI将基于此进行改写');
                  }
                });
              }}
            >
              添加范文
            </Button>
          </div>
        }
        style={{ background: '#FFFFFF' }}
        headStyle={{ borderBottom: 'none', padding: '16px 20px 0', marginBottom: 0 }}
        bodyStyle={{ padding: '12px 20px 20px' }}
      >
        <List
          dataSource={mockHotTopics}
          renderItem={item => (
            <List.Item
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #f0f0f0',
                marginBottom: '12px',
                background: item.created ? '#FAFAFA' : 'white'
              }}
              actions={[
                /* 移除开始改写/已改写按钮 */
              ]}
            >
              <div style={{ width: '100%' }}>
                <div style={{
                  fontWeight: 'bold',
                  fontSize: '15px',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {item.title}
                  {item.created && <Tag color="green">已改写</Tag>}
                </div>
                <Space size={16} style={{ marginBottom: '8px' }}>
                  <span>
                    <EyeOutlined style={{ marginRight: '4px' }} />
                    {(item.views / 10000).toFixed(1)}万热度
                  </span>
                  <span>
                    来源：小红书
                  </span>
                  <span>
                    发布时间：{dayjs(item.date).format('YYYY-MM-DD')}
                  </span>
                </Space>
                
                <div style={{
                  fontSize: '13px',
                  color: '#666',
                  background: '#f9f9f9',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  marginTop: '8px'
                }}>
                  {item.details.substring(0, 120)}...
                </div>
              </div>
            </List.Item>
          )}
          pagination={{
            onChange: page => {
              console.log(page);
            },
            pageSize: 5,
          }}
        />
      </Card>
    </div>
  );
};

export default PersonalizationTab; 