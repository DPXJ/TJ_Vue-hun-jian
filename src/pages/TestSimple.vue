<template>
  <div style="padding: 20px;">
    <h1>测试页面</h1>
    <p>如果你能看到这个页面，说明 Vue 和路由都正常工作。</p>
    <button @click="count++">点击次数: {{ count }}</button>
    <div>
      <p>当前主题: {{ currentTheme }}</p>
      <button @click="testTheme">切换主题</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useThemeStore } from '@/store/theme.store'

const count = ref(0)
const themeStore = useThemeStore()
const currentTheme = ref(themeStore.currentTheme)

const testTheme = () => {
  const themes = ['light', 'dark', 'ai-glow']
  const currentIndex = themes.indexOf(currentTheme.value)
  const nextIndex = (currentIndex + 1) % themes.length
  currentTheme.value = themes[nextIndex]
  themeStore.setTheme(currentTheme.value)
}
</script>

