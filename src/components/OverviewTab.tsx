import React, { useState } from 'react';
import { Card, Row, Col, Button } from 'antd';
import { 
  WarningOutlined, ArrowUpOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

interface OverviewTabProps {
  setCalendarVisible: (visible: boolean) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ setCalendarVisible }) => {
  const [showAllReviewContent, setShowAllReviewContent] = useState(false);

  const titleStyle = {
    fontFamily: 'PingFang SC',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '1.5em',
    color: '#333333'
  };

  const normalTextStyle = {
    fontFamily: 'PingFang SC',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '1.71em',
    color: '#333333'
  };

  const linkTextStyle = {
    fontFamily: 'PingFang SC',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '1.71em',
    color: '#155BD4',
    padding: '0'
  };

  const smallTextStyle = {
    fontFamily: 'PingFang SC',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '1.5em',
    color: '#999999'
  };

  const numberStyle = {
    fontFamily: 'Avenir',
    fontWeight: 500,
    fontSize: '30px',
    lineHeight: '1em',
    color: '#333333'
  };

  const growthTextStyle = {
    fontFamily: 'PingFang SC',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '1.5em',
    color: '#52c41a',
    display: 'flex',
    alignItems: 'center'
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col style={{ width: '566px' }}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={titleStyle}>待审核内容(3)</span>
                <Button 
                  type="link" 
                  size="small" 
                  style={linkTextStyle}
                  onClick={() => setShowAllReviewContent(!showAllReviewContent)}
                >
                  查看全部
                </Button>
              </div>
            } 
            style={{ height: '166px', overflow: 'hidden' }}
            bodyStyle={{ padding: '0px 20px 20px', height: 'calc(166px - 46px)', overflowY: 'hidden' }}
            headStyle={{ borderBottom: 'none', padding: '16px 20px 0', marginBottom: 0 }}
          >
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '16px'
              }}
            >
              <WarningOutlined style={{ color: '#ED6A18', marginRight: '8px', flexShrink: 0 }} />
              <span style={{ ...smallTextStyle, color: '#333333', flex: 1 }}>
                你还未配置消息推送渠道，无法及时接收到审核结果通知，请尽快处理 
                <a href="#" style={{ color: '#155BD4', marginLeft: '4px' }}>前往配置</a>
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '56px',
                  height: '56px',
                  borderRadius: '4px',
                  background: '#D9D9D9',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  <img 
                    src="https://picsum.photos/400/400?random=101" 
                    alt="预览图" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <div style={normalTextStyle}>🍵一口沦陷！这家抹茶慕斯绝了</div>
                  <div style={smallTextStyle}>计划 2024-03-22 10:00 发布</div>
                </div>
              </div>
              <Button
                type="primary"
                size="small"
                style={{
                  fontFamily: 'PingFang SC',
                  fontWeight: 400,
                  fontSize: '12px',
                  height: '24px',
                  lineHeight: '24px',
                  padding: '0 8px',
                  background: '#155BD4'
                }}
              >
                审核
              </Button>
            </div>
          </Card>
        </Col>
        
        <Col style={{ width: '706px' }}>
          <Card 
            title={<div style={titleStyle}>账号数据</div>}
            style={{ height: '166px' }}
            bodyStyle={{ padding: '12px 20px 20px', height: 'calc(166px - 46px)' }}
            headStyle={{ borderBottom: 'none', padding: '16px 20px 0', marginBottom: 0 }}
          >
            <Row gutter={[16, 0]} style={{ height: '100%' }}>
              <Col span={8}>
                <div style={{ height: '100%' }}>
                  <div style={smallTextStyle}>本周涨粉</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={numberStyle}>30</div>
                    <div>
                      <div style={smallTextStyle}>较上周</div>
                      <div style={growthTextStyle}>
                        <ArrowUpOutlined style={{ marginRight: '4px' }} /> 100%
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ height: '100%' }}>
                  <div style={smallTextStyle}>本周阅读</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={numberStyle}>3000</div>
                    <div>
                      <div style={smallTextStyle}>较上周</div>
                      <div style={growthTextStyle}>
                        <ArrowUpOutlined style={{ marginRight: '4px' }} /> 10.01%
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ height: '100%' }}>
                  <div style={smallTextStyle}>本周互动</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={numberStyle}>281000</div>
                    <div>
                      <div style={smallTextStyle}>较上周</div>
                      <div style={growthTextStyle}>
                        <ArrowUpOutlined style={{ marginRight: '4px' }} /> 10.01%
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={titleStyle}>下周发布计划</span>
                <Button 
                  type="link" 
                  size="small" 
                  style={linkTextStyle}
                  onClick={() => setCalendarVisible(true)}
                >
                  查看全部
                </Button>
              </div>
            }
            headStyle={{ borderBottom: 'none', padding: '16px 20px 0', marginBottom: 0 }}
            bodyStyle={{ padding: '12px 20px 20px' }}
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
                      <div style={normalTextStyle}>{date.format('MM/DD')}</div>
                      <div style={smallTextStyle}>{date.format('ddd')}</div>
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
                        <div style={{ ...normalTextStyle, fontWeight: 500, marginBottom: '4px' }}>春季新品分享</div>
                        <div style={smallTextStyle}>10:00 发布</div>
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
                        <div style={{ ...normalTextStyle, fontWeight: 500, marginBottom: '4px' }}>护肤品测评</div>
                        <div style={smallTextStyle}>15:30 发布</div>
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
                        <div style={{ ...normalTextStyle, fontWeight: 500, marginBottom: '4px' }}>搭配技巧分享</div>
                        <div style={smallTextStyle}>20:00 发布</div>
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
                        <div style={{ ...normalTextStyle, fontWeight: 500, marginBottom: '4px' }}>断桥奶茶探店</div>
                        <div style={smallTextStyle}>12:30 发布</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OverviewTab; 