<template>
  <div id="app" :data-theme="currentTheme">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useThemeStore } from '@/store/theme.store'

// 主题管理
const themeStore = useThemeStore()
const currentTheme = computed(() => themeStore.currentTheme)

// 生命周期
onMounted(() => {
  // 初始化主题
  themeStore.init()
})
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
  line-height: 1.5;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  transition: background-color var(--transition-normal), color var(--transition-normal);
}

#app {
  height: 100%;
  overflow: hidden;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}

/* Ant Design Vue 组件样式覆盖 */
.ant-layout {
  background: var(--bg-primary);
}

.ant-layout-header {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-light);
}

.ant-layout-content {
  background: var(--bg-primary);
}

.ant-layout-sider {
  background: var(--bg-secondary);
}

/* 按钮样式 */
.ant-btn {
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.ant-btn-primary {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
}

.ant-btn-primary:hover {
  background: var(--brand-hover);
  border-color: var(--brand-hover);
}

/* 输入框样式 */
.ant-input,
.ant-input-number,
.ant-select-selector,
.ant-picker {
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.ant-input:focus,
.ant-input-number:focus,
.ant-select-focused .ant-select-selector,
.ant-picker-focused {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
}

/* 卡片样式 */
.ant-card {
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  background: var(--bg-primary);
}

/* 模态框样式 */
.ant-modal-content {
  border-radius: var(--radius-lg);
  background: var(--bg-primary);
}

.ant-modal-header {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-light);
}

.ant-modal-body {
  background: var(--bg-primary);
}

.ant-modal-footer {
  background: var(--bg-primary);
  border-top: 1px solid var(--border-light);
}

/* 消息提示样式 */
.ant-message {
  z-index: 9999;
}

/* AI流光主题特殊效果 */
[data-theme="ai-glow"] .ant-btn-primary {
  background: var(--ai-gradient);
  border: none;
}

[data-theme="ai-glow"] .ant-btn-primary:hover {
  box-shadow: var(--ai-glow);
}

[data-theme="ai-glow"] .ant-input:focus,
[data-theme="ai-glow"] .ant-input-number:focus,
[data-theme="ai-glow"] .ant-select-focused .ant-select-selector,
[data-theme="ai-glow"] .ant-picker-focused {
  border-color: var(--brand-primary);
  box-shadow: var(--ai-glow);
}

[data-theme="ai-glow"] .ant-card {
  background: linear-gradient(135deg, var(--bg-primary), rgba(102, 126, 234, 0.02));
  border-color: rgba(102, 126, 234, 0.2);
}

[data-theme="ai-glow"] .ant-modal-content {
  background: linear-gradient(135deg, var(--bg-primary), rgba(102, 126, 234, 0.02));
  border: 1px solid rgba(102, 126, 234, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  html, body {
    font-size: var(--font-size-sm);
  }
  
  .ant-btn {
    font-size: var(--font-size-sm);
  }
  
  .ant-input,
  .ant-input-number,
  .ant-select-selector {
    font-size: var(--font-size-sm);
  }
}

@media (max-width: 480px) {
  html, body {
    font-size: var(--font-size-xs);
  }
}
</style>
