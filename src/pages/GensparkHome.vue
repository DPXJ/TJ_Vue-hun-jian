<template>
  <div class="genspark-home" :data-theme="currentTheme">
    <!-- 左侧导航栏 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">🎬</span>
        </div>
        <button class="menu-btn">
          <span class="icon">☰</span>
        </button>
      </div>
      
      <div class="sidebar-nav">
        <button class="nav-item new-chat">
          <span class="icon">+</span>
          <span>New</span>
        </button>
        
        <button class="nav-item" @click="activeTab = 'home'">
          <span class="icon">🏠</span>
          <span>首页</span>
        </button>
        
        <button class="nav-item" @click="activeTab = 'cloud'">
          <span class="icon">☁️</span>
          <span>AI 云盘</span>
        </button>
      </div>
    </aside>
    
    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 顶部导航 -->
      <header class="top-header">
        <div class="header-title">
          <h1>Genspark 超级智能体</h1>
          <span class="status-dot"></span>
        </div>
        
        <div class="header-actions">
          <button class="theme-btn" @click="toggleTheme">
            {{ themeText }}
          </button>
          <button class="primary-btn">
            选最省钱的AI
          </button>
        </div>
      </header>
      
      <!-- 中央搜索区域 -->
      <div class="search-section">
        <div class="search-container">
          <div class="search-input-wrapper">
            <textarea
              v-model="searchQuery"
              class="search-input"
              placeholder="询问任何问题，创建任何事物"
              rows="1"
              @keydown.enter.exact="handleSearch"
              @input="autoResize"
              ref="searchInput"
            ></textarea>
            
            <div class="search-toolbar">
              <div class="toolbar-left">
                <button class="tool-btn" title="留言板">
                  <span>📋</span>
                  <span class="tool-text">留言板</span>
                </button>
                <button class="tool-btn" title="表情">
                  <span>😊</span>
                </button>
              </div>
              
              <div class="toolbar-right">
                <button class="tool-btn" title="上传文件" @click="handleUpload">
                  <span>📎</span>
                </button>
                <button class="tool-btn" title="语音输入">
                  <span>🎤</span>
                </button>
                <button class="tool-btn send-btn" @click="handleSearch" :disabled="!searchQuery.trim()">
                  <span>📤</span>
                </button>
              </div>
            </div>
          </div>
          
          <div class="search-hint">
            <span class="hint-icon">✨</span>
            <span>Genspark 支持个性化工具</span>
            <button class="close-hint">×</button>
          </div>
        </div>
      </div>
      
      <!-- 功能卡片区域 -->
      <div class="features-section">
        <div class="features-container">
          <button
            v-for="feature in features"
            :key="feature.id"
            class="feature-card"
            @click="handleFeatureClick(feature)"
          >
            <div class="feature-icon" :style="{ background: feature.gradient }">
              {{ feature.icon }}
            </div>
            <div class="feature-label">{{ feature.label }}</div>
            <span v-if="feature.isNew" class="feature-badge">New</span>
          </button>
          
          <button class="feature-card">
            <div class="feature-icon" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)">
              ✨
            </div>
            <div class="feature-label">所有智能体</div>
          </button>
        </div>
      </div>
      
      <!-- 推荐内容区域 -->
      <div class="recommendations-section">
        <div class="section-header">
          <h2>为你推荐</h2>
        </div>
        
        <div class="recommendations-grid">
          <div
            v-for="item in recommendations"
            :key="item.id"
            class="recommendation-card"
            @click="handleRecommendationClick(item)"
          >
            <div class="card-image" :style="{ background: item.gradient }">
              <div class="card-icon">{{ item.icon }}</div>
              <div v-if="item.type === 'podcast'" class="card-badge">
                <span>🎙️</span>
                <span>AI Pods</span>
              </div>
            </div>
            <div class="card-content">
              <h3 class="card-title">{{ item.title }}</h3>
              <p v-if="item.description" class="card-description">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/store/theme.store'
import { useChatStore } from '@/store/chat.store'

const router = useRouter()
const themeStore = useThemeStore()
const chatStore = useChatStore()

const currentTheme = ref(themeStore.currentTheme)
const searchQuery = ref('')
const activeTab = ref('home')
const searchInput = ref<HTMLTextAreaElement>()

const themeText = computed(() => {
  const themeMap: Record<string, string> = {
    'light': '🌞 浅色',
    'dark': '🌙 深色',
    'ai-glow': '✨ AI流光'
  }
  return themeMap[currentTheme.value] || '切换主题'
})

// 功能卡片数据
const features = [
  {
    id: 'custom-agent',
    icon: '⚙️',
    label: '自定义超级智能体',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    isNew: true
  },
  {
    id: 'ai-docs',
    icon: '📄',
    label: 'AI 文档灯片',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 'ai-table',
    icon: '📊',
    label: 'AI 表格',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 'ai-doc',
    icon: '📝',
    label: 'AI 文档',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    id: 'ai-developer',
    icon: '💻',
    label: 'AI 开发者',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    id: 'ai-designer',
    icon: '🎨',
    label: 'AI 设计师',
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
  },
  {
    id: 'audio-text',
    icon: '🎵',
    label: '音频文本',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  },
  {
    id: 'ai-painter',
    icon: '🖌️',
    label: 'AI 画天',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  },
  {
    id: 'ai-image',
    icon: '🖼️',
    label: 'AI 图片',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  },
  {
    id: 'ai-video',
    icon: '🎬',
    label: 'AI 视频',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  },
  {
    id: 'ai-meeting',
    icon: '📹',
    label: 'AI 视频',
    gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
  },
  {
    id: 'ai-notes',
    icon: '📋',
    label: 'AI 会议记录',
    gradient: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)'
  }
]

// 推荐内容数据（模拟）
const recommendations = ref([
  {
    id: 1,
    title: '埃森哲面下线 文档关怀',
    type: 'document',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: '📄'
  },
  {
    id: 2,
    title: 'NBA季后赛精彩瞬间',
    type: 'podcast',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: '🏀'
  },
  {
    id: 3,
    title: '一起去宁朝1，2025春晚',
    type: 'video',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: '📺'
  },
  {
    id: 4,
    title: '城市夜景拍摄技巧',
    type: 'image',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    icon: '🌃'
  },
  {
    id: 5,
    title: '跨国供应链数据分析：多视角自营标全球化途径再汇',
    description: '分析全球供应链趋势',
    type: 'podcast',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    icon: '🌍'
  },
  {
    id: 6,
    title: '2025年10月：中美经济对比',
    description: '深度分析中美两国经济现状',
    type: 'podcast',
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    icon: '📊'
  },
  {
    id: 7,
    title: '金融数据可视化',
    type: 'chart',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    icon: '📈'
  },
  {
    id: 8,
    title: '市场趋势分析报告',
    type: 'report',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    icon: '📋'
  }
])

// 主题切换
const toggleTheme = () => {
  const themes = ['light', 'dark', 'ai-glow']
  const currentIndex = themes.indexOf(currentTheme.value)
  const nextIndex = (currentIndex + 1) % themes.length
  currentTheme.value = themes[nextIndex]
  
  themeStore.setTheme(currentTheme.value)
  document.documentElement.setAttribute('data-theme', currentTheme.value)
}

// 自动调整输入框高度
const autoResize = () => {
  const textarea = searchInput.value
  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
  }
}

// 处理搜索
const handleSearch = (e?: KeyboardEvent) => {
  if (e) {
    e.preventDefault()
  }
  
  if (!searchQuery.value.trim()) return
  
  // 保存搜索内容到聊天store
  const userMessage = {
    id: Date.now().toString(),
    type: 'user' as const,
    content: searchQuery.value.trim(),
    timestamp: Date.now()
  }
  
  chatStore.addMessage(userMessage)
  
  // 跳转到聊天页面
  router.push('/chat')
}

// 处理上传
const handleUpload = () => {
  console.log('打开文件上传')
  // TODO: 实现文件上传
}

// 处理功能卡片点击
const handleFeatureClick = (feature: any) => {
  console.log('点击功能:', feature)
  
  // 根据功能类型生成相应的消息
  const featureMessages: Record<string, string> = {
    'ai-video': '我想制作AI视频',
    'ai-table': '帮我创建一个数据表格',
    'ai-doc': '我需要生成一份文档',
    'ai-designer': '帮我设计界面',
    'audio-text': '将音频转换为文字',
    'ai-image': '生成一张图片'
  }
  
  const message = featureMessages[feature.id] || `使用${feature.label}功能`
  searchQuery.value = message
  handleSearch()
}

// 处理推荐内容点击
const handleRecommendationClick = (item: any) => {
  console.log('点击推荐:', item)
  searchQuery.value = `了解更多关于"${item.title}"的内容`
  handleSearch()
}

// 初始化
onMounted(() => {
  document.documentElement.setAttribute('data-theme', currentTheme.value)
})
</script>

<style scoped>
.genspark-home {
  display: flex;
  height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
}

/* ========== 左侧导航栏 ========== */
.sidebar {
  width: 260px;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  transition: all var(--transition-normal);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-light);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.logo-icon {
  font-size: 28px;
}

.menu-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 20px;
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.menu-btn:hover {
  background-color: var(--bg-tertiary);
}

.sidebar-nav {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: none;
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: left;
}

.nav-item:hover {
  background-color: var(--bg-tertiary);
}

.nav-item.new-chat {
  background-color: var(--brand-primary);
  color: white;
  font-weight: 500;
}

.nav-item.new-chat:hover {
  background-color: var(--brand-hover);
}

.nav-item .icon {
  font-size: 20px;
}

/* ========== 主内容区域 ========== */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 顶部导航 */
.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--border-light);
  background-color: var(--bg-primary);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.header-title h1 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin: 0;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(82, 196, 26, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.theme-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.theme-btn:hover {
  background-color: var(--bg-tertiary);
  border-color: var(--brand-primary);
}

.primary-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: linear-gradient(135deg, #1677ff 0%, #4096ff 100%);
  border: none;
  border-radius: var(--radius-md);
  color: white;
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.2);
}

.primary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.3);
}

/* ========== 搜索区域 ========== */
.search-section {
  padding: var(--spacing-2xl) var(--spacing-xl);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.search-container {
  width: 100%;
  max-width: 800px;
}

.search-input-wrapper {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-fast);
}

.search-input-wrapper:focus-within {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.1), var(--shadow-lg);
}

.search-input {
  width: 100%;
  min-height: 60px;
  max-height: 200px;
  background: none;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: var(--font-size-lg);
  font-family: var(--font-family);
  resize: none;
  overflow-y: auto;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.search-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-light);
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.tool-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: none;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tool-btn:hover:not(:disabled) {
  background-color: var(--bg-tertiary);
  border-color: var(--border-color);
}

.tool-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tool-btn.send-btn {
  color: var(--brand-primary);
}

.tool-btn.send-btn:hover:not(:disabled) {
  background-color: var(--brand-primary);
  color: white;
}

.tool-text {
  display: none;
}

@media (min-width: 768px) {
  .tool-text {
    display: inline;
  }
}

.search-hint {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.hint-icon {
  font-size: 16px;
}

.close-hint {
  margin-left: auto;
  background: none;
  border: none;
  color: var(--text-tertiary);
  font-size: 20px;
  cursor: pointer;
  padding: 0 var(--spacing-xs);
  transition: all var(--transition-fast);
}

.close-hint:hover {
  color: var(--text-primary);
}

/* ========== 功能卡片区域 ========== */
.features-section {
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--border-light);
}

.features-container {
  display: flex;
  gap: var(--spacing-lg);
  overflow-x: auto;
  padding: var(--spacing-md) 0;
  scrollbar-width: thin;
}

.features-container::-webkit-scrollbar {
  height: 6px;
}

.feature-card {
  position: relative;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: none;
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.feature-card:hover .feature-icon {
  transform: translateY(-4px) scale(1.05);
}

.feature-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  border-radius: 50%;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-fast);
}

.feature-label {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  text-align: center;
  max-width: 100px;
  line-height: 1.4;
}

.feature-badge {
  position: absolute;
  top: 0;
  right: 10px;
  padding: 2px 8px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 12px;
  text-transform: uppercase;
}

/* ========== 推荐内容区域 ========== */
.recommendations-section {
  padding: var(--spacing-xl);
}

.section-header {
  margin-bottom: var(--spacing-lg);
}

.section-header h2 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin: 0;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.recommendation-card {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.recommendation-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.card-image {
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.card-icon {
  font-size: 64px;
  opacity: 0.9;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
}

.card-badge {
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-sm);
  color: white;
  font-size: var(--font-size-xs);
}

.card-content {
  padding: var(--spacing-md);
}

.card-title {
  font-size: var(--font-size-md);
  font-weight: 500;
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--text-primary);
  line-height: 1.4;
}

.card-description {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* ========== AI流光主题特效 ========== */
[data-theme="ai-glow"] .search-input-wrapper:focus-within {
  border-color: var(--brand-primary);
  box-shadow: var(--ai-glow);
}

[data-theme="ai-glow"] .feature-icon {
  box-shadow: var(--shadow-md), var(--ai-glow);
}

[data-theme="ai-glow"] .feature-card:hover .feature-icon {
  box-shadow: var(--shadow-lg), var(--ai-glow-strong);
}

[data-theme="ai-glow"] .recommendation-card {
  background: linear-gradient(135deg, var(--bg-secondary), rgba(102, 126, 234, 0.05));
  border: 1px solid rgba(102, 126, 234, 0.1);
}

[data-theme="ai-glow"] .recommendation-card:hover {
  border-color: rgba(102, 126, 234, 0.3);
  box-shadow: var(--ai-glow);
}

/* ========== 响应式设计 ========== */
@media (max-width: 1024px) {
  .sidebar {
    width: 220px;
  }
  
  .recommendations-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  .sidebar {
    position: absolute;
    left: -260px;
    z-index: 100;
    height: 100%;
  }
  
  .top-header {
    padding: var(--spacing-md);
  }
  
  .header-title h1 {
    font-size: var(--font-size-lg);
  }
  
  .search-section {
    padding: var(--spacing-lg) var(--spacing-md);
    min-height: 200px;
  }
  
  .features-section,
  .recommendations-section {
    padding: var(--spacing-lg) var(--spacing-md);
  }
  
  .recommendations-grid {
    grid-template-columns: 1fr;
  }
  
  .primary-btn {
    padding: var(--spacing-xs) var(--spacing-md);
    font-size: 12px;
  }
}
</style>

