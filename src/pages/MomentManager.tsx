import React, { useState } from 'react';
import { Button, Drawer, Form, DatePicker, Space, List, Card, Input, message, Modal, Checkbox } from 'antd';
import { PlusOutlined, RobotOutlined } from '@ant-design/icons';

interface MomentPost {
  id: string;
  imageUrl: string;
  content: string;
  status: 'pending' | 'sent';
  scheduledTime: string;
  syncToXiaohongshu?: boolean;
}

const MomentManager: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [posts, setPosts] = useState<MomentPost[]>([]);
  const [form] = Form.useForm();

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
    form.resetFields();
  };

  const generateAIContent = () => {
    form.setFieldsValue({
      content: '这是一个AI生成的示例文案：今天的阳光真好，和朋友们分享这美好的时光。☀️ #生活记录 #美好时光'
    });
    message.success('AI文案生成成功！');
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const newPost: MomentPost = {
        id: `post-${Date.now()}`,
        imageUrl: values.imageUrl || 'https://picsum.photos/400/400',
        content: values.content,
        status: 'pending',
        scheduledTime: values.scheduledTime.format('YYYY-MM-DD HH:mm:ss'),
        syncToXiaohongshu: values.syncToXiaohongshu
      };

      setPosts([...posts, newPost]);
      message.success('发布内容添加成功！');
      onClose();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showDrawer}
        style={{ marginBottom: 16 }}
      >
        添加发布内容
      </Button>

      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={posts}
        renderItem={post => (
          <List.Item>
            <Card
              cover={
                <img
                  alt="图片"
                  src={post.imageUrl}
                  style={{ height: 200, objectFit: 'cover' }}
                />
              }
            >
              <Card.Meta
                title={
                  <Space>
                    状态：
                    <span style={{ color: post.status === 'sent' ? '#52c41a' : '#1890ff' }}>
                      {post.status === 'sent' ? '已发送' : '未发送'}
                    </span>
                  </Space>
                }
                description={
                  <div>
                    <p style={{ marginBottom: 8 }}>{post.content}</p>
                    <p style={{ color: '#1890ff' }}>预计发送时间：{post.scheduledTime}</p>
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      <Drawer
        title="添加定时朋友圈"
        placement="right"
        onClose={onClose}
        open={drawerVisible}
        width={400}
        extra={
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" onClick={handleSubmit}>
              添加
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="imageUrl"
            label="图片URL"
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
                            border: form.getFieldValue('imageUrl') === `https://picsum.photos/400/400?random=${index}` ? '2px solid #1890ff' : '1px solid #d9d9d9',
                            borderRadius: 4,
                            padding: 4,
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            const imageUrl = `https://picsum.photos/400/400?random=${index}`;
                            form.setFieldsValue({ imageUrl });
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
            name="content"
            label={
              <Space>
                文案内容
                <Button
                  type="link"
                  icon={<RobotOutlined />}
                  onClick={generateAIContent}
                  style={{ padding: 0 }}
                >
                  AI生成
                </Button>
              </Space>
            }
            rules={[{ required: true, message: '请输入文案内容' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入文案内容" />
          </Form.Item>

          <Form.Item
            name="scheduledTime"
            label="预计发送时间"
            rules={[{ required: true, message: '请选择预计发送时间' }]}
          >
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="syncToXiaohongshu"
            valuePropName="checked"
          >
            <Checkbox>同时发布到小红书</Checkbox>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default MomentManager;