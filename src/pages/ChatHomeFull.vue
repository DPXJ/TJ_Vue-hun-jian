<template>
  <div class="chat-home" :data-theme="currentTheme">
    <!-- 顶部导航栏 -->
    <ChatHeader 
      :current-theme="currentTheme"
      @toggle-theme="handleToggleTheme"
      @new-chat="handleNewChat"
      @export-video="handleExportVideo"
    />
    
    <!-- 主聊天区域 -->
    <div class="chat-container">
      <!-- 消息流区域 -->
      <ChatMessages 
        :messages="messages"
        :is-loading="isLoading"
        @retry-message="handleRetryMessage"
      />
      
      <!-- 底部输入区域 -->
      <ChatInput 
        :disabled="isLoading"
        @send-message="handleSendMessage"
        @upload-file="handleUploadFile"
        @use-template="handleUseTemplate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ChatHeader from '@/components/chat/ChatHeader.vue'
import ChatMessages from '@/components/chat/ChatMessages.vue'
import ChatInput from '@/components/chat/ChatInput.vue'

// 响应式数据
const currentTheme = ref('light')
const messages = ref([
  {
    id: 'welcome',
    type: 'ai',
    content: '🎬 欢迎使用AI视频混剪V2.0！\n\n我可以帮您：\n• 📁 上传视频素材\n• 🎵 选择配音音色\n• 📝 设置视频标题和封面\n• ✨ 添加转场效果\n• 🎬 应用视频模板\n• 🚀 渲染最终视频\n\n请告诉我您需要什么帮助？',
    timestamp: Date.now()
  }
])
const isLoading = ref(false)

// 生命周期
onMounted(() => {
  // 设置主题
  document.documentElement.setAttribute('data-theme', currentTheme.value)
})

// 主题切换
const handleToggleTheme = () => {
  const themes = ['light', 'dark', 'ai-glow']
  const currentIndex = themes.indexOf(currentTheme.value)
  const nextIndex = (currentIndex + 1) % themes.length
  currentTheme.value = themes[nextIndex]
  
  document.documentElement.setAttribute('data-theme', currentTheme.value)
}

// 新建对话
const handleNewChat = () => {
  messages.value = [
    {
      id: Date.now().toString(),
      type: 'ai',
      content: '新对话已创建！请告诉我您需要什么帮助？',
      timestamp: Date.now()
    }
  ]
}

// 导出视频
const handleExportVideo = () => {
  console.log('导出视频功能')
}

// 发送消息
const handleSendMessage = async (content: string) => {
  if (!content.trim() || isLoading.value) return
  
  // 添加用户消息
  const userMessage = {
    id: Date.now().toString(),
    type: 'user' as const,
    content: content.trim(),
    timestamp: Date.now()
  }
  
  messages.value.push(userMessage)
  isLoading.value = true
  
  try {
    // 模拟AI回复延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 根据消息内容生成不同的AI回复和卡片
    const aiResponse = generateAIResponse(content.trim())
    messages.value.push(aiResponse)
    
  } catch (error) {
    console.error('发送消息失败:', error)
    messages.value.push({
      id: Date.now().toString(),
      type: 'system' as const,
      content: '发送失败，请重试',
      timestamp: Date.now()
    })
  } finally {
    isLoading.value = false
  }
}

// 上传文件
const handleUploadFile = (files: FileList) => {
  console.log('上传文件:', files)
}

// 使用模板
const handleUseTemplate = (templateId: string) => {
  console.log('使用模板:', templateId)
}

// 重试消息
const handleRetryMessage = (messageId: string) => {
  console.log('重试消息:', messageId)
}

// 生成AI回复（模拟逻辑）
const generateAIResponse = (userMessage: string): any => {
  const messageId = Date.now().toString()
  
  // 根据用户消息内容生成不同的回复
  if (userMessage.includes('上传') || userMessage.includes('素材')) {
    return {
      id: messageId,
      type: 'ai',
      content: '好的，我来帮您上传视频素材。请选择要上传的文件：',
      timestamp: Date.now(),
      cardType: 'upload',
      cardData: {
        accept: '.mp4,.avi,.mov,.wmv',
        multiple: true,
        maxSize: 100 * 1024 * 1024
      }
    }
  }
  
  if (userMessage.includes('配音') || userMessage.includes('音色')) {
    return {
      id: messageId,
      type: 'ai',
      content: '请选择您喜欢的配音音色：',
      timestamp: Date.now(),
      cardType: 'select',
      cardData: {
        type: 'single',
        title: '选择配音音色',
        searchable: true,
        options: [
          { id: 'male1', name: '成熟男声', description: '适合商务、新闻类内容' },
          { id: 'female1', name: '温柔女声', description: '适合教育、生活类内容' },
          { id: 'male2', name: '活力男声', description: '适合运动、娱乐类内容' },
          { id: 'female2', name: '专业女声', description: '适合科技、专业类内容' }
        ]
      }
    }
  }
  
  if (userMessage.includes('设置') || userMessage.includes('标题') || userMessage.includes('信息')) {
    return {
      id: messageId,
      type: 'ai',
      content: '请填写视频的基本信息：',
      timestamp: Date.now(),
      cardType: 'form',
      cardData: {
        title: '视频信息设置',
        fields: [
          { name: 'title', label: '视频标题', type: 'text', required: true, placeholder: '请输入视频标题' },
          { name: 'description', label: '视频描述', type: 'textarea', placeholder: '请输入视频描述（可选）', rows: 3 },
          { name: 'category', label: '视频分类', type: 'select', options: [
            { label: '商务', value: 'business' },
            { label: '教育', value: 'education' },
            { label: '娱乐', value: 'entertainment' }
          ]}
        ]
      }
    }
  }
  
  if (userMessage.includes('渲染') || userMessage.includes('生成')) {
    return {
      id: messageId,
      type: 'ai',
      content: '确认开始渲染视频吗？这可能需要几分钟时间。',
      timestamp: Date.now(),
      cardType: 'confirm',
      cardData: {
        title: '确认渲染',
        description: '开始渲染视频将消耗一定的计算资源，预计需要3-5分钟完成。',
        details: {
          '预计时长': '3-5分钟',
          '输出格式': 'MP4 (1080p)',
          '文件大小': '约50-100MB'
        },
        warning: '渲染过程中请勿关闭页面。',
        confirmText: '开始渲染',
        cancelText: '取消'
      }
    }
  }
  
  if (userMessage.includes('转场')) {
    return {
      id: messageId,
      type: 'ai',
      content: '请选择转场效果：',
      timestamp: Date.now(),
      cardType: 'select',
      cardData: {
        type: 'single',
        title: '选择转场效果',
        options: [
          { id: 'fade', name: '淡入淡出', description: '平滑过渡效果' },
          { id: 'slide', name: '滑动', description: '左右滑动效果' },
          { id: 'zoom', name: '缩放', description: '放大缩小效果' }
        ]
      }
    }
  }
  
  if (userMessage.includes('模板')) {
    return {
      id: messageId,
      type: 'ai',
      content: '请选择视频模板：',
      timestamp: Date.now(),
      cardType: 'select',
      cardData: {
        type: 'single',
        title: '选择视频模板',
        searchable: true,
        options: [
          { id: 'business', name: '商务模板', description: '适合企业宣传、商务汇报' },
          { id: 'education', name: '教育模板', description: '适合课程讲解、知识分享' },
          { id: 'entertainment', name: '娱乐模板', description: '适合娱乐内容、生活分享' }
        ]
      }
    }
  }
  
  // 默认回复
  return {
    id: messageId,
    type: 'ai',
    content: `我理解您想要"${userMessage}"。\n\n我可以帮您：\n• 📁 上传视频素材\n• 🎵 选择配音音色\n• 📝 设置视频信息\n• ✨ 添加转场效果\n• 🎬 应用视频模板\n• 🚀 渲染最终视频\n\n请告诉我您具体需要什么帮助？`,
    timestamp: Date.now()
  }
}
</script>

<style scoped>
.chat-home {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color var(--transition-normal), color var(--transition-normal);
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

@media (max-width: 768px) {
  .chat-home {
    height: 100vh;
    height: 100dvh;
  }
}
</style>
