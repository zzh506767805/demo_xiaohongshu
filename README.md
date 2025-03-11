# 小红书自动发布工具

一个基于React的小红书内容管理和自动发布工具，帮助创作者更高效地管理和发布内容。

## 主要功能

- 内容管理：支持笔记的批量创建、编辑和管理
- 发布计划：可以制定和管理内容发布计划
- 朋友圈托管：支持朋友圈内容的定时发布
- 多账号管理：支持多个小红书账号的切换和管理
- 数据分析：提供笔记的互动数据分析

## 技术栈

- React
- TypeScript
- Ant Design
- Vite
- dayjs

## 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
src/
  ├── pages/         # 页面组件
  │   ├── ContentManager.tsx    # 内容管理
  │   ├── MomentManager.tsx     # 朋友圈管理
  │   └── PublishPlan.tsx       # 发布计划
  ├── App.tsx        # 应用入口
  └── main.tsx       # 主渲染文件
```