<template>
  <div style="padding: 20px; text-align: center;">
    <h1 style="color: #1677ff;">AI视频混剪V2.0</h1>
    <p>{{ message }}</p>
    <button @click="count++" style="padding: 10px 20px; background: #1677ff; color: white; border: none; border-radius: 4px; cursor: pointer;">
      点击次数: {{ count }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('页面加载成功！')
const count = ref(0)

console.log('HelloWorld页面已挂载')
</script>
