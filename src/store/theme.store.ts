import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

// Types
export type Theme = 'light' | 'dark' | 'ai-glow'

// Store
export const useThemeStore = defineStore('theme', () => {
  // State
  const currentTheme = ref<Theme>('light')
  const systemTheme = ref<'light' | 'dark'>('light')

  // Actions
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    applyTheme(theme)
    saveTheme(theme)
  }

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'ai-glow']
    const currentIndex = themes.indexOf(currentTheme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const applyTheme = (theme: Theme) => {
    // 应用到 document
    document.documentElement.setAttribute('data-theme', theme)
    
    // 更新 meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      const colors = {
        light: '#ffffff',
        dark: '#0f1115',
        'ai-glow': '#12121a'
      }
      metaThemeColor.setAttribute('content', colors[theme])
    }
  }

  const saveTheme = (theme: Theme) => {
    try {
      localStorage.setItem('app-theme', theme)
    } catch (error) {
      console.error('保存主题失败:', error)
    }
  }

  const loadTheme = () => {
    try {
      const savedTheme = localStorage.getItem('app-theme') as Theme
      if (savedTheme && ['light', 'dark', 'ai-glow'].includes(savedTheme)) {
        currentTheme.value = savedTheme
      } else {
        // 检测系统主题
        detectSystemTheme()
      }
      applyTheme(currentTheme.value)
    } catch (error) {
      console.error('加载主题失败:', error)
      detectSystemTheme()
    }
  }

  const detectSystemTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      systemTheme.value = 'dark'
      currentTheme.value = 'dark'
    } else {
      systemTheme.value = 'light'
      currentTheme.value = 'light'
    }
  }

  const resetTheme = () => {
    setTheme('light')
  }

  // 监听系统主题变化
  const setupSystemThemeListener = () => {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      
      const handleChange = (e: MediaQueryListEvent) => {
        systemTheme.value = e.matches ? 'dark' : 'light'
        // 只有在使用系统主题时才自动切换
        if (currentTheme.value === 'light' || currentTheme.value === 'dark') {
          setTheme(systemTheme.value)
        }
      }
      
      mediaQuery.addEventListener('change', handleChange)
      
      // 返回清理函数
      return () => {
        mediaQuery.removeEventListener('change', handleChange)
      }
    }
    return () => {}
  }

  // 主题相关的工具函数
  const getThemeColors = (theme: Theme) => {
    const colors = {
      light: {
        primary: '#1677ff',
        background: '#ffffff',
        surface: '#f5f5f5',
        text: '#111111',
        textSecondary: '#666666'
      },
      dark: {
        primary: '#3b82f6',
        background: '#0f1115',
        surface: '#171a21',
        text: '#e5e7eb',
        textSecondary: '#9ca3af'
      },
      'ai-glow': {
        primary: '#667eea',
        background: '#12121a',
        surface: '#0e0e15',
        text: '#eef3ff',
        textSecondary: '#a0a8c0'
      }
    }
    return colors[theme]
  }

  const isDarkTheme = (theme: Theme) => {
    return theme === 'dark' || theme === 'ai-glow'
  }

  const getThemeIcon = (theme: Theme) => {
    const icons = {
      light: '☀️',
      dark: '🌙',
      'ai-glow': '⚡'
    }
    return icons[theme]
  }

  const getThemeName = (theme: Theme) => {
    const names = {
      light: '浅色模式',
      dark: '深色模式',
      'ai-glow': 'AI流光模式'
    }
    return names[theme]
  }

  // 初始化
  const init = () => {
    loadTheme()
    return setupSystemThemeListener()
  }

  return {
    // State
    currentTheme,
    systemTheme,
    
    // Actions
    setTheme,
    toggleTheme,
    applyTheme,
    saveTheme,
    loadTheme,
    resetTheme,
    init,
    
    // Utils
    getThemeColors,
    isDarkTheme,
    getThemeIcon,
    getThemeName
  }
})
