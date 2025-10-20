<template>
  <div class="markdown-renderer" v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
// 简化版本，暂时不使用markdown-it和highlight.js

// Props
interface Props {
  content: string
}

const props = defineProps<Props>()

// 简化的Markdown渲染器
const renderedContent = computed(() => {
  if (!props.content) return ''
  
  // 简单的文本处理，将换行符转换为<br>
  return props.content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
})
</script>

<style scoped>
.markdown-renderer {
  line-height: 1.6;
  color: var(--text-primary);
}

/* Markdown 样式 */
.markdown-renderer :deep(h1),
.markdown-renderer :deep(h2),
.markdown-renderer :deep(h3),
.markdown-renderer :deep(h4),
.markdown-renderer :deep(h5),
.markdown-renderer :deep(h6) {
  margin: var(--spacing-lg) 0 var(--spacing-md) 0;
  font-weight: 600;
  color: var(--text-primary);
}

.markdown-renderer :deep(h1) {
  font-size: var(--font-size-2xl);
  border-bottom: 2px solid var(--border-color);
  padding-bottom: var(--spacing-sm);
}

.markdown-renderer :deep(h2) {
  font-size: var(--font-size-xl);
  border-bottom: 1px solid var(--border-light);
  padding-bottom: var(--spacing-xs);
}

.markdown-renderer :deep(h3) {
  font-size: var(--font-size-lg);
}

.markdown-renderer :deep(p) {
  margin: var(--spacing-md) 0;
  color: var(--text-primary);
}

.markdown-renderer :deep(ul),
.markdown-renderer :deep(ol) {
  margin: var(--spacing-md) 0;
  padding-left: var(--spacing-lg);
}

.markdown-renderer :deep(li) {
  margin: var(--spacing-xs) 0;
  color: var(--text-primary);
}

.markdown-renderer :deep(blockquote) {
  margin: var(--spacing-md) 0;
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-left: 4px solid var(--brand-primary);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
}

.markdown-renderer :deep(code) {
  background: var(--bg-secondary);
  color: var(--brand-primary);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9em;
}

.markdown-renderer :deep(pre) {
  margin: var(--spacing-md) 0;
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  overflow-x: auto;
  border: 1px solid var(--border-light);
}

.markdown-renderer :deep(pre code) {
  background: transparent;
  color: var(--text-primary);
  padding: 0;
  border-radius: 0;
}

.markdown-renderer :deep(a) {
  color: var(--brand-primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all var(--transition-fast);
}

.markdown-renderer :deep(a:hover) {
  border-bottom-color: var(--brand-primary);
}

.markdown-renderer :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: var(--spacing-md) 0;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.markdown-renderer :deep(th),
.markdown-renderer :deep(td) {
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--border-light);
}

.markdown-renderer :deep(th) {
  background: var(--bg-secondary);
  font-weight: 600;
  color: var(--text-primary);
}

.markdown-renderer :deep(td) {
  color: var(--text-primary);
}

.markdown-renderer :deep(hr) {
  border: none;
  height: 1px;
  background: var(--border-color);
  margin: var(--spacing-xl) 0;
}

/* 代码高亮样式 */
.markdown-renderer :deep(.hljs) {
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
}

/* AI流光主题特殊效果 */
[data-theme="ai-glow"] .markdown-renderer :deep(blockquote) {
  background: linear-gradient(135deg, var(--bg-secondary), rgba(102, 126, 234, 0.05));
  border-left-color: var(--brand-primary);
}

[data-theme="ai-glow"] .markdown-renderer :deep(pre) {
  background: linear-gradient(135deg, var(--bg-secondary), rgba(102, 126, 234, 0.05));
  border-color: rgba(102, 126, 234, 0.2);
}

[data-theme="ai-glow"] .markdown-renderer :deep(table) {
  box-shadow: var(--shadow-sm);
}

[data-theme="ai-glow"] .markdown-renderer :deep(th) {
  background: linear-gradient(135deg, var(--bg-secondary), rgba(102, 126, 234, 0.1));
}

/* 响应式设计 */
@media (max-width: 768px) {
  .markdown-renderer :deep(pre) {
    padding: var(--spacing-sm);
    font-size: var(--font-size-sm);
  }
  
  .markdown-renderer :deep(table) {
    font-size: var(--font-size-sm);
  }
  
  .markdown-renderer :deep(th),
  .markdown-renderer :deep(td) {
    padding: var(--spacing-xs) var(--spacing-sm);
  }
}
</style>
