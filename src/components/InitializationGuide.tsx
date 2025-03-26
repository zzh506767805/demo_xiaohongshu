import React, { useState, useEffect, useRef } from 'react';
import { Button, Typography, Form, Input, InputNumber, Radio, Space, Card } from 'antd';
import { SmileOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface InitializationGuideProps {
  visible: boolean;
  onClose: () => void;
}

interface AccountConfig {
  nickname: string;
  avatar: string;
}

interface PhaseConfig {
  nurtureDays: number;
  autoCreateContent: boolean;
  publishFrequency: 'daily' | 'weekly';
  publishCount: number;
  contentStyle: string;
  approver: string;
  mountType: 'none' | 'product' | 'poi';
}

const InitializationGuide: React.FC<InitializationGuideProps> = ({ visible, onClose }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showAccountConfig, setShowAccountConfig] = useState(false);
  const [showPhaseConfig, setShowPhaseConfig] = useState(false);
  const accounts = useState<AccountConfig[]>([])[0];
  const [phaseConfig, setPhaseConfig] = useState<PhaseConfig>({
    nurtureDays: 15,
    autoCreateContent: false,
    publishFrequency: 'daily',
    publishCount: 1,
    contentStyle: '轻松随意',
    approver: '',
    mountType: 'none'
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm();

  // 检测元素是否在视口中
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1
      }
    );

    document.querySelectorAll('.scroll-section').forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [showAnalysis, showAccountConfig, showPhaseConfig]);

  // 模拟打字机效果
  const typeWriter = (text: string, callback?: () => void) => {
    setIsTyping(true);
    let index = 0;
    setTypingText('');
    
    const timer = setInterval(() => {
      if (index < text.length) {
        setTypingText(prev => prev + text[index]);
        index++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
        if (callback) callback();
      }
    }, 50);
  };

  const handleStart = () => {
    setShowAnalysis(true);
    setTimeout(() => {
      analysisRef.current?.scrollIntoView({ behavior: 'smooth' });
      typeWriter('正在分析您的需求和行业特点...\n正在生成个性化运营方案...', () => {
        setTimeout(() => {
          setShowAccountConfig(true);
          setTimeout(() => {
            accountRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }, 1000);
      });
    }, 100);
  };

  const handleAccountNext = () => {
    setShowPhaseConfig(true);
    setTimeout(() => {
      phaseRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (!visible) return null;

  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        zIndex: 1000,
        overflow: 'auto',
        padding: '40px'
      }}
    >
      {/* 欢迎页 */}
      <div 
        className="scroll-section visible fade-in"
        style={{ 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <SmileOutlined style={{ fontSize: '64px', color: '#1890ff', marginBottom: '32px' }} />
        <Title>欢迎使用小红书内容托管助手</Title>
        <Paragraph style={{ fontSize: '18px', marginBottom: '40px', maxWidth: '600px' }}>
          我是您的AI助手，将帮助您实现小红书账号的全自动化运营。
          从选题规划、内容创作到数据分析，让运营变得简单高效。
        </Paragraph>
        <Button type="primary" size="large" onClick={handleStart}>
          开始体验
        </Button>
      </div>

      {/* 分析页 */}
      {showAnalysis && (
        <div 
          ref={analysisRef}
          className="scroll-section"
          style={{ 
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px'
          }}
        >
          <div style={{ 
            width: '100%',
            maxWidth: '800px',
            backgroundColor: '#f5f5f5', 
            padding: '40px', 
            borderRadius: '12px',
            marginBottom: '40px',
            fontFamily: 'monospace',
            fontSize: '16px',
            lineHeight: '1.8'
          }}>
            <Text>{typingText}</Text>
            {isTyping && <span className="typing-cursor">|</span>}
          </div>
        </div>
      )}

      {/* 账号配置页 */}
      {showAccountConfig && (
        <div 
          ref={accountRef}
          className="scroll-section"
          style={{ 
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px'
          }}
        >
          <Title level={2} style={{ marginBottom: '40px' }}>添加要托管的小红书账号</Title>
          <div style={{ 
            display: 'flex', 
            gap: '24px', 
            marginBottom: '40px',
            width: '100%',
            maxWidth: '800px',
            justifyContent: 'center'
          }}>
            {[1, 2, 3].map((slot) => (
              <Card
                key={slot}
                style={{ width: 240 }}
                className="fade-in"
                actions={[
                  accounts[slot - 1] ? (
                    <Button type="link" danger>移除</Button>
                  ) : (
                    <Button type="link">添加账号</Button>
                  )
                ]}
              >
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  {accounts[slot - 1] ? (
                    <>
                      <img 
                        src={accounts[slot - 1].avatar} 
                        alt="avatar" 
                        style={{ width: 80, height: 80, borderRadius: '50%', marginBottom: 16 }} 
                      />
                      <div style={{ fontSize: '16px' }}>{accounts[slot - 1].nickname}</div>
                    </>
                  ) : (
                    <UserOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                  )}
                </div>
              </Card>
            ))}
          </div>
          <div>
            <Button type="primary" size="large" onClick={handleAccountNext}>
              下一步：运营配置
            </Button>
            <Button size="large" style={{ marginLeft: 16 }} onClick={handleAccountNext}>
              暂不添加，跳过
            </Button>
          </div>
        </div>
      )}

      {/* 运营配置页 */}
      {showPhaseConfig && (
        <div 
          ref={phaseRef}
          className="scroll-section"
          style={{ 
            minHeight: '100vh',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Title level={2} style={{ marginBottom: '40px' }}>运营配置</Title>
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <Form
              form={form}
              layout="vertical"
              initialValues={phaseConfig}
              onValuesChange={(_, values) => setPhaseConfig(values)}
            >
              <Card title="第一阶段：养号期" style={{ marginBottom: '24px' }} className="fade-in">
                <Form.Item
                  name="nurtureDays"
                  label="养号天数"
                >
                  <InputNumber min={7} max={30} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  name="autoCreateContent"
                  label="内容创作"
                >
                  <Radio.Group>
                    <Space direction="vertical">
                      <Radio value={true}>立即为我创作养号期的全部内容</Radio>
                      <Radio value={false}>稍后手动创建</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Card>

              <Card title="第二阶段：日常运营" style={{ marginBottom: '40px' }} className="fade-in">
                <Form.Item
                  name="publishFrequency"
                  label="发布频率"
                >
                  <Radio.Group>
                    <Radio.Button value="daily">每日发布</Radio.Button>
                    <Radio.Button value="weekly">每周发布</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  name="publishCount"
                  label="每次发布数量"
                >
                  <InputNumber min={1} max={5} />
                </Form.Item>

                <Form.Item
                  name="contentStyle"
                  label="内容风格"
                >
                  <Radio.Group>
                    <Radio.Button value="轻松随意">轻松随意</Radio.Button>
                    <Radio.Button value="专业正式">专业正式</Radio.Button>
                    <Radio.Button value="感性文艺">感性文艺</Radio.Button>
                    <Radio.Button value="幽默诙谐">幽默诙谐</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  name="approver"
                  label="内容审批人"
                >
                  <Input placeholder="请输入审批人姓名" />
                </Form.Item>

                <Form.Item
                  name="mountType"
                  label="挂载配置"
                >
                  <Radio.Group>
                    <Space direction="vertical">
                      <Radio value="none">不挂载商品或POI</Radio>
                      <Radio value="product">挂载商品</Radio>
                      <Radio value="poi">挂载POI</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Card>

              <div style={{ textAlign: 'center' }}>
                <Button type="primary" size="large" onClick={onClose} className="fade-in">
                  完成配置，开始使用
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InitializationGuide; 