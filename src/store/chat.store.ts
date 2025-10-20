import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Types
export interface Message {
  id: string
  type: 'user' | 'ai' | 'system'
  content: string
  timestamp: number
  cardType?: 'upload' | 'select' | 'form' | 'confirm'
  cardData?: any
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

// Store
export const useChatStore = defineStore('chat', () => {
  // State
  const currentSessionId = ref<string>('')
  const sessions = ref<ChatSession[]>([])
  const messages = ref<Message[]>([])
  const isLoading = ref(false)

  // Getters
  const currentSession = computed(() => {
    return sessions.value.find(session => session.id === currentSessionId.value)
  })

  const sessionCount = computed(() => sessions.value.length)

  // Actions
  const createSession = (title?: string) => {
    const sessionId = Date.now().toString()
    const session: ChatSession = {
      id: sessionId,
      title: title || `新对话 ${sessionCount.value + 1}`,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    
    sessions.value.unshift(session)
    currentSessionId.value = sessionId
    messages.value = []
    
    return sessionId
  }

  const switchSession = (sessionId: string) => {
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      currentSessionId.value = sessionId
      messages.value = [...session.messages]
    }
  }

  const addMessage = (message: Message) => {
    messages.value.push(message)
    
    // 更新当前会话
    const session = sessions.value.find(s => s.id === currentSessionId.value)
    if (session) {
      session.messages.push(message)
      session.updatedAt = Date.now()
      
      // 如果是第一条消息，更新会话标题
      if (session.messages.length === 1 && message.type === 'user') {
        session.title = message.content.slice(0, 20) + (message.content.length > 20 ? '...' : '')
      }
    }
  }

  const updateMessage = (messageId: string, updates: Partial<Message>) => {
    const messageIndex = messages.value.findIndex(m => m.id === messageId)
    if (messageIndex !== -1) {
      messages.value[messageIndex] = { ...messages.value[messageIndex], ...updates }
      
      // 同步到会话
      const session = sessions.value.find(s => s.id === currentSessionId.value)
      if (session) {
        const sessionMessageIndex = session.messages.findIndex(m => m.id === messageId)
        if (sessionMessageIndex !== -1) {
          session.messages[sessionMessageIndex] = { ...session.messages[sessionMessageIndex], ...updates }
        }
      }
    }
  }

  const deleteMessage = (messageId: string) => {
    const messageIndex = messages.value.findIndex(m => m.id === messageId)
    if (messageIndex !== -1) {
      messages.value.splice(messageIndex, 1)
      
      // 同步到会话
      const session = sessions.value.find(s => s.id === currentSessionId.value)
      if (session) {
        const sessionMessageIndex = session.messages.findIndex(m => m.id === messageId)
        if (sessionMessageIndex !== -1) {
          session.messages.splice(sessionMessageIndex, 1)
        }
      }
    }
  }

  const clearMessages = () => {
    messages.value = []
    
    // 清空当前会话的消息
    const session = sessions.value.find(s => s.id === currentSessionId.value)
    if (session) {
      session.messages = []
      session.updatedAt = Date.now()
    }
  }

  const deleteSession = (sessionId: string) => {
    const index = sessions.value.findIndex(s => s.id === sessionId)
    if (index !== -1) {
      sessions.value.splice(index, 1)
      
      // 如果删除的是当前会话，切换到第一个会话或创建新会话
      if (currentSessionId.value === sessionId) {
        if (sessions.value.length > 0) {
          switchSession(sessions.value[0].id)
        } else {
          createSession()
        }
      }
    }
  }

  const loadHistory = () => {
    // 从本地存储加载历史会话
    try {
      const savedSessions = localStorage.getItem('chat-sessions')
      if (savedSessions) {
        sessions.value = JSON.parse(savedSessions)
        
        // 如果有会话，切换到最新的
        if (sessions.value.length > 0) {
          const latestSession = sessions.value[0]
          currentSessionId.value = latestSession.id
          messages.value = [...latestSession.messages]
        } else {
          createSession()
        }
      } else {
        createSession()
      }
    } catch (error) {
      console.error('加载聊天历史失败:', error)
      createSession()
    }
  }

  const saveHistory = () => {
    // 保存到本地存储
    try {
      localStorage.setItem('chat-sessions', JSON.stringify(sessions.value))
    } catch (error) {
      console.error('保存聊天历史失败:', error)
    }
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  // 自动保存
  const autoSave = () => {
    saveHistory()
  }

  // 监听消息变化，自动保存
  const stopWatcher = ref<() => void>()
  
  const startAutoSave = () => {
    if (stopWatcher.value) {
      stopWatcher.value()
    }
    
    // 这里可以添加自动保存逻辑
    // 例如：每30秒保存一次，或者消息变化时保存
  }

  const stopAutoSave = () => {
    if (stopWatcher.value) {
      stopWatcher.value()
      stopWatcher.value = undefined
    }
  }

  return {
    // State
    currentSessionId,
    sessions,
    messages,
    isLoading,
    
    // Getters
    currentSession,
    sessionCount,
    
    // Actions
    createSession,
    switchSession,
    addMessage,
    updateMessage,
    deleteMessage,
    clearMessages,
    deleteSession,
    loadHistory,
    saveHistory,
    setLoading,
    startAutoSave,
    stopAutoSave
  }
})
