import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Badge, Divider } from 'antd';
import { UserOutlined, MessageOutlined, ShopOutlined } from '@ant-design/icons';

interface HeaderProps {
  title?: string;
  onAssistantClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onAssistantClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 根据路径获取当前页面标题
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path.includes('/accounts')) {
      return '小红书内容托管';
    } else if (path.includes('/moment-manager')) {
      return '占位页面';
    } else if (path.includes('/content-manager')) {
      return '占位页面';
    } else if (path.includes('/account/')) {
      return '账号详情';
    }
    
    return title || '页面标题';
  };
  
  const badgeStyle = {
    backgroundColor: '#D42F15'
  };
  
  // 检查是否在账号详情页，以便面包屑支持点击返回
  const isAccountDetail = location.pathname.includes('/account/');
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      width: '100%',
      height: '48px'
    }}>
      {/* 左侧面包屑导航 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span 
          style={{ 
            color: '#999999', 
            fontSize: '14px', 
            cursor: isAccountDetail ? 'pointer' : 'default' 
          }}
          onClick={() => isAccountDetail && navigate('/accounts')}
        >
          智能体
        </span>
        <span style={{ color: '#999999', fontSize: '14px' }}>/</span>
        <span style={{ color: '#333333', fontSize: '14px', fontWeight: 500 }}>{getPageTitle()}</span>
      </div>
      
      {/* 右侧用户信息和通知 - 整体容器 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        background: '#FFFFFF',
        padding: '8px',
        borderRadius: '24px 2px 2px 24px',
        gap: '4px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        height: '100%'
      }}>
        {/* 智能助手 */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '4px 8px', 
            background: '#F8F8F8', 
            borderRadius: '24px',
            gap: '4px',
            cursor: 'pointer'
          }}
          onClick={onAssistantClick}
        >
          <div style={{ 
            width: '20px', 
            height: '20px',
            position: 'relative'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(180deg, #292B31 53.48%, #585A62 100%)',
              borderRadius: '50%',
              position: 'relative',
              boxShadow: '0px 0px 5.8px rgba(129, 147, 183, 1), inset 0px -4px 4px rgba(0, 0, 0, 0.05)'
            }}>
              <span style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                fontSize: '12px', 
                color: '#fff',
                fontWeight: 'bold'
              }}>AI</span>
            </div>
          </div>
          <span style={{ color: '#323233', fontSize: '14px' }}>你的智能助手</span>
          <Badge 
            count={8} 
            style={badgeStyle}
            offset={[0, 0]}
          />
        </div>
        
        <Divider type="vertical" style={{ background: '#E4E4E4', height: '20px', margin: '0' }} />
        
        {/* 客户通知 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '6px 8px',
          gap: '4px'
        }}>
          <MessageOutlined style={{ color: '#333333' }} />
          <span style={{ color: '#323233', fontSize: '14px' }}>客户</span>
          <Badge 
            count={8} 
            style={badgeStyle}
            offset={[0, 0]}
          />
        </div>
        
        <Divider type="vertical" style={{ background: '#E4E4E4', height: '20px', margin: '0' }} />
        
        {/* 有赞链接 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '6px 12px 6px 8px',
          gap: '10px',
          position: 'relative'
        }}>
          <ShopOutlined style={{ color: '#333333' }} />
          <span style={{ color: '#323233', fontSize: '14px' }}>有赞</span>
          <Badge 
            dot 
            style={{
              ...badgeStyle,
              position: 'absolute',
              top: '5px',
              right: '0'
            }}
          />
        </div>
        
        <Divider type="vertical" style={{ background: '#E4E4E4', height: '20px', margin: '0' }} />
        
        {/* 用户头像 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '6px 8px',
          gap: '4px'
        }}>
          <span style={{ 
            color: '#323233', 
            fontSize: '14px', 
            textAlign: 'right' 
          }}>最多四字</span>
          <Avatar 
            icon={<UserOutlined />} 
            style={{ 
              background: '#D8D8D8', 
              border: '1px solid #999999',
              color: '#999999'
            }} 
            size={24}
          />
        </div>
      </div>
    </div>
  );
};

export default Header; 