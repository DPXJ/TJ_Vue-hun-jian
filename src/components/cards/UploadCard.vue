<template>
  <div class="upload-card">
    <div class="card-header">
      <CloudUploadOutlined class="card-icon" />
      <span class="card-title">文件上传</span>
    </div>
    
    <div class="card-content">
      <!-- 上传区域 -->
      <a-upload-dragger
        v-model:file-list="fileList"
        :before-upload="handleBeforeUpload"
        :custom-request="handleUpload"
        :accept="data.accept"
        :multiple="data.multiple"
        :max-count="data.maxCount || 10"
        :disabled="uploading"
        class="upload-dragger"
      >
        <p class="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p class="ant-upload-text">
          点击或拖拽文件到此区域上传
        </p>
        <p class="ant-upload-hint">
          支持 {{ data.accept }} 格式，单个文件不超过 {{ formatFileSize(data.maxSize) }}
        </p>
      </a-upload-dragger>
      
      <!-- 文件列表 -->
      <div v-if="fileList.length > 0" class="file-list">
        <div 
          v-for="file in fileList" 
          :key="file.uid"
          class="file-item"
          :class="{ 'file-error': file.status === 'error' }"
        >
          <div class="file-info">
            <FileOutlined class="file-icon" />
            <span class="file-name">{{ file.name }}</span>
            <span class="file-size">{{ formatFileSize(file.size) }}</span>
          </div>
          
          <div class="file-status">
            <a-progress 
              v-if="file.status === 'uploading'"
              :percent="file.percent"
              size="small"
              :show-info="false"
            />
            <CheckCircleOutlined 
              v-else-if="file.status === 'done'"
              class="status-icon success"
            />
            <CloseCircleOutlined 
              v-else-if="file.status === 'error'"
              class="status-icon error"
            />
          </div>
          
          <a-button 
            v-if="file.status === 'error'"
            type="text"
            size="small"
            @click="retryUpload(file)"
          >
            重试
          </a-button>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="card-actions">
        <a-space>
          <a-button 
            type="primary"
            :disabled="fileList.length === 0 || uploading"
            @click="handleConfirm"
          >
            确认上传
          </a-button>
          <a-button 
            @click="handleClear"
            :disabled="uploading"
          >
            清空
          </a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import {
  CloudUploadOutlined,
  InboxOutlined,
  FileOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons-vue'
import type { UploadFile, UploadProps } from 'ant-design-vue'

// Props
interface Props {
  data: {
    accept?: string
    multiple?: boolean
    maxSize?: number
    maxCount?: number
  }
  messageId: string
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'card-action': [action: string, data: any]
}>()

// 响应式数据
const fileList = ref<UploadFile[]>([])
const uploading = ref(false)

// 计算属性
const uploadSuccess = computed(() => {
  return fileList.value.length > 0 && 
         fileList.value.every(file => file.status === 'done')
})

// 方法
const formatFileSize = (bytes: number) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleBeforeUpload: UploadProps['beforeUpload'] = (file) => {
  // 检查文件大小
  if (props.data.maxSize && file.size > props.data.maxSize) {
    message.error(`文件大小不能超过 ${formatFileSize(props.data.maxSize)}`)
    return false
  }
  
  // 检查文件类型
  if (props.data.accept) {
    const acceptTypes = props.data.accept.split(',').map(type => type.trim())
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!acceptTypes.some(type => type.includes(fileExtension))) {
      message.error(`不支持的文件类型，请上传 ${props.data.accept} 格式的文件`)
      return false
    }
  }
  
  return true
}

const handleUpload: UploadProps['customRequest'] = async (options) => {
  const { file, onProgress, onSuccess, onError } = options
  
  try {
    uploading.value = true
    
    // 模拟上传进度
    let progress = 0
    const timer = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(timer)
        
        // 模拟上传成功
        setTimeout(() => {
          onSuccess?.(file)
          uploading.value = false
          message.success(`${file.name} 上传成功`)
        }, 500)
      } else {
        onProgress?.({ percent: progress })
      }
    }, 200)
    
  } catch (error) {
    uploading.value = false
    onError?.(error as Error)
    message.error(`${file.name} 上传失败`)
  }
}

const retryUpload = (file: UploadFile) => {
  // 重置文件状态
  file.status = 'uploading'
  file.percent = 0
  
  // 重新上传
  handleUpload({
    file: file as any,
    onProgress: (progress) => {
      file.percent = progress.percent
    },
    onSuccess: (response) => {
      file.status = 'done'
      file.response = response
    },
    onError: (error) => {
      file.status = 'error'
      file.error = error
    }
  })
}

const handleConfirm = () => {
  if (fileList.value.length === 0) {
    message.warning('请先选择要上传的文件')
    return
  }
  
  const uploadedFiles = fileList.value.filter(file => file.status === 'done')
  if (uploadedFiles.length === 0) {
    message.warning('请等待文件上传完成')
    return
  }
  
  emit('card-action', 'upload-confirm', {
    files: uploadedFiles,
    messageId: props.messageId
  })
  
  message.success(`成功上传 ${uploadedFiles.length} 个文件`)
}

const handleClear = () => {
  fileList.value = []
  emit('card-action', 'upload-clear', {
    messageId: props.messageId
  })
}
</script>

<style scoped>
.upload-card {
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
  margin-bottom: var(--spacing-md);
}

.card-icon {
  font-size: var(--font-size-lg);
  color: var(--brand-primary);
}

.card-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-primary);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.upload-dragger {
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
}

.upload-dragger:hover {
  border-color: var(--brand-primary);
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  max-height: 200px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm);
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.file-item.file-error {
  border-color: var(--error-color);
  background: rgba(255, 77, 79, 0.05);
}

.file-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
  min-width: 0;
}

.file-icon {
  color: var(--brand-primary);
  flex-shrink: 0;
}

.file-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-primary);
}

.file-size {
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
  flex-shrink: 0;
}

.file-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin: 0 var(--spacing-sm);
}

.status-icon {
  font-size: var(--font-size-md);
}

.status-icon.success {
  color: var(--success-color);
}

.status-icon.error {
  color: var(--error-color);
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-light);
}

/* AI流光主题特殊效果 */
[data-theme="ai-glow"] .upload-card {
  background: linear-gradient(135deg, var(--bg-secondary), rgba(102, 126, 234, 0.05));
  border: 1px solid rgba(102, 126, 234, 0.2);
}

[data-theme="ai-glow"] .upload-dragger:hover {
  border-color: var(--brand-primary);
  box-shadow: var(--ai-glow);
}

[data-theme="ai-glow"] .file-item:hover {
  border-color: var(--brand-primary);
  box-shadow: var(--shadow-sm);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .upload-card {
    padding: var(--spacing-md);
  }
  
  .file-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .file-status {
    margin: 0;
    align-self: flex-end;
  }
}
</style>
