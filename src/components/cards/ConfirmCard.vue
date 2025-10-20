<template>
  <div class="confirm-card">
    <div class="card-header">
      <ExclamationCircleOutlined class="card-icon" />
      <span class="card-title">{{ data.title || '确认操作' }}</span>
    </div>
    
    <div class="card-content">
      <!-- 操作描述 -->
      <div class="confirm-description">
        <p class="description-text">{{ data.description }}</p>
      </div>
      
      <!-- 详细信息 -->
      <div v-if="data.details" class="confirm-details">
        <div class="details-title">详细信息：</div>
        <div class="details-content">
          <div 
            v-for="(value, key) in data.details" 
            :key="key"
            class="detail-item"
          >
            <span class="detail-label">{{ key }}：</span>
            <span class="detail-value">{{ value }}</span>
          </div>
        </div>
      </div>
      
      <!-- 警告信息 -->
      <div v-if="data.warning" class="confirm-warning">
        <a-alert
          :message="data.warning"
          type="warning"
          show-icon
          :closable="false"
        />
      </div>
      
      <!-- 操作按钮 -->
      <div class="card-actions">
        <a-space size="large">
          <a-button 
            type="primary"
            danger
            size="large"
            :loading="confirming"
            @click="handleConfirm"
          >
            {{ data.confirmText || '确认' }}
          </a-button>
          <a-button 
            size="large"
            @click="handleCancel"
            :disabled="confirming"
          >
            {{ data.cancelText || '取消' }}
          </a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

// Props
interface Props {
  data: {
    title?: string
    description: string
    details?: Record<string, any>
    warning?: string
    confirmText?: string
    cancelText?: string
  }
  messageId: string
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'card-action': [action: string, data: any]
}>()

// 响应式数据
const confirming = ref(false)

// 方法
const handleConfirm = async () => {
  try {
    confirming.value = true
    
    // 模拟确认操作延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    emit('card-action', 'confirm', {
      messageId: props.messageId,
      action: 'confirm'
    })
    
    message.success('操作已确认')
    
  } catch (error) {
    console.error('确认操作失败:', error)
    message.error('操作失败，请重试')
  } finally {
    confirming.value = false
  }
}

const handleCancel = () => {
  emit('card-action', 'cancel', {
    messageId: props.messageId,
    action: 'cancel'
  })
  
  message.info('操作已取消')
}
</script>

<style scoped>
.confirm-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin: var(--spacing-md) 0;
  transition: all var(--transition-normal);
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.card-icon {
  font-size: var(--font-size-lg);
  color: var(--warning-color);
}

.card-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-primary);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.confirm-description {
  padding: var(--spacing-md);
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--warning-color);
}

.description-text {
  margin: 0;
  font-size: var(--font-size-md);
  line-height: 1.6;
  color: var(--text-primary);
}

.confirm-details {
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.details-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.detail-label {
  font-weight: 500;
  color: var(--text-secondary);
  min-width: 80px;
}

.detail-value {
  color: var(--text-primary);
  flex: 1;
}

.confirm-warning {
  margin: var(--spacing-sm) 0;
}

.card-actions {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-light);
}

/* AI流光主题特殊效果 */
[data-theme="ai-glow"] .confirm-card {
  background: linear-gradient(135deg, var(--bg-secondary), rgba(102, 126, 234, 0.05));
  border: 1px solid rgba(102, 126, 234, 0.2);
}

[data-theme="ai-glow"] .confirm-description {
  background: linear-gradient(135deg, var(--bg-primary), rgba(102, 126, 234, 0.02));
  border-left-color: var(--brand-primary);
}

[data-theme="ai-glow"] .confirm-details {
  background: linear-gradient(135deg, var(--bg-primary), rgba(102, 126, 234, 0.02));
  border-color: rgba(102, 126, 234, 0.2);
}

[data-theme="ai-glow"] .card-actions .ant-btn-primary {
  background: var(--ai-gradient);
  border: none;
}

[data-theme="ai-glow"] .card-actions .ant-btn-primary:hover {
  box-shadow: var(--ai-glow);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .confirm-card {
    padding: var(--spacing-md);
  }
  
  .card-actions {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .card-actions .ant-space {
    width: 100%;
    justify-content: center;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
  
  .detail-label {
    min-width: auto;
  }
}
</style>
