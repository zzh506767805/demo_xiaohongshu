import React, { useState, useCallback, Suspense } from 'react'
import { Layout, Menu } from 'antd'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import AccountOverview from './pages/AccountOverview'
import PublishPlan from './pages/PublishPlan'
import MomentManager from './pages/MomentManager'
import ContentManager from './pages/ContentManager'
import { UserOutlined, TeamOutlined, FileOutlined } from '@ant-design/icons'

const { Content, Sider } = Layout

const App: React.FC = () => {
  const navigate = useNavigate()
  const [, setSiderWidth] = useState(200)
  const [isDragging, setIsDragging] = useState(false)


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
        width={160}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="logo" style={{ 
          height: '50px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <span style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>XHS Writer</span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: '内容托管',
              onClick: () => navigate('/accounts')
            },
            {
              key: '2',
              icon: <TeamOutlined />,
              label: '朋友圈托管',
              onClick: () => navigate('/moment-manager')
            },
            {
              key: '3',
              icon: <FileOutlined />,
              label: '内容管理',
              onClick: () => navigate('/content-manager')
            }
          ]}
        />
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 160 }}>
        <Content style={{ margin: '0 16px', overflow: 'initial' }}>
          <div style={{ padding: 16, background: '#fff', minHeight: 'calc(100vh - 32px)' }}>
            <Suspense fallback={<div>加载中...</div>}>
              <Routes>
                <Route path="/" element={<Navigate to="/accounts" replace />} />
                <Route path="/accounts" element={<AccountOverview />} />
                <Route path="/account/:id" element={<PublishPlan />} />
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