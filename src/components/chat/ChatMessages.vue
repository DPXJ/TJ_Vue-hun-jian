<template>
  <div class="chat-messages" ref="messagesContainer">
    <div class="messages-list" ref="messagesList">
      <div 
        v-for="message in messages" 
        :key="message.id"
        class="message-item"
        :class="[
          `message-${message.type}`,
          { 'message-loading': message.id === loadingMessageId }
        ]"
      >
        <!-- 用户消息 -->
        <div v-if="message.type === 'user'" class="message-bubble user-message">
          <div class="message-content">
            {{ message.content }}
          </div>
          <div class="message-time">
            {{ formatTime(message.timestamp) }}
          </div>
        </div>
        
        <!-- AI消息 -->
        <div v-else-if="message.type === 'ai'" class="message-bubble ai-message">
          <div class="ai-avatar">
            <ThunderboltFilled />
          </div>
          <div class="message-wrapper">
            <div class="message-content">
              <MarkdownRenderer :content="message.content" />
            </div>
            
            <!-- 智能卡片 -->
            <div v-if="message.cardType" class="smart-card-container">
              <component 
                :is="getCardComponent(message.cardType)"
                :data="message.cardData"
                :message-id="message.id"
                @card-action="handleCardAction"
              />
            </div>
            
            <div class="message-time">
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
        </div>
        
        <!-- 系统消息 -->
        <div v-else-if="message.type === 'system'" class="message-bubble system-message">
          <div class="message-content">
            <ExclamationCircleOutlined />
            {{ message.content }}
          </div>
          <div class="message-time">
            {{ formatTime(message.timestamp) }}
          </div>
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="isLoading" class="message-item message-ai">
        <div class="message-bubble ai-message">
          <div class="ai-avatar">
            <ThunderboltFilled />
          </div>
          <div class="message-wrapper">
            <div class="message-content loading-content">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span class="loading-text">AI正在思考中...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from 'vue'
import { ThunderboltFilled, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import MarkdownRenderer from '@/components/common/MarkdownRenderer.vue'
import UploadCard from '@/components/cards/UploadCard.vue'
import SelectCard from '@/components/cards/SelectCard.vue'
import FormCard from '@/components/cards/FormCard.vue'
import ConfirmCard from '@/components/cards/ConfirmCard.vue'

// Types
interface Message {
  id: string
  type: 'user' | 'ai' | 'system'
  content: string
  timestamp: number
  cardType?: 'upload' | 'select' | 'form' | 'confirm'
  cardData?: any
}

// Props
interface Props {
  messages: Message[]
  isLoading?: boolean
  loadingMessageId?: string
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  loadingMessageId: ''
})

// Emits
const emit = defineEmits<{
  'retry-message': [messageId: string]
  'card-action': [action: string, data: any]
}>()

// 响应式数据
const messagesContainer = ref<HTMLElement>()
const messagesList = ref<HTMLElement>()

// 组件映射
const cardComponents = {
  upload: UploadCard,
  select: SelectCard,
  form: FormCard,
  confirm: ConfirmCard
}

// 方法
const getCardComponent = (cardType: string) => {
  return cardComponents[cardType as keyof typeof cardComponents]
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const handleCardAction = (action: string, data: any) => {
  // 处理卡片操作
  console.log('Card action:', action, data)
}

// 监听消息变化，自动滚动到底部
watch(() => props.messages, () => {
  scrollToBottom()
}, { deep: true })

// 监听加载状态变化
watch(() => props.isLoading, (newVal) => {
  if (newVal) {
    scrollToBottom()
  }
})

// 生命周期
onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
  background-color: var(--bg-primary);
}

.messages-list {
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: var(--spacing-lg);
}

.message-item {
  margin-bottom: var(--spacing-lg);
}

.message-bubble {
  max-width: 70%;
  word-wrap: break-word;
}

/* 用户消息 */
.message-user {
  display: flex;
  justify-content: flex-end;
}

.user-message {
  background: var(--brand-primary);
  color: var(--chat-text-user);
  border-radius: var(--radius-lg) var(--radius-lg) var(--radius-sm) var(--radius-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  margin-left: auto;
  box-shadow: var(--shadow-md);
}

/* AI消息 */
.message-ai {
  display: flex;
  justify-content: flex-start;
}

.ai-message {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  background: var(--chat-bubble-ai);
  color: var(--chat-text-ai);
  border-radius: var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
}

.ai-avatar {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--ai-gradient, var(--brand-primary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.message-wrapper {
  flex: 1;
  min-width: 0;
}

.message-content {
  margin-bottom: var(--spacing-sm);
}

.loading-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
}

/* 打字机效果 */
.typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--brand-primary);
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 系统消息 */
.message-system {
  display: flex;
  justify-content: center;
}

.system-message {
  background: var(--chat-bubble-system);
  color: var(--chat-text-system);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: center;
  font-size: var(--font-size-xs);
  border: 1px solid var(--border-color);
}

.system-message .message-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
}

/* 智能卡片容器 */
.smart-card-container {
  margin-top: var(--spacing-md);
}

/* 消息时间 */
.message-time {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  text-align: right;
}

.message-ai .message-time {
  text-align: left;
}

/* AI流光主题特殊效果 */
[data-theme="ai-glow"] .ai-avatar {
  box-shadow: var(--ai-glow);
}

[data-theme="ai-glow"] .ai-message {
  background: linear-gradient(135deg, var(--bg-tertiary), rgba(102, 126, 234, 0.1));
  border: 1px solid rgba(102, 126, 234, 0.2);
}

[data-theme="ai-glow"] .typing-indicator span {
  background: var(--ai-gradient);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-messages {
    padding: var(--spacing-md);
  }
  
  .message-bubble {
    max-width: 85%;
  }
  
  .ai-message {
    gap: var(--spacing-sm);
  }
  
  .ai-avatar {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .chat-messages {
    padding: var(--spacing-sm);
  }
  
  .message-bubble {
    max-width: 90%;
  }
}
</style>
