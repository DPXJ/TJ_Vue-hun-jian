<template>
  <div class="test-page">
    <h1>测试页面</h1>
    <p>如果你能看到这个页面，说明Vue应用已经正常启动！</p>
    <a-button type="primary">测试按钮</a-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('测试页面已挂载')
})
</script>

<style scoped>
.test-page {
  padding: 20px;
  text-align: center;
}
</style>
