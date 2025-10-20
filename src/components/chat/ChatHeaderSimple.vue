<template>
  <header class="chat-header">
    <div class="header-left">
      <h1 class="header-title">AI视频混剪V2.0</h1>
    </div>
    
    <div class="header-right">
      <!-- 新建对话 -->
      <button class="header-btn" @click="emit('new-chat')" title="新建对话">
        ➕ 新建
      </button>
      
      <!-- 导出视频 -->
      <button class="header-btn" @click="emit('export-video')" title="导出视频">
        📥 导出
      </button>
      
      <!-- 主题切换 -->
      <button class="header-btn" @click="emit('toggle-theme')" :title="getThemeTooltip">
        {{ getThemeIcon }}
      </button>
      
      <!-- 用户菜单 -->
      <button class="header-btn user-btn" title="用户菜单">
        👤
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  currentTheme: string
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'toggle-theme': []
  'new-chat': []
  'export-video': []
}>()

// 计算属性
const getThemeIcon = computed(() => {
  switch (props.currentTheme) {
    case 'light':
      return '☀️'
    case 'dark':
      return '🌙'
    case 'ai-glow':
      return '⚡'
    default:
      return '☀️'
  }
})

const getThemeTooltip = computed(() => {
  switch (props.currentTheme) {
    case 'light':
      return '切换到深色主题'
    case 'dark':
      return '切换到AI流光主题'
    case 'ai-glow':
      return '切换到浅色主题'
    default:
      return '切换主题'
  }
})
</script>

<style scoped>
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 var(--spacing-lg);
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-light);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all var(--transition-normal);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.header-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.header-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.header-btn:hover {
  background: var(--bg-secondary);
}

.user-btn {
  font-size: var(--font-size-lg);
  padding: var(--spacing-xs);
}

/* AI流光主题特效 */
[data-theme="ai-glow"] .chat-header {
  background: linear-gradient(135deg, var(--bg-primary), rgba(102, 126, 234, 0.05));
  border-bottom-color: rgba(102, 126, 234, 0.2);
}

[data-theme="ai-glow"] .header-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-header {
    height: 56px;
    padding: 0 var(--spacing-md);
  }
  
  .header-title {
    font-size: var(--font-size-md);
  }
  
  .header-btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-xs);
  }
}
</style>
