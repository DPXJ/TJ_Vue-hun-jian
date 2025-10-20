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
import { ref, onMounted, nextTick } from 'vue'
import { useChatStore } from '@/store/chat.store'
import { useThemeStore } from '@/store/theme.store'
import ChatHeader from '@/components/chat/ChatHeader.vue'
import ChatMessages from '@/components/chat/ChatMessages.vue'
import ChatInput from '@/components/chat/ChatInput.vue'

// 状态管理
const chatStore = useChatStore()
const themeStore = useThemeStore()

// 响应式数据
const currentTheme = ref(themeStore.currentTheme)
const messages = ref(chatStore.messages)
const isLoading = ref(false)

// 生命周期
onMounted(() => {
  // 初始化聊天历史
  chatStore.loadHistory()
  messages.value = chatStore.messages
  
  // 设置主题
  document.documentElement.setAttribute('data-theme', currentTheme.value)
})

// 主题切换
const handleToggleTheme = () => {
  const themes = ['light', 'dark', 'ai-glow']
  const currentIndex = themes.indexOf(currentTheme.value)
  const nextIndex = (currentIndex + 1) % themes.length
  currentTheme.value = themes[nextIndex]
  
  themeStore.setTheme(currentTheme.value)
  document.documentElement.setAttribute('data-theme', currentTheme.value)
}

// 新建对话
const handleNewChat = () => {
  chatStore.clearMessages()
  messages.value = chatStore.messages
}

// 导出视频
const handleExportVideo = () => {
  // TODO: 实现视频导出逻辑
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
  
  chatStore.addMessage(userMessage)
  messages.value = chatStore.messages
  isLoading.value = true
  
  try {
    // 模拟AI回复
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 根据消息内容生成不同的AI回复和卡片
    const aiResponse = generateAIResponse(content.trim())
    chatStore.addMessage(aiResponse)
    messages.value = chatStore.messages
    
  } catch (error) {
    console.error('发送消息失败:', error)
    // 添加错误消息
    const errorMessage = {
      id: Date.now().toString(),
      type: 'system' as const,
      content: '发送失败，请重试',
      timestamp: Date.now()
    }
    chatStore.addMessage(errorMessage)
    messages.value = chatStore.messages
  } finally {
    isLoading.value = false
  }
}

// 上传文件
const handleUploadFile = (file: File) => {
  console.log('上传文件:', file)
  // TODO: 实现文件上传逻辑
}

// 使用模板
const handleUseTemplate = (templateId: string) => {
  console.log('使用模板:', templateId)
  // TODO: 实现模板使用逻辑
}

// 重试消息
const handleRetryMessage = (messageId: string) => {
  console.log('重试消息:', messageId)
  // TODO: 实现消息重试逻辑
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
        maxSize: 100 * 1024 * 1024 // 100MB
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
        options: [
          { id: 'male1', name: '成熟男声', preview: '/audio/male1.mp3' },
          { id: 'female1', name: '温柔女声', preview: '/audio/female1.mp3' },
          { id: 'male2', name: '活力男声', preview: '/audio/male2.mp3' },
          { id: 'female2', name: '专业女声', preview: '/audio/female2.mp3' }
        ]
      }
    }
  }
  
  if (userMessage.includes('设置') || userMessage.includes('标题')) {
    return {
      id: messageId,
      type: 'ai',
      content: '请填写视频的基本信息：',
      timestamp: Date.now(),
      cardType: 'form',
      cardData: {
        fields: [
          { name: 'title', label: '视频标题', type: 'text', required: true },
          { name: 'description', label: '视频描述', type: 'textarea' },
          { name: 'cover', label: '封面图片', type: 'file', accept: 'image/*' }
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
        confirmText: '开始渲染',
        cancelText: '取消'
      }
    }
  }
  
  // 默认回复
  return {
    id: messageId,
    type: 'ai',
    content: `我理解您想要"${userMessage}"。我可以帮您：\n\n• 上传视频素材\n• 选择配音音色\n• 设置视频标题和封面\n• 添加转场效果\n• 渲染最终视频\n\n请告诉我您具体需要什么帮助？`,
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

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-home {
    height: 100vh;
    height: 100dvh; /* 动态视口高度 */
  }
}
</style>
