# 云创笔记 (InkCloud Note) - Web 前端

## 项目简介

云创笔记是一款支持多端同步的个人笔记管理平台，提供笔记管理、版本控制、分类标签、好友互动、AI 辅助等核心功能。

## 技术栈

- **React 19** - UI 框架
- **Ant Design 5** - UI 组件库
- **Redux Toolkit** - 状态管理
- **React Router** - 路由管理
- **React Quill** - 富文本编辑器
- **Recharts** - 数据可视化
- **Axios** - HTTP 请求
- **Day.js** - 日期处理

## 功能特性

- ✅ 用户登录/注册（手机号+验证码/密码）
- ✅ 笔记管理（创建、编辑、删除、搜索）
- ✅ 分类和标签管理
- ✅ 笔记版本历史
- ✅ 好友管理和实时聊天
- ✅ 数据统计可视化
- ✅ 个人中心设置
- ✅ 响应式设计（支持手机、平板、电脑）

## 项目结构

```
src/
├── components/      # 公共组件
│   └── Layout.jsx   # 主布局组件
├── pages/          # 页面组件
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── HomePage.jsx
│   ├── NoteEditPage.jsx
│   ├── CategoryPage.jsx
│   ├── TagPage.jsx
│   ├── FriendPage.jsx
│   ├── ChatPage.jsx
│   ├── StatisticsPage.jsx
│   └── ProfilePage.jsx
├── store/          # Redux Store
│   ├── index.js
│   └── slices/     # Redux Slices
│       ├── authSlice.js
│       ├── noteSlice.js
│       ├── categorySlice.js
│       ├── tagSlice.js
│       ├── friendSlice.js
│       ├── chatSlice.js
│       └── userSlice.js
├── utils/          # 工具函数
│   ├── api.js      # Axios 配置
│   └── ProtectedRoute.jsx
└── App.jsx         # 根组件
```

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并配置 API 地址：

```bash
cp .env.example .env
```

编辑 `.env` 文件，设置后端 API 地址：

```
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 4. 构建生产版本

```bash
npm run build
```

## 接口对接

所有 API 接口定义在 `src/store/slices/` 中，接口路径遵循后端文档规范：

- 用户服务：`/api/user/v1/*`
- 笔记服务：`/api/note/v1/*`
- 互动服务：`/api/interact/v1/*`

## 响应式设计

- **移动端** (< 768px): 单栏布局，底部导航
- **平板** (768px - 992px): 适配布局
- **桌面端** (> 992px): 三栏布局（导航+内容+侧边栏）

## 开发规范

- 使用函数式组件和 Hooks
- 状态管理使用 Redux Toolkit
- 样式使用 CSS Modules 或独立 CSS 文件
- 遵循 Ant Design 设计规范
- 代码格式化使用 ESLint

## 待开发功能

- [ ] 笔记分享链接生成
- [ ] 版本对比和回滚
- [ ] AI 助手功能对接
- [ ] 图片上传功能
- [ ] WebSocket 实时聊天
- [ ] 离线缓存支持

## 许可证

MIT
