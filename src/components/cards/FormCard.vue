<template>
  <div class="form-card">
    <div class="card-header">
      <FormOutlined class="card-icon" />
      <span class="card-title">{{ data.title || '填写表单' }}</span>
    </div>
    
    <div class="card-content">
      <a-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        @finish="handleSubmit"
        @finishFailed="handleSubmitFailed"
      >
        <a-form-item 
          v-for="field in data.fields" 
          :key="field.name"
          :label="field.label"
          :name="field.name"
          :rules="getFieldRules(field)"
        >
          <!-- 文本输入框 -->
          <a-input
            v-if="field.type === 'text'"
            v-model:value="formData[field.name]"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
          />
          
          <!-- 多行文本输入框 -->
          <a-textarea
            v-else-if="field.type === 'textarea'"
            v-model:value="formData[field.name]"
            :placeholder="field.placeholder"
            :rows="field.rows || 4"
            :disabled="field.disabled"
          />
          
          <!-- 数字输入框 -->
          <a-input-number
            v-else-if="field.type === 'number'"
            v-model:value="formData[field.name]"
            :placeholder="field.placeholder"
            :min="field.min"
            :max="field.max"
            :step="field.step"
            :disabled="field.disabled"
            style="width: 100%"
          />
          
          <!-- 选择器 -->
          <a-select
            v-else-if="field.type === 'select'"
            v-model:value="formData[field.name]"
            :placeholder="field.placeholder"
            :options="field.options"
            :disabled="field.disabled"
            :mode="field.multiple ? 'multiple' : undefined"
          />
          
          <!-- 开关 -->
          <a-switch
            v-else-if="field.type === 'switch'"
            v-model:checked="formData[field.name]"
            :disabled="field.disabled"
          />
          
          <!-- 文件上传 -->
          <a-upload
            v-else-if="field.type === 'file'"
            v-model:file-list="fileLists[field.name]"
            :accept="field.accept"
            :multiple="field.multiple"
            :max-count="field.maxCount || 1"
            :before-upload="() => false"
            list-type="text"
          >
            <a-button>
              <UploadOutlined />
              选择文件
            </a-button>
          </a-upload>
          
          <!-- 日期选择器 -->
          <a-date-picker
            v-else-if="field.type === 'date'"
            v-model:value="formData[field.name]"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            style="width: 100%"
          />
          
          <!-- 时间选择器 -->
          <a-time-picker
            v-else-if="field.type === 'time'"
            v-model:value="formData[field.name]"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            style="width: 100%"
          />
          
          <!-- 颜色选择器 -->
          <a-color-picker
            v-else-if="field.type === 'color'"
            v-model:value="formData[field.name]"
            :disabled="field.disabled"
          />
          
          <!-- 滑块 -->
          <a-slider
            v-else-if="field.type === 'slider'"
            v-model:value="formData[field.name]"
            :min="field.min || 0"
            :max="field.max || 100"
            :step="field.step || 1"
            :disabled="field.disabled"
          />
          
          <!-- 自定义组件 -->
          <component
            v-else-if="field.component"
            :is="field.component"
            v-model="formData[field.name]"
            v-bind="field.props"
          />
        </a-form-item>
        
        <!-- 表单操作按钮 -->
        <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
          <a-space>
            <a-button 
              type="primary" 
              html-type="submit"
              :loading="submitting"
            >
              提交
            </a-button>
            <a-button @click="handleReset">
              重置
            </a-button>
            <a-button @click="handleCancel">
              取消
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { message } from 'ant-design-vue'
import { FormOutlined, UploadOutlined } from '@ant-design/icons-vue'
import type { FormInstance, Rule } from 'ant-design-vue'

// Types
interface FormField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'select' | 'switch' | 'file' | 'date' | 'time' | 'color' | 'slider'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  default?: any
  min?: number
  max?: number
  step?: number
  rows?: number
  multiple?: boolean
  accept?: string
  maxCount?: number
  options?: Array<{ label: string; value: any }>
  component?: any
  props?: Record<string, any>
}

// Props
interface Props {
  data: {
    title?: string
    fields: FormField[]
  }
  messageId: string
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'card-action': [action: string, data: any]
}>()

// 响应式数据
const formRef = ref<FormInstance>()
const formData = reactive<Record<string, any>>({})
const fileLists = reactive<Record<string, any[]>>({})
const submitting = ref(false)

// 计算属性
const formRules = computed(() => {
  const rules: Record<string, Rule[]> = {}
  
  props.data.fields.forEach(field => {
    if (field.required) {
      rules[field.name] = [
        { required: true, message: `请输入${field.label}`, trigger: 'blur' }
      ]
    }
  })
  
  return rules
})

// 方法
const getFieldRules = (field: FormField): Rule[] => {
  const rules: Rule[] = []
  
  if (field.required) {
    rules.push({ required: true, message: `请输入${field.label}`, trigger: 'blur' })
  }
  
  if (field.type === 'number') {
    rules.push({ type: 'number', message: '请输入有效数字' })
  }
  
  if (field.type === 'email') {
    rules.push({ type: 'email', message: '请输入有效邮箱' })
  }
  
  return rules
}

const initializeFormData = () => {
  props.data.fields.forEach(field => {
    formData[field.name] = field.default || getDefaultValue(field)
    if (field.type === 'file') {
      fileLists[field.name] = []
    }
  })
}

const getDefaultValue = (field: FormField) => {
  switch (field.type) {
    case 'text':
    case 'textarea':
      return ''
    case 'number':
      return field.min || 0
    case 'select':
      return field.multiple ? [] : undefined
    case 'switch':
      return false
    case 'slider':
      return field.min || 0
    default:
      return undefined
  }
}

const handleSubmit = async (values: any) => {
  try {
    submitting.value = true
    
    // 合并文件数据
    const submitData = { ...values }
    Object.keys(fileLists).forEach(fieldName => {
      if (fileLists[fieldName].length > 0) {
        submitData[fieldName] = fileLists[fieldName]
      }
    })
    
    // 模拟提交延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    emit('card-action', 'form-submit', {
      data: submitData,
      messageId: props.messageId
    })
    
    message.success('表单提交成功')
    
  } catch (error) {
    console.error('表单提交失败:', error)
    message.error('表单提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

const handleSubmitFailed = (errorInfo: any) => {
  console.error('表单验证失败:', errorInfo)
  message.error('请检查表单填写是否正确')
}

const handleReset = () => {
  formRef.value?.resetFields()
  initializeFormData()
  message.info('表单已重置')
}

const handleCancel = () => {
  emit('card-action', 'form-cancel', {
    messageId: props.messageId
  })
  message.info('已取消表单填写')
}

// 初始化表单数据
initializeFormData()
</script>

<style scoped>
.form-card {
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
  color: var(--brand-primary);
}

.card-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-primary);
}

.card-content {
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
}

/* 表单样式优化 */
.form-card :deep(.ant-form-item-label) {
  font-weight: 500;
}

.form-card :deep(.ant-input),
.form-card :deep(.ant-input-number),
.form-card :deep(.ant-select-selector),
.form-card :deep(.ant-picker) {
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.form-card :deep(.ant-input:focus),
.form-card :deep(.ant-input-number:focus),
.form-card :deep(.ant-select-focused .ant-select-selector),
.form-card :deep(.ant-picker-focused) {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
}

.form-card :deep(.ant-btn-primary) {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  border-radius: var(--radius-sm);
}

.form-card :deep(.ant-btn-primary:hover) {
  background: var(--brand-hover);
  border-color: var(--brand-hover);
}

/* AI流光主题特殊效果 */
[data-theme="ai-glow"] .form-card {
  background: linear-gradient(135deg, var(--bg-secondary), rgba(102, 126, 234, 0.05));
  border: 1px solid rgba(102, 126, 234, 0.2);
}

[data-theme="ai-glow"] .card-content {
  background: linear-gradient(135deg, var(--bg-primary), rgba(102, 126, 234, 0.02));
}

[data-theme="ai-glow"] .form-card :deep(.ant-input:focus),
[data-theme="ai-glow"] .form-card :deep(.ant-input-number:focus),
[data-theme="ai-glow"] .form-card :deep(.ant-select-focused .ant-select-selector),
[data-theme="ai-glow"] .form-card :deep(.ant-picker-focused) {
  border-color: var(--brand-primary);
  box-shadow: var(--ai-glow);
}

[data-theme="ai-glow"] .form-card :deep(.ant-btn-primary) {
  background: var(--ai-gradient);
  border: none;
}

[data-theme="ai-glow"] .form-card :deep(.ant-btn-primary:hover) {
  box-shadow: var(--ai-glow);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-card {
    padding: var(--spacing-md);
  }
  
  .card-content {
    padding: var(--spacing-md);
  }
  
  .form-card :deep(.ant-form-item) {
    margin-bottom: var(--spacing-md);
  }
  
  .form-card :deep(.ant-form-item-label) {
    text-align: left;
  }
}

@media (max-width: 480px) {
  .form-card :deep(.ant-form-item-label) {
    flex: 0 0 100%;
    max-width: 100%;
    margin-bottom: var(--spacing-xs);
  }
  
  .form-card :deep(.ant-form-item-control) {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>
