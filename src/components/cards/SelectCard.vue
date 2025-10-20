<template>
  <div class="select-card">
    <div class="card-header">
      <UnorderedListOutlined class="card-icon" />
      <span class="card-title">{{ data.title || '请选择' }}</span>
    </div>
    
    <div class="card-content">
      <!-- 搜索框 -->
      <div v-if="data.searchable" class="search-box">
        <a-input
          v-model:value="searchValue"
          :placeholder="data.searchPlaceholder || '搜索选项...'"
          allow-clear
          @change="handleSearch"
        >
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input>
      </div>
      
      <!-- 选项列表 -->
      <div class="options-container">
        <a-radio-group 
          v-if="data.type === 'single'"
          v-model:value="selectedValue"
          class="options-list"
          @change="handleSelectionChange"
        >
          <div 
            v-for="option in filteredOptions" 
            :key="option.id"
            class="option-item radio-option"
            :class="{ 'option-selected': selectedValue === option.id }"
          >
            <a-radio :value="option.id" class="option-radio">
              <div class="option-content">
                <div class="option-main">
                  <span class="option-label">{{ option.name }}</span>
                  <span v-if="option.description" class="option-description">
                    {{ option.description }}
                  </span>
                </div>
                <div v-if="option.preview" class="option-preview">
                  <a-button 
                    type="text" 
                    size="small"
                    @click.stop="handlePreview(option)"
                  >
                    <PlayCircleOutlined />
                    试听
                  </a-button>
                </div>
              </div>
            </a-radio>
          </div>
        </a-radio-group>
        
        <a-checkbox-group 
          v-else-if="data.type === 'multiple'"
          v-model:value="selectedValues"
          class="options-list"
          @change="handleSelectionChange"
        >
          <div 
            v-for="option in filteredOptions" 
            :key="option.id"
            class="option-item checkbox-option"
            :class="{ 'option-selected': selectedValues.includes(option.id) }"
          >
            <a-checkbox :value="option.id" class="option-checkbox">
              <div class="option-content">
                <div class="option-main">
                  <span class="option-label">{{ option.name }}</span>
                  <span v-if="option.description" class="option-description">
                    {{ option.description }}
                  </span>
                </div>
                <div v-if="option.preview" class="option-preview">
                  <a-button 
                    type="text" 
                    size="small"
                    @click.stop="handlePreview(option)"
                  >
                    <PlayCircleOutlined />
                    试听
                  </a-button>
                </div>
              </div>
            </a-checkbox>
          </div>
        </a-checkbox-group>
      </div>
      
      <!-- 选中状态显示 -->
      <div v-if="hasSelection" class="selection-summary">
        <div class="summary-title">已选择：</div>
        <div class="selected-items">
          <a-tag 
            v-for="selectedId in displaySelectedItems" 
            :key="selectedId"
            closable
            @close="handleRemoveSelection(selectedId)"
            class="selected-tag"
          >
            {{ getOptionName(selectedId) }}
          </a-tag>
          <span v-if="selectedCount > maxDisplayItems" class="more-count">
            还有 {{ selectedCount - maxDisplayItems }} 个选项
          </span>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="card-actions">
        <a-space>
          <a-button 
            type="primary"
            :disabled="!hasSelection"
            @click="handleConfirm"
          >
            确认选择
          </a-button>
          <a-button 
            @click="handleClear"
            :disabled="!hasSelection"
          >
            清空选择
          </a-button>
        </a-space>
      </div>
    </div>
    
    <!-- 预览模态框 -->
    <a-modal
      v-model:open="previewVisible"
      title="预览"
      :footer="null"
      width="400px"
    >
      <div class="preview-content">
        <div class="preview-info">
          <h4>{{ currentPreview?.name }}</h4>
          <p v-if="currentPreview?.description">{{ currentPreview.description }}</p>
        </div>
        <div class="preview-player">
          <!-- 音频播放器 -->
          <audio 
            v-if="currentPreview?.preview"
            :src="currentPreview.preview"
            controls
            class="audio-player"
          >
            您的浏览器不支持音频播放
          </audio>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import {
  UnorderedListOutlined,
  SearchOutlined,
  PlayCircleOutlined
} from '@ant-design/icons-vue'

// Types
interface Option {
  id: string
  name: string
  description?: string
  preview?: string
}

// Props
interface Props {
  data: {
    type?: 'single' | 'multiple'
    title?: string
    searchable?: boolean
    searchPlaceholder?: string
    options: Option[]
  }
  messageId: string
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'card-action': [action: string, data: any]
}>()

// 响应式数据
const searchValue = ref('')
const selectedValue = ref<string>('')
const selectedValues = ref<string[]>([])
const previewVisible = ref(false)
const currentPreview = ref<Option | null>(null)

// 常量
const maxDisplayItems = 3

// 计算属性
const filteredOptions = computed(() => {
  if (!searchValue.value) return props.data.options
  
  const searchLower = searchValue.value.toLowerCase()
  return props.data.options.filter(option => 
    option.name.toLowerCase().includes(searchLower) ||
    option.description?.toLowerCase().includes(searchLower)
  )
})

const hasSelection = computed(() => {
  return props.data.type === 'single' 
    ? !!selectedValue.value 
    : selectedValues.value.length > 0
})

const selectedCount = computed(() => {
  return props.data.type === 'single' 
    ? (selectedValue.value ? 1 : 0)
    : selectedValues.value.length
})

const displaySelectedItems = computed(() => {
  if (props.data.type === 'single') {
    return selectedValue.value ? [selectedValue.value] : []
  }
  return selectedValues.value.slice(0, maxDisplayItems)
})

// 方法
const getOptionName = (id: string) => {
  const option = props.data.options.find(opt => opt.id === id)
  return option?.name || id
}

const handleSearch = () => {
  // 搜索逻辑已通过计算属性实现
}

const handleSelectionChange = () => {
  // 选择变化时的处理逻辑
}

const handlePreview = (option: Option) => {
  currentPreview.value = option
  previewVisible.value = true
}

const handleRemoveSelection = (id: string) => {
  if (props.data.type === 'single') {
    selectedValue.value = ''
  } else {
    const index = selectedValues.value.indexOf(id)
    if (index > -1) {
      selectedValues.value.splice(index, 1)
    }
  }
}

const handleConfirm = () => {
  if (!hasSelection.value) {
    message.warning('请先选择选项')
    return
  }
  
  const selectedOptions = props.data.type === 'single'
    ? [props.data.options.find(opt => opt.id === selectedValue.value)].filter(Boolean)
    : props.data.options.filter(opt => selectedValues.value.includes(opt.id))
  
  emit('card-action', 'select-confirm', {
    selected: selectedOptions,
    messageId: props.messageId
  })
  
  message.success(`已选择 ${selectedCount.value} 个选项`)
}

const handleClear = () => {
  if (props.data.type === 'single') {
    selectedValue.value = ''
  } else {
    selectedValues.value = []
  }
  
  emit('card-action', 'select-clear', {
    messageId: props.messageId
  })
  
  message.info('已清空选择')
}

// 监听数据变化，重置选择状态
watch(() => props.data.options, () => {
  selectedValue.value = ''
  selectedValues.value = []
  searchValue.value = ''
}, { deep: true })
</script>

<style scoped>
.select-card {
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

.search-box {
  margin-bottom: var(--spacing-sm);
}

.options-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
}

.options-list {
  width: 100%;
  padding: var(--spacing-sm);
}

.option-item {
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.option-item:hover {
  background: var(--bg-secondary);
}

.option-item.option-selected {
  background: rgba(22, 119, 255, 0.1);
  border: 1px solid rgba(22, 119, 255, 0.3);
}

.option-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.option-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.option-label {
  font-weight: 500;
  color: var(--text-primary);
}

.option-description {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.option-preview {
  flex-shrink: 0;
}

.option-radio,
.option-checkbox {
  width: 100%;
}

.option-radio :deep(.ant-radio-wrapper),
.option-checkbox :deep(.ant-checkbox-wrapper) {
  width: 100%;
  margin: 0;
}

.selection-summary {
  padding: var(--spacing-md);
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
}

.summary-title {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.selected-items {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  align-items: center;
}

.selected-tag {
  background: var(--brand-primary);
  color: white;
  border: none;
}

.more-count {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-light);
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.preview-info h4 {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-primary);
}

.preview-info p {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.audio-player {
  width: 100%;
  height: 40px;
}

/* AI流光主题特殊效果 */
[data-theme="ai-glow"] .select-card {
  background: linear-gradient(135deg, var(--bg-secondary), rgba(102, 126, 234, 0.05));
  border: 1px solid rgba(102, 126, 234, 0.2);
}

[data-theme="ai-glow"] .option-item.option-selected {
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.4);
  box-shadow: var(--shadow-sm);
}

[data-theme="ai-glow"] .selected-tag {
  background: var(--ai-gradient);
  box-shadow: var(--ai-glow);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .select-card {
    padding: var(--spacing-md);
  }
  
  .option-content {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .option-preview {
    align-self: flex-end;
  }
}
</style>
