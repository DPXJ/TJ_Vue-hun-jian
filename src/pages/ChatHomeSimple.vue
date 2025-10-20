<template>
  <div class="chat-home-simple">
    <h1>AI视频混剪V2.0</h1>
    <p>简化版聊天界面</p>
    
    <div class="chat-container">
      <div class="messages">
        <div v-for="message in messages" :key="message.id" class="message">
          <strong>{{ message.type }}:</strong> {{ message.content }}
        </div>
      </div>
      
      <div class="input-area">
        <input 
          v-model="inputValue" 
          @keyup.enter="sendMessage"
          placeholder="输入消息..."
          class="message-input"
        />
        <button @click="sendMessage" class="send-btn">发送</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const inputValue = ref('')
const messages = ref([
  {
    id: '1',
    type: 'ai',
    content: '欢迎使用AI视频混剪V2.0！'
  }
])

const sendMessage = () => {
  if (!inputValue.value.trim()) return
  
  messages.value.push({
    id: Date.now().toString(),
    type: 'user',
    content: inputValue.value
  })
  
  // 模拟AI回复
  setTimeout(() => {
    messages.value.push({
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: `您说: "${inputValue.value}"`
    })
  }, 1000)
  
  inputValue.value = ''
}
</script>

<style scoped>
.chat-home-simple {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.messages {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 20px;
}

.message {
  margin-bottom: 10px;
  padding: 5px;
}

.input-area {
  display: flex;
  gap: 10px;
}

.message-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.send-btn {
  padding: 10px 20px;
  background: #1677ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
