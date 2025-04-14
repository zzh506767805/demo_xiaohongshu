import React, { useState, useCallback, Suspense } from 'react'
import { Layout, Menu } from 'antd'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import AccountOverview from './pages/AccountOverview'
import PublishPlan from './pages/PublishPlan'
import MomentManager from './pages/MomentManager'
import ContentManager from './pages/ContentManager'
import { UserOutlined, TeamOutlined, FileOutlined } from '@ant-design/icons'
import Header from './components/Header'

const { Content, Sider } = Layout

const App: React.FC = () => {
  const navigate = useNavigate()
  const [, setSiderWidth] = useState(200)
  const [isDragging, setIsDragging] = useState(false)
  // 用于在页面间共享智能助手状态
  const [aiAssistantVisible, setAiAssistantVisible] = useState(false)

  const handleAssistantClick = () => {
    setAiAssistantVisible(true)
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newWidth = e.clientX
      if (newWidth >= 150 && newWidth <= 400) {
        setSiderWidth(newWidth)
      }
    }
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={120}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          backgroundColor: '#202033',
          zIndex: 10
        }}
      >
        <div className="logo" style={{ 
          height: '50px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <span style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>Youzan</span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ backgroundColor: '#202033' }}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: '智能体',
              onClick: () => navigate('/accounts')
            },
            {
              key: '2',
              icon: <TeamOutlined />,
              label: '占位',
              onClick: () => navigate('/moment-manager')
            },
            {
              key: '3',
              icon: <FileOutlined />,
              label: '占位',
              onClick: () => navigate('/content-manager')
            }
          ]}
        />
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 120, background: '#F7F7F7' }}>
        <Content style={{ margin: '0', overflow: 'initial' }}>
          <div style={{ padding: '16px 24px', minHeight: 'calc(100vh - 32px)' }}>
            <Header onAssistantClick={handleAssistantClick} />
            
            <Suspense fallback={<div>加载中...</div>}>
              <Routes>
                <Route path="/" element={<Navigate to="/accounts" replace />} />
                <Route path="/accounts" element={<AccountOverview />} />
                <Route 
                  path="/account/:id" 
                  element={
                    <PublishPlan 
                      aiAssistantVisible={aiAssistantVisible} 
                      setAiAssistantVisible={setAiAssistantVisible} 
                    />
                  } 
                />
                <Route path="/moment-manager" element={<MomentManager />} />
                <Route path="/content-manager" element={<ContentManager />} />
              </Routes>
            </Suspense>
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App