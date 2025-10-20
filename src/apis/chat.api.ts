// AI视频混剪V2.0 - 聊天API接口定义与Mock实现

// Types
export interface ChatMessage {
  id: string
  type: 'user' | 'ai' | 'system'
  content: string
  timestamp: number
  cardType?: 'upload' | 'select' | 'form' | 'confirm'
  cardData?: any
}

export interface ChatResponse {
  type: 'text' | 'card'
  content: string
  cardType?: 'upload' | 'select' | 'form' | 'confirm'
  cardData?: any
  timestamp: number
}

export interface UploadResponse {
  success: boolean
  files: Array<{
    id: string
    name: string
    size: number
    type: string
    url: string
  }>
  message?: string
}

export interface ChatHistory {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

// Mock数据
const mockResponses = {
  // 上传相关
  upload: {
    type: 'card' as const,
    content: '好的，我来帮您上传视频素材。请选择要上传的文件：',
    cardType: 'upload' as const,
    cardData: {
      accept: '.mp4,.avi,.mov,.wmv,.mkv',
      multiple: true,
      maxSize: 100 * 1024 * 1024, // 100MB
      maxCount: 10
    }
  },
  
  // 配音相关
  voice: {
    type: 'card' as const,
    content: '请选择您喜欢的配音音色：',
    cardType: 'select' as const,
    cardData: {
      type: 'single',
      title: '选择配音音色',
      searchable: true,
      options: [
        { 
          id: 'male1', 
          name: '成熟男声', 
          description: '适合商务、新闻类内容',
          preview: '/audio/male1.mp3'
        },
        { 
          id: 'female1', 
          name: '温柔女声', 
          description: '适合教育、生活类内容',
          preview: '/audio/female1.mp3'
        },
        { 
          id: 'male2', 
          name: '活力男声', 
          description: '适合运动、娱乐类内容',
          preview: '/audio/male2.mp3'
        },
        { 
          id: 'female2', 
          name: '专业女声', 
          description: '适合科技、专业类内容',
          preview: '/audio/female2.mp3'
        },
        { 
          id: 'child', 
          name: '童声', 
          description: '适合儿童、轻松类内容',
          preview: '/audio/child.mp3'
        }
      ]
    }
  },
  
  // 表单相关
  form: {
    type: 'card' as const,
    content: '请填写视频的基本信息：',
    cardType: 'form' as const,
    cardData: {
      title: '视频信息设置',
      fields: [
        { 
          name: 'title', 
          label: '视频标题', 
          type: 'text', 
          required: true,
          placeholder: '请输入视频标题'
        },
        { 
          name: 'description', 
          label: '视频描述', 
          type: 'textarea',
          placeholder: '请输入视频描述（可选）',
          rows: 3
        },
        { 
          name: 'category', 
          label: '视频分类', 
          type: 'select',
          options: [
            { label: '商务', value: 'business' },
            { label: '教育', value: 'education' },
            { label: '娱乐', value: 'entertainment' },
            { label: '科技', value: 'technology' },
            { label: '生活', value: 'lifestyle' }
          ]
        },
        { 
          name: 'cover', 
          label: '封面图片', 
          type: 'file',
          accept: 'image/*',
          maxCount: 1
        },
        { 
          name: 'duration', 
          label: '视频时长（秒）', 
          type: 'number',
          min: 10,
          max: 300
        }
      ]
    }
  },
  
  // 确认相关
  confirm: {
    type: 'card' as const,
    content: '确认开始渲染视频吗？这可能需要几分钟时间。',
    cardType: 'confirm' as const,
    cardData: {
      title: '确认渲染',
      description: '开始渲染视频将消耗一定的计算资源，预计需要3-5分钟完成。',
      details: {
        '预计时长': '3-5分钟',
        '输出格式': 'MP4 (1080p)',
        '文件大小': '约50-100MB'
      },
      warning: '渲染过程中请勿关闭页面，否则可能导致渲染失败。',
      confirmText: '开始渲染',
      cancelText: '取消'
    }
  }
}

// API实现
export class ChatAPI {
  private static instance: ChatAPI
  private messageHistory: ChatMessage[] = []

  static getInstance(): ChatAPI {
    if (!ChatAPI.instance) {
      ChatAPI.instance = new ChatAPI()
    }
    return ChatAPI.instance
  }

  // 发送消息
  async sendMessage(message: string): Promise<ChatResponse> {
    // 模拟网络延迟
    await this.delay(1000 + Math.random() * 1000)
    
    // 分析用户消息，生成相应回复
    const response = this.analyzeMessage(message)
    
    // 保存到历史记录
    this.messageHistory.push({
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: Date.now()
    })
    
    return response
  }

  // 上传文件
  async uploadFile(file: File): Promise<UploadResponse> {
    // 模拟上传延迟
    await this.delay(2000 + Math.random() * 3000)
    
    // 模拟上传成功/失败
    const success = Math.random() > 0.1 // 90% 成功率
    
    if (success) {
      return {
        success: true,
        files: [{
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file)
        }],
        message: '文件上传成功'
      }
    } else {
      throw new Error('文件上传失败，请重试')
    }
  }

  // 获取历史消息
  async getHistory(): Promise<ChatHistory[]> {
    // 模拟网络延迟
    await this.delay(500)
    
    // 从本地存储获取历史记录
    try {
      const saved = localStorage.getItem('chat-history')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('获取历史记录失败:', error)
      return []
    }
  }

  // 保存历史记录
  async saveHistory(history: ChatHistory[]): Promise<void> {
    try {
      localStorage.setItem('chat-history', JSON.stringify(history))
    } catch (error) {
      console.error('保存历史记录失败:', error)
    }
  }

  // 分析用户消息，生成AI回复
  private analyzeMessage(message: string): ChatResponse {
    const lowerMessage = message.toLowerCase()
    
    // 上传相关关键词
    if (lowerMessage.includes('上传') || lowerMessage.includes('素材') || lowerMessage.includes('文件')) {
      return mockResponses.upload
    }
    
    // 配音相关关键词
    if (lowerMessage.includes('配音') || lowerMessage.includes('音色') || lowerMessage.includes('声音')) {
      return mockResponses.voice
    }
    
    // 设置相关关键词
    if (lowerMessage.includes('设置') || lowerMessage.includes('标题') || lowerMessage.includes('信息')) {
      return mockResponses.form
    }
    
    // 渲染相关关键词
    if (lowerMessage.includes('渲染') || lowerMessage.includes('生成') || lowerMessage.includes('制作')) {
      return mockResponses.confirm
    }
    
    // 转场效果
    if (lowerMessage.includes('转场') || lowerMessage.includes('过渡')) {
      return {
        type: 'card',
        content: '请选择转场效果：',
        cardType: 'select',
        cardData: {
          type: 'single',
          title: '选择转场效果',
          options: [
            { id: 'fade', name: '淡入淡出', description: '平滑过渡效果' },
            { id: 'slide', name: '滑动', description: '左右滑动效果' },
            { id: 'zoom', name: '缩放', description: '放大缩小效果' },
            { id: 'rotate', name: '旋转', description: '旋转过渡效果' },
            { id: 'flip', name: '翻转', description: '3D翻转效果' }
          ]
        }
      }
    }
    
    // 模板相关
    if (lowerMessage.includes('模板') || lowerMessage.includes('样式')) {
      return {
        type: 'card',
        content: '请选择视频模板：',
        cardType: 'select',
        cardData: {
          type: 'single',
          title: '选择视频模板',
          searchable: true,
          options: [
            { id: 'business', name: '商务模板', description: '适合企业宣传、商务汇报' },
            { id: 'education', name: '教育模板', description: '适合课程讲解、知识分享' },
            { id: 'entertainment', name: '娱乐模板', description: '适合娱乐内容、生活分享' },
            { id: 'technology', name: '科技模板', description: '适合科技产品、技术介绍' },
            { id: 'lifestyle', name: '生活模板', description: '适合生活记录、日常分享' }
          ]
        }
      }
    }
    
    // 默认回复
    return {
      type: 'text',
      content: `我理解您想要"${message}"。我可以帮您：\n\n• 📁 上传视频素材\n• 🎵 选择配音音色\n• 📝 设置视频标题和封面\n• ✨ 添加转场效果\n• 🎬 应用视频模板\n• 🚀 渲染最终视频\n\n请告诉我您具体需要什么帮助？`,
      timestamp: Date.now()
    }
  }

  // 模拟延迟
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// 导出单例实例
export const chatAPI = ChatAPI.getInstance()
