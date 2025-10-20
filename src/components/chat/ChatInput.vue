<template>
  <div class="chat-input">
    <div class="input-container">
      <!-- 快捷操作栏 -->
      <div class="quick-actions">
        <a-tooltip title="上传文件">
          <a-button 
            type="text" 
            size="small"
            @click="handleUploadClick"
            :disabled="disabled"
          >
            <template #icon>
              <PaperClipOutlined />
            </template>
          </a-button>
        </a-tooltip>
        
        <a-tooltip title="使用模板">
          <a-button 
            type="text" 
            size="small"
            @click="handleTemplateClick"
            :disabled="disabled"
          >
            <template #icon>
              <FileTextOutlined />
            </template>
          </a-button>
        </a-tooltip>
        
        <a-tooltip title="语音输入">
          <a-button 
            type="text" 
            size="small"
            @click="handleVoiceClick"
            :disabled="disabled"
          >
            <template #icon>
              <AudioOutlined />
            </template>
          </a-button>
        </a-tooltip>
      </div>
      
      <!-- 输入框区域 -->
      <div class="input-wrapper">
        <a-textarea
          v-model:value="inputValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :auto-size="{ minRows: 1, maxRows: 6 }"
          class="message-input"
          @keydown="handleKeydown"
          @focus="handleFocus"
          @blur="handleBlur"
          ref="inputRef"
        />
        
        <div class="input-actions">
          <a-button 
            type="primary"
            :loading="disabled"
            :disabled="!canSend"
            @click="handleSend"
            class="send-button"
          >
            <template #icon>
              <SendOutlined />
            </template>
            发送
          </a-button>
        </div>
      </div>
      
      <!-- 提示信息 -->
      <div class="input-hints">
        <span class="hint-text">
          按 Enter 发送，Shift + Enter 换行
        </span>
        <span class="hint-text">
          支持上传视频、图片、音频文件
        </span>
      </div>
    </div>
    
    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInput"
      type="file"
      multiple
      accept="video/*,image/*,audio/*"
      style="display: none"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { 
  SendOutlined, 
  PaperClipOutlined, 
  FileTextOutlined, 
  AudioOutlined 
} from '@ant-design/icons-vue'

// Props
interface Props {
  disabled?: boolean
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  placeholder: '输入您的问题或指令，AI将为您提供帮助...'
})

// Emits
const emit = defineEmits<{
  'send-message': [content: string]
  'upload-file': [files: FileList]
  'use-template': [templateId: string]
}>()

// 响应式数据
const inputValue = ref('')
const inputRef = ref()
const fileInput = ref<HTMLInputElement>()

// 计算属性
const canSend = computed(() => {
  return inputValue.value.trim().length > 0 && !props.disabled
})

// 方法
const handleSend = () => {
  if (!canSend.value) return
  
  const content = inputValue.value.trim()
  inputValue.value = ''
  
  nextTick(() => {
    // 重置输入框高度
    if (inputRef.value) {
      inputRef.value.focus()
    }
  })
  
  // 发送消息
  emit('send-message', content)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    if (event.shiftKey) {
      // Shift + Enter 换行，不做处理
      return
    } else {
      // Enter 发送消息
      event.preventDefault()
      handleSend()
    }
  }
}

const handleFocus = () => {
  // 输入框获得焦点时的处理
}

const handleBlur = () => {
  // 输入框失去焦点时的处理
}

const handleUploadClick = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    emit('upload-file', target.files)
    // 清空input值，允许重复选择同一文件
    target.value = ''
  }
}

const handleTemplateClick = () => {
  // TODO: 实现模板选择逻辑
  emit('use-template', 'default')
}

const handleVoiceClick = () => {
  // TODO: 实现语音输入逻辑
  console.log('语音输入功能待实现')
}

// 暴露方法给父组件
defineExpose({
  focus: () => inputRef.value?.focus(),
  clear: () => {
    inputValue.value = ''
  }
})
</script>

<style scoped>
.chat-input {
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--bg-primary);
  border-top: 1px solid var(--border-light);
  transition: background-color var(--transition-normal);
}

.input-container {
  max-width: 800px;
  margin: 0 auto;
}

.quick-actions {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
  padding-left: var(--spacing-sm);
}

.quick-actions .ant-btn {
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.quick-actions .ant-btn:hover {
  color: var(--brand-primary);
  background-color: var(--bg-secondary);
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: var(--spacing-md);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  transition: all var(--transition-normal);
}

.input-wrapper:focus-within {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
}

.message-input {
  flex: 1;
  border: none;
  background: transparent;
  resize: none;
  font-size: var(--font-size-md);
  color: var(--text-primary);
  line-height: 1.5;
}

.message-input:focus {
  box-shadow: none;
}

.message-input::placeholder {
  color: var(--text-tertiary);
}

.input-actions {
  flex-shrink: 0;
}

.send-button {
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.send-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.input-hints {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-sm);
  padding: 0 var(--spacing-sm);
}

.hint-text {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

/* AI流光主题特殊效果 */
[data-theme="ai-glow"] .input-wrapper:focus-within {
  border-color: var(--brand-primary);
  box-shadow: var(--ai-glow);
  background: linear-gradient(135deg, var(--bg-secondary), rgba(102, 126, 234, 0.05));
}

[data-theme="ai-glow"] .send-button:hover {
  box-shadow: var(--ai-glow);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-input {
    padding: var(--spacing-sm) var(--spacing-md);
  }
  
  .input-wrapper {
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
  }
  
  .input-hints {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .quick-actions {
    padding-left: 0;
  }
}

@media (max-width: 480px) {
  .quick-actions {
    justify-content: center;
  }
  
  .input-hints {
    text-align: center;
  }
}

/* 禁用状态 */
.chat-input.disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* 输入框动画效果 */
.message-input {
  transition: all var(--transition-fast);
}

.message-input:focus {
  outline: none;
}
</style>
