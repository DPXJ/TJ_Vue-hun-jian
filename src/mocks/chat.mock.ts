// AI视频混剪V2.0 - Mock数据与模板

import type { ChatMessage, ChatResponse, UploadResponse } from '@/apis/chat.api'

// Mock消息模板
export const mockMessageTemplates = {
  // 欢迎消息
  welcome: {
    type: 'ai' as const,
    content: `🎬 欢迎使用AI视频混剪V2.0！

我是您的智能视频制作助手，可以帮助您：

📁 **素材管理**
• 上传视频、图片、音频文件
• 智能素材分类与整理

🎵 **音频处理**
• 多音色AI配音
• 背景音乐智能匹配
• 音频降噪与优化

🎨 **视频编辑**
• 智能转场效果
• 字幕自动生成
• 视频模板应用

🚀 **一键渲染**
• 高质量视频输出
• 多种格式支持
• 云端渲染加速

请告诉我您想要制作什么类型的视频，或者直接开始上传素材！`,
    timestamp: Date.now()
  },

  // 帮助消息
  help: {
    type: 'ai' as const,
    content: `📖 **使用指南**

**基础操作：**
• 直接输入文字描述您的需求
• 点击输入框旁的图标进行快捷操作
• 使用智能卡片完成复杂操作

**常用指令：**
• "上传视频素材" - 打开文件上传
• "选择配音音色" - 选择AI配音
• "设置视频信息" - 填写视频详情
• "添加转场效果" - 选择转场样式
• "应用视频模板" - 选择制作模板
• "开始渲染视频" - 生成最终视频

**快捷操作：**
• 📎 上传文件
• 📄 使用模板
• 🎤 语音输入

有任何问题都可以随时问我！`,
    timestamp: Date.now()
  },

  // 错误消息
  error: {
    type: 'system' as const,
    content: '❌ 操作失败，请重试或联系技术支持',
    timestamp: Date.now()
  }
}

// Mock用户消息示例
export const mockUserMessages = [
  '上传一些视频素材',
  '为这个视频配音',
  '设置视频标题和封面',
  '添加转场效果',
  '使用商务模板',
  '开始渲染视频',
  '帮我制作一个产品介绍视频',
  '创建一个教育类视频',
  '制作一个生活分享视频'
]

// Mock AI回复模板
export const mockAIResponses: Record<string, ChatResponse> = {
  // 产品介绍
  'product': {
    type: 'text',
    content: `🎯 **产品介绍视频制作方案**

我为您推荐以下制作流程：

1. **素材准备**
   • 产品图片/视频素材
   • 产品功能演示视频
   • 品牌Logo和配色方案

2. **内容结构**
   • 开场：产品概述（5-10秒）
   • 主体：核心功能介绍（30-60秒）
   • 结尾：行动号召（5-10秒）

3. **推荐模板**
   • 商务科技风：适合B2B产品
   • 时尚生活风：适合消费品
   • 简约现代风：适合软件产品

4. **配音建议**
   • 专业男声：适合技术产品
   • 亲和女声：适合生活产品

请先上传您的产品素材，我来帮您制作！`,
    timestamp: Date.now()
  },

  // 教育内容
  'education': {
    type: 'text',
    content: `📚 **教育视频制作方案**

教育类视频制作要点：

1. **内容规划**
   • 知识点分解
   • 逻辑清晰的结构
   • 重点内容突出

2. **视觉设计**
   • 简洁的界面设计
   • 清晰的文字展示
   • 适当的动画效果

3. **音频配置**
   • 清晰的人声录制
   • 适中的语速
   • 背景音乐音量控制

4. **推荐模板**
   • 课堂讲解风
   • 知识科普风
   • 技能教学风

请告诉我您要制作什么主题的教育内容？`,
    timestamp: Date.now()
  },

  // 生活分享
  'lifestyle': {
    type: 'text',
    content: `🌟 **生活分享视频制作方案**

生活类视频制作建议：

1. **内容方向**
   • 日常生活记录
   • 美食制作分享
   • 旅行见闻记录
   • 技能学习过程

2. **拍摄技巧**
   • 自然光线运用
   • 多角度拍摄
   • 细节特写镜头

3. **后期处理**
   • 温馨的色调
   • 轻快的背景音乐
   • 生活化的字幕

4. **推荐模板**
   • 温馨生活风
   • 清新自然风
   • 活力青春风

请上传您的生活素材，我来帮您制作精彩的生活分享视频！`,
    timestamp: Date.now()
  }
}

// Mock文件上传响应
export const mockUploadResponses: Record<string, UploadResponse> = {
  success: {
    success: true,
    files: [
      {
        id: '1',
        name: 'product_demo.mp4',
        size: 25 * 1024 * 1024, // 25MB
        type: 'video/mp4',
        url: '/mock/videos/product_demo.mp4'
      },
      {
        id: '2',
        name: 'product_image.jpg',
        size: 2 * 1024 * 1024, // 2MB
        type: 'image/jpeg',
        url: '/mock/images/product_image.jpg'
      }
    ],
    message: '文件上传成功'
  },
  
  error: {
    success: false,
    files: [],
    message: '文件上传失败，请检查文件格式和大小'
  }
}

// Mock渲染任务状态
export const mockRenderTasks = {
  queued: {
    status: 'queued',
    message: '视频已加入渲染队列，预计等待时间：2分钟',
    progress: 0
  },
  
  processing: {
    status: 'processing',
    message: '正在渲染视频，请稍候...',
    progress: 45
  },
  
  completed: {
    status: 'completed',
    message: '视频渲染完成！',
    progress: 100,
    downloadUrl: '/mock/downloads/video_output.mp4'
  },
  
  failed: {
    status: 'failed',
    message: '视频渲染失败，请重试',
    progress: 0,
    error: '渲染过程中出现错误'
  }
}

// Mock音色数据
export const mockVoiceOptions = [
  {
    id: 'male1',
    name: '成熟男声',
    description: '适合商务、新闻类内容',
    preview: '/mock/audio/male1.mp3',
    category: 'business'
  },
  {
    id: 'female1',
    name: '温柔女声',
    description: '适合教育、生活类内容',
    preview: '/mock/audio/female1.mp3',
    category: 'education'
  },
  {
    id: 'male2',
    name: '活力男声',
    description: '适合运动、娱乐类内容',
    preview: '/mock/audio/male2.mp3',
    category: 'entertainment'
  },
  {
    id: 'female2',
    name: '专业女声',
    description: '适合科技、专业类内容',
    preview: '/mock/audio/female2.mp3',
    category: 'technology'
  },
  {
    id: 'child',
    name: '童声',
    description: '适合儿童、轻松类内容',
    preview: '/mock/audio/child.mp3',
    category: 'lifestyle'
  }
]

// Mock模板数据
export const mockTemplates = [
  {
    id: 'business',
    name: '商务模板',
    description: '适合企业宣传、商务汇报',
    thumbnail: '/mock/templates/business.jpg',
    category: 'business',
    features: ['专业配色', '商务字体', '简洁布局']
  },
  {
    id: 'education',
    name: '教育模板',
    description: '适合课程讲解、知识分享',
    thumbnail: '/mock/templates/education.jpg',
    category: 'education',
    features: ['清晰布局', '重点突出', '易于理解']
  },
  {
    id: 'entertainment',
    name: '娱乐模板',
    description: '适合娱乐内容、生活分享',
    thumbnail: '/mock/templates/entertainment.jpg',
    category: 'entertainment',
    features: ['动感效果', '丰富色彩', '活泼风格']
  },
  {
    id: 'technology',
    name: '科技模板',
    description: '适合科技产品、技术介绍',
    thumbnail: '/mock/templates/technology.jpg',
    category: 'technology',
    features: ['科技感', '现代设计', '数据展示']
  },
  {
    id: 'lifestyle',
    name: '生活模板',
    description: '适合生活记录、日常分享',
    thumbnail: '/mock/templates/lifestyle.jpg',
    category: 'lifestyle',
    features: ['温馨风格', '自然色调', '生活化']
  }
]

// Mock转场效果
export const mockTransitions = [
  { id: 'fade', name: '淡入淡出', description: '平滑过渡效果', duration: 1.0 },
  { id: 'slide', name: '滑动', description: '左右滑动效果', duration: 0.8 },
  { id: 'zoom', name: '缩放', description: '放大缩小效果', duration: 1.2 },
  { id: 'rotate', name: '旋转', description: '旋转过渡效果', duration: 1.5 },
  { id: 'flip', name: '翻转', description: '3D翻转效果', duration: 1.0 },
  { id: 'wipe', name: '擦除', description: '擦除过渡效果', duration: 0.6 }
]

// 生成随机消息ID
export const generateMessageId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// 生成随机用户消息
export const getRandomUserMessage = (): string => {
  return mockUserMessages[Math.floor(Math.random() * mockUserMessages.length)]
}

// 模拟网络延迟
export const mockDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 模拟API错误
export const mockApiError = (message: string = '网络错误'): Promise<never> => {
  return Promise.reject(new Error(message))
}
