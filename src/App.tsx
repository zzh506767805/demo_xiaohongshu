import React, { useState, useCallback } from 'react'
import { Menu, Button, Badge } from 'antd'
import Layout from 'antd/lib/layout'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import PublishPlan from './pages/PublishPlan'
import MomentManager from './pages/MomentManager'
import ContentManager from './pages/ContentManager'

const { Header, Content, Sider } = Layout

const App: React.FC = () => {
  const navigate = useNavigate()
  const [siderWidth, setSiderWidth] = useState(160)
  const [isDragging, setIsDragging] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [initStep, setInitStep] = useState(0)
  const [showBadge, setShowBadge] = useState(true)

  const initSteps = [
    '正在读取您的账户信息（粉丝数：12,580，笔记数：326）...',
    '正在分析历史数据（平均点赞：2,342，平均收藏：892）...',
    '正在设定目标人群数据（女性用户：78%，年龄层：18-35岁）...',
    '正在分析内容偏好（高互动领域：美妆护肤、穿搭分享）...',
    '正在生成个性化推荐方案（预期互动率：3.8%）...'
  ]

  React.useEffect(() => {
    let currentStep = 0
    const stepInterval = setInterval(() => {
      if (currentStep < initSteps.length - 1) {
        setInitStep(currentStep + 1)
        currentStep += 1
      } else {
        clearInterval(stepInterval)
      }
    }, 500)

    return () => clearInterval(stepInterval)
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newWidth = e.clientX
      if (newWidth >= 120 && newWidth <= 400) {
        setSiderWidth(newWidth)
      }
    }
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  if (isInitializing) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#fff',
        padding: '20px'
      }}>
        <div
          style={{
            width: '100%',
            maxWidth: '600px',
            background: '#1e1e1e',
            borderRadius: '8px',
            padding: '20px',
            fontFamily: 'monospace',
            color: '#fff'
          }}
        >
          <div style={{ marginBottom: '16px', color: '#0f0' }}>$ 正在初始化系统...</div>
          {initSteps.map((step, index) => (
            <div key={index} style={{ marginBottom: '8px', opacity: index > initStep ? 0.5 : 1 }}>
              {index <= initStep ? (
                <>
                  <span style={{ color: '#0f0' }}>$</span> {step}
                  {index < initStep && <span style={{ color: '#0f0', marginLeft: '8px' }}>✓ 已完成</span>}
                </>
              ) : (
                <span style={{ color: '#666' }}>$ {step}</span>
              )}
            </div>
          ))}
          {initStep === initSteps.length - 1 && (
            <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '20px' }}>
              <div style={{ color: '#0f0', marginBottom: '12px' }}>$ 初始化完成</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button type="primary" onClick={() => setIsInitializing(false)}>
                  开始生成内容
                </Button>
                <Button onClick={() => setIsInitializing(false)}>
                  暂不生成
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  } 

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', background: '#fff', borderBottom: '1px solid #f0f0f0', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>小红书自动发布工具</div>
        <Badge count={showBadge ? 1 : 0} offset={[-8, 0]}>
          <Button 
            type="primary" 
            onClick={() => {
              setShowBadge(false)
            }}
            style={{ marginRight: '20px' }}
          >
            智能助手
          </Button>
        </Badge>
      </Header>
      <Layout>
        <Sider width={siderWidth} style={{ background: '#fff', position: 'relative' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={[window.location.pathname.replace('/', '')]}
            style={{ height: '100%', borderRight: 0 }}
            items={[
              {
                key: 'publish-plan',
                label: '发布计划',
                onClick: () => navigate('/publish-plan')
              },
              {
                key: 'moment-manager',
                label: '朋友圈托管',
                onClick: () => navigate('/moment-manager')
              },
              {
                key: 'content-manager',
                label: '内容管理',
                onClick: () => navigate('/content-manager')
              }
            ]}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '5px',
              height: '100%',
              cursor: 'col-resize',
              background: isDragging ? '#1890ff' : 'transparent',
              transition: 'background-color 0.3s'
            }}
            onMouseDown={handleMouseDown}
            onMouseEnter={e => e.currentTarget.style.background = '#1890ff33'}
            onMouseLeave={e => {
              if (!isDragging) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          />
        </Sider>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/publish-plan" replace />} />
            <Route path="/publish-plan" element={<PublishPlan />} />
            <Route path="/moment-manager" element={<MomentManager />} />
            <Route path="/content-manager" element={<ContentManager />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App