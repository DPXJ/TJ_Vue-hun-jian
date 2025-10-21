<template>
  <header class="chat-header">
    <div class="header-left">
      <a-button 
        type="text" 
        @click="$emit('new-chat')"
        class="new-chat-btn"
      >
        <template #icon>
          <PlusOutlined />
        </template>
        新建对话
      </a-button>
    </div>
    
    <div class="header-center">
      <h1 class="app-title">AI视频混剪 V2.0</h1>
      <span class="app-subtitle">对话式智能视频制作</span>
    </div>
    
    <div class="header-right">
      <a-space>
        <!-- 主题切换按钮 -->
        <a-tooltip :title="getThemeTooltip()">
          <a-button 
            type="text" 
            @click="$emit('toggle-theme')"
            class="theme-toggle-btn"
          >
            <template #icon>
              <component :is="getThemeIcon()" />
            </template>
          </a-button>
        </a-tooltip>
        
        <!-- 导出视频按钮 -->
        <a-tooltip title="导出视频">
          <a-button 
            type="text" 
            @click="$emit('export-video')"
            class="export-btn"
          >
            <template #icon>
              <DownloadOutlined />
            </template>
          </a-button>
        </a-tooltip>
        
        <!-- 用户头像/登录状态 -->
        <a-dropdown>
          <a-avatar 
            size="small" 
            :style="{ backgroundColor: 'var(--brand-primary)' }"
          >
            <UserOutlined />
          </a-avatar>
          <template #overlay>
            <a-menu>
              <a-menu-item key="profile">
                <UserOutlined />
                个人资料
              </a-menu-item>
              <a-menu-item key="settings">
                <SettingOutlined />
                设置
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="logout">
                <LogoutOutlined />
                退出登录
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-space>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  PlusOutlined, 
  DownloadOutlined, 
  UserOutlined, 
  SettingOutlined, 
  LogoutOutlined,
  BgColorsOutlined,
  SkinOutlined,
  FireOutlined
} from '@ant-design/icons-vue'

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
      return BgColorsOutlined
    case 'dark':
      return SkinOutlined
    case 'ai-glow':
      return FireOutlined
    default:
      return BgColorsOutlined
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
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  z-index: 100;
}

.header-left,
.header-right {
  flex: 1;
  display: flex;
  align-items: center;
}

.header-left {
  justify-content: flex-start;
}

.header-right {
  justify-content: flex-end;
}

.header-center {
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.app-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  background: var(--ai-gradient, linear-gradient(135deg, var(--brand-primary), var(--brand-hover)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-subtitle {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin-top: 2px;
}

.new-chat-btn,
.theme-toggle-btn,
.export-btn {
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.new-chat-btn:hover,
.theme-toggle-btn:hover,
.export-btn:hover {
  color: var(--brand-primary);
  background-color: var(--bg-secondary);
}

/* AI流光主题特殊效果 */
[data-theme="ai-glow"] .app-title {
  filter: drop-shadow(var(--ai-glow));
}

[data-theme="ai-glow"] .theme-toggle-btn:hover,
[data-theme="ai-glow"] .export-btn:hover {
  box-shadow: var(--ai-glow);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-header {
    padding: var(--spacing-sm) var(--spacing-md);
  }
  
  .app-title {
    font-size: var(--font-size-md);
  }
  
  .app-subtitle {
    display: none;
  }
  
  .header-center {
    flex: 1;
  }
  
  .new-chat-btn {
    padding: var(--spacing-xs) var(--spacing-sm);
  }
  
  .new-chat-btn :deep(.ant-btn) {
    font-size: var(--font-size-xs);
  }
}

@media (max-width: 480px) {
  .header-center {
    display: none;
  }
}
</style>
