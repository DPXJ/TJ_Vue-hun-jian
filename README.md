# AI视频混剪V2.0

> 对话式智能视频制作平台 - 基于Vue3 + TypeScript + Ant Design Vue

## 🎯 项目概述

AI视频混剪V2.0是一个以"对话式/指令式"交互为核心的智能视频制作平台。用户通过自然语言与AI助手交互，系统自动生成智能卡片引导用户完成视频制作流程。

### ✨ 核心特性

- 🤖 **AI对话交互** - 自然语言指令，智能理解用户需求
- 🎴 **智能卡片系统** - 动态生成操作卡片，简化复杂流程
- 🎨 **多主题支持** - 浅色/深色/AI流光三种主题一键切换
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🚀 **现代化技术栈** - Vue3 + TypeScript + Pinia + Ant Design Vue

## 🛠️ 技术栈

- **前端框架**: Vue 3 + Composition API + TypeScript
- **UI组件库**: Ant Design Vue (antdv)
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **构建工具**: Vite
- **样式方案**: Less/SCSS + CSS Variables
- **代码规范**: ESLint + Prettier

## 📁 项目结构

```
src/
├── app/                    # 应用入口
│   ├── App.vue            # 根组件
│   └── router.ts          # 路由配置
├── components/            # 组件库
│   ├── chat/             # 聊天相关组件
│   │   ├── ChatHeader.vue
│   │   ├── ChatMessages.vue
│   │   └── ChatInput.vue
│   ├── cards/            # 智能卡片组件
│   │   ├── UploadCard.vue
│   │   ├── SelectCard.vue
│   │   ├── FormCard.vue
│   │   └── ConfirmCard.vue
│   └── common/           # 通用组件
│       └── MarkdownRenderer.vue
├── pages/                # 页面组件
│   └── ChatHome.vue      # 主聊天页面
├── store/                # 状态管理
│   ├── chat.store.ts     # 聊天状态
│   └── theme.store.ts    # 主题状态
├── apis/                 # API接口
│   └── chat.api.ts       # 聊天API
├── mocks/                # Mock数据
│   └── chat.mock.ts      # 聊天Mock
└── styles/               # 样式文件
    └── variables.css     # CSS变量
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 🎨 主题系统

项目支持三种主题模式：

### 浅色主题 (Light)
- 简洁明亮的界面设计
- 适合日间使用
- 低对比度，护眼舒适

### 深色主题 (Dark)
- 深色背景，减少眼部疲劳
- 适合夜间使用
- 高对比度，清晰易读

### AI流光主题 (AI-Glow)
- 科技感十足的渐变设计
- 流光效果和阴影
- 适合展示和演示

### 主题切换

点击右上角的主题切换按钮，或使用快捷键 `Ctrl/Cmd + T` 快速切换主题。

## 🎴 智能卡片系统

### 上传卡片 (UploadCard)
- 支持拖拽上传
- 多文件选择
- 实时上传进度
- 文件类型和大小验证

### 选择卡片 (SelectCard)
- 单选/多选模式
- 搜索筛选功能
- 预览试听功能
- 选中状态管理

### 表单卡片 (FormCard)
- 动态表单生成
- 实时数据验证
- 多种输入类型
- 文件上传集成

### 确认卡片 (ConfirmCard)
- 操作确认提示
- 详细信息展示
- 警告信息显示
- 确认/取消操作

## 💬 交互示例

### 基础对话
```
用户: "上传一些视频素材"
AI: [显示上传卡片]
```

### 配音选择
```
用户: "为这个视频配音"
AI: [显示音色选择卡片]
```

### 信息设置
```
用户: "设置视频标题和封面"
AI: [显示表单卡片]
```

### 操作确认
```
用户: "开始渲染视频"
AI: [显示确认卡片]
```

## 🔧 开发指南

### 添加新的智能卡片

1. 在 `src/components/cards/` 目录下创建新组件
2. 实现卡片的基础结构和交互逻辑
3. 在 `ChatMessages.vue` 中注册新卡片类型
4. 在 `chat.api.ts` 中添加对应的响应逻辑

### 自定义主题

1. 在 `src/styles/variables.css` 中添加新的CSS变量
2. 在 `theme.store.ts` 中注册新主题
3. 更新主题切换逻辑

### Mock数据扩展

1. 在 `src/mocks/chat.mock.ts` 中添加新的Mock数据
2. 在 `src/apis/chat.api.ts` 中实现对应的API逻辑
3. 更新消息分析逻辑

## 📱 响应式设计

项目采用移动端优先的响应式设计：

- **桌面端** (>= 1200px): 完整功能展示
- **平板端** (768px - 1199px): 适配布局调整
- **移动端** (< 768px): 简化界面，优化触控体验

## 🎯 功能特性

### 已实现功能
- ✅ 聊天界面基础框架
- ✅ 智能卡片系统
- ✅ 主题切换功能
- ✅ 响应式设计
- ✅ Mock数据系统
- ✅ 状态管理
- ✅ 路由配置

### 待实现功能
- 🔄 真实API集成
- 🔄 文件上传功能
- 🔄 视频预览功能
- 🔄 用户认证系统
- 🔄 云端渲染服务

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

- 项目地址: [GitHub Repository]
- 问题反馈: [GitHub Issues]
- 邮箱: [your-email@example.com]

---

**AI视频混剪V2.0** - 让视频制作变得简单智能 🎬✨
